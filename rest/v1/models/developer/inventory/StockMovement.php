<?php
class StockMovement
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

    // create
    public function create()
    {
        try {
            $sql = "insert into {$this->tblMovementStock} ";
            $sql .= "( stock_movement_status, ";
            $sql .= "stock_movement_is_active, ";
            $sql .= "stock_movement_type, ";
            $sql .= "stock_movement_product_id, ";
            $sql .= "stock_movement_product_name, ";
            $sql .= "stock_movement_before_qty, ";
            $sql .= "stock_movement_after_qty, ";
            $sql .= "stock_movement_qty, ";
            $sql .= "stock_movement_location, ";
            $sql .= "stock_movement_product_owner_id, ";
            $sql .= "stock_movement_product_owner_name, ";
            $sql .= "stock_movement_notes, ";
            $sql .= "stock_movement_date, ";
            $sql .= "stock_movement_created, ";
            $sql .= "stock_movement_updated ) values ( ";
            $sql .= ":stock_movement_status, ";
            $sql .= ":stock_movement_is_active, ";
            $sql .= ":stock_movement_type, ";
            $sql .= ":stock_movement_product_id, ";
            $sql .= ":stock_movement_product_name, ";
            $sql .= ":stock_movement_before_qty, ";
            $sql .= ":stock_movement_after_qty, ";
            $sql .= ":stock_movement_qty, ";
            $sql .= ":stock_movement_location, ";
            $sql .= ":stock_movement_product_owner_id, ";
            $sql .= ":stock_movement_product_owner_name, ";
            $sql .= ":stock_movement_notes, ";
            $sql .= ":stock_movement_date, ";
            $sql .= ":stock_movement_created, ";
            $sql .= ":stock_movement_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "stock_movement_status" => $this->stock_movement_status,
                "stock_movement_is_active" => $this->stock_movement_is_active,
                "stock_movement_type" => $this->stock_movement_type,
                "stock_movement_product_id" => $this->stock_movement_product_id,
                "stock_movement_product_name" => $this->stock_movement_product_name,
                "stock_movement_before_qty" => $this->stock_movement_before_qty,
                "stock_movement_after_qty" => $this->stock_movement_after_qty,
                "stock_movement_qty" => $this->stock_movement_qty,
                "stock_movement_location" => $this->stock_movement_location,
                "stock_movement_product_owner_id" => $this->stock_movement_product_owner_id,
                "stock_movement_product_owner_name" => $this->stock_movement_product_owner_name,
                "stock_movement_notes" => $this->stock_movement_notes,
                "stock_movement_date" => $this->stock_movement_date,
                "stock_movement_created" => $this->stock_movement_created,
                "stock_movement_updated" => $this->stock_movement_updated,
            ]);
            $this->lastInsertedId = $this->connection->lastInsertId();
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
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

            $query = false;
        }
        return $query;
    }

    public function search()
    {
        try {
            $sql = "select *, ";
            $sql .= "stock_movement_aid as id, ";
            $sql .= "stock_movement_is_active as is_active, ";
            $sql .= "DATE_FORMAT(stock_movement_date, '%b %d, %Y') as stock_movement_date, ";
            $sql .= "stock_movement_product_name as name ";
            $sql .= "from ";
            $sql .= " {$this->tblMovementStock} ";
            $sql .= "where ( stock_movement_product_name like :stock_movement_product_name, ";
            $sql .= "or stock_movement_product_owner_name like :stock_movement_product_owner_name ) ";
            $sql .= "order by stock_movement_status desc, ";
            $sql .= "stock_movement_product_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "stock_movement_product_name" => "%{$this->column_search}%",
                "stock_movement_product_owner_name" => "%{$this->column_search}%",
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // read by id
    public function readById()
    {
        try {
            $sql = "select *, ";
            $sql .= "stock_movement_aid as id, ";
            $sql .= "stock_movement_is_active as is_active, ";
            $sql .= "DATE_FORMAT(stock_movement_date, '%b %d, %Y') as stock_movement_date, ";
            $sql .= "stock_movement_product_name as name ";
            $sql .= "from {$this->tblMovementStock} ";
            $sql .= "where stock_movement_aid = :stock_movement_aid ";
            $sql .= "order by stock_movement_product_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "stock_movement_aid" => $this->stock_movement_aid,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // update
    public function update()
    {
        try {
            $sql = "update {$this->tblMovementStock} set ";
            $sql .= "stock_movement_product_name = :stock_movement_product_name, ";
            $sql .= "stock_movement_type = :stock_movement_type, ";
            $sql .= "stock_movement_status = :stock_movement_status, ";
            $sql .= "stock_movement_is_active = :stock_movement_is_active, ";
            $sql .= "stock_movement_product_id = :stock_movement_product_id, ";
            $sql .= "stock_movement_before_qty = :stock_movement_before_qty, ";
            $sql .= "stock_movement_qty = :stock_movement_qty, ";
            $sql .= "stock_movement_after_qty = :stock_movement_after_qty, ";
            $sql .= "stock_movement_location = :stock_movement_location, ";
            $sql .= "stock_movement_product_owner_id = :stock_movement_product_owner_id, ";
            $sql .= "stock_movement_product_owner_name = :stock_movement_product_owner_name, ";
            $sql .= "stock_movement_notes = :stock_movement_notes, ";
            $sql .= "stock_movement_updated = :stock_movement_updated ";
            $sql .= "where stock_movement_aid  = :stock_movement_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "stock_movement_product_name" => $this->stock_movement_product_name,
                "stock_movement_type" => $this->stock_movement_type,
                "stock_movement_status" => $this->stock_movement_status,
                "stock_movement_is_active" => $this->stock_movement_is_active,
                "stock_movement_product_id" => $this->stock_movement_product_id,
                "stock_movement_before_qty" => $this->stock_movement_before_qty,
                "stock_movement_after_qty" => $this->stock_movement_after_qty,
                "stock_movement_qty" => $this->stock_movement_qty,
                "stock_movement_location" => $this->stock_movement_location,
                "stock_movement_product_owner_id" => $this->stock_movement_product_owner_id,
                "stock_movement_product_owner_name" => $this->stock_movement_product_owner_name,
                "stock_movement_notes" => $this->stock_movement_notes,
                "stock_movement_updated" => $this->stock_movement_updated,
                "stock_movement_aid" => $this->stock_movement_aid,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // active
    public function active()
    {
        try {
            $sql = "update {$this->tblMovementStock} set ";
            $sql .= "stock_movement_status = :stock_movement_status, ";
            $sql .= "stock_movement_is_active = :stock_movement_is_active, ";
            $sql .= "stock_movement_updated = :stock_movement_updated ";
            $sql .= "where stock_movement_aid = :stock_movement_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "stock_movement_status" => $this->stock_movement_status,
                "stock_movement_is_active" => $this->stock_movement_is_active,
                "stock_movement_updated" => $this->stock_movement_updated,
                "stock_movement_aid" => $this->stock_movement_aid,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // delete
    public function delete()
    {
        try {
            $sql = "delete from {$this->tblMovementStock} ";
            $sql .= "where stock_movement_aid = :stock_movement_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "stock_movement_aid" => $this->stock_movement_aid,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }


    // read by id
    public function readtotalQTY()
    {
        try {
            $sql = "select ";
            $sql .= "SUM(ms.stock_movement_qty) - IFNULL(SUM(so.sales_order_qty), 0) as current_qty, ";
            $sql .= "ms.stock_movement_product_name as name ";
            $sql .= "from {$this->tblMovementStock} as ms, ";
            $sql .= "{$this->tblProducts} as p ";
            $sql .= "LEFT JOIN {$this->tblSalesOrder} as so ";
            $sql .= "ON so.sales_order_product_id = p.products_aid ";
            $sql .= "where ms.stock_movement_product_id = p.products_aid ";
            $sql .= "and ms.stock_movement_product_id = :stock_movement_product_id ";
            $sql .= "group by ms.stock_movement_product_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "stock_movement_product_id" => $this->stock_movement_product_id,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }
}
