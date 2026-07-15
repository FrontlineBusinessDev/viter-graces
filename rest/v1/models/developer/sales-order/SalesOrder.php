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
    public $sales_order_total_receivable_amount;
    public $sales_order_total_amount;
    public $sales_order_tax_amount;
    public $sales_order_total_balance_amount;
    public $sales_order_payment_terms;
    public $sales_order_discounted_with_vat_amount;
    public $sales_order_vat;
    public $sales_order_created;
    public $sales_order_updated;

    public $installmet_payment_aid;
    public $installmet_payment_code_id;
    public $installmet_payment_code;
    public $installmet_payment_is_paid;
    public $installmet_payment_due_date;
    public $installmet_payment_code_number;
    public $installmet_payment_method;
    public $installmet_payment_amount;
    public $installmet_payment_customer_id;
    public $installmet_payment_customer_name;

    public $stock_movement_before_qty;
    public $stock_movement_after_qty;
    public $stock_movement_qty;
    public $stock_movement_type;
    public $stock_movement_status;

    public $date_today;
    public $date_yesterday;

    public $connection;
    public $lastInsertedId;
    public $tblSalesOrder;
    public $tblStockMovements;
    public $tblMovementStock;
    public $tblProducts;
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
        $this->tblInstallmetPayment = "graces_installment_payment";
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
            $sql .= "sales_order_total_receivable_amount, ";
            $sql .= "sales_order_total_amount, ";
            $sql .= "sales_order_tax_amount, ";
            $sql .= "sales_order_total_balance_amount, ";
            $sql .= "sales_order_payment_terms, ";
            $sql .= "sales_order_vat, ";
            $sql .= "sales_order_discounted_with_vat_amount, ";
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
            $sql .= ":sales_order_total_receivable_amount, ";
            $sql .= ":sales_order_total_amount, ";
            $sql .= ":sales_order_tax_amount, ";
            $sql .= ":sales_order_total_balance_amount, ";
            $sql .= ":sales_order_payment_terms, ";
            $sql .= ":sales_order_vat, ";
            $sql .= ":sales_order_discounted_with_vat_amount, ";
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
                "sales_order_total_receivable_amount" => $this->sales_order_total_receivable_amount,
                "sales_order_total_amount" => $this->sales_order_total_amount,
                "sales_order_tax_amount" => $this->sales_order_tax_amount,
                "sales_order_total_balance_amount" => $this->sales_order_total_balance_amount,
                "sales_order_payment_terms" => $this->sales_order_payment_terms,
                "sales_order_vat" => $this->sales_order_vat,
                "sales_order_discounted_with_vat_amount" => $this->sales_order_discounted_with_vat_amount,
                "sales_order_created" => $this->sales_order_created,
                "sales_order_updated" => $this->sales_order_updated,
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
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_order_number like :sales_order_number 
            or sales_order_customer_name like :sales_order_customer_name 
            or sales_order_received_by_name like :sales_order_received_by_name 
            or sales_order_product_owner_name like :sales_order_product_owner_name 
            or sales_order_product_name like :sales_order_product_name ) " : " ");
            }
            $sql .= " group by sales_order_number ";
            $sql .= " order by MAX(sales_order_is_active) desc, ";
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
    public function readLimit($allowedColumns)
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
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_order_number like :sales_order_number 
            or sales_order_customer_name like :sales_order_customer_name 
            or sales_order_received_by_name like :sales_order_received_by_name 
            or sales_order_product_owner_name like :sales_order_product_owner_name 
            or sales_order_product_name like :sales_order_product_name ) " : " ");
            }
            $sql .= " group by sales_order_number ";
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
    public function readByCustomerId($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "sales_order_customer_id" => $this->sales_order_customer_id,
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
            $sql .= " where sales_order_customer_id = :sales_order_customer_id ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_order_number like :sales_order_number 
            or sales_order_customer_name like :sales_order_customer_name 
            or sales_order_received_by_name like :sales_order_received_by_name 
            or sales_order_product_owner_name like :sales_order_product_owner_name 
            or sales_order_product_name like :sales_order_product_name ) " : " ");
            }
            $sql .= " group by sales_order_number ";
            $sql .= "order by MAX(sales_order_is_active) desc, ";
            $sql .= "CASE sales_order_status ";
            $sql .= "WHEN 'overdue' THEN 1 ";
            $sql .= "WHEN 'unpaid' THEN 2 ";
            $sql .= "WHEN 'partial' THEN 3 ";
            $sql .= "WHEN 'paid' THEN 4 ";
            $sql .= "WHEN 'inactive' THEN 5 ELSE 6 END, ";
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
    public function readLimitByCustomerId($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "sales_order_customer_id" => $this->sales_order_customer_id,
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->column_search != "" ? [
                "sales_order_number" => "%{$this->column_search}%",
                "sales_order_customer_name" => "%{$this->column_search}%",
                "sales_order_product_name" => "%{$this->column_search}%",
                "sales_order_received_by_name" => "%{$this->column_search}%",
                "sales_order_product_owner_name" => "%{$this->column_search}%",
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
            $sql .= " where sales_order_customer_id = :sales_order_customer_id ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_order_number like :sales_order_number 
            or sales_order_customer_name like :sales_order_customer_name 
            or sales_order_received_by_name like :sales_order_received_by_name 
            or sales_order_product_owner_name like :sales_order_product_owner_name 
            or sales_order_product_name like :sales_order_product_name ) " : " ");
            }
            $sql .= " group by sales_order_number ";
            $sql .= " order by MAX(sales_order_is_active) desc, ";
            $sql .= "CASE sales_order_status ";
            $sql .= "WHEN 'overdue' THEN 1 ";
            $sql .= "WHEN 'unpaid' THEN 2 ";
            $sql .= "WHEN 'partial' THEN 3 ";
            $sql .= "WHEN 'paid' THEN 4 ";
            $sql .= "WHEN 'inactive' THEN 5 ELSE 6 END, ";
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
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
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
            $sql .= "sales_order_total_receivable_amount = :sales_order_total_receivable_amount, ";
            $sql .= "sales_order_total_amount = :sales_order_total_amount, ";
            $sql .= "sales_order_status = :sales_order_status, ";
            $sql .= "sales_order_tax_amount = :sales_order_tax_amount, ";
            $sql .= "sales_order_total_balance_amount = :sales_order_total_balance_amount, ";
            $sql .= "sales_order_payment_terms = :sales_order_payment_terms, ";
            $sql .= "sales_order_discounted_with_vat_amount = :sales_order_discounted_with_vat_amount, ";
            $sql .= "sales_order_vat = :sales_order_vat, ";
            $sql .= "sales_order_updated = :sales_order_updated ";
            $sql .= "where sales_order_aid  = :sales_order_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_date" => $this->sales_order_date,
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
                "sales_order_total_receivable_amount" => $this->sales_order_total_receivable_amount,
                "sales_order_total_amount" => $this->sales_order_total_amount,
                "sales_order_status" => $this->sales_order_status,
                "sales_order_tax_amount" => $this->sales_order_tax_amount,
                "sales_order_total_balance_amount" => $this->sales_order_total_balance_amount,
                "sales_order_payment_terms" => $this->sales_order_payment_terms,
                "sales_order_discounted_with_vat_amount" => $this->sales_order_discounted_with_vat_amount,
                "sales_order_updated" => $this->sales_order_updated,
                "sales_order_vat" => $this->sales_order_vat,
                "sales_order_aid" => $this->sales_order_aid,
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
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
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
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
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
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // delete
    public function deleteInstallment()
    {
        try {
            $sql = "delete from {$this->tblInstallmetPayment} ";
            $sql .= "where installmet_payment_code_number = :installmet_payment_code_number ";
            $sql .= "and installmet_payment_code = 'sales-order' ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "installmet_payment_code_number" => $this->sales_order_number,
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
            $sql = "insert into {$this->tblStockMovements} ";
            $sql .= "( stock_movement_product_id, ";
            $sql .= "stock_movement_product_name, ";
            $sql .= "stock_movement_date, ";
            $sql .= "stock_movement_type, ";
            $sql .= "stock_movement_status, ";
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
            $sql .= ":stock_movement_status, ";
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
                "stock_movement_status" => $this->stock_movement_status,
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
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }

        return $query;
    }

    // Create Movement Stock
    public function createInstallment()
    {
        try {
            $sql = "insert into {$this->tblInstallmetPayment} ";
            $sql .= "( installmet_payment_code_id, ";
            $sql .= "installmet_payment_code, ";
            $sql .= "installmet_payment_is_paid, ";
            $sql .= "installmet_payment_due_date, ";
            $sql .= "installmet_payment_code_number, ";
            $sql .= "installmet_payment_amount, ";
            $sql .= "installmet_payment_method, ";
            $sql .= "installmet_payment_customer_id, ";
            $sql .= "installmet_payment_customer_name, ";
            $sql .= "installmet_payment_created, ";
            $sql .= "installmet_payment_updated ) values ( ";
            $sql .= ":installmet_payment_code_id, ";
            $sql .= ":installmet_payment_code, ";
            $sql .= ":installmet_payment_is_paid, ";
            $sql .= ":installmet_payment_due_date, ";
            $sql .= ":installmet_payment_code_number, ";
            $sql .= ":installmet_payment_amount, ";
            $sql .= ":installmet_payment_method, ";
            $sql .= ":installmet_payment_customer_id, ";
            $sql .= ":installmet_payment_customer_name, ";
            $sql .= ":installmet_payment_created, ";
            $sql .= ":installmet_payment_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "installmet_payment_code_id" => $this->installmet_payment_code_id,
                "installmet_payment_code" => $this->installmet_payment_code,
                "installmet_payment_is_paid" => $this->installmet_payment_is_paid,
                "installmet_payment_due_date" => $this->installmet_payment_due_date,
                "installmet_payment_code_number" => $this->installmet_payment_code_number,
                "installmet_payment_amount" => $this->installmet_payment_amount,
                "installmet_payment_method" => $this->installmet_payment_method,
                "installmet_payment_customer_id" => $this->installmet_payment_customer_id,
                "installmet_payment_customer_name" => $this->installmet_payment_customer_name,
                "installmet_payment_created" => $this->sales_order_created,
                "installmet_payment_updated" => $this->sales_order_updated,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
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
            $sql .= "sales_order_number as id_number ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= "order by sales_order_number desc ";
            $sql .= "limit 1 ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read by id
    public function readBySoNumber()
    {
        try {
            $sql = "select so.*, ";
            $sql .= "so.sales_order_aid as id, ";
            $sql .= "p.products_owner_id, ";
            $sql .= "p.products_owner_name, ";
            $sql .= "so.sales_order_is_active as is_active, ";
            $sql .= "DATE_FORMAT(so.sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(so.sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "so.sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} as so, ";
            $sql .= "{$this->tblProducts} as p ";
            $sql .= "where so.sales_order_product_id = p.products_aid ";
            $sql .= "and so.sales_order_number = :sales_order_number ";
            $sql .= "order by so.sales_order_date asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_number" => $this->sales_order_number,
            ]);
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

                    WHEN ms.stock_movement_type IN ( 
                        'stock out - reject/defective items',
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

                    WHEN ms.stock_movement_type IN (
                        'stock out - reject/defective items',
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
                "stock_movement_product_id" => $this->sales_order_product_id,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }

        return $query;
    }


    public function readSalesToday()
    {
        try {
            $sql = "select DATE(sales_order_date) AS sales_date, ";
            $sql .= "SUM(sales_order_total) AS total_sales, ";
            $sql .= "SUM(sales_order_qty) AS total_qty ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= "where DATE(sales_order_date) in (DATE(:date_today), DATE(:date_yesterday)) ";
            $sql .= "group by DATE(sales_order_date) ";
            $sql .= "order by DATE(sales_date) desc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "date_today" => $this->date_today,
                "date_yesterday" => $this->date_yesterday,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }

        return $query;
    }


    public function readTopSellingProduct()
    {
        try {
            $sql = "select * from ( ";
            $sql .= "select sales_order_product_id, ";
            $sql .= "sales_order_product_name as product_name, ";
            $sql .= "SUM(sales_order_qty) as qty, ";
            $sql .= "SUM(sales_order_total) as total_amount, ";
            $sql .= "ROW_NUMBER() OVER ( order by ";
            $sql .= "SUM(sales_order_total) desc, ";
            $sql .= "SUM(sales_order_qty) desc ";
            $sql .= ") AS rn ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= "where DATE(sales_order_date) = DATE(:date_today) ";
            $sql .= "group by ";
            $sql .= "sales_order_product_id, ";
            $sql .= "sales_order_product_name ) ranked ";
            $sql .= "where rn = 1 ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "date_today" => $this->date_today,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }

        return $query;
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
    public function readByInstallment()
    {
        try {
            $sql = "select *, installmet_payment_aid as id from {$this->tblInstallmetPayment} ";
            $sql .= "where installmet_payment_code_number = :installmet_payment_code_number ";
            $sql .= "and installmet_payment_code = 'sales-order' ";
            $sql .= "order by installmet_payment_code_number asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "installmet_payment_code_number" => $this->sales_order_number,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readDuedateById()
    {
        try {
            $sql = "select ";
            $sql .= "DATE_FORMAT(installmet_payment_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "from {$this->tblInstallmetPayment} ";
            $sql .= "where installmet_payment_code_number = :installmet_payment_code_number ";
            $sql .= "and installmet_payment_code = 'sales-order' ";
            $sql .= "and installmet_payment_is_paid = '0' ";
            $sql .= "and DATE(installmet_payment_due_date) = DATE(:date_today) ";
            $sql .= "order by DATE(installmet_payment_due_date) desc ";
            $sql .= "limit 1 ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "installmet_payment_code_number" => $this->sales_order_number,
                "date_today" => $this->date_today,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // update
    public function updateInstallment()
    {
        try {
            $sql = "update {$this->tblInstallmetPayment} set ";
            $sql .= "installmet_payment_due_date = :installmet_payment_due_date, ";
            $sql .= "installmet_payment_amount = :installmet_payment_amount, ";
            $sql .= "installmet_payment_updated = :installmet_payment_updated ";
            $sql .= "where installmet_payment_aid = :installmet_payment_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "installmet_payment_due_date" => $this->installmet_payment_due_date,
                "installmet_payment_amount" => $this->installmet_payment_amount,
                "installmet_payment_updated" => $this->sales_order_updated,
                "installmet_payment_aid" => $this->installmet_payment_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }



    // read all
    public function readSalesOrder($allowedColumns)
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
            $sql .= "sales_order_number, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_total_receivable_amount as total_amount, ";
            $sql .= "sales_order_total_amount as total_sub_amount, ";
            $sql .= "sales_order_paid_amount as total_paid, ";
            $sql .= "sales_order_number as value, ";
            $sql .= "CONCAT(sales_order_number, ' - ', sales_order_customer_name) as label, ";
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
                $sql .= ($this->column_search != "" ? "and ( sales_order_number like :sales_order_number 
            or sales_order_customer_name like :sales_order_customer_name 
            or sales_order_received_by_name like :sales_order_received_by_name 
            or sales_order_product_owner_name like :sales_order_product_owner_name 
            or sales_order_product_name like :sales_order_product_name ) " : " ");
            }
            $sql .= " group by sales_order_number ";
            $sql .= " order by MAX(sales_order_is_active) desc, ";
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
