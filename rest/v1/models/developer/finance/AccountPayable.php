<?php
class AccountPayable
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
    public $purchase_order_delivery_status;
    public $purchase_order_delivery_is_status;
    public $purchase_order_note;
    public $purchase_order_product_id;
    public $purchase_order_product_name;
    public $purchase_order_product_owner_id;
    public $purchase_order_product_owner_name;
    public $purchase_order_qty;
    public $purchase_order_price;
    public $purchase_order_balance;
    public $purchase_order_discount;
    public $purchase_order_tax;
    public $purchase_order_total_balance_per_product;
    public $purchase_order_total_paid_per_product;
    public $purchase_order_created;
    public $purchase_order_updated;

    public $suppliers_product_aid;
    public $suppliers_product_name;
    public $suppliers_product_price;
    public $suppliers_product_unit;
    public $suppliers_product_supplier_id;
    public $suppliers_product_supplier_name;
    public $suppliers_product_is_active;
    public $suppliers_product_created;
    public $suppliers_product_updated;


    public $purchase_order_movement_status;
    public $purchase_order_before_qty;
    public $purchase_order_after_qty;
    public $purchase_order_transact_id;
    public $purchase_order_transact_name;
    public $purchase_order_total_amount_per_product;
    public $purchase_order_percent_tax;

    public $date_yesterday;
    public $date_today;

    public $connection;
    public $lastInsertedId;
    public $tblSuppliersPurchaseOrder;
    public $tblSuppliers;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblSuppliersPurchaseOrder = "graces_suppliers_purchase_order";
        $this->tblSuppliers = "graces_suppliers";
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
            $sql .= "DATE_FORMAT(purchase_order_date, '%b %d, %Y') as purchase_order_date, ";
            $sql .= "DATE_FORMAT(purchase_order_expected_delivery, '%b %d, %Y') as purchase_order_expected_delivery, ";
            $sql .= "purchase_order_status as status, ";
            $sql .= "purchase_order_payment_status as payment_status, ";
            $sql .= "purchase_order_total_amount_per_product as amount, ";
            $sql .= "purchase_order_is_active as is_active, ";
            $sql .= "purchase_order_number as name ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= " where CAST(purchase_order_total_balance_per_product AS DECIMAL(10, 2)) != 0 ";
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
            $sql .= "DATE_FORMAT(purchase_order_date, '%b %d, %Y') as purchase_order_date, ";
            $sql .= "DATE_FORMAT(purchase_order_expected_delivery, '%b %d, %Y') as purchase_order_expected_delivery, ";
            $sql .= "purchase_order_status as status, ";
            $sql .= "purchase_order_payment_status as payment_status, ";
            $sql .= "purchase_order_total_amount_per_product as amount, ";
            $sql .= "purchase_order_is_active as is_active, ";
            $sql .= "purchase_order_number as name ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= " where CAST(purchase_order_total_balance_per_product AS DECIMAL(10, 2)) != 0 ";
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
}
