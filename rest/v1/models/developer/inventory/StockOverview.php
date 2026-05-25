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

    // read all
    public function readAll($allowedColumns)
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
            $sql = "select ms.*, ";
            $sql .= "p.products_low_stock_threshold, ";
            $sql .= "p.products_sku, ";
            $sql .= "p.products_unit, ";
            $sql .= "p.products_status, ";
            $sql .= "IFNULL(SUM(so.sales_order_qty), 0) as order_qty, ";
            $sql .= "SUM(ms.stock_movement_qty) as stock_qty, ";
            $sql .= "SUM(ms.stock_movement_qty) - IFNULL(SUM(so.sales_order_qty), 0) as current_qty, ";
            $sql .= "ms.stock_movement_is_active as is_active, ";
            $sql .= "DATE_FORMAT(ms.stock_movement_date, '%b %d, %Y') as stock_movement_date, ";
            $sql .= "ms.stock_movement_product_name as name ";
            $sql .= "from {$this->tblMovementStock} as ms, ";
            $sql .= "{$this->tblProducts} as p ";
            $sql .= "LEFT JOIN {$this->tblSalesOrder} as so ";
            $sql .= "ON so.sales_order_product_id = p.products_aid ";
            $sql .= "where ms.stock_movement_product_id = p.products_aid ";
            $sql .= "and ( ms.stock_movement_type = 'in stock' ";
            $sql .= "or ms.stock_movement_type = 'stock in adjustments' ) ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( ms.stock_movement_product_name like :stock_movement_product_name 
            or ms.stock_movement_product_owner_name like :stock_movement_product_owner_name ) " : " ");
            }
            $sql .= "group by p.products_aid ";
            $sql .= "order by ms.stock_movement_status desc, ";
            $sql .= "ms.stock_movement_product_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {

            $query = false;
        }

        return $query;
    }

    // read all
    public function readLimit($allowedColumns)
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
            $sql = "select ms.*, ";
            $sql .= "p.products_low_stock_threshold, ";
            $sql .= "p.products_sku, ";
            $sql .= "p.products_unit, ";
            $sql .= "p.products_status, ";
            $sql .= "IFNULL(SUM(so.sales_order_qty), 0) as order_qty, ";
            $sql .= "SUM(ms.stock_movement_qty) as stock_qty, ";
            $sql .= "SUM(ms.stock_movement_qty) - IFNULL(SUM(so.sales_order_qty), 0) as current_qty, ";
            $sql .= "ms.stock_movement_is_active as is_active, ";
            $sql .= "DATE_FORMAT(ms.stock_movement_date, '%b %d, %Y') as stock_movement_date, ";
            $sql .= "ms.stock_movement_product_name as name ";
            $sql .= "from {$this->tblMovementStock} as ms, ";
            $sql .= "{$this->tblProducts} as p ";
            $sql .= "LEFT JOIN {$this->tblSalesOrder} as so ";
            $sql .= "ON so.sales_order_product_id = p.products_aid ";
            $sql .= "where ms.stock_movement_product_id = p.products_aid ";
            $sql .= "and ( ms.stock_movement_type = 'in stock' ";
            $sql .= "or ms.stock_movement_type = 'stock in adjustments' ) ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( ms.stock_movement_product_name like :stock_movement_product_name 
            or ms.stock_movement_product_owner_name like :stock_movement_product_owner_name ) " : " ");
            }
            $sql .= "group by p.products_aid ";
            $sql .= "order by ms.stock_movement_status desc, ";
            $sql .= "ms.stock_movement_product_name asc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            returnError($ex);

            $query = false;
        }
        return $query;
    }
}
