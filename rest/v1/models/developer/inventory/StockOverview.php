<?php
class StockOverview
{
    public $stock_movement_aid;
    public $stock_movement_date;
    public $stock_movement_type;
    public $stock_movement_status;
    public $stock_movement_is_active;
    public $stock_movement_product_id;
    public $stock_movement_product_name;
    public $stock_movement_before_qty;
    public $stock_movement_after_qty;
    public $stock_movement_qty;
    public $stock_movement_location;
    public $stock_movement_product_owner_id;
    public $stock_movement_product_owner_name;
    public $stock_movement_notes;
    public $stock_movement_created;
    public $stock_movement_updated;

    public $userId;

    public $connection;
    public $lastInsertedId;
    public $tblMovementStock;
    public $tblProducts;
    public $tblSalesOrder;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblMovementStock = "graces_stock_movement";
        $this->tblProducts = "graces_products";
        $this->tblSalesOrder = "graces_sales_order";
    }

    // Builds the "columnFilters" WHERE fragments shared by every read*()
    // method below, and writes the matching bound params into &$params.
    // - inventory_status  -> handled by callers that pass &$inventoryStatusFilter
    //                        (captured here, not added to $filterColumn)
    // - {min, max} value  -> numeric BETWEEN (range filter)
    // - array value       -> multi-select OR match via IN (...)
    // - plain value       -> single LIKE match (legacy single-select filter)
    private function buildFilterColumns($allowedColumns, &$params, &$inventoryStatusFilter = null)
    {
        $filterColumn = [];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }

            if ($inventoryStatusFilter !== null && $item['id'] === 'inventory_status') {
                // the frontend's status filter is now a multi-select
                // checkbox dropdown, so $item['value'] arrives as an array
                // even for a single pick - trim()/strtolower() on an array
                // throws a TypeError. The downstream match below only
                // supports one status at a time anyway, so take the first
                // selected value.
                $rawStatus = is_array($item['value'])
                    ? ($item['value'][0] ?? '')
                    : $item['value'];
                $inventoryStatusFilter = strtolower(trim((string) $rawStatus));
                continue;
            }

            $col = $item['id'];
            $value = $item['value'];

            if (is_array($value) && array_key_exists('min', $value)) {
                $params["min$i"] = (float) $value['min'];

                $params["max$i"] = $value['max'] === ""
                    ? (float) $this->max
                    : (float) $value['max'];

                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";
            } elseif (is_array($value) && isset($value[0]) && is_array($value[0])) {
                $rangeClauses = [];

                foreach ($value as $j => $range) {
                    $hasMin = isset($range['min']) && $range['min'] !== '';
                    $hasMax = isset($range['max']) && $range['max'] !== '';

                    if (!$hasMin && !$hasMax) {
                        continue;
                    }

                    $minKey = "range{$i}_{$j}_min";
                    $maxKey = "range{$i}_{$j}_max";
                    $params[$minKey] = $hasMin ? (float) $range['min'] : 0.0;
                    $params[$maxKey] = $hasMax ? (float) $range['max'] : (float) $this->max;
                    $rangeClauses[] = "$col BETWEEN :$minKey AND :$maxKey";
                }

                if (empty($rangeClauses)) {
                    continue;
                }

                $filterColumn[] = "(" . implode(" OR ", $rangeClauses) . ")";
            } elseif (is_array($value)) {
                $selectedValues = array_values(array_filter(
                    $value,
                    fn ($v) => trim((string) $v) !== ""
                ));

                if (empty($selectedValues)) {
                    continue;
                }

                $placeholders = [];
                foreach ($selectedValues as $j => $selectedValue) {
                    $paramKey = "filter{$i}_{$j}";
                    $placeholders[] = ":$paramKey";
                    $params[$paramKey] = trim($selectedValue);
                }

                $filterColumn[] = "$col IN (" . implode(", ", $placeholders) . ")";
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($value) . "%";
            }
        }

        return $filterColumn;
    }

    public function readAllLowStock()
    {
        try {
            $sql = "select MAX(p.products_low_stock_threshold) as products_low_stock_threshold, ";
            $sql .= "MAX(p.products_sku) as products_sku, ";
            $sql .= "MAX(p.products_unit) as products_unit, ";
            $sql .= "MAX(p.products_status) as products_status, ";
            $sql .= "MAX(p.products_price) as products_price, ";
            $sql .= "MAX(p.products_name) as products_name, ";
            $sql .= "MAX(p.products_aid) as products_aid, ";
            $sql .= "MAX(ms.stock_movement_location) AS stock_movement_location, ";
            $sql .= "MAX(ms.stock_movement_product_name) as name, ";
            $sql .= "MAX(ms.stock_movement_is_active) as is_active, ";
            $sql .= "MAX(ms.stock_movement_product_name) as stock_movement_product_name, ";
            $sql .= "MAX(ms.stock_movement_product_owner_name) as stock_movement_product_owner_name, ";
            $sql .= "DATE_FORMAT(MAX(ms.stock_movement_date), '%b %d, %Y') AS stock_movement_date, ";

            // Total stock quantity
            $sql .= "
            SUM(
                CASE
                    WHEN ms.stock_movement_type IN (
                        'in stock',
                        'stock in - return',
                        'purchases',
                        'stock in adjustments'
                    )
                    THEN ms.stock_movement_qty

                    WHEN ms.stock_movement_type IN (
                        'stock out - reject/defective items',
                        'stock out - return item'
                    )
                    THEN -ms.stock_movement_qty

                    ELSE 0
                END
            ) AS stock_qty,
        ";

            $sql .= "
            MAX(IFNULL(so.order_qty, 0)) AS order_qty,
        ";
            $sql .= "
            (
                SUM(
                    CASE
                        WHEN ms.stock_movement_type IN (
                            'in stock',
                        'stock in - return',
                            'purchases',
                            'stock in adjustments'
                        )
                        THEN ms.stock_movement_qty

                        WHEN ms.stock_movement_type IN ( 
                        'stock out - reject/defective items',
                        'stock out - return item'
                        )
                        THEN -ms.stock_movement_qty

                        ELSE 0
                    END
                ) - MAX(IFNULL(so.order_qty, 0))
            ) AS current_qty
        ";
            $sql .= "from {$this->tblMovementStock} AS ms ";

            $sql .= "
            INNER JOIN {$this->tblProducts} AS p
                ON ms.stock_movement_product_id = p.products_aid
        ";

            $sql .= "
            LEFT JOIN (
                select
                    sales_order_product_id,
                    SUM(sales_order_qty) AS order_qty
                from {$this->tblSalesOrder}
                group by sales_order_product_id
            ) AS so
                ON so.sales_order_product_id = p.products_aid
        ";
            $sql .= " group by p.products_aid ";
            $sql .= "HAVING current_qty <= MAX(p.products_low_stock_threshold) ";
            $sql .= " order by p.products_aid ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError(
                $ex->getMessage(),
                $ex->getFile(),
                [
                    'line' => $ex->getLine(),
                    'code' => $ex->getCode()
                ]
            );

            $query = false;
        }

        return $query;
    }

    public function readByUserIdLowStock()
    {
        try {
            $sql = "select MAX(p.products_low_stock_threshold) as products_low_stock_threshold, ";
            $sql .= "MAX(p.products_sku) as products_sku, ";
            $sql .= "MAX(p.products_unit) as products_unit, ";
            $sql .= "MAX(p.products_status) as products_status, ";
            $sql .= "MAX(p.products_price) as products_price, ";
            $sql .= "MAX(p.products_name) as products_name, ";
            $sql .= "MAX(p.products_aid) as products_aid, ";
            $sql .= "MAX(ms.stock_movement_location) AS stock_movement_location, ";
            $sql .= "MAX(ms.stock_movement_product_name) as name, ";
            $sql .= "MAX(ms.stock_movement_is_active) as is_active, ";
            $sql .= "MAX(ms.stock_movement_product_name) as stock_movement_product_name, ";
            $sql .= "MAX(ms.stock_movement_product_owner_name) as stock_movement_product_owner_name, ";
            $sql .= "DATE_FORMAT(MAX(ms.stock_movement_date), '%b %d, %Y') AS stock_movement_date, ";

            // Total stock quantity
            $sql .= "
            SUM(
                CASE
                    WHEN ms.stock_movement_type IN (
                        'in stock',
                        'stock in - return',
                        'purchases',
                        'stock in adjustments'
                    )
                    THEN ms.stock_movement_qty

                    WHEN ms.stock_movement_type IN (
                        'stock out - reject/defective items',
                        'stock out - return item'
                    )
                    THEN -ms.stock_movement_qty

                    ELSE 0
                END
            ) AS stock_qty,
        ";

            $sql .= "
            MAX(IFNULL(so.order_qty, 0)) AS order_qty,
        ";
            $sql .= "
            (
                SUM(
                    CASE
                        WHEN ms.stock_movement_type IN (
                            'in stock',
                        'stock in - return',
                            'purchases',
                            'stock in adjustments'
                        )
                        THEN ms.stock_movement_qty

                        WHEN ms.stock_movement_type IN ( 
                        'stock out - reject/defective items',
                        'stock out - return item'
                        )
                        THEN -ms.stock_movement_qty

                        ELSE 0
                    END
                ) - MAX(IFNULL(so.order_qty, 0))
            ) AS current_qty
        ";
            $sql .= "from {$this->tblMovementStock} AS ms ";

            $sql .= "
            INNER JOIN {$this->tblProducts} AS p
                ON ms.stock_movement_product_id = p.products_aid
        ";

            $sql .= "
            LEFT JOIN (
                select
                    sales_order_product_id,
                    SUM(sales_order_qty) AS order_qty
                from {$this->tblSalesOrder}
                group by sales_order_product_id
            ) AS so
                ON so.sales_order_product_id = p.products_aid
        ";
            $sql .= " and p.products_owner_id = :products_owner_id ";
            $sql .= " group by p.products_aid ";
            $sql .= "HAVING current_qty <= MAX(p.products_low_stock_threshold) ";
            $sql .= " order by p.products_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "products_owner_id" => $this->userId,
            ]);
        } catch (PDOException $ex) {
            logError(
                $ex->getMessage(),
                $ex->getFile(),
                [
                    'line' => $ex->getLine(),
                    'code' => $ex->getCode()
                ]
            );

            $query = false;
        }

        return $query;
    }

    public function readCountLowStock()
    {
        try {
            $sql = "select COUNT(*) AS data_count ";
            $sql .= " FROM ( select MAX(p.products_low_stock_threshold) as products_low_stock_threshold, ";
            $sql .= "MAX(p.products_sku) as products_sku, ";
            $sql .= "MAX(p.products_unit) as products_unit, ";
            $sql .= "MAX(p.products_status) as products_status, ";
            $sql .= "MAX(p.products_price) as products_price, ";
            $sql .= "MAX(p.products_name) as products_name, ";
            $sql .= "MAX(p.products_aid) as products_aid, ";
            $sql .= "MAX(ms.stock_movement_location) AS stock_movement_location, ";
            $sql .= "MAX(ms.stock_movement_product_name) as name, ";
            $sql .= "MAX(ms.stock_movement_is_active) as is_active, ";
            $sql .= "MAX(ms.stock_movement_product_name) as stock_movement_product_name, ";
            $sql .= "MAX(ms.stock_movement_product_owner_name) as stock_movement_product_owner_name, ";
            $sql .= "DATE_FORMAT(MAX(ms.stock_movement_date), '%b %d, %Y') AS stock_movement_date, ";

            // Total stock quantity
            $sql .= "
            SUM(
                CASE
                    WHEN ms.stock_movement_type IN (
                        'in stock',
                        'stock in - return',
                            'purchases',
                        'stock in adjustments'
                    )
                    THEN ms.stock_movement_qty

                    WHEN ms.stock_movement_type IN ( 
                        'stock out - reject/defective items',
                        'stock out - return item'
                    )
                    THEN -ms.stock_movement_qty

                    ELSE 0
                END
            ) AS stock_qty,
        ";

            $sql .= "
            MAX(IFNULL(so.order_qty, 0)) AS order_qty,
        ";
            $sql .= "
            (
                SUM(
                    CASE
                        WHEN ms.stock_movement_type IN (
                            'in stock',
                        'stock in - return',
                            'purchases',
                            'stock in adjustments'
                        )
                        THEN ms.stock_movement_qty

                        WHEN ms.stock_movement_type IN ( 
                        'stock out - reject/defective items',
                        'stock out - return item'
                        )
                        THEN -ms.stock_movement_qty

                        ELSE 0
                    END
                ) - MAX(IFNULL(so.order_qty, 0))
            ) AS current_qty
        ";
            $sql .= "from {$this->tblMovementStock} AS ms ";

            $sql .= "
            INNER JOIN {$this->tblProducts} AS p
                ON ms.stock_movement_product_id = p.products_aid
        ";

            $sql .= "
            LEFT JOIN (
                select
                    sales_order_product_id,
                    SUM(sales_order_qty) AS order_qty
                from {$this->tblSalesOrder}
                group by sales_order_product_id
            ) AS so
                ON so.sales_order_product_id = p.products_aid
        ";
            $sql .= " group by p.products_aid ) as p ";
            $sql .= "WHERE current_qty <= products_low_stock_threshold ";
            $sql .= " order by p.products_aid ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError(
                $ex->getMessage(),
                $ex->getFile(),
                [
                    'line' => $ex->getLine(),
                    'code' => $ex->getCode()
                ]
            );

            $query = false;
        }

        return $query;
    }

    public function readAll($allowedColumns)
    {
        $filterColumn = [];
        $inventoryStatusFilter = "";

        $params = [
            ...(
                $this->column_search != ""
                ? [
                    "stock_movement_product_name" => "%{$this->column_search}%",
                    "stock_movement_product_owner_name" => "%{$this->column_search}%",
                ]
                : []
            ),
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params, $inventoryStatusFilter);
        try {
            $sql = " select inventory_data.*, ";
            $sql .= "CASE WHEN inventory_data.current_qty <= 0 THEN 'out of stock' ";
            $sql .= "WHEN inventory_data.current_qty <= inventory_data.products_low_stock_threshold THEN 'low stock' ";
            $sql .= "ELSE 'in stock' ";
            $sql .= "END as inventory_status ";
            $sql .= "from ( select MAX(p.products_low_stock_threshold) as products_low_stock_threshold, ";
            $sql .= "MAX(p.products_sku) as products_sku, ";
            $sql .= "MAX(p.products_unit) as products_unit, ";
            $sql .= "MAX(p.products_status) as products_status, ";
            $sql .= "MAX(p.products_price) as products_price, ";
            $sql .= "MAX(p.products_name) as products_name, ";
            $sql .= "MAX(p.products_name) as name, ";
            $sql .= "MAX(p.products_owner_name) as products_owner_name, ";
            $sql .= "MAX(p.products_aid) as products_aid, ";
            $sql .= "MAX(ms.stock_movement_location) as stock_movement_location, ";
            // $sql .= "MAX(ms.stock_movement_is_active) as is_active, ";
            // $sql .= "MAX(ms.stock_movement_is_active) as stock_movement_is_active, ";
            // $sql .= "MAX(ms.stock_movement_product_name) as stock_movement_product_name, ";
            // $sql .= "MAX(ms.stock_movement_product_owner_name) as stock_movement_product_owner_name, ";
            // $sql .= "DATE_FORMAT(MAX(ms.stock_movement_date), '%b %d, %Y') AS stock_movement_date, ";
            $sql .= "SUM( CASE WHEN ms.stock_movement_type IN ( 'in stock', 'stock in - return', 'purchases', 'stock in adjustments' ) ";
            $sql .= "THEN ms.stock_movement_qty WHEN ms.stock_movement_type IN ( 'stock out - reject/defective items', 'stock out - return item' ) ";
            $sql .= "THEN -ms.stock_movement_qty ELSE 0 END ) as stock_qty, ";
            $sql .= "MAX(IFNULL(so.order_qty, 0)) as order_qty, ";
            $sql .= "( SUM( CASE WHEN ms.stock_movement_type IN ( 'in stock', 'stock in - return', 'purchases', 'stock in adjustments' ) ";
            $sql .= "THEN ms.stock_movement_qty WHEN ms.stock_movement_type IN ( 'stock out - reject/defective items', ";
            $sql .= "'stock out - return item' ) THEN -ms.stock_movement_qty ELSE 0 END ) - MAX(IFNULL(so.order_qty, 0))) as current_qty ";
            $sql .= "from {$this->tblMovementStock} AS ms INNER JOIN {$this->tblProducts} as p ";
            $sql .= "ON ms.stock_movement_product_id = p.products_aid LEFT JOIN ( ";
            $sql .= "select sales_order_product_id, SUM(sales_order_qty) AS order_qty ";
            $sql .= "from {$this->tblSalesOrder} group by sales_order_product_id ) as so ";
            $sql .= "ON so.sales_order_product_id = p.products_aid ";
            $sql .= "group by p.products_aid ) AS inventory_data ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } elseif ($this->column_search !== "") {
                $sql .= " and ( inventory_data.products_name LIKE :stock_movement_product_name
                OR inventory_data.products_owner_name LIKE :stock_movement_product_owner_name ) ";
            }
            if ($inventoryStatusFilter === 'out of stock') {
                $sql .= " and inventory_data.current_qty <= 0 ";
            } elseif ($inventoryStatusFilter === 'low stock') {
                $sql .= " and inventory_data.current_qty > 0 ";
                $sql .= " and inventory_data.current_qty <= inventory_data.products_low_stock_threshold ";
            } elseif ($inventoryStatusFilter === 'in stock') {
                $sql .= " and inventory_data.current_qty > inventory_data.products_low_stock_threshold ";
            }
            $sql .= " order by inventory_data.current_qty asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError(
                $ex->getMessage(),
                $ex->getFile(),
                [
                    'line' => $ex->getLine(),
                    'code' => $ex->getCode()
                ]
            );

            $query = false;
        }
        return $query;
    }

    public function readLimit($allowedColumns)
    {
        $filterColumn = [];
        $inventoryStatusFilter = "";

        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...(
                $this->column_search != ""
                ? [
                    "stock_movement_product_name" => "%{$this->column_search}%",
                    "stock_movement_product_owner_name" => "%{$this->column_search}%",
                ]
                : []
            ),
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params, $inventoryStatusFilter);

        try {
            $sql = " select inventory_data.*, ";
            $sql .= "CASE WHEN inventory_data.current_qty <= 0 THEN 'out of stock' ";
            $sql .= "WHEN inventory_data.current_qty <= inventory_data.products_low_stock_threshold THEN 'low stock' ";
            $sql .= "ELSE 'in stock' ";
            $sql .= "END as inventory_status ";
            $sql .= "from ( select MAX(p.products_low_stock_threshold) as products_low_stock_threshold, ";
            $sql .= "MAX(p.products_sku) as products_sku, ";
            $sql .= "MAX(p.products_unit) as products_unit, ";
            $sql .= "MAX(p.products_status) as products_status, ";
            $sql .= "MAX(p.products_price) as products_price, ";
            $sql .= "MAX(p.products_name) as products_name, ";
            $sql .= "MAX(p.products_name) as name, ";
            $sql .= "MAX(p.products_owner_name) as products_owner_name, ";
            $sql .= "MAX(p.products_aid) as products_aid, ";
            $sql .= "MAX(ms.stock_movement_location) as stock_movement_location, ";
            // $sql .= "MAX(ms.stock_movement_is_active) as is_active, ";
            // $sql .= "MAX(ms.stock_movement_is_active) as stock_movement_is_active, ";
            // $sql .= "MAX(ms.stock_movement_product_name) as stock_movement_product_name, ";
            // $sql .= "MAX(ms.stock_movement_product_owner_name) as stock_movement_product_owner_name, ";
            // $sql .= "DATE_FORMAT(MAX(ms.stock_movement_date), '%b %d, %Y') AS stock_movement_date, ";
            $sql .= "SUM( CASE WHEN ms.stock_movement_type IN ( 'in stock', 'stock in - return', 'purchases', 'stock in adjustments' ) ";
            $sql .= "THEN ms.stock_movement_qty WHEN ms.stock_movement_type IN ( 'stock out - reject/defective items', 'stock out - return item' ) ";
            $sql .= "THEN -ms.stock_movement_qty ELSE 0 END ) as stock_qty, ";
            $sql .= "MAX(IFNULL(so.order_qty, 0)) as order_qty, ";
            $sql .= "( SUM( CASE WHEN ms.stock_movement_type IN ( 'in stock', 'stock in - return', 'purchases', 'stock in adjustments' ) ";
            $sql .= "THEN ms.stock_movement_qty WHEN ms.stock_movement_type IN ( 'stock out - reject/defective items', ";
            $sql .= "'stock out - return item' ) THEN -ms.stock_movement_qty ELSE 0 END ) - MAX(IFNULL(so.order_qty, 0))) as current_qty ";
            $sql .= "from {$this->tblMovementStock} AS ms INNER JOIN {$this->tblProducts} as p ";
            $sql .= "ON ms.stock_movement_product_id = p.products_aid LEFT JOIN ( ";
            $sql .= "select sales_order_product_id, SUM(sales_order_qty) AS order_qty ";
            $sql .= "from {$this->tblSalesOrder} group by sales_order_product_id ) as so ";
            $sql .= "ON so.sales_order_product_id = p.products_aid ";
            $sql .= "group by p.products_aid ) AS inventory_data ";
            $sql .= "WHERE true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } elseif ($this->column_search !== "") {
                $sql .= " and ( inventory_data.products_name LIKE :stock_movement_product_name
                OR inventory_data.products_owner_name LIKE :stock_movement_product_owner_name ) ";
            }
            // FILTER THE inventory_status 
            if ($inventoryStatusFilter === 'out of stock') {
                $sql .= " and inventory_data.current_qty <= 0 ";
            } elseif ($inventoryStatusFilter === 'low stock') {
                $sql .= " and inventory_data.current_qty > 0 ";
                $sql .= " and inventory_data.current_qty <= inventory_data.products_low_stock_threshold ";
            } elseif ($inventoryStatusFilter === 'in stock') {
                $sql .= " and inventory_data.current_qty > inventory_data.products_low_stock_threshold ";
            }
            $sql .= " order by inventory_data.current_qty asc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {

            logError(
                $ex->getMessage(),
                $ex->getFile(),
                [
                    'line' => $ex->getLine(),
                    'code' => $ex->getCode()
                ]
            );

            $query = false;
        }
        return $query;
    }

    public function readByUserId($allowedColumns)
    {
        $filterColumn = [];
        $inventoryStatusFilter = "";

        $params = [
            "stock_movement_product_owner_id" => $this->userId,
            ...(
                $this->column_search != ""
                ? [
                    "stock_movement_product_name" => "%{$this->column_search}%",
                    "stock_movement_product_owner_name" => "%{$this->column_search}%",
                ]
                : []
            ),
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params, $inventoryStatusFilter);
        try {
            $sql = " select inventory_data.*, ";
            $sql .= "CASE WHEN inventory_data.current_qty <= 0 THEN 'out of stock' ";
            $sql .= "WHEN inventory_data.current_qty <= inventory_data.products_low_stock_threshold THEN 'low stock' ";
            $sql .= "ELSE 'in stock' ";
            $sql .= "END as inventory_status ";
            $sql .= "from ( select MAX(p.products_low_stock_threshold) as products_low_stock_threshold, ";
            $sql .= "MAX(p.products_sku) as products_sku, ";
            $sql .= "MAX(p.products_unit) as products_unit, ";
            $sql .= "MAX(p.products_status) as products_status, ";
            $sql .= "MAX(p.products_price) as products_price, ";
            $sql .= "MAX(p.products_name) as products_name, ";
            $sql .= "MAX(p.products_owner_name) as products_owner_name, ";
            $sql .= "MAX(p.products_aid) as products_aid, ";
            $sql .= "MAX(ms.stock_movement_location) as stock_movement_location, ";
            $sql .= "MAX(ms.stock_movement_product_name) as name, ";
            $sql .= "MAX(ms.stock_movement_is_active) as is_active, ";
            $sql .= "MAX(ms.stock_movement_is_active) as stock_movement_is_active, ";
            $sql .= "MAX(ms.stock_movement_product_name) as stock_movement_product_name, ";
            $sql .= "MAX(ms.stock_movement_product_owner_name) as stock_movement_product_owner_name, ";
            $sql .= "MAX(ms.stock_movement_product_owner_id) as stock_movement_product_owner_id, ";
            $sql .= "DATE_FORMAT(MAX(ms.stock_movement_date), '%b %d, %Y') AS stock_movement_date, ";
            $sql .= "SUM( CASE WHEN ms.stock_movement_type IN ( 'in stock', 'stock in - return', 'purchases', 'stock in adjustments' ) ";
            $sql .= "THEN ms.stock_movement_qty WHEN ms.stock_movement_type IN ( 'stock out - reject/defective items', 'stock out - return item' ) ";
            $sql .= "THEN -ms.stock_movement_qty ELSE 0 END ) as stock_qty, ";
            $sql .= "MAX(IFNULL(so.order_qty, 0)) as order_qty, ";
            $sql .= "( SUM( CASE WHEN ms.stock_movement_type IN ( 'in stock', 'stock in - return', 'purchases', 'stock in adjustments' ) ";
            $sql .= "THEN ms.stock_movement_qty WHEN ms.stock_movement_type IN ( 'stock out - reject/defective items', ";
            $sql .= "'stock out - return item' ) THEN -ms.stock_movement_qty ELSE 0 END ) - MAX(IFNULL(so.order_qty, 0))) as current_qty ";
            $sql .= "from {$this->tblMovementStock} AS ms INNER JOIN {$this->tblProducts} as p ";
            $sql .= "ON ms.stock_movement_product_id = p.products_aid LEFT JOIN ( ";
            $sql .= "select sales_order_product_id, SUM(sales_order_qty) AS order_qty ";
            $sql .= "from {$this->tblSalesOrder} group by sales_order_product_id ) as so ";
            $sql .= "ON so.sales_order_product_id = p.products_aid ";
            $sql .= "group by p.products_aid ) AS inventory_data ";
            $sql .= " where inventory_data.stock_movement_product_owner_id = :stock_movement_product_owner_id ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } elseif ($this->column_search !== "") {
                $sql .= " and ( inventory_data.products_name LIKE :stock_movement_product_name
                OR inventory_data.products_owner_name LIKE :stock_movement_product_owner_name ) ";
            }
            if ($inventoryStatusFilter === 'out of stock') {
                $sql .= " and inventory_data.current_qty <= 0 ";
            } elseif ($inventoryStatusFilter === 'low stock') {
                $sql .= " and inventory_data.current_qty > 0 ";
                $sql .= " and inventory_data.current_qty <= inventory_data.products_low_stock_threshold ";
            } elseif ($inventoryStatusFilter === 'in stock') {
                $sql .= " and inventory_data.current_qty > inventory_data.products_low_stock_threshold ";
            }
            $sql .= " order by inventory_data.current_qty asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError(
                $ex->getMessage(),
                $ex->getFile(),
                [
                    'line' => $ex->getLine(),
                    'code' => $ex->getCode()
                ]
            );

            $query = false;
        }
        return $query;
    }

    public function readByUserIdLimit($allowedColumns)
    {
        $filterColumn = [];
        $inventoryStatusFilter = "";

        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            "stock_movement_product_owner_id" => $this->userId,
            ...(
                $this->column_search != ""
                ? [
                    "stock_movement_product_name" => "%{$this->column_search}%",
                    "stock_movement_product_owner_name" => "%{$this->column_search}%",
                ]
                : []
            ),
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params, $inventoryStatusFilter);

        try {
            $sql = " select inventory_data.*, ";
            $sql .= "CASE WHEN inventory_data.current_qty <= 0 THEN 'out of stock' ";
            $sql .= "WHEN inventory_data.current_qty <= inventory_data.products_low_stock_threshold THEN 'low stock' ";
            $sql .= "ELSE 'in stock' ";
            $sql .= "END as inventory_status ";
            $sql .= "from ( select MAX(p.products_low_stock_threshold) as products_low_stock_threshold, ";
            $sql .= "MAX(p.products_sku) as products_sku, ";
            $sql .= "MAX(p.products_unit) as products_unit, ";
            $sql .= "MAX(p.products_status) as products_status, ";
            $sql .= "MAX(p.products_price) as products_price, ";
            $sql .= "MAX(p.products_name) as products_name, ";
            $sql .= "MAX(p.products_owner_name) as products_owner_name, ";
            $sql .= "MAX(p.products_aid) as products_aid, ";
            $sql .= "MAX(ms.stock_movement_location) as stock_movement_location, ";
            $sql .= "MAX(ms.stock_movement_product_name) as name, ";
            $sql .= "MAX(ms.stock_movement_is_active) as is_active, ";
            $sql .= "MAX(ms.stock_movement_is_active) as stock_movement_is_active, ";
            $sql .= "MAX(ms.stock_movement_product_name) as stock_movement_product_name, ";
            $sql .= "MAX(ms.stock_movement_product_owner_name) as stock_movement_product_owner_name, ";
            $sql .= "MAX(ms.stock_movement_product_owner_id) as stock_movement_product_owner_id, ";
            $sql .= "DATE_FORMAT(MAX(ms.stock_movement_date), '%b %d, %Y') AS stock_movement_date, ";
            $sql .= "SUM( CASE WHEN ms.stock_movement_type IN ( 'in stock', 'stock in - return', 'purchases', 'stock in adjustments' ) ";
            $sql .= "THEN ms.stock_movement_qty WHEN ms.stock_movement_type IN ( 'stock out - reject/defective items', 'stock out - return item' ) ";
            $sql .= "THEN -ms.stock_movement_qty ELSE 0 END ) as stock_qty, ";
            $sql .= "MAX(IFNULL(so.order_qty, 0)) as order_qty, ";
            $sql .= "( SUM( CASE WHEN ms.stock_movement_type IN ( 'in stock', 'stock in - return', 'purchases', 'stock in adjustments' ) ";
            $sql .= "THEN ms.stock_movement_qty WHEN ms.stock_movement_type IN ( 'stock out - reject/defective items', ";
            $sql .= "'stock out - return item' ) THEN -ms.stock_movement_qty ELSE 0 END ) - MAX(IFNULL(so.order_qty, 0))) as current_qty ";
            $sql .= "from {$this->tblMovementStock} AS ms INNER JOIN {$this->tblProducts} as p ";
            $sql .= "ON ms.stock_movement_product_id = p.products_aid LEFT JOIN ( ";
            $sql .= "select sales_order_product_id, SUM(sales_order_qty) AS order_qty ";
            $sql .= "from {$this->tblSalesOrder} group by sales_order_product_id ) as so ";
            $sql .= "ON so.sales_order_product_id = p.products_aid ";
            $sql .= "group by p.products_aid ) AS inventory_data ";
            $sql .= " where inventory_data.stock_movement_product_owner_id = :stock_movement_product_owner_id ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } elseif ($this->column_search !== "") {
                $sql .= " and ( inventory_data.products_name LIKE :stock_movement_product_name
                OR inventory_data.products_owner_name LIKE :stock_movement_product_owner_name ) ";
            }
            // FILTER THE inventory_status 
            if ($inventoryStatusFilter === 'out of stock') {
                $sql .= " and inventory_data.current_qty <= 0 ";
            } elseif ($inventoryStatusFilter === 'low stock') {
                $sql .= " and inventory_data.current_qty > 0 ";
                $sql .= " and inventory_data.current_qty <= inventory_data.products_low_stock_threshold ";
            } elseif ($inventoryStatusFilter === 'in stock') {
                $sql .= " and inventory_data.current_qty > inventory_data.products_low_stock_threshold ";
            }
            $sql .= " order by inventory_data.current_qty asc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {

            logError(
                $ex->getMessage(),
                $ex->getFile(),
                [
                    'line' => $ex->getLine(),
                    'code' => $ex->getCode()
                ]
            );

            $query = false;
        }
        return $query;
    }
}
