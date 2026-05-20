<?php
class SuppliersPurchaseOrder
{
    public $purchase_order_aid;
    public $purchase_order_number;
    public $purchase_order_supplier_id;
    public $purchase_order_supplier_name;
    public $purchase_order_date;
    public $purchase_order_expected_delivery;
    public $purchase_order_total_amount;
    public $purchase_order_payment;
    public $purchase_order_is_active;
    public $purchase_order_status;
    public $purchase_order_payment_status;
    public $purchase_order_note;
    public $purchase_order_product_id;
    public $purchase_order_product_name;
    public $purchase_order_product_owner_id;
    public $purchase_order_product_owner_name;
    public $purchase_order_qty;
    public $purchase_order_price;
    public $purchase_order_created;
    public $purchase_order_updated;

    public $connection;
    public $lastInsertedId;
    public $tblSuppliersPurchaseOrder;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblSuppliersPurchaseOrder = "graces_suppliers_purchase_order";
    }

    // create
    public function create()
    {
        try {
            $sql = "insert into {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "( purchase_order_number, ";
            $sql .= "purchase_order_supplier_id, ";
            $sql .= "purchase_order_supplier_name, ";
            $sql .= "purchase_order_date, ";
            $sql .= "purchase_order_expected_delivery, ";
            $sql .= "purchase_order_total_amount, ";
            $sql .= "purchase_order_payment, ";
            $sql .= "purchase_order_is_active, ";
            $sql .= "purchase_order_status, ";
            $sql .= "purchase_order_payment_status, ";
            $sql .= "purchase_order_note, ";
            $sql .= "purchase_order_product_id, ";
            $sql .= "purchase_order_product_name, ";
            $sql .= "purchase_order_product_owner_id, ";
            $sql .= "purchase_order_product_owner_name, ";
            $sql .= "purchase_order_qty, ";
            $sql .= "purchase_order_price, ";
            $sql .= "purchase_order_created, ";
            $sql .= "purchase_order_updated ) values ( ";
            $sql .= ":purchase_order_number, ";
            $sql .= ":purchase_order_supplier_id, ";
            $sql .= ":purchase_order_supplier_name, ";
            $sql .= ":purchase_order_date, ";
            $sql .= ":purchase_order_expected_delivery, ";
            $sql .= ":purchase_order_total_amount, ";
            $sql .= ":purchase_order_payment, ";
            $sql .= ":purchase_order_is_active, ";
            $sql .= ":purchase_order_status, ";
            $sql .= ":purchase_order_payment_status, ";
            $sql .= ":purchase_order_note, ";
            $sql .= ":purchase_order_product_id, ";
            $sql .= ":purchase_order_product_name, ";
            $sql .= ":purchase_order_product_owner_id, ";
            $sql .= ":purchase_order_product_owner_name, ";
            $sql .= ":purchase_order_qty, ";
            $sql .= ":purchase_order_price, ";
            $sql .= ":purchase_order_created, ";
            $sql .= ":purchase_order_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "purchase_order_number" => $this->purchase_order_number,
                "purchase_order_supplier_id" => $this->purchase_order_supplier_id,
                "purchase_order_supplier_name" => $this->purchase_order_supplier_name,
                "purchase_order_date" => $this->purchase_order_date,
                "purchase_order_expected_delivery" => $this->purchase_order_expected_delivery,
                "purchase_order_total_amount" => $this->purchase_order_total_amount,
                "purchase_order_payment" => $this->purchase_order_payment,
                "purchase_order_is_active" => $this->purchase_order_is_active,
                "purchase_order_status" => $this->purchase_order_status,
                "purchase_order_payment_status" => $this->purchase_order_payment_status,
                "purchase_order_note" => $this->purchase_order_note,
                "purchase_order_product_id" => $this->purchase_order_product_id,
                "purchase_order_product_name" => $this->purchase_order_product_name,
                "purchase_order_product_owner_id" => $this->purchase_order_product_owner_id,
                "purchase_order_product_owner_name" => $this->purchase_order_product_owner_name,
                "purchase_order_qty" => $this->purchase_order_qty,
                "purchase_order_price" => $this->purchase_order_price,
                "purchase_order_created" => $this->purchase_order_created,
                "purchase_order_updated" => $this->purchase_order_updated,
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
            $sql .= "purchase_order_aid as id, ";
            $sql .= "DATE_FORMAT(purchase_order_date, '%b %d, %Y') as formated_date, ";
            $sql .= "DATE_FORMAT(purchase_order_expected_delivery, '%b %d, %Y') as formated_delivery_date, ";
            $sql .= "purchase_order_date as total_amount, ";
            $sql .= "SUM(purchase_order_total_amount) as total_amount, ";
            $sql .= "SUM(purchase_order_payment) as total_paid, ";
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
            $sql .= " group by purchase_order_number ";
            $sql .= " order by purchase_order_is_active desc, ";
            $sql .= " purchase_order_aid desc ";
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
            $sql .= "purchase_order_aid as id, ";
            $sql .= "DATE_FORMAT(purchase_order_date, '%b %d, %Y') as formated_date, ";
            $sql .= "DATE_FORMAT(purchase_order_expected_delivery, '%b %d, %Y') as formated_delivery_date, ";
            $sql .= "SUM(purchase_order_total_amount) as total_amount, ";
            $sql .= "SUM(purchase_order_payment) as total_paid, ";
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
            $sql .= " group by purchase_order_number ";
            $sql .= " order by purchase_order_is_active desc, ";
            $sql .= " purchase_order_aid desc ";
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
            $sql .= "purchase_order_aid as id, ";
            $sql .= "purchase_order_is_active as is_active, ";
            $sql .= "purchase_order_status as status, ";
            $sql .= "purchase_order_number as name ";
            $sql .= "from ";
            $sql .= " {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "where (purchase_order_number like :purchase_order_number ";
            $sql .= "or purchase_order_supplier_name like :purchase_order_supplier_name  ";
            $sql .= "or purchase_order_product_owner_name like :purchase_order_product_owner_name  ";
            $sql .= "or purchase_order_product_name like :purchase_order_product_name)  ";
            $sql .= "order by suppliers_product_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "purchase_order_number" => "%{$this->column_search}%",
                "purchase_order_supplier_name" => "%{$this->column_search}%",
                "purchase_order_product_owner_name" => "%{$this->column_search}%",
                "purchase_order_product_name" => "%{$this->column_search}%",
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // read by id
    public function readByPoNumber()
    {
        try {
            $sql = "select *, ";
            $sql .= "DATE_FORMAT(purchase_order_date, '%b %d, %Y') as formated_date, ";
            $sql .= "DATE_FORMAT(purchase_order_expected_delivery, '%b %d, %Y') as formated_delivery_date, ";
            $sql .= "purchase_order_aid as id, ";
            $sql .= "purchase_order_is_active as is_active, ";
            $sql .= "purchase_order_status as status, ";
            $sql .= "purchase_order_number as name ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "where purchase_order_number = :purchase_order_number ";
            $sql .= "order by purchase_order_number asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "purchase_order_number" => $this->purchase_order_number,
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
            $sql .= "DATE_FORMAT(purchase_order_date, '%b %d, %Y') as formated_date, ";
            $sql .= "DATE_FORMAT(purchase_order_expected_delivery, '%b %d, %Y') as formated_delivery_date, ";
            $sql .= "purchase_order_aid as id, ";
            $sql .= "purchase_order_is_active as is_active, ";
            $sql .= "purchase_order_status as status, ";
            $sql .= "purchase_order_number as name ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "where purchase_order_aid = :purchase_order_aid ";
            $sql .= "order by purchase_order_number asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "purchase_order_aid" => $this->purchase_order_aid,
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
            $sql = "update {$this->tblSuppliersPurchaseOrder} set ";
            $sql .= "purchase_order_number = :purchase_order_number, ";
            $sql .= "purchase_order_supplier_id = :purchase_order_supplier_id, ";
            $sql .= "purchase_order_supplier_name = :purchase_order_supplier_name, ";
            $sql .= "purchase_order_date = :purchase_order_date, ";
            $sql .= "purchase_order_expected_delivery = :purchase_order_expected_delivery, ";
            $sql .= "purchase_order_total_amount = :purchase_order_total_amount, ";
            $sql .= "purchase_order_payment = :purchase_order_payment, ";
            $sql .= "purchase_order_is_active = :purchase_order_is_active, ";
            $sql .= "purchase_order_status = :purchase_order_status, ";
            $sql .= "purchase_order_payment_status = :purchase_order_payment_status, ";
            $sql .= "purchase_order_note = :purchase_order_note, ";
            $sql .= "purchase_order_product_id = :purchase_order_product_id, ";
            $sql .= "purchase_order_product_name = :purchase_order_product_name, ";
            $sql .= "purchase_order_product_owner_id = :purchase_order_product_owner_id, ";
            $sql .= "purchase_order_product_owner_name = :purchase_order_product_owner_name, ";
            $sql .= "purchase_order_qty = :purchase_order_qty, ";
            $sql .= "purchase_order_price = :purchase_order_price, ";
            $sql .= "purchase_order_updated = :purchase_order_updated ";
            $sql .= "where purchase_order_aid = :purchase_order_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "purchase_order_number" => $this->purchase_order_number,
                "purchase_order_supplier_id" => $this->purchase_order_supplier_id,
                "purchase_order_supplier_name" => $this->purchase_order_supplier_name,
                "purchase_order_date" => $this->purchase_order_date,
                "purchase_order_expected_delivery" => $this->purchase_order_expected_delivery,
                "purchase_order_total_amount" => $this->purchase_order_total_amount,
                "purchase_order_payment" => $this->purchase_order_payment,
                "purchase_order_is_active" => $this->purchase_order_is_active,
                "purchase_order_status" => $this->purchase_order_status,
                "purchase_order_payment_status" => $this->purchase_order_payment_status,
                "purchase_order_note" => $this->purchase_order_note,
                "purchase_order_product_id" => $this->purchase_order_product_id,
                "purchase_order_product_name" => $this->purchase_order_product_name,
                "purchase_order_product_owner_id" => $this->purchase_order_product_owner_id,
                "purchase_order_product_owner_name" => $this->purchase_order_product_owner_name,
                "purchase_order_qty" => $this->purchase_order_qty,
                "purchase_order_price" => $this->purchase_order_price,
                "purchase_order_updated" => $this->purchase_order_updated,
                "purchase_order_aid" => $this->purchase_order_aid,
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
            $sql = "delete from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "where purchase_order_aid = :purchase_order_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "purchase_order_aid" => $this->purchase_order_aid,
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
            $sql = "update {$this->tblSuppliersPurchaseOrder} set ";
            $sql .= "purchase_order_is_active = :purchase_order_is_active, ";
            $sql .= "purchase_order_status = :purchase_order_status, ";
            $sql .= "purchase_order_updated = :purchase_order_updated ";
            $sql .= "where purchase_order_aid = :purchase_order_aid  ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "purchase_order_is_active" => $this->purchase_order_is_active,
                "purchase_order_status" => $this->purchase_order_status,
                "purchase_order_updated" => $this->purchase_order_updated,
                "purchase_order_aid" => $this->purchase_order_aid,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // name
    public function checkName()
    {
        try {
            $sql = "select purchase_order_number from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "where purchase_order_number = :purchase_order_number ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "purchase_order_number" => "{$this->purchase_order_number}",
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }
}
