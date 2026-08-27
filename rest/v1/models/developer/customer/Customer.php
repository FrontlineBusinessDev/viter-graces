<?php
class Customer
{
    public $customer_aid;
    public $customer_is_active;
    public $customer_name;
    public $customer_email;
    public $customer_phone;
    public $customer_address;
    public $customer_messenger;
    public $customer_whatsapp;
    public $customer_other;
    public $customer_notes;
    public $customer_created;
    public $customer_updated;

    public $customer_is_walk_in_customer;
    public $installment_payment_customer_id;

    public $due_date;

    public $connection;
    public $lastInsertedId;
    public $tblCustomer;
    public $tblinstallmentPayment;
    public $tblSalesOrder;
    public $tblReturnProduct;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblCustomer = "graces_customer";
        $this->tblinstallmentPayment = "graces_installment_payment";
        $this->tblSalesOrder = "graces_sales_order";
        $this->tblReturnProduct = "graces_return_product";
    }

    // create
    public function create()
    {
        try {
            $sql = "insert into {$this->tblCustomer} ";
            $sql .= "( customer_is_active, ";
            $sql .= "customer_name, ";
            $sql .= "customer_email, ";
            $sql .= "customer_is_walk_in_customer, ";
            $sql .= "customer_phone, ";
            $sql .= "customer_address, ";
            $sql .= "customer_messenger, ";
            $sql .= "customer_whatsapp, ";
            $sql .= "customer_other, ";
            $sql .= "customer_notes, ";
            $sql .= "customer_created, ";
            $sql .= "customer_updated ) values ( ";
            $sql .= ":customer_is_active, ";
            $sql .= ":customer_name, ";
            $sql .= ":customer_email, ";
            $sql .= ":customer_is_walk_in_customer, ";
            $sql .= ":customer_phone, ";
            $sql .= ":customer_address, ";
            $sql .= ":customer_messenger, ";
            $sql .= ":customer_whatsapp, ";
            $sql .= ":customer_other, ";
            $sql .= ":customer_notes, ";
            $sql .= ":customer_created, ";
            $sql .= ":customer_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_is_active" => $this->customer_is_active,
                "customer_name" => $this->customer_name,
                "customer_email" => $this->customer_email,
                "customer_is_walk_in_customer" => $this->customer_is_walk_in_customer,
                "customer_phone" => $this->customer_phone,
                "customer_address" => $this->customer_address,
                "customer_messenger" => $this->customer_messenger,
                "customer_whatsapp" => $this->customer_whatsapp,
                "customer_other" => $this->customer_other,
                "customer_notes" => $this->customer_notes,
                "customer_created" => $this->customer_created,
                "customer_updated" => $this->customer_updated,
            ]);
            $this->lastInsertedId = $this->connection->lastInsertId();
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAllActive($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...$this->column_search != "" ? [
                "customer_name" => "%{$this->column_search}%",
                "customer_email" => "%{$this->column_search}%",
                "customer_address" => "%{$this->column_search}%",
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
            $sql .= "customer_aid as id, ";
            $sql .= "customer_messenger as messenger, ";
            $sql .= "customer_whatsapp as whatsapp, ";
            $sql .= "customer_other as other, ";
            $sql .= "customer_is_active as is_active, ";
            $sql .= "customer_name as name ";
            $sql .= "from {$this->tblCustomer} ";
            $sql .= " where customer_is_active = '1' ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? " and ( customer_name like :customer_name 
            or customer_address like :customer_address 
            or customer_email like :customer_email ) " : " ");
            }
            $sql .= " order by customer_is_active desc, ";
            $sql .= " customer_is_walk_in_customer desc, ";
            $sql .= " customer_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
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
                "customer_name" => "%{$this->column_search}%",
                "customer_email" => "%{$this->column_search}%",
                "customer_address" => "%{$this->column_search}%",
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
            $sql .= "customer_aid as id, ";
            $sql .= "customer_messenger as messenger, ";
            $sql .= "customer_whatsapp as whatsapp, ";
            $sql .= "customer_other as other, ";
            $sql .= "customer_is_active as is_active, ";
            $sql .= "customer_name as name ";
            $sql .= "from {$this->tblCustomer} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? " and ( customer_name like :customer_name 
            or customer_address like :customer_address 
            or customer_email like :customer_email ) " : " ");
            }
            $sql .= " order by customer_is_active desc, ";
            $sql .= " customer_is_walk_in_customer desc, ";
            $sql .= " customer_name asc ";
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
                "customer_name" => "%{$this->column_search}%",
                "customer_email" => "%{$this->column_search}%",
                "customer_address" => "%{$this->column_search}%",
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
            $sql .= "customer_aid as id, ";
            $sql .= "customer_messenger as messenger, ";
            $sql .= "customer_whatsapp as whatsapp, ";
            $sql .= "customer_other as other, ";
            $sql .= "customer_is_active as is_active, ";
            $sql .= "customer_name as name ";
            $sql .= "from {$this->tblCustomer} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? " and ( customer_name like :customer_name 
            or customer_address like :customer_address 
            or customer_email like :customer_email ) " : " ");
            }
            $sql .= " order by customer_is_active desc, ";
            $sql .= " customer_is_walk_in_customer desc, ";
            $sql .= " customer_name asc ";
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
            $sql .= "customer_aid as id, ";
            $sql .= "customer_messenger as messenger, ";
            $sql .= "customer_whatsapp as whatsapp, ";
            $sql .= "customer_other as other, ";
            $sql .= "customer_is_active as is_active, ";
            $sql .= "customer_name as name ";
            $sql .= "from ";
            $sql .= " {$this->tblCustomer} ";
            $sql .= "where ( customer_name like :customer_name ";
            $sql .= "or customer_email like :customer_email ";
            $sql .= "or customer_address like :customer_address ";
            $sql .= ") ";
            $sql .= "order by customer_is_active desc, ";
            $sql .= " customer_is_walk_in_customer desc, ";
            $sql .= "customer_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_name" => "%{$this->column_search}%",
                "customer_email" => "%{$this->column_search}%",
                "customer_address" => "%{$this->column_search}%",
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
            $sql .= "customer_aid as id, ";
            $sql .= "customer_messenger as messenger, ";
            $sql .= "customer_whatsapp as whatsapp, ";
            $sql .= "customer_other as other, ";
            $sql .= "customer_is_active as is_active, ";
            $sql .= "customer_name as name ";
            $sql .= "from {$this->tblCustomer} ";
            $sql .= "where customer_aid = :customer_aid ";
            $sql .= "order by customer_is_active desc, ";
            $sql .= "customer_is_walk_in_customer desc, ";
            $sql .= "customer_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_aid" => $this->customer_aid,
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
            $sql = "update {$this->tblCustomer} set ";
            $sql .= "customer_name = :customer_name, ";
            $sql .= "customer_email = :customer_email, ";
            $sql .= "customer_phone = :customer_phone, ";
            $sql .= "customer_address = :customer_address, ";
            $sql .= "customer_messenger = :customer_messenger, ";
            $sql .= "customer_whatsapp = :customer_whatsapp, ";
            $sql .= "customer_other = :customer_other, ";
            $sql .= "customer_notes = :customer_notes, ";
            $sql .= "customer_updated = :customer_updated ";
            $sql .= "where customer_aid  = :customer_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_name" => $this->customer_name,
                "customer_email" => $this->customer_email,
                "customer_phone" => $this->customer_phone,
                "customer_address" => $this->customer_address,
                "customer_messenger" => $this->customer_messenger,
                "customer_whatsapp" => $this->customer_whatsapp,
                "customer_other" => $this->customer_other,
                "customer_notes" => $this->customer_notes,
                "customer_updated" => $this->customer_updated,
                "customer_aid" => $this->customer_aid,
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
            $sql = "update {$this->tblCustomer} set ";
            $sql .= "customer_is_active = :customer_is_active, ";
            $sql .= "customer_updated = :customer_updated ";
            $sql .= "where customer_aid = :customer_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_is_active" => $this->customer_is_active,
                "customer_updated" => $this->customer_updated,
                "customer_aid" => $this->customer_aid,
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
            $sql = "delete from {$this->tblCustomer} ";
            $sql .= "where customer_aid = :customer_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_aid" => $this->customer_aid,
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
            $sql = "select customer_name from {$this->tblCustomer} ";
            $sql .= "where customer_name = :customer_name ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_name" => "{$this->customer_name}",
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readWalkInCustomer()
    {
        try {
            $sql = "select * ";
            $sql .= "from {$this->tblCustomer} ";
            $sql .= " where customer_is_walk_in_customer = '1' ";
            $sql .= " order by customer_aid desc ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAllCutomer()
    {
        try {
            $sql = "select * ";
            $sql .= "from {$this->tblCustomer} ";
            $sql .= "order by customer_is_active desc, ";
            $sql .= "customer_is_walk_in_customer desc, ";
            $sql .= "customer_name asc ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // create
    public function createWalkInCustomer()
    {
        try {
            $sql = "insert into {$this->tblCustomer} ";
            $sql .= "( customer_is_active, ";
            $sql .= "customer_is_walk_in_customer, ";
            $sql .= "customer_name, ";
            $sql .= "customer_created, ";
            $sql .= "customer_updated ) values ( ";
            $sql .= ":customer_is_active, ";
            $sql .= ":customer_is_walk_in_customer, ";
            $sql .= ":customer_name, ";
            $sql .= ":customer_created, ";
            $sql .= ":customer_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_is_active" => $this->customer_is_active,
                "customer_is_walk_in_customer" => $this->customer_is_walk_in_customer,
                "customer_name" => $this->customer_name,
                "customer_created" => $this->customer_created,
                "customer_updated" => $this->customer_updated,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAllOverdueBalance($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "installment_payment_customer_id" => $this->installment_payment_customer_id,
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
            $sql .= "DATE_FORMAT(installment_payment_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "DATEDIFF(NOW(), installment_payment_due_date) as days_ago, ";
            $sql .= "SUM(installment_payment_amount) as amount, ";
            $sql .= "installment_payment_aid as id, ";
            $sql .= "installment_payment_is_paid as is_active, ";
            $sql .= "installment_payment_code_number as name ";
            $sql .= "from {$this->tblinstallmentPayment} ";
            $sql .= "where installment_payment_is_paid = '0' ";
            $sql .= "and installment_payment_customer_id = :installment_payment_customer_id ";
            $sql .= "and DATE(installment_payment_due_date) <= DATE(:due_date) ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (installment_payment_due_date like :installment_payment_due_date 
                or installment_payment_code_number like :installment_payment_code_number) " : " ");
            }
            $sql .= " group by installment_payment_customer_id ";
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
    public function readAllOpenBalance($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "installment_payment_customer_id" => $this->installment_payment_customer_id,
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
            $sql .= "COUNT(sales_order_number) as number_of_order, ";
            $sql .= "sales_order_number, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_total_receivable_amount as total_amount, ";
            $sql .= "sales_order_total_amount as total_sub_amount, ";
            $sql .= "sales_order_paid_amount as total_paid, ";
            $sql .= "sales_order_total_balance_amount as balance, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where sales_order_customer_id = :installment_payment_customer_id ";
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

    // read by id
    public function readSalesOrderByCustomerId()
    {
        try {
            $sql = "SELECT ";
            $sql .= "SUM(outstanding_balance) as outstanding_balance, ";
            $sql .= "COUNT(sales_order_number) as number_of_orders, ";
            $sql .= "SUM(total_amount_spent) as total_amount_spent ";
            $sql .= "FROM ( ";
            $sql .= "    SELECT ";
            $sql .= "        sales_order_number, ";
            $sql .= "        MAX(sales_order_total_balance_amount) as outstanding_balance, ";
            $sql .= "        MAX(sales_order_paid_amount) as total_amount_spent ";
            $sql .= "    FROM {$this->tblSalesOrder} ";
            $sql .= "    WHERE sales_order_customer_id = :sales_order_customer_id ";
            $sql .= "    GROUP BY sales_order_number ";
            $sql .= ") as unique_orders";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_customer_id" => $this->customer_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read by id
    public function readReturnByOpenCreditMemo()
    {
        try {
            $sql = "select SUM(return_product_amount) as open_credit_memo ";
            $sql .= "from {$this->tblReturnProduct} ";
            $sql .= " where return_product_customer_id =:return_product_customer_id ";
            $sql .= " and return_product_resolution_type = 'credit memo' ";
            $sql .= " and return_product_status = 'processed' ";
            $sql .= "order by return_product_customer_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "return_product_customer_id" => $this->customer_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
}
