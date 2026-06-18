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
    public $sales_order_overall_amount;
    public $sales_order_created;
    public $sales_order_updated;

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
}
