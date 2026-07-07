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

    public $stock_movement_before_qty;
    public $stock_movement_after_qty;
    public $stock_movement_qty;
    public $stock_movement_type;

    public $date_today;
    public $date_yesterday;

    public $connection;
    public $lastInsertedId;
    public $tblSalesOrder;
    public $tblStockMovements;
    public $tblMovementStock;
    public $tblProducts;
    public $tblSuppliersPurchaseOrder;
    public $tblInstallmetPayment;

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
        $this->tblSuppliersPurchaseOrder = "graces_suppliers_purchase_order";
        $this->tblInstallmetPayment = "graces_installment_payment";
    }

    // read all
    public function readAllSalesOrder($allowedColumns)
    {
        $filterColumn = [];
        $params = [
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
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where true ";
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
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where true ";
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
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where true ";
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
            $sql = "select * ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "where purchase_order_status = 'paid' ";
            $sql .= "order by purchase_order_aid ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAllStockLevel($allowedColumns)
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

    public function readAllStockLevelLimit($allowedColumns)
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
            $sql = "select *, ";
            $sql .= "stock_movement_aid as id, ";
            $sql .= "stock_movement_type as status_text, ";
            $sql .= "stock_movement_is_active as is_active, ";
            $sql .= "DATE_FORMAT(stock_movement_date, '%b %d, %Y') as stock_movement_date, ";
            $sql .= "stock_movement_product_name as name ";
            $sql .= "from {$this->tblMovementStock} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( stock_movement_product_name like :stock_movement_product_name 
            or stock_movement_product_owner_name like :stock_movement_product_owner_name ) " : " ");
            }
            $sql .= " order by stock_movement_aid desc ";
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
            $sql = "select *, ";
            $sql .= "stock_movement_aid as id, ";
            $sql .= "stock_movement_type as status_text, ";
            $sql .= "stock_movement_is_active as is_active, ";
            $sql .= "DATE_FORMAT(stock_movement_date, '%b %d, %Y') as stock_movement_date, ";
            $sql .= "stock_movement_product_name as name ";
            $sql .= "from {$this->tblMovementStock} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( stock_movement_product_name like :stock_movement_product_name 
            or stock_movement_product_owner_name like :stock_movement_product_owner_name ) " : " ");
            }
            $sql .= " order by stock_movement_aid desc ";
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
            $sql .= "purchase_order_is_active as is_active, ";
            $sql .= "purchase_order_number as name ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= " where true ";
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
            $sql .= "purchase_order_is_active as is_active, ";
            $sql .= "purchase_order_number as name ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= " where true ";
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
                "installmet_payment_due_date" => "%{$this->column_search}%",
                "installmet_payment_code_number" => "%{$this->column_search}%",
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
            $sql .= "DATE_FORMAT(installmet_payment_due_date, '%b %d, %Y') as installmet_payment_due_date, ";
            $sql .= "DATEDIFF(NOW(), installmet_payment_due_date) as days_ago, ";
            $sql .= "installmet_payment_aid as id, ";
            $sql .= "installmet_payment_is_paid as is_active, ";
            $sql .= "installmet_payment_code_number as name ";
            $sql .= "from {$this->tblInstallmetPayment} ";
            $sql .= "where installmet_payment_is_paid = '0' ";
            $sql .= "and DATE(installmet_payment_due_date) <= DATE(:due_date) ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (installmet_payment_due_date like :installmet_payment_due_date 
                or installmet_payment_code_number like :installmet_payment_code_number) " : " ");
            }
            $sql .= " order by DATE(installmet_payment_due_date) asc ";
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
                "installmet_payment_due_date" => "%{$this->column_search}%",
                "installmet_payment_code_number" => "%{$this->column_search}%",
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
            $sql .= "DATE_FORMAT(installmet_payment_due_date, '%b %d, %Y') as installmet_payment_due_date, ";
            $sql .= "DATEDIFF(NOW(), installmet_payment_due_date) as days_ago, ";
            $sql .= "installmet_payment_aid as id, ";
            $sql .= "installmet_payment_is_paid as is_active, ";
            $sql .= "installmet_payment_code_number as name ";
            $sql .= "from {$this->tblInstallmetPayment} ";
            $sql .= "where installmet_payment_is_paid = '0' ";
            $sql .= "and DATE(installmet_payment_due_date) <= DATE(:due_date) ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (installmet_payment_due_date like :installmet_payment_due_date 
                or installmet_payment_code_number like :installmet_payment_code_number) " : " ");
            }
            $sql .= " order by DATE(installmet_payment_due_date) asc ";
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
            $sql .= "DATE_FORMAT(installmet_payment_due_date, '%b %d, %Y') as installmet_payment_due_date, ";
            $sql .= "DATEDIFF(NOW(), installmet_payment_due_date) as days_ago, ";
            $sql .= "installmet_payment_aid as id, ";
            $sql .= "installmet_payment_code_number as name ";
            $sql .= "from {$this->tblInstallmetPayment} ";
            $sql .= "where installmet_payment_is_paid = '0' ";
            $sql .= "and DATE(installmet_payment_due_date) <= DATE(:due_date) ";
            $sql .= " order by DATE(installmet_payment_due_date) asc ";
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
}
