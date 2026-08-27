<?php
class ReportSalesOrder
{
    public $sales_order_aid;
    public $sales_order_status;
    public $sales_order_is_active;
    public $sales_order_number;
    public $sales_order_date;
    public $sales_order_customer_id;
    public $sales_order_customer_name;
    public $sales_order_payment_method;
    public $sales_order_product_id;
    public $sales_order_product_name;
    public $sales_order_qty;
    public $sales_order_price;
    public $sales_order_total;
    public $sales_order_discount;
    public $sales_order_tax;
    public $sales_order_paid_amount;
    public $sales_order_notes;
    public $sales_order_received_by_id;
    public $sales_order_received_by_name;
    public $sales_order_product_owner_id;
    public $sales_order_product_owner_name;
    public $sales_order_installment;
    public $sales_order_due_date;
    public $sales_order_total_receivable_amount;
    public $sales_order_created;
    public $sales_order_updated;

    public $due_date;
    public $userId;

    public $stock_movement_before_qty;
    public $stock_movement_after_qty;
    public $stock_movement_qty;
    public $stock_movement_type;

    public $to;
    public $from;

    public $date_today;
    public $date_yesterday;

    public $connection;
    public $lastInsertedId;
    public $tblSalesOrder;
    public $tblStockMovements;
    public $tblMovementStock;
    public $tblProducts;
    public $tblSupplier;
    public $tblSuppliersPurchaseOrder;
    public $tblinstallmentPayment;
    public $tblReturnProducts;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblSalesOrder = "graces_sales_order";
        $this->tblStockMovements = "graces_stock_movement";
        $this->tblMovementStock = "graces_stock_movement";
        $this->tblProducts = "graces_products";
        $this->tblSupplier = "graces_suppliers";
        $this->tblSuppliersPurchaseOrder = "graces_suppliers_purchase_order";
        $this->tblinstallmentPayment = "graces_installment_payment";
        $this->tblReturnProducts = "graces_return_product";
    }


    // read all
    public function readAllSalesOrder($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...$this->userId != 0 ? ["sales_order_product_owner_id" => $this->userId] : [],
            ...($this->column_search != "" ? [
                "sales_order_number" => "%{$this->column_search}%",
                "sales_order_customer_name" => "%{$this->column_search}%",
                "sales_order_product_name" => "%{$this->column_search}%",
                "sales_order_received_by_name" => "%{$this->column_search}%",
                "sales_order_product_owner_name" => "%{$this->column_search}%",
            ] : []),
        ];
        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "sales_order_number, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_total_receivable_amount as total_amount, ";
            $sql .= "sales_order_total_amount as total_sub_amount, ";
            $sql .= "sales_order_paid_amount as total_paid, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where true ";
            $sql .= ($this->userId != 0 ? "and sales_order_product_owner_id = :sales_order_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_order_number like :sales_order_number 
            or sales_order_customer_name like :sales_order_customer_name 
            or sales_order_received_by_name like :sales_order_received_by_name 
            or sales_order_product_owner_name like :sales_order_product_owner_name 
            or sales_order_product_name like :sales_order_product_name ) " : " ");
            }
            $sql .= " order by sales_order_is_active desc, ";
            $sql .= "sales_order_number desc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAllSalesOrderLimit($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->userId != 0 ? ["sales_order_product_owner_id" => $this->userId] : [],
            ...($this->column_search != "" ? [
                "sales_order_number" => "%{$this->column_search}%",
                "sales_order_customer_name" => "%{$this->column_search}%",
                "sales_order_product_name" => "%{$this->column_search}%",
                "sales_order_received_by_name" => "%{$this->column_search}%",
                "sales_order_product_owner_name" => "%{$this->column_search}%",
            ] : []),
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "sales_order_number, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_total_receivable_amount as total_amount, ";
            $sql .= "sales_order_total_amount as total_sub_amount, ";
            $sql .= "sales_order_paid_amount as total_paid, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where true ";
            $sql .= ($this->userId != 0 ? "and sales_order_product_owner_id = :sales_order_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_order_number like :sales_order_number 
            or sales_order_customer_name like :sales_order_customer_name 
            or sales_order_received_by_name like :sales_order_received_by_name 
            or sales_order_product_owner_name like :sales_order_product_owner_name 
            or sales_order_product_name like :sales_order_product_name ) " : " ");
            }
            $sql .= " order by sales_order_is_active desc, ";
            $sql .= "sales_order_number desc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAllSalesOrderAmount($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...$this->userId != 0 ? ["sales_order_product_owner_id" => $this->userId] : [],
            ...($this->column_search != "" ? [
                "sales_order_number" => "%{$this->column_search}%",
                "sales_order_customer_name" => "%{$this->column_search}%",
                "sales_order_product_name" => "%{$this->column_search}%",
                "sales_order_received_by_name" => "%{$this->column_search}%",
                "sales_order_product_owner_name" => "%{$this->column_search}%",
            ] : []),
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "SUM(sales_order_qty) as qty, ";
            $sql .= "SUM(sales_order_discounted_with_vat_amount) as sales_order_discounted_with_vat_amount, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where true ";
            $sql .= ($this->userId != 0 ? "and sales_order_product_owner_id = :sales_order_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_order_number like :sales_order_number 
            or sales_order_customer_name like :sales_order_customer_name 
            or sales_order_received_by_name like :sales_order_received_by_name 
            or sales_order_product_owner_name like :sales_order_product_owner_name 
            or sales_order_product_name like :sales_order_product_name ) " : " ");
            }
            $sql .= " order by sales_order_is_active desc, ";
            $sql .= "sales_order_number desc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }

        return $query;
    }

    public function readAllExpensesAmount()
    {
        try {
            $sql = "select *, ";
            $sql .= "SUM(purchase_order_total_paid_per_product) as total_paid ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= " where true ";
            $sql .= ($this->userId != 0 ? "and purchase_order_product_owner_id = :purchase_order_product_owner_id " : " ");
            $sql .= " group by purchase_order_number ";
            $sql .= " order by purchase_order_number ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->userId != 0 ? ["purchase_order_product_owner_id" => $this->userId] : [],
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    public function readAllSalesOrderPaidAmount()
    {
        try {
            $sql = "select *, ";
            $sql .= "SUM(sales_order_paid_per_product) as total_paid_sales ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where CAST(sales_order_paid_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= " group by sales_order_number ";
            $sql .= " order by sales_order_number ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    public function readAllStockLevel($allowedColumns)
    {
        $filterColumn = [];
        $inventoryStatusFilter = "";

        $params = [
            ...$this->userId != 0 ? ["products_owner_id" => $this->userId] : [],
            ...(
                $this->column_search != ""
                ? [
                    "stock_movement_product_name" => "%{$this->column_search}%",
                    "stock_movement_product_owner_name" => "%{$this->column_search}%",
                ]
                : []
            ),
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            // Special handling for inventory_status
            if ($item['id'] === 'inventory_status') {
                $inventoryStatusFilter = strtolower(trim($item['value']));
                continue;
            }


            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];

                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
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
            $sql .= "MAX(p.products_owner_id) as products_owner_id, ";
            $sql .= "MAX(p.products_aid) as products_aid, ";
            $sql .= "MAX(ms.stock_movement_location) as stock_movement_location, ";
            $sql .= "MAX(ms.stock_movement_product_name) as name, ";
            $sql .= "MAX(ms.stock_movement_is_active) as is_active, ";
            $sql .= "MAX(ms.stock_movement_is_active) as stock_movement_is_active, ";
            $sql .= "MAX(ms.stock_movement_product_name) as stock_movement_product_name, ";
            $sql .= "MAX(ms.stock_movement_product_owner_name) as stock_movement_product_owner_name, ";
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
            $sql .= " where true ";
            $sql .= ($this->userId != 0 ? "and inventory_data.products_owner_id = :products_owner_id " : " ");
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

    public function readAllStockLevelLimit($allowedColumns)
    {
        $filterColumn = [];
        $inventoryStatusFilter = "";

        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->userId != 0 ? ["products_owner_id" => $this->userId] : [],
            ...(
                $this->column_search != ""
                ? [
                    "stock_movement_product_name" => "%{$this->column_search}%",
                    "stock_movement_product_owner_name" => "%{$this->column_search}%",
                ]
                : []
            ),
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }

            // Special handling for inventory_status
            if ($item['id'] === 'inventory_status') {
                $inventoryStatusFilter = strtolower(trim($item['value']));
                continue;
            }

            $col = $item['id'];

            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];

                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }

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
            $sql .= "MAX(p.products_owner_id) as products_owner_id, ";
            $sql .= "MAX(p.products_owner_name) as products_owner_name, ";
            $sql .= "MAX(p.products_aid) as products_aid, ";
            $sql .= "MAX(ms.stock_movement_location) as stock_movement_location, ";
            $sql .= "MAX(ms.stock_movement_product_name) as name, ";
            $sql .= "MAX(ms.stock_movement_is_active) as is_active, ";
            $sql .= "MAX(ms.stock_movement_is_active) as stock_movement_is_active, ";
            $sql .= "MAX(ms.stock_movement_product_name) as stock_movement_product_name, ";
            $sql .= "MAX(ms.stock_movement_product_owner_name) as stock_movement_product_owner_name, ";
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
            $sql .= "WHERE true ";
            $sql .= ($this->userId != 0 ? "and inventory_data.products_owner_id = :products_owner_id " : " ");
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

            returnError($ex);
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

    // read all
    public function readAllLowStock($allowedColumns)
    {
        $filterColumn = [];
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

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }

            $col = $item['id'];

            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];

                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }

        try {
            $sql = "select ";
            $sql .= "MAX(p.products_low_stock_threshold) as products_low_stock_threshold, ";
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

            $sql .= "WHERE 1=1 ";

            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } elseif ($this->column_search !== "") {
                $sql .= "
                and (
                    ms.stock_movement_product_name LIKE :stock_movement_product_name
                    OR ms.stock_movement_product_owner_name LIKE :stock_movement_product_owner_name
                )
            ";
            }

            $sql .= " group by p.products_aid ";
            $sql .= "HAVING current_qty <= MAX(p.products_low_stock_threshold) ";
            $sql .= " order by p.products_aid ";

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

    public function readAllLowStockLimit($allowedColumns)
    {
        $filterColumn = [];
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

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }

            $col = $item['id'];

            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];

                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }

        try {
            $sql = "select ";
            $sql .= "MAX(p.products_low_stock_threshold) AS products_low_stock_threshold, ";
            $sql .= "MAX(p.products_sku) AS products_sku, ";
            $sql .= "MAX(p.products_unit) AS products_unit, ";
            $sql .= "MAX(p.products_status) AS products_status, ";
            $sql .= "MAX(p.products_price) as products_price, ";
            $sql .= "MAX(p.products_name) as products_name, ";
            $sql .= "MAX(p.products_aid) AS products_aid, ";
            $sql .= "MAX(ms.stock_movement_location) AS stock_movement_location, ";
            $sql .= "MAX(ms.stock_movement_product_name) AS name, ";
            $sql .= "MAX(ms.stock_movement_is_active) AS is_active, ";
            $sql .= "MAX(ms.stock_movement_product_name) as stock_movement_product_name, ";
            $sql .= "MAX(ms.stock_movement_product_owner_name) as stock_movement_product_owner_name, ";
            $sql .= "DATE_FORMAT(MAX(ms.stock_movement_date), '%b %d, %Y') AS stock_movement_date, ";

            // Total stock quantity
            $sql .= "
            SUM(
                CASE
                    WHEN ms.stock_movement_type IN (
                        'in stock',
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

            // Current quantity
            $sql .= "
            (
                SUM(
                    CASE
                        WHEN ms.stock_movement_type IN (
                            'in stock',
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

            $sql .= "where 1=1 ";

            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } elseif ($this->column_search !== "") {
                $sql .= "
                and (
                    ms.stock_movement_product_name LIKE :stock_movement_product_name
                    OR ms.stock_movement_product_owner_name LIKE :stock_movement_product_owner_name
                )
            ";
            }

            $sql .= " group by p.products_aid ";
            $sql .= "HAVING current_qty <= MAX(p.products_low_stock_threshold) ";
            $sql .= " order by p.products_aid ";
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


    // read all
    public function readAllInventoryMovement($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...$this->userId != 0 ? ["stock_movement_product_owner_id" => $this->userId] : [],
            ...$this->column_search != "" ? [
                "stock_movement_product_name" => "%{$this->column_search}%",
                "stock_movement_product_owner_name" => "%{$this->column_search}%",
            ] : [],
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select sm.*, ";
            $sql .= "p.products_name, ";
            $sql .= "p.products_low_stock_threshold, ";
            $sql .= "p.products_price, ";
            $sql .= "p.products_sku, ";
            $sql .= "p.products_category, ";
            $sql .= "sm.stock_movement_aid as id, ";
            $sql .= "sm.stock_movement_type as status_text, ";
            $sql .= "sm.stock_movement_is_active as is_active, ";
            $sql .= "DATE_FORMAT(sm.stock_movement_date, '%b %d, %Y') as stock_movement_date, ";
            $sql .= "sm.stock_movement_product_name as name ";
            $sql .= "from {$this->tblMovementStock} as sm, ";
            $sql .= "{$this->tblProducts} as p ";
            $sql .= " where p.products_aid = sm.stock_movement_product_id ";
            $sql .= ($this->userId != 0 ? "and sm.stock_movement_product_owner_id = :stock_movement_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sm.stock_movement_product_name like :stock_movement_product_name 
            or sm.stock_movement_product_owner_name like :stock_movement_product_owner_name ) " : " ");
            }
            $sql .= " order by sm.stock_movement_aid desc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {


            $query = false;
        }
        return $query;
    }

    // read all
    public function readAllInventoryMovementLimit($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->userId != 0 ? ["stock_movement_product_owner_id" => $this->userId] : [],
            ...$this->column_search != "" ? [
                "stock_movement_product_name" => "%{$this->column_search}%",
                "stock_movement_product_owner_name" => "%{$this->column_search}%",
            ] : [],
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select sm.*, ";
            $sql .= "p.products_name, ";
            $sql .= "p.products_low_stock_threshold, ";
            $sql .= "p.products_price, ";
            $sql .= "p.products_sku, ";
            $sql .= "p.products_category, ";
            $sql .= "sm.stock_movement_aid as id, ";
            $sql .= "sm.stock_movement_type as status_text, ";
            $sql .= "sm.stock_movement_is_active as is_active, ";
            $sql .= "DATE_FORMAT(sm.stock_movement_date, '%b %d, %Y') as stock_movement_date, ";
            $sql .= "sm.stock_movement_product_name as name ";
            $sql .= "from {$this->tblMovementStock} as sm, ";
            $sql .= "{$this->tblProducts} as p ";
            $sql .= " where p.products_aid = sm.stock_movement_product_id ";
            $sql .= ($this->userId != 0 ? "and sm.stock_movement_product_owner_id = :stock_movement_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sm.stock_movement_product_name like :stock_movement_product_name 
            or sm.stock_movement_product_owner_name like :stock_movement_product_owner_name ) " : " ");
            }
            $sql .= " order by sm.stock_movement_aid desc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAllExpenses($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...$this->userId != 0 ? ["purchase_order_product_owner_id" => $this->userId] : [],
            ...$this->column_search != "" ? [
                "purchase_order_number" => "%{$this->column_search}%",
                "purchase_order_supplier_name" => "%{$this->column_search}%",
                "purchase_order_product_owner_name" => "%{$this->column_search}%",
                "purchase_order_product_name" => "%{$this->column_search}%",
            ] : [],
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "DATE_FORMAT(purchase_order_date, '%b %d, %Y') as purchase_order_date, ";
            $sql .= "DATE_FORMAT(purchase_order_expected_delivery, '%b %d, %Y') as purchase_order_expected_delivery, ";
            $sql .= "purchase_order_status as status, ";
            $sql .= "purchase_order_payment_status as payment_status, ";
            $sql .= "purchase_order_total_amount_per_product as amount, ";
            $sql .= "purchase_order_is_active as is_active, ";
            $sql .= "purchase_order_number as name ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= " where true ";
            $sql .= ($this->userId != 0 ? "and purchase_order_product_owner_id = :purchase_order_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (purchase_order_number like :purchase_order_number
                or purchase_order_supplier_name like :purchase_order_supplier_name 
                or purchase_order_product_owner_name like :purchase_order_product_owner_name 
                or purchase_order_product_name like :purchase_order_product_name) " : " ");
            }
            $sql .= " order by purchase_order_is_active desc, ";
            $sql .= " purchase_order_aid desc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAllExpensesLimit($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->userId != 0 ? ["purchase_order_product_owner_id" => $this->userId] : [],
            ...$this->column_search != "" ? [
                "purchase_order_number" => "%{$this->column_search}%",
                "purchase_order_supplier_name" => "%{$this->column_search}%",
                "purchase_order_product_owner_name" => "%{$this->column_search}%",
                "purchase_order_product_name" => "%{$this->column_search}%",
            ] : [],
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "DATE_FORMAT(purchase_order_date, '%b %d, %Y') as purchase_order_date, ";
            $sql .= "DATE_FORMAT(purchase_order_expected_delivery, '%b %d, %Y') as purchase_order_expected_delivery, ";
            $sql .= "purchase_order_status as status, ";
            $sql .= "purchase_order_payment_status as payment_status, ";
            $sql .= "purchase_order_total_amount_per_product as amount, ";
            $sql .= "purchase_order_is_active as is_active, ";
            $sql .= "purchase_order_number as name ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= " where true ";
            $sql .= ($this->userId != 0 ? "and purchase_order_product_owner_id = :purchase_order_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (purchase_order_number like :purchase_order_number
                or purchase_order_supplier_name like :purchase_order_supplier_name 
                or purchase_order_product_owner_name like :purchase_order_product_owner_name 
                or purchase_order_product_name like :purchase_order_product_name) " : " ");
            }
            $sql .= "order by purchase_order_is_active desc, ";
            $sql .= "purchase_order_aid desc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }

        return $query;
    }

    // read all
    public function readAllOverduePayment($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "due_date" => $this->due_date,
            ...$this->column_search != "" ? [
                "installment_payment_due_date" => "%{$this->column_search}%",
                "installment_payment_code_number" => "%{$this->column_search}%",
            ] : [],
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "DATE_FORMAT(installment_payment_due_date, '%b %d, %Y') as installment_payment_due_date, ";
            $sql .= "DATEDIFF(NOW(), installment_payment_due_date) as days_ago, ";
            $sql .= "installment_payment_aid as id, ";
            $sql .= "installment_payment_is_paid as is_active, ";
            $sql .= "installment_payment_code_number as name ";
            $sql .= "from {$this->tblinstallmentPayment} ";
            $sql .= "where installment_payment_is_paid = '0' ";
            $sql .= "and DATE(installment_payment_due_date) <= DATE(:due_date) ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (installment_payment_due_date like :installment_payment_due_date 
                or installment_payment_code_number like :installment_payment_code_number) " : " ");
            }
            $sql .= " order by DATE(installment_payment_due_date) asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAllOverduePaymentLimit($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            "due_date" => $this->due_date,
            ...$this->column_search != "" ? [
                "installment_payment_due_date" => "%{$this->column_search}%",
                "installment_payment_code_number" => "%{$this->column_search}%",
            ] : [],
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "DATE_FORMAT(installment_payment_due_date, '%b %d, %Y') as installment_payment_due_date, ";
            $sql .= "DATEDIFF(NOW(), installment_payment_due_date) as days_ago, ";
            $sql .= "installment_payment_aid as id, ";
            $sql .= "installment_payment_is_paid as is_active, ";
            $sql .= "installment_payment_code_number as name ";
            $sql .= "from {$this->tblinstallmentPayment} ";
            $sql .= "where installment_payment_is_paid = '0' ";
            $sql .= "and DATE(installment_payment_due_date) <= DATE(:due_date) ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (installment_payment_due_date like :installment_payment_due_date 
                or installment_payment_code_number like :installment_payment_code_number) " : " ");
            }
            $sql .= " order by DATE(installment_payment_due_date) asc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }

        return $query;
    }

    // read all
    public function readOverduePaymentWithLimit()
    {
        try {
            $sql = "select *, ";
            $sql .= "DATE_FORMAT(installment_payment_due_date, '%b %d, %Y') as installment_payment_due_date, ";
            $sql .= "DATEDIFF(NOW(), installment_payment_due_date) as days_ago, ";
            $sql .= "installment_payment_aid as id, ";
            $sql .= "installment_payment_code_number as name ";
            $sql .= "from {$this->tblinstallmentPayment} ";
            $sql .= "where installment_payment_is_paid = '0' ";
            $sql .= "and DATE(installment_payment_due_date) <= DATE(:due_date) ";
            $sql .= " order by DATE(installment_payment_due_date) desc ";
            $sql .= "limit :total ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "total" => $this->column_total,
                "due_date" => $this->due_date,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }



    // read all
    public function readAllAR($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...$this->userId != 0 ? ["sales_order_product_owner_id" => $this->userId] : [],
            ...($this->column_search != "" ? [
                "sales_order_number" => "%{$this->column_search}%",
                "sales_order_customer_name" => "%{$this->column_search}%",
                "sales_order_product_name" => "%{$this->column_search}%",
                "sales_order_received_by_name" => "%{$this->column_search}%",
                "sales_order_product_owner_name" => "%{$this->column_search}%",
            ] : []),
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "(sales_order_paid_per_product + sales_order_balance_per_product) as total_amount_per_product, ";
            $sql .= "sales_order_number, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_total_receivable_amount as total_amount, ";
            $sql .= "sales_order_total_amount as total_sub_amount, ";
            $sql .= "sales_order_paid_amount as total_paid, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where CAST(sales_order_balance_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= ($this->userId != 0 ? "and sales_order_product_owner_id = :sales_order_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_order_number like :sales_order_number 
            or sales_order_customer_name like :sales_order_customer_name 
            or sales_order_received_by_name like :sales_order_received_by_name 
            or sales_order_product_owner_name like :sales_order_product_owner_name 
            or sales_order_product_name like :sales_order_product_name ) " : " ");
            }
            $sql .= " order by DATE(sales_order_date) desc, ";
            $sql .= "sales_order_number desc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readARLimit($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->userId != 0 ? ["sales_order_product_owner_id" => $this->userId] : [],
            ...($this->column_search != "" ? [
                "sales_order_number" => "%{$this->column_search}%",
                "sales_order_customer_name" => "%{$this->column_search}%",
                "sales_order_product_name" => "%{$this->column_search}%",
                "sales_order_received_by_name" => "%{$this->column_search}%",
                "sales_order_product_owner_name" => "%{$this->column_search}%",
            ] : []),
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "(sales_order_paid_per_product + sales_order_balance_per_product) as total_amount_per_product, ";
            $sql .= "sales_order_number, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_total_receivable_amount as total_amount, ";
            $sql .= "sales_order_total_amount as total_sub_amount, ";
            $sql .= "sales_order_paid_amount as total_paid, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where CAST(sales_order_balance_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= ($this->userId != 0 ? "and sales_order_product_owner_id = :sales_order_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_order_number like :sales_order_number 
            or sales_order_customer_name like :sales_order_customer_name 
            or sales_order_received_by_name like :sales_order_received_by_name 
            or sales_order_product_owner_name like :sales_order_product_owner_name 
            or sales_order_product_name like :sales_order_product_name ) " : " ");
            }
            $sql .= " order by sales_order_is_active desc, ";
            $sql .= "sales_order_number desc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }



    // read all
    public function readAllAP($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...$this->userId != 0 ? ["purchase_order_product_owner_id" => $this->userId] : [],
            ...$this->column_search != "" ? [
                "purchase_order_number" => "%{$this->column_search}%",
                "purchase_order_supplier_name" => "%{$this->column_search}%",
                "purchase_order_product_owner_name" => "%{$this->column_search}%",
                "purchase_order_product_name" => "%{$this->column_search}%",
            ] : [],
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "DATE_FORMAT(purchase_order_date, '%b %d, %Y') as purchase_order_date, ";
            $sql .= "DATE_FORMAT(purchase_order_expected_delivery, '%b %d, %Y') as purchase_order_expected_delivery, ";
            $sql .= "purchase_order_status as status, ";
            $sql .= "purchase_order_payment_status as payment_status, ";
            $sql .= "purchase_order_total_amount_per_product as amount, ";
            $sql .= "purchase_order_is_active as is_active, ";
            $sql .= "purchase_order_number as name ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= " where CAST(purchase_order_total_balance_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= ($this->userId != 0 ? "and purchase_order_product_owner_id = :purchase_order_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (purchase_order_number like :purchase_order_number
                or purchase_order_supplier_name like :purchase_order_supplier_name 
                or purchase_order_product_owner_name like :purchase_order_product_owner_name 
                or purchase_order_product_name like :purchase_order_product_name) " : " ");
            }
            $sql .= " order by purchase_order_is_active desc, ";
            $sql .= " purchase_order_aid desc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAPLimit($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->userId != 0 ? ["purchase_order_product_owner_id" => $this->userId] : [],
            ...$this->column_search != "" ? [
                "purchase_order_number" => "%{$this->column_search}%",
                "purchase_order_supplier_name" => "%{$this->column_search}%",
                "purchase_order_product_owner_name" => "%{$this->column_search}%",
                "purchase_order_product_name" => "%{$this->column_search}%",
            ] : [],
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "DATE_FORMAT(purchase_order_date, '%b %d, %Y') as purchase_order_date, ";
            $sql .= "DATE_FORMAT(purchase_order_expected_delivery, '%b %d, %Y') as purchase_order_expected_delivery, ";
            $sql .= "purchase_order_status as status, ";
            $sql .= "purchase_order_payment_status as payment_status, ";
            $sql .= "purchase_order_total_amount_per_product as amount, ";
            $sql .= "purchase_order_is_active as is_active, ";
            $sql .= "purchase_order_number as name ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= " where CAST(purchase_order_total_balance_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= ($this->userId != 0 ? "and purchase_order_product_owner_id = :purchase_order_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (purchase_order_number like :purchase_order_number
                or purchase_order_supplier_name like :purchase_order_supplier_name 
                or purchase_order_product_owner_name like :purchase_order_product_owner_name 
                or purchase_order_product_name like :purchase_order_product_name) " : " ");
            }
            $sql .= "order by purchase_order_is_active desc, ";
            $sql .= "purchase_order_aid desc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }

        return $query;
    }

    // read all
    public function readSalesPerWeek()
    {

        try {
            $sql = "select ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'monday' ";
            $sql .= "THEN sales_order_paid_per_product ELSE 0 END) AS monday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'tuesday' ";
            $sql .= "THEN sales_order_paid_per_product ELSE 0 END) AS tuesday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'wednesday' ";
            $sql .= "THEN sales_order_paid_per_product ELSE 0 END) AS wednesday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'thursday' ";
            $sql .= "THEN sales_order_paid_per_product ELSE 0 END) AS thursday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'friday' ";
            $sql .= "THEN sales_order_paid_per_product ELSE 0 END) AS friday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'saturday' ";
            $sql .= "THEN sales_order_paid_per_product ELSE 0 END) AS saturday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'sunday' ";
            $sql .= "THEN sales_order_paid_per_product ELSE 0 END) AS sunday ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= "WHERE sales_order_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) ";
            $sql .= "and CAST(sales_order_paid_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= " group by MONTH(sales_order_date) ";
            $sql .= " order by MONTH(sales_order_date) desc ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readSalesPerMonth()
    {
        try {
            $sql = "select  ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 1 THEN sales_order_paid_per_product ELSE 0 END) AS january, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 2 THEN sales_order_paid_per_product ELSE 0 END) AS february, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 3 THEN sales_order_paid_per_product ELSE 0 END) AS march, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 4 THEN sales_order_paid_per_product ELSE 0 END) AS april, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 5 THEN sales_order_paid_per_product ELSE 0 END) AS may, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 6 THEN sales_order_paid_per_product ELSE 0 END) AS june, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 7 THEN sales_order_paid_per_product ELSE 0 END) AS july, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 8 THEN sales_order_paid_per_product ELSE 0 END) AS august, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 9 THEN sales_order_paid_per_product ELSE 0 END) AS september, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 10 THEN sales_order_paid_per_product ELSE 0 END) AS october, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 11 THEN sales_order_paid_per_product ELSE 0 END) AS november, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 12 THEN sales_order_paid_per_product ELSE 0 END) AS december ";
            $sql .= "FROM {$this->tblSalesOrder} ";
            $sql .= "WHERE YEAR(sales_order_date) = YEAR(CURDATE()) ";
            $sql .= "and CAST(sales_order_paid_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= "GROUP BY YEAR(sales_order_date) ";
            $sql .= "ORDER BY YEAR(sales_order_date) DESC ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readSalesPerYear()
    {

        try {
            $sql  = "select ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) THEN sales_order_paid_per_product ELSE 0 END) AS year_0, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 1 THEN sales_order_paid_per_product ELSE 0 END) AS year_1, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 2 THEN sales_order_paid_per_product ELSE 0 END) AS year_2, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 3 THEN sales_order_paid_per_product ELSE 0 END) AS year_3, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 4 THEN sales_order_paid_per_product ELSE 0 END) AS year_4, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 5 THEN sales_order_paid_per_product ELSE 0 END) AS year_5 ";
            $sql .= "FROM {$this->tblSalesOrder} ";
            $sql .= "WHERE sales_order_date >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR) ";
            $sql .= "and CAST(sales_order_paid_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= "GROUP BY DATE_SUB(CURDATE(), INTERVAL 5 YEAR) ";
            $sql .= "ORDER BY DATE_SUB(CURDATE(), INTERVAL 5 YEAR) DESC ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    public function readAllExpensesPaidAmount()
    {
        try {
            $sql = "select *, ";
            $sql .= "SUM(purchase_order_total_paid_per_product) as total_paid ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= " where CAST(purchase_order_total_paid_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= " group by purchase_order_number ";
            $sql .= " order by purchase_order_number ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
    // read all
    public function readExpensesPerWeek()
    {

        try {
            $sql = "select ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'monday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS monday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'tuesday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS tuesday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'wednesday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS wednesday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'thursday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS thursday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'friday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS friday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'saturday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS saturday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'sunday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS sunday ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "WHERE purchase_order_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) ";
            $sql .= "and CAST(purchase_order_total_paid_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= " group by MONTH(purchase_order_date) ";
            $sql .= " order by MONTH(purchase_order_date) desc ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readExpensesPerMonth()
    {
        try {
            $sql = "select  ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 1 THEN purchase_order_total_paid_per_product ELSE 0 END) AS january, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 2 THEN purchase_order_total_paid_per_product ELSE 0 END) AS february, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 3 THEN purchase_order_total_paid_per_product ELSE 0 END) AS march, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 4 THEN purchase_order_total_paid_per_product ELSE 0 END) AS april, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 5 THEN purchase_order_total_paid_per_product ELSE 0 END) AS may, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 6 THEN purchase_order_total_paid_per_product ELSE 0 END) AS june, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 7 THEN purchase_order_total_paid_per_product ELSE 0 END) AS july, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 8 THEN purchase_order_total_paid_per_product ELSE 0 END) AS august, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 9 THEN purchase_order_total_paid_per_product ELSE 0 END) AS september, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 10 THEN purchase_order_total_paid_per_product ELSE 0 END) AS october, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 11 THEN purchase_order_total_paid_per_product ELSE 0 END) AS november, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 12 THEN purchase_order_total_paid_per_product ELSE 0 END) AS december ";
            $sql .= "FROM {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "WHERE YEAR(purchase_order_date) = YEAR(CURDATE()) ";
            $sql .= "and CAST(purchase_order_total_paid_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= "GROUP BY YEAR(purchase_order_date) ";
            $sql .= "ORDER BY YEAR(purchase_order_date) DESC ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readExpensesPerYear()
    {

        try {
            $sql  = "select ";
            $sql .= "SUM(CASE WHEN YEAR(purchase_order_date) = YEAR(CURDATE()) THEN purchase_order_total_paid_per_product ELSE 0 END) AS year_0, ";
            $sql .= "SUM(CASE WHEN YEAR(purchase_order_date) = YEAR(CURDATE()) - 1 THEN purchase_order_total_paid_per_product ELSE 0 END) AS year_1, ";
            $sql .= "SUM(CASE WHEN YEAR(purchase_order_date) = YEAR(CURDATE()) - 2 THEN purchase_order_total_paid_per_product ELSE 0 END) AS year_2, ";
            $sql .= "SUM(CASE WHEN YEAR(purchase_order_date) = YEAR(CURDATE()) - 3 THEN purchase_order_total_paid_per_product ELSE 0 END) AS year_3, ";
            $sql .= "SUM(CASE WHEN YEAR(purchase_order_date) = YEAR(CURDATE()) - 4 THEN purchase_order_total_paid_per_product ELSE 0 END) AS year_4, ";
            $sql .= "SUM(CASE WHEN YEAR(purchase_order_date) = YEAR(CURDATE()) - 5 THEN purchase_order_total_paid_per_product ELSE 0 END) AS year_5 ";
            $sql .= "FROM {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "WHERE purchase_order_date >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR) ";
            $sql .= "and CAST(purchase_order_total_paid_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= "GROUP BY DATE_SUB(CURDATE(), INTERVAL 5 YEAR) ";
            $sql .= "ORDER BY DATE_SUB(CURDATE(), INTERVAL 5 YEAR) DESC ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readPalIncome()
    {
        $filterColumn = [];
        $params = [
            "from" => $this->from,
            "to" => $this->to,
            ...($this->sales_order_product_owner_id != 0 ? [
                "sales_order_product_owner_id" => $this->sales_order_product_owner_id,
            ] : []),
        ];

        if ($this->from != "" && $this->to != "") {

            $filterColumn[] = " DATE(sales_order_date) BETWEEN DATE(:from) and DATE(:to) ";
        } else {
            $filterColumn[] = " ( DATE(sales_order_date) = DATE(:from) or DATE(sales_order_date) = DATE(:to) ) ";
        }

        if ($this->sales_order_product_owner_id != 0) {
            $filterColumn[] = "sales_order_product_owner_id = :sales_order_product_owner_id ";
        }

        try {
            $sql = "select ";
            $sql .= "SUM(sales_order_total) as total_amount, ";
            $sql .= "SUM(sales_order_vat) as tax_amount, ";
            $sql .= "SUM(sales_order_discount) as discount_amount, ";
            $sql .= "SUM(sales_order_discounted_with_vat_amount) as discounted_with_vat_amount ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            }
            $sql .= " group by sales_order_product_owner_id ";
            $sql .= " order by sales_order_product_owner_id asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }

        return $query;
    }

    // read all
    public function readPalSupplierExpenses()
    {
        $filterColumn = [];
        $params = [
            "from" => $this->from,
            "to" => $this->to,
            ...($this->sales_order_product_owner_id != 0 ? [
                "sales_order_product_owner_id" => $this->sales_order_product_owner_id,
            ] : []),
        ];

        if ($this->from != "" && $this->to != "") {

            $filterColumn[] = " DATE(sp.purchase_order_date) BETWEEN DATE(:from) and DATE(:to) ";
        } else {
            $filterColumn[] = " ( DATE(sp.purchase_order_date) = DATE(:from) or DATE(sp.purchase_order_date) = DATE(:to) ) ";
        }

        if ($this->sales_order_product_owner_id != 0) {
            $filterColumn[] = "sp.purchase_order_product_owner_id = :sales_order_product_owner_id ";
        }

        try {
            $sql = "select ";
            $sql .= "SUM(sp.purchase_order_total_amount_per_product) as amount ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} as sp, ";
            $sql .= "{$this->tblSupplier} as s ";
            $sql .= " where sp.purchase_order_supplier_id = s.suppliers_aid ";
            $sql .= " and s.suppliers_is_default != '1' ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            }
            $sql .= " group by s.suppliers_name ";
            $sql .= " order by s.suppliers_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }

        return $query;
    }
    public function readPalOperatingExpenses()
    {
        $filterColumn = [];
        $params = [
            "from" => $this->from,
            "to" => $this->to,
            ...($this->sales_order_product_owner_id != 0 ? [
                "sales_order_product_owner_id" => $this->sales_order_product_owner_id,
            ] : []),
        ];

        if ($this->from != "" && $this->to != "") {

            $filterColumn[] = " DATE(sp.purchase_order_date) BETWEEN DATE(:from) and DATE(:to) ";
        } else {
            $filterColumn[] = " ( DATE(sp.purchase_order_date) = DATE(:from) or DATE(sp.purchase_order_date) = DATE(:to) ) ";
        }

        if ($this->sales_order_product_owner_id != 0) {
            $filterColumn[] = "sp.purchase_order_product_owner_id = :sales_order_product_owner_id ";
        }

        try {
            $sql = "select ";
            $sql .= "s.suppliers_name as name, ";
            $sql .= "SUM(sp.purchase_order_total_amount_per_product) as amount ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} as sp, ";
            $sql .= "{$this->tblSupplier} as s ";
            $sql .= " where sp.purchase_order_supplier_id = s.suppliers_aid ";
            $sql .= " and s.suppliers_is_default = '1' ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            }
            $sql .= " group by s.suppliers_name ";
            $sql .= " order by s.suppliers_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }

        return $query;
    }
    // read by id
    public function readReturn()
    {
        try {
            $sql = "select *, ";
            $sql .= "SUM(return_product_amount) as amount, ";
            $sql .= "return_product_aid as id, ";
            $sql .= "return_product_status as is_status, ";
            $sql .= "return_product_number as name ";
            $sql .= "from {$this->tblReturnProducts} ";
            $sql .= "where return_product_status = 'processed' ";
            $sql .= ($this->userId != 0 ? "and return_product_owner_id = :return_product_owner_id " : " ");
            $sql .= "group by return_product_owner_id, ";
            $sql .= "return_product_status ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->userId != 0 ? ["return_product_owner_id" => $this->userId] : [],
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAllReturns($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...$this->column_search != "" ? [
                "return_product_number" => "%{$this->column_search}%",
                "return_product_order_number" => "%{$this->column_search}%",
                "return_product_customer_name" => "%{$this->column_search}%",
                "return_product_product_name" => "%{$this->column_search}%",
                "return_product_owner_name" => "%{$this->column_search}%",
            ] : [],
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "return_product_aid as id, ";
            $sql .= "return_product_status as is_status, ";
            $sql .= "DATE_FORMAT(return_product_date, '%b %d, %Y') as return_product_date, ";
            $sql .= "return_product_number as name ";
            $sql .= "from {$this->tblReturnProducts} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( return_product_number like :return_product_number
            or return_product_order_number like :return_product_order_number
            or return_product_customer_name like :return_product_customer_name
            or return_product_product_name like :return_product_product_name
            or return_product_owner_name like :return_product_owner_name ) " : " ");
            }
            $sql .= " order by return_product_date desc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read limit
    public function readAllReturnsLimit($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->column_search != "" ? [
                "return_product_number" => "%{$this->column_search}%",
                "return_product_order_number" => "%{$this->column_search}%",
                "return_product_customer_name" => "%{$this->column_search}%",
                "return_product_product_name" => "%{$this->column_search}%",
                "return_product_owner_name" => "%{$this->column_search}%",
            ] : [],
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "return_product_aid as id, ";
            $sql .= "return_product_status as is_status, ";
            $sql .= "DATE_FORMAT(return_product_date, '%b %d, %Y') as return_product_date, ";
            $sql .= "return_product_number as name ";
            $sql .= "from {$this->tblReturnProducts} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( return_product_number like :return_product_number
            or return_product_order_number like :return_product_order_number
            or return_product_customer_name like :return_product_customer_name
            or return_product_product_name like :return_product_product_name
            or return_product_owner_name like :return_product_owner_name ) " : " ");
            }
            $sql .= " order by return_product_date desc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }

        return $query;
    }
}
