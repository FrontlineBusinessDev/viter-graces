<?php
class SalesOrder
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

    public $connection;
    public $lastInsertedId;
    public $tblSalesOrder;
    public $tblStockMovements;

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
    }

    // create
    public function create()
    {
        try {
            $sql = "insert into {$this->tblSalesOrder} ";
            $sql .= "( sales_order_status, ";
            $sql .= "sales_order_is_active, ";
            $sql .= "sales_order_date, ";
            $sql .= "sales_order_number, ";
            $sql .= "sales_order_customer_id, ";
            $sql .= "sales_order_customer_name, ";
            $sql .= "sales_order_payment_method, ";
            $sql .= "sales_order_product_id, ";
            $sql .= "sales_order_product_name, ";
            $sql .= "sales_order_qty, ";
            $sql .= "sales_order_price, ";
            $sql .= "sales_order_total, ";
            $sql .= "sales_order_discount, ";
            $sql .= "sales_order_tax, ";
            $sql .= "sales_order_paid_amount, ";
            $sql .= "sales_order_notes, ";
            $sql .= "sales_order_received_by_id, ";
            $sql .= "sales_order_received_by_name, ";
            $sql .= "sales_order_product_owner_id, ";
            $sql .= "sales_order_product_owner_name, ";
            $sql .= "sales_order_installment, ";
            $sql .= "sales_order_due_date, ";
            $sql .= "sales_order_overall_amount, ";
            $sql .= "sales_order_created, ";
            $sql .= "sales_order_updated ) values ( ";
            $sql .= ":sales_order_status, ";
            $sql .= ":sales_order_is_active, ";
            $sql .= ":sales_order_date, ";
            $sql .= ":sales_order_number, ";
            $sql .= ":sales_order_customer_id, ";
            $sql .= ":sales_order_customer_name, ";
            $sql .= ":sales_order_payment_method, ";
            $sql .= ":sales_order_product_id, ";
            $sql .= ":sales_order_product_name, ";
            $sql .= ":sales_order_qty, ";
            $sql .= ":sales_order_price, ";
            $sql .= ":sales_order_total, ";
            $sql .= ":sales_order_discount, ";
            $sql .= ":sales_order_tax, ";
            $sql .= ":sales_order_paid_amount, ";
            $sql .= ":sales_order_notes, ";
            $sql .= ":sales_order_received_by_id, ";
            $sql .= ":sales_order_received_by_name, ";
            $sql .= ":sales_order_product_owner_id, ";
            $sql .= ":sales_order_product_owner_name, ";
            $sql .= ":sales_order_installment, ";
            $sql .= ":sales_order_due_date, ";
            $sql .= ":sales_order_overall_amount, ";
            $sql .= ":sales_order_created, ";
            $sql .= ":sales_order_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_status" => $this->sales_order_status,
                "sales_order_is_active" => $this->sales_order_is_active,
                "sales_order_date" => $this->sales_order_date,
                "sales_order_number" => $this->sales_order_number,
                "sales_order_customer_id" => $this->sales_order_customer_id,
                "sales_order_customer_name" => $this->sales_order_customer_name,
                "sales_order_payment_method" => $this->sales_order_payment_method,
                "sales_order_product_id" => $this->sales_order_product_id,
                "sales_order_product_name" => $this->sales_order_product_name,
                "sales_order_qty" => $this->sales_order_qty,
                "sales_order_price" => $this->sales_order_price,
                "sales_order_total" => $this->sales_order_total,
                "sales_order_discount" => $this->sales_order_discount,
                "sales_order_tax" => $this->sales_order_tax,
                "sales_order_paid_amount" => $this->sales_order_paid_amount,
                "sales_order_notes" => $this->sales_order_notes,
                "sales_order_received_by_id" => $this->sales_order_received_by_id,
                "sales_order_received_by_name" => $this->sales_order_received_by_name,
                "sales_order_product_owner_id" => $this->sales_order_product_owner_id,
                "sales_order_product_owner_name" => $this->sales_order_product_owner_name,
                "sales_order_installment" => $this->sales_order_installment,
                "sales_order_due_date" => $this->sales_order_due_date,
                "sales_order_overall_amount" => $this->sales_order_overall_amount,
                "sales_order_created" => $this->sales_order_created,
                "sales_order_updated" => $this->sales_order_updated,
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
                "sales_order_customer_name" => "%{$this->column_search}%",
                "sales_order_customer_id" => "%{$this->column_search}%",
                "sales_order_price" => "%{$this->column_search}%",
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
            $sql .= "sales_order_overall_amount as total_amount, ";
            $sql .= "sales_order_paid_amount as total_paid, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_order_customer_name like :sales_order_customer_name 
            or sales_order_price like :sales_order_price 
            or sales_order_customer_id like :sales_order_customer_id ) " : " ");
            }
            $sql .= " group by sales_order_number ";
            $sql .= " order by sales_order_is_active desc, ";
            $sql .= "sales_order_number desc ";
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
                "sales_order_date" => "%{$this->column_search}%",
                "sales_order_customer_id" => "%{$this->column_search}%",
                "sales_order_price" => "%{$this->column_search}%",
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
            $sql .= "sales_order_overall_amount as total_amount, ";
            $sql .= "sales_order_paid_amount as total_paid, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_order_customer_name like :sales_order_customer_name 
            or sales_order_price like :sales_order_price 
            or sales_order_customer_id like :sales_order_customer_id ) " : " ");
            }
            $sql .= " group by sales_order_number ";
            $sql .= " order by sales_order_is_active desc, ";
            $sql .= "sales_order_number desc ";
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
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from ";
            $sql .= " {$this->tblSalesOrder} ";
            $sql .= "where ( sales_order_date like :sales_order_date, ";
            $sql .= "or sales_order_price like :sales_order_price, ";
            $sql .= "or sales_order_customer_id like :sales_order_customer_id ) ";
            $sql .= "order by sales_order_status desc, ";
            $sql .= "sales_order_date asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_date" => "%{$this->column_search}%",
                "sales_order_customer_id" => "%{$this->column_search}%",
                "sales_order_price" => "%{$this->column_search}%",
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
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= "where sales_order_aid = :sales_order_aid ";
            $sql .= "order by sales_order_date asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_aid" => $this->sales_order_aid,
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
            $sql = "update {$this->tblSalesOrder} set ";
            $sql .= "sales_order_date = :sales_order_date, ";
            $sql .= "sales_order_number = :sales_order_number, ";
            $sql .= "sales_order_customer_id = :sales_order_customer_id, ";
            $sql .= "sales_order_customer_name = :sales_order_customer_name, ";
            $sql .= "sales_order_payment_method = :sales_order_payment_method, ";
            $sql .= "sales_order_product_id = :sales_order_product_id, ";
            $sql .= "sales_order_product_name = :sales_order_product_name, ";
            $sql .= "sales_order_qty = :sales_order_qty, ";
            $sql .= "sales_order_price = :sales_order_price, ";
            $sql .= "sales_order_total = :sales_order_total, ";
            $sql .= "sales_order_discount = :sales_order_discount, ";
            $sql .= "sales_order_tax = :sales_order_tax, ";
            $sql .= "sales_order_paid_amount = :sales_order_paid_amount, ";
            $sql .= "sales_order_notes = :sales_order_notes, ";
            $sql .= "sales_order_received_by_id = :sales_order_received_by_id, ";
            $sql .= "sales_order_received_by_name = :sales_order_received_by_name, ";
            $sql .= "sales_order_overall_amount = :sales_order_overall_amount, ";
            $sql .= "sales_order_updated = :sales_order_updated ";
            $sql .= "where sales_order_aid  = :sales_order_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_date" => $this->sales_order_date,
                "sales_order_number" => $this->sales_order_number,
                "sales_order_customer_id" => $this->sales_order_customer_id,
                "sales_order_customer_name" => $this->sales_order_customer_name,
                "sales_order_payment_method" => $this->sales_order_payment_method,
                "sales_order_product_id" => $this->sales_order_product_id,
                "sales_order_product_name" => $this->sales_order_product_name,
                "sales_order_qty" => $this->sales_order_qty,
                "sales_order_price" => $this->sales_order_price,
                "sales_order_total" => $this->sales_order_total,
                "sales_order_discount" => $this->sales_order_discount,
                "sales_order_tax" => $this->sales_order_tax,
                "sales_order_paid_amount" => $this->sales_order_paid_amount,
                "sales_order_notes" => $this->sales_order_notes,
                "sales_order_received_by_id" => $this->sales_order_received_by_id,
                "sales_order_received_by_name" => $this->sales_order_received_by_name,
                "sales_order_overall_amount" => $this->sales_order_overall_amount,
                "sales_order_updated" => $this->sales_order_updated,
                "sales_order_aid" => $this->sales_order_aid,
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
            $sql = "update {$this->tblSalesOrder} set ";
            $sql .= "sales_order_status = :sales_order_status, ";
            $sql .= "sales_order_is_active = :sales_order_is_active, ";
            $sql .= "sales_order_updated = :sales_order_updated ";
            $sql .= "where sales_order_number = :sales_order_number ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_status" => $this->sales_order_status,
                "sales_order_is_active" => $this->sales_order_is_active,
                "sales_order_updated" => $this->sales_order_updated,
                "sales_order_number" => $this->sales_order_number,
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
            $sql = "delete from {$this->tblSalesOrder} ";
            $sql .= "where sales_order_number = :sales_order_number ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_number" => $this->sales_order_number,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // delete
    public function deleteById()
    {
        try {
            $sql = "delete from {$this->tblSalesOrder} ";
            $sql .= "where sales_order_aid = :sales_order_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_aid" => $this->sales_order_aid,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // Create Movement Stock
    public function createMovementStock()
    {
        try {
            $sql = "insert into {$this->tblStockMovements} ";
            $sql .= "( stock_movement_product_id, ";
            $sql .= "stock_movement_product_name, ";
            $sql .= "stock_movement_date, ";
            $sql .= "stock_movement_type, ";
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
            $sql .= ":stock_movement_date, ";
            $sql .= ":stock_movement_type, ";
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
                "stock_movement_product_id" => $this->lastInsertedId,
                "stock_movement_product_name" => $this->sales_order_product_name,
                "stock_movement_date" => $this->sales_order_date,
                "stock_movement_type" => $this->stock_movement_type,
                "stock_movement_is_active" => $this->sales_order_is_active,
                "stock_movement_before_qty" => $this->stock_movement_before_qty,
                "stock_movement_after_qty" => $this->stock_movement_after_qty,
                "stock_movement_qty" => $this->stock_movement_qty,
                "stock_movement_product_owner_id" => $this->sales_order_product_owner_id,
                "stock_movement_product_owner_name" => $this->sales_order_product_owner_name,
                "stock_movement_created" => $this->sales_order_created,
                "stock_movement_updated" => $this->sales_order_updated,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }

        return $query;
    }


    // read all
    public function readAllActiveByName()
    {
        try {
            $sql = "select *, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "sales_order_date as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where true ";
            $sql .= ($this->column_search != "" ? "and ( sales_order_date like :sales_order_date 
            or sales_order_price like :sales_order_price 
            or sales_order_customer_id like :sales_order_customer_id ) " : " ");
            $sql .= " order by sales_order_status desc, ";
            $sql .= "sales_order_date asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->column_search != "" ? [
                    "sales_order_date" => "%{$this->column_search}%",
                    "sales_order_customer_id" => "%{$this->column_search}%",
                    "sales_order_price" => "%{$this->column_search}%",
                ] : [],
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // read all
    public function checkIdNumberExist($newCodeNumber)
    {
        try {
            $sql = "select *, ";
            $sql .= "sales_order_number as id_number ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= "where sales_order_number = :sales_order_number ";
            $sql .= "group by sales_order_number ";
            $sql .= "order by sales_order_status desc, ";
            $sql .= "sales_order_date asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_number" => $newCodeNumber,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // read all
    public function checkLastIdNumber()
    {
        try {
            $sql = "select *, ";
            $sql .= "sales_order_number as id_number ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= "order by sales_order_aid desc ";
            $sql .= "limit 1 ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // read by id
    public function readBySoNumber()
    {
        try {
            $sql = "select *, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= "where sales_order_number = :sales_order_number ";
            $sql .= "order by sales_order_date asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_number" => $this->sales_order_number,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }
}
