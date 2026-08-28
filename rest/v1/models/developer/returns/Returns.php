<?php
class Returns
{
    public $return_product_aid;
    public $return_product_status;
    public $return_product_number;
    public $return_product_order_id;
    public $return_product_order_number;
    public $return_product_customer_id;
    public $return_product_customer_name;
    public $return_product_date;
    public $return_product_amount;
    public $return_product_product_id;
    public $return_product_product_name;
    public $return_product_qty;
    public $return_product_price;
    public $return_product_reason;
    public $return_product_notes;
    public $return_product_is_restocked;
    public $return_product_owner_id;
    public $return_product_owner_name;
    public $return_product_resolution_type;
    public $return_product_created;
    public $return_product_updated;

    public $stock_movement_status;
    public $stock_movement_is_active;
    public $stock_movement_location;
    public $stock_movement_type;
    public $stock_movement_date;
    public $stock_movement_before_qty;
    public $stock_movement_after_qty;
    public $stock_movement_qty;

    public $connection;
    public $lastInsertedId;
    public $tblReturnProducts;
    public $tblMovementStock;
    public $tblSalesOrder;
    public $tblProducts;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblReturnProducts = "graces_return_product";
        $this->tblMovementStock = "graces_stock_movement";
        $this->tblProducts = "graces_products";
        $this->tblSalesOrder = "graces_sales_order";
    }

    // create
    public function create()
    {
        try {
            $sql = "insert into {$this->tblReturnProducts} ";
            $sql .= "( return_product_status, ";
            $sql .= "return_product_number, ";
            $sql .= "return_product_order_id, ";
            $sql .= "return_product_order_number, ";
            $sql .= "return_product_customer_id, ";
            $sql .= "return_product_customer_name, ";
            $sql .= "return_product_date, ";
            $sql .= "return_product_amount, ";
            $sql .= "return_product_product_id, ";
            $sql .= "return_product_product_name, ";
            $sql .= "return_product_qty, ";
            $sql .= "return_product_price, ";
            $sql .= "return_product_reason, ";
            $sql .= "return_product_notes, ";
            $sql .= "return_product_is_restocked, ";
            $sql .= "return_product_owner_id, ";
            $sql .= "return_product_owner_name, ";
            $sql .= "return_product_resolution_type, ";
            $sql .= "return_product_created, ";
            $sql .= "return_product_updated ) values ( ";
            $sql .= ":return_product_status, ";
            $sql .= ":return_product_number, ";
            $sql .= ":return_product_order_id, ";
            $sql .= ":return_product_order_number, ";
            $sql .= ":return_product_customer_id, ";
            $sql .= ":return_product_customer_name, ";
            $sql .= ":return_product_date, ";
            $sql .= ":return_product_amount, ";
            $sql .= ":return_product_product_id, ";
            $sql .= ":return_product_product_name, ";
            $sql .= ":return_product_qty, ";
            $sql .= ":return_product_price, ";
            $sql .= ":return_product_reason, ";
            $sql .= ":return_product_notes, ";
            $sql .= ":return_product_is_restocked, ";
            $sql .= ":return_product_owner_id, ";
            $sql .= ":return_product_owner_name, ";
            $sql .= ":return_product_resolution_type, ";
            $sql .= ":return_product_created, ";
            $sql .= ":return_product_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "return_product_status" => $this->return_product_status,
                "return_product_number" => $this->return_product_number,
                "return_product_order_id" => $this->return_product_order_id,
                "return_product_order_number" => $this->return_product_order_number,
                "return_product_customer_id" => $this->return_product_customer_id,
                "return_product_customer_name" => $this->return_product_customer_name,
                "return_product_date" => $this->return_product_date,
                "return_product_amount" => $this->return_product_amount,
                "return_product_product_id" => $this->return_product_product_id,
                "return_product_product_name" => $this->return_product_product_name,
                "return_product_qty" => $this->return_product_qty,
                "return_product_price" => $this->return_product_price,
                "return_product_reason" => $this->return_product_reason,
                "return_product_notes" => $this->return_product_notes,
                "return_product_is_restocked" => $this->return_product_is_restocked,
                "return_product_owner_id" => $this->return_product_owner_id,
                "return_product_owner_name" => $this->return_product_owner_name,
                "return_product_resolution_type" => $this->return_product_resolution_type,
                "return_product_created" => $this->return_product_created,
                "return_product_updated" => $this->return_product_updated,
            ]);
            $this->lastInsertedId = $this->connection->lastInsertId();
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
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
                "return_product_order_number" => "%{$this->column_search}%",
                "return_product_customer_name" => "%{$this->column_search}%",
                "return_product_product_name" => "%{$this->column_search}%",
                "return_product_reason" => "%{$this->column_search}%",
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
                $sql .= ($this->column_search != "" ? "and ( return_product_order_number like :return_product_order_number 
            or return_product_customer_name like :return_product_customer_name 
            or return_product_product_name like :return_product_product_name 
            or return_product_owner_name like :return_product_owner_name 
            or return_product_reason like :return_product_reason ) " : " ");
            }
            $sql .= " order by CASE WHEN LOWER(return_product_status) = 'processed' THEN 1 ELSE 0 END asc, ";
            $sql .= " return_product_status asc, ";
            $sql .= " return_product_number desc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
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
                "return_product_order_number" => "%{$this->column_search}%",
                "return_product_customer_name" => "%{$this->column_search}%",
                "return_product_product_name" => "%{$this->column_search}%",
                "return_product_reason" => "%{$this->column_search}%",
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
                $filterColumn[] = " CAST($col AS UNSIGNED) BETWEEN :min$i AND :max$i";

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
                $sql .= ($this->column_search != "" ? "and ( return_product_order_number like :return_product_order_number 
            or return_product_customer_name like :return_product_customer_name 
            or return_product_product_name like :return_product_product_name 
            or return_product_reason like :return_product_reason ) " : " ");
            }
            $sql .= " order by CASE WHEN LOWER(return_product_status) = 'processed' THEN 1 ELSE 0 END asc, ";
            $sql .= " return_product_status asc, ";
            $sql .= " return_product_number desc ";
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

    public function search()
    {
        try {
            $sql = "select *, ";
            $sql .= "return_product_aid as id, ";
            $sql .= "return_product_status as is_status, ";
            $sql .= "return_product_number as name ";
            $sql .= "from ";
            $sql .= " {$this->tblReturnProducts} ";
            $sql .= "where ( return_product_order_number like :return_product_order_number, ";
            $sql .= "or return_product_customer_name like :return_product_customer_name, ";
            $sql .= "or return_product_reason like :return_product_reason, ";
            $sql .= "or return_product_owner_name like :return_product_owner_name, ";
            $sql .= "or return_product_product_name like :return_product_product_name ) ";
            $sql .= "order by return_product_number desc, ";
            $sql .= "return_product_status asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "return_product_order_number" => "%{$this->column_search}%",
                "return_product_customer_name" => "%{$this->column_search}%",
                "return_product_reason" => "%{$this->column_search}%",
                "return_product_owner_name" => "%{$this->column_search}%",
                "return_product_product_name" => "%{$this->column_search}%",
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read by id
    public function readById()
    {
        try {
            $sql = "select *, ";
            $sql .= "return_product_aid as id, ";
            $sql .= "return_product_status as is_status, ";
            $sql .= "return_product_number as name ";
            $sql .= "from {$this->tblReturnProducts} ";
            $sql .= "where return_product_aid = :return_product_aid ";
            $sql .= "order by return_product_number desc, ";
            $sql .= "return_product_status asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "return_product_aid" => $this->return_product_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // update
    public function update()
    {
        try {
            $sql = "update {$this->tblReturnProducts} set ";
            $sql .= "return_product_status = :return_product_status, ";
            $sql .= "return_product_updated = :return_product_updated ";
            $sql .= "where return_product_aid = :return_product_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "return_product_status" => $this->return_product_status,
                "return_product_updated" => $this->return_product_updated,
                "return_product_aid" => $this->return_product_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // active
    public function active()
    {
        try {
            $sql = "update {$this->tblReturnProducts} set ";
            $sql .= "return_product_status = :return_product_status, ";
            $sql .= "return_product_updated = :return_product_updated ";
            $sql .= "where return_product_aid = :return_product_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "return_product_status" => $this->return_product_status,
                "return_product_updated" => $this->return_product_updated,
                "return_product_aid" => $this->return_product_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // delete
    public function delete()
    {
        try {
            $sql = "delete from {$this->tblReturnProducts} ";
            $sql .= "where return_product_aid = :return_product_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "return_product_aid" => $this->return_product_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // name
    public function checkName()
    {
        try {
            $sql = "select return_product_number from {$this->tblReturnProducts} ";
            $sql .= "where return_product_number = :return_product_number ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "return_product_number" => "{$this->return_product_number}",
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }


    // Create Movement Stock
    public function createMovementStock()
    {
        try {
            $sql = "insert into {$this->tblMovementStock} ";
            $sql .= "( stock_movement_product_id, ";
            $sql .= "stock_movement_product_name, ";
            $sql .= "stock_movement_type, ";
            $sql .= "stock_movement_location, ";
            $sql .= "stock_movement_status, ";
            $sql .= "stock_movement_date, ";
            $sql .= "stock_movement_is_active, ";
            $sql .= "stock_movement_before_qty, ";
            $sql .= "stock_movement_after_qty, ";
            $sql .= "stock_movement_qty, ";
            $sql .= "stock_movement_product_owner_id, ";
            $sql .= "stock_movement_product_owner_name, ";
            $sql .= "stock_movement_created, ";
            $sql .= "stock_movement_updated ) values ( ";
            $sql .= ":stock_movement_product_id, ";
            $sql .= ":stock_movement_product_name, ";
            $sql .= ":stock_movement_type, ";
            $sql .= ":stock_movement_location, ";
            $sql .= ":stock_movement_status, ";
            $sql .= ":stock_movement_date, ";
            $sql .= ":stock_movement_is_active, ";
            $sql .= ":stock_movement_before_qty, ";
            $sql .= ":stock_movement_after_qty, ";
            $sql .= ":stock_movement_qty, ";
            $sql .= ":stock_movement_product_owner_id, ";
            $sql .= ":stock_movement_product_owner_name, ";
            $sql .= ":stock_movement_created, ";
            $sql .= ":stock_movement_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "stock_movement_product_id" => $this->return_product_product_id,
                "stock_movement_product_name" => $this->return_product_product_name,
                "stock_movement_type" => $this->stock_movement_type,
                "stock_movement_location" => $this->stock_movement_location,
                "stock_movement_status" => $this->stock_movement_status,
                "stock_movement_date" => $this->return_product_date,
                "stock_movement_is_active" => $this->stock_movement_is_active,
                "stock_movement_before_qty" => $this->stock_movement_before_qty,
                "stock_movement_after_qty" => $this->stock_movement_after_qty,
                "stock_movement_qty" => $this->stock_movement_qty,
                "stock_movement_product_owner_id" => $this->return_product_owner_id,
                "stock_movement_product_owner_name" => $this->return_product_owner_name,
                "stock_movement_created" => $this->return_product_created,
                "stock_movement_updated" => $this->return_product_updated,
            ]);
        } catch (PDOException $ex) {
            returnError($ex);
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function checkIdNumberExist($newCodeNumber)
    {
        try {
            $sql = "select *, ";
            $sql .= "return_product_number as id_number ";
            $sql .= "from {$this->tblReturnProducts} ";
            $sql .= "where return_product_number = :return_product_number ";
            $sql .= "group by return_product_number ";
            $sql .= "order by return_product_number desc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "return_product_number" => $newCodeNumber,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function checkLastIdNumber()
    {
        try {
            $sql = "select *, ";
            $sql .= "return_product_number as id_number ";
            $sql .= "from {$this->tblReturnProducts} ";
            $sql .= "order by return_product_number desc ";
            $sql .= "limit 1 ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readtotalQTY()
    {
        try {
            $sql = "select ms.*, ";
            $sql .= "p.products_low_stock_threshold, ";
            $sql .= "p.products_sku, ";
            $sql .= "p.products_unit, ";
            $sql .= "p.products_status, ";
            $sql .= "so.order_qty, ";
            $sql .= "p.products_aid, ";
            $sql .= "DATE_FORMAT(ms.stock_movement_date, '%b %d, %Y') as stock_movement_date, ";
            $sql .= "ms.stock_movement_product_name AS name, ";
            $sql .= "ms.stock_movement_is_active AS is_active, ";
            $sql .= "IFNULL(so.order_qty, 0) AS order_qty, ";

            // Total stock quantity
            $sql .= "SUM(
                CASE
                    WHEN ms.stock_movement_type IN ('in stock', 'stock in - return', 'purchases', 'stock in adjustments')
                        THEN ms.stock_movement_qty

                    WHEN ms.stock_movement_type IN ('stock out - reject/defective items',
                        'stock out - return item'
                    )
                        THEN -ms.stock_movement_qty

                    ELSE 0
                END
            ) AS stock_qty, ";

            // Current quantity after sales orders
            $sql .= "SUM(
                CASE
                    WHEN ms.stock_movement_type IN ('in stock', 'stock in - return', 'purchases', 'stock in adjustments')
                        THEN ms.stock_movement_qty 
                    WHEN ms.stock_movement_type IN ('stock out - reject/defective items',
                        'stock out - return item'
                    )
                        THEN -ms.stock_movement_qty

                    ELSE 0
                END
            ) - IFNULL(so.order_qty, 0) AS current_qty, ";

            $sql .= "DATE_FORMAT(MAX(ms.stock_movement_date), '%b %d, %Y') AS stock_movement_date ";

            $sql .= "FROM {$this->tblMovementStock} AS ms ";

            $sql .= "INNER JOIN {$this->tblProducts} AS p ";
            $sql .= "ON ms.stock_movement_product_id = p.products_aid ";

            $sql .= "LEFT JOIN (
                SELECT
                    sales_order_product_id,
                    SUM(sales_order_qty) AS order_qty
                FROM {$this->tblSalesOrder}
                GROUP BY sales_order_product_id
             ) AS so
             ON so.sales_order_product_id = p.products_aid ";

            $sql .= " WHERE ms.stock_movement_product_id = :stock_movement_product_id ";
            $sql .= " GROUP BY p.products_aid ";
            $sql .= " ORDER BY
                ms.stock_movement_status DESC,
                ms.stock_movement_product_name ASC ";

            $query = $this->connection->prepare($sql);
            $query->execute([
                "stock_movement_product_id" => $this->return_product_product_id,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }

        return $query;
    }
}
