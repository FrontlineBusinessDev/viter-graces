<?php
class AccountReceivable
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
    public $sales_order_balance_per_product;
    public $sales_order_paid_per_product;
    public $sales_order_created;
    public $sales_order_updated;

    public $installment_payment_aid;
    public $installment_payment_code_id;
    public $installment_payment_code;
    public $installment_payment_is_paid;
    public $installment_payment_received_id;
    public $installment_payment_received_name;
    public $installment_payment_paid_amount;
    public $installment_payment_due_date;
    public $installment_payment_code_number;
    public $installment_payment_method;
    public $installment_payment_amount;
    public $installment_payment_customer_id;
    public $installment_payment_customer_name;
    public $installment_payment_updated;

    public $stock_movement_before_qty;
    public $stock_movement_after_qty;
    public $stock_movement_qty;
    public $stock_movement_type;
    public $stock_movement_status;

    public $sales_journal_aid;
    public $sales_journal_order_number;
    public $sales_journal_order_id;
    public $sales_journal_debit;
    public $sales_journal_credit;
    public $sales_journal_balance;
    public $sales_journal_method;
    public $sales_journal_date;
    public $sales_journal_customer;
    public $sales_journal_customer_id;
    public $sales_journal_note;
    public $sales_journal_from;
    public $sales_journal_create;
    public $sales_journal_update;

    public $userId;
    public $date_today;
    public $date_yesterday;

    public $connection;
    public $lastInsertedId;
    public $tblSalesOrder;
    public $tblinstallmentPayment;
    public $tblSalesJournal;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;



    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblSalesOrder = "graces_sales_order";
        $this->tblinstallmentPayment = "graces_installment_payment";
        $this->tblSalesJournal = "graces_sales_journal";
    }

    // // read all
    // public function readAll($allowedColumns)
    // {
    //     $filterColumn = [];
    //     $params = [
    //         ...$this->userId != 0 ? ["sales_order_product_owner_id" => $this->userId] : [],
    //         ...($this->column_search != "" ? [
    //             "sales_order_number" => "%{$this->column_search}%",
    //             "sales_order_customer_name" => "%{$this->column_search}%",
    //             "sales_order_product_name" => "%{$this->column_search}%",
    //             "sales_order_received_by_name" => "%{$this->column_search}%",
    //             "sales_order_product_owner_name" => "%{$this->column_search}%",
    //         ] : []),
    //     ];

    //     foreach ($this->filters as $i => $item) {
    //         if (!in_array($item['id'], $allowedColumns, true)) {
    //             continue;
    //         }
    //         $col = $item['id'];
    //         if (is_array($item['value'])) {
    //             $params["min$i"] = (float) $item['value']['min'];
    //             $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

    //             $params["max$i"] = $item['value']['max'] === ""
    //                 ? (float) $this->max
    //                 : (float) $item['value']['max'];
    //         } else {
    //             $filterColumn[] = "$col LIKE :search$i";
    //             $params["search$i"] = "%" . trim($item['value']) . "%";
    //         }
    //     }
    //     try {
    //         $sql = "select *, ";
    //         $sql .= "sales_order_status as is_status, ";
    //         $sql .= "sales_order_aid as id, ";
    //         $sql .= "sales_order_is_active as is_active, ";
    //         $sql .= "sales_order_date as order_date, ";
    //         $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
    //         $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
    //         $sql .= "sales_order_customer_name as name ";
    //         $sql .= "from {$this->tblSalesOrder} ";
    //         $sql .= " where CAST(sales_order_total_balance_amount AS DECIMAL(10, 2)) != 0 ";
    //         $sql .= ($this->userId != 0 ? "and sales_order_product_owner_id = :sales_order_product_owner_id " : " ");
    //         if (!empty($filterColumn)) {
    //             $sql .= " and " . implode(" and ", $filterColumn);
    //         } else {
    //             $sql .= ($this->column_search != "" ? "and ( sales_order_number like :sales_order_number 
    //         or sales_order_customer_name like :sales_order_customer_name 
    //         or sales_order_received_by_name like :sales_order_received_by_name 
    //         or sales_order_product_owner_name like :sales_order_product_owner_name 
    //         or sales_order_product_name like :sales_order_product_name ) " : " ");
    //         }
    //         $sql .= " group by sales_order_number ";
    //         $sql .= " order by DATE(sales_order_date) desc, ";
    //         $sql .= "sales_order_number desc ";
    //         $query = $this->connection->prepare($sql);
    //         $query->execute($params);
    //     } catch (PDOException $ex) {
    //         logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
    //         $query = false;
    //     }
    //     return $query;
    // }
    // // read all
    // public function readLimit($allowedColumns)
    // {
    //     $filterColumn = [];
    //     $params = [
    //         "start" => $this->column_start - 1,
    //         "total" => $this->column_total,
    //         ...$this->userId != 0 ? ["sales_order_product_owner_id" => $this->userId] : [],
    //         ...($this->column_search != "" ? [
    //             "sales_order_number" => "%{$this->column_search}%",
    //             "sales_order_customer_name" => "%{$this->column_search}%",
    //             "sales_order_product_name" => "%{$this->column_search}%",
    //             "sales_order_received_by_name" => "%{$this->column_search}%",
    //             "sales_order_product_owner_name" => "%{$this->column_search}%",
    //         ] : []),
    //     ];

    //     foreach ($this->filters as $i => $item) {
    //         if (!in_array($item['id'], $allowedColumns, true)) {
    //             continue;
    //         }
    //         $col = $item['id'];
    //         if (is_array($item['value'])) {
    //             $params["min$i"] = (float) $item['value']['min'];
    //             $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

    //             $params["max$i"] = $item['value']['max'] === ""
    //                 ? (float) $this->max
    //                 : (float) $item['value']['max'];
    //         } else {
    //             $filterColumn[] = "$col LIKE :search$i";
    //             $params["search$i"] = "%" . trim($item['value']) . "%";
    //         }
    //     }
    //     try {
    //         $sql = "select *, ";
    //         $sql .= "sales_order_status as is_status, ";
    //         $sql .= "sales_order_aid as id, ";
    //         $sql .= "sales_order_is_active as is_active, ";
    //         $sql .= "sales_order_date as order_date, ";
    //         $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
    //         $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
    //         $sql .= "sales_order_customer_name as name ";
    //         $sql .= "from {$this->tblSalesOrder} ";
    //         $sql .= " where CAST(sales_order_total_balance_amount AS DECIMAL(10, 2)) != 0 ";
    //         $sql .= ($this->userId != 0 ? "and sales_order_product_owner_id = :sales_order_product_owner_id " : " ");
    //         if (!empty($filterColumn)) {
    //             $sql .= " and " . implode(" and ", $filterColumn);
    //         } else {
    //             $sql .= ($this->column_search != "" ? "and ( sales_order_number like :sales_order_number 
    //         or sales_order_customer_name like :sales_order_customer_name 
    //         or sales_order_received_by_name like :sales_order_received_by_name 
    //         or sales_order_product_owner_name like :sales_order_product_owner_name 
    //         or sales_order_product_name like :sales_order_product_name ) " : " ");
    //         }
    //         $sql .= " group by sales_order_number ";
    //         $sql .= " order by sales_order_is_active desc, ";
    //         $sql .= "sales_order_number desc ";
    //         $sql .= "limit :start, ";
    //         $sql .= ":total ";
    //         $query = $this->connection->prepare($sql);
    //         $query->execute($params);
    //     } catch (PDOException $ex) {
    //         logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
    //         $query = false;
    //     }
    //     return $query;
    // }
    public function readAll(array $allowedColumns)
    {
        $where = ["CAST(sales_order_total_balance_amount AS DECIMAL(10,2)) != 0"];
        $having = [];
        $params = [];

        if ($this->userId) {
            $where[] = "sales_order_product_owner_id = :user_id";
            $params['user_id'] = $this->userId;
        }

        foreach ($this->filters as $i => $f) {
            // 1. Check allowed columns FIRST (Ensure 'ar_status' is in $allowedColumns)
            if (!in_array($f['id'], $allowedColumns, true)) continue;

            // 2. Handle ar_status filtering
            if ($f['id'] === 'ar_status') {
                if (is_array($f['value'])) {
                    $statusParams = [];
                    foreach ((array)$f['value'] as $k => $val) {
                        $paramKey = "status_$k";
                        $statusParams[] = ":$paramKey";
                        $params[$paramKey] = $val;
                    }
                    if (!empty($statusParams)) {
                        $having[] = "ar_status IN (" . implode(",", $statusParams) . ")";
                    }
                } else {
                    $params["ar_status_search"] = "%" . trim($f['value']) . "%";
                    $having[] = "ar_status LIKE :ar_status_search";
                }
                continue;
            }

            // 3. Standard WHERE filters
            if (is_array($f['value'])) {
                $params["min$i"] = (float)$f['value']['min'];
                $params["max$i"] = $f['value']['max'] === "" ? (float)$this->max : (float)$f['value']['max'];
                $where[] = "{$f['id']} BETWEEN :min$i AND :max$i";
            } else {
                $params["search$i"] = "%" . trim($f['value']) . "%";
                $where[] = "{$f['id']} LIKE :search$i";
            }
        }

        if (empty($this->filters) && $this->column_search !== "") {
            $cols = ['sales_order_number', 'sales_order_customer_name', 'sales_order_received_by_name', 'sales_order_product_owner_name', 'sales_order_product_name'];
            $where[] = "(" . implode(" OR ", array_map(fn($c) => "$c LIKE :q", $cols)) . ")";
            $params['q'] = "%{$this->column_search}%";
        }

        $havingClause = !empty($having) ? " HAVING " . implode(" AND ", $having) : "";

        $sql = "SELECT *, sales_order_status AS is_status, sales_order_aid AS id, 
            sales_order_is_active AS is_active, sales_order_date AS order_date, 
            sales_order_customer_name AS name,
            DATE_FORMAT(sales_order_date, '%b %d, %Y') AS sales_order_date, 
            DATE_FORMAT(sales_order_due_date, '%b %d, %Y') AS sales_order_due_date,
            CASE 
                WHEN sales_order_paid_amount > 0 AND CAST(sales_order_total_balance_amount AS DECIMAL(10,2)) > 0 THEN 'Partial'
                WHEN sales_order_due_date < CURDATE() THEN 'Overdue'
                WHEN sales_order_due_date = CURDATE() THEN 'Due Today'
                WHEN sales_order_due_date = CURDATE() + INTERVAL 1 DAY THEN 'Due Tomorrow'
                WHEN sales_order_due_date BETWEEN CURDATE() + INTERVAL 2 DAY AND CURDATE() + INTERVAL 7 DAY THEN 'Due Soon'
                ELSE 'Pending'
            END AS ar_status
            FROM {$this->tblSalesOrder} 
            WHERE " . implode(" AND ", $where) . "
            {$havingClause}
            ORDER BY ar_status ASC";

        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            return false;
        }
    }
    public function readLimit(array $allowedColumns)
    {
        $where = ["CAST(sales_order_total_balance_amount AS DECIMAL(10,2)) != 0"];
        $having = [];
        $params = [];

        if ($this->userId) {
            $where[] = "sales_order_product_owner_id = :user_id";
            $params['user_id'] = $this->userId;
        }

        foreach ($this->filters as $i => $f) {
            // Ensure column is permitted before processing
            if (!in_array($f['id'], $allowedColumns, true)) continue;

            // Direct alias check in HAVING clause
            if ($f['id'] === 'ar_status') {
                if (is_array($f['value'])) {
                    $statusParams = [];
                    foreach ((array)$f['value'] as $k => $val) {
                        $paramKey = "status_$k";
                        $statusParams[] = ":$paramKey";
                        $params[$paramKey] = $val;
                    }
                    if (!empty($statusParams)) {
                        $having[] = "ar_status IN (" . implode(",", $statusParams) . ")";
                    }
                } else {
                    $params["ar_status_search"] = "%" . trim($f['value']) . "%";
                    $having[] = "ar_status LIKE :ar_status_search";
                }
                continue;
            }

            // Standard column filters for WHERE clause
            if (is_array($f['value'])) {
                $params["min$i"] = (float)$f['value']['min'];
                $params["max$i"] = $f['value']['max'] === "" ? (float)$this->max : (float)$f['value']['max'];
                $where[] = "{$f['id']} BETWEEN :min$i AND :max$i";
            } else {
                $params["search$i"] = "%" . trim($f['value']) . "%";
                $where[] = "{$f['id']} LIKE :search$i";
            }
        }

        if (empty($this->filters) && $this->column_search !== "") {
            $cols = ['sales_order_number', 'sales_order_customer_name', 'sales_order_received_by_name', 'sales_order_product_owner_name', 'sales_order_product_name'];
            $where[] = "(" . implode(" OR ", array_map(fn($c) => "$c LIKE :q", $cols)) . ")";
            $params['q'] = "%{$this->column_search}%";
        }

        $havingClause = !empty($having) ? " HAVING " . implode(" AND ", $having) : "";

        $sql = "SELECT *, sales_order_status AS is_status, sales_order_aid AS id, 
            sales_order_is_active AS is_active, sales_order_date AS order_date, 
            sales_order_customer_name AS name,
            DATE_FORMAT(sales_order_date, '%b %d, %Y') AS sales_order_date, 
            DATE_FORMAT(sales_order_due_date, '%b %d, %Y') AS sales_order_due_date,
            CASE 
                WHEN sales_order_paid_amount > 0 AND CAST(sales_order_total_balance_amount AS DECIMAL(10,2)) > 0 THEN 'Partial'
                WHEN sales_order_due_date < CURDATE() THEN 'Overdue'
                WHEN sales_order_due_date = CURDATE() THEN 'Due Today'
                WHEN sales_order_due_date = CURDATE() + INTERVAL 1 DAY THEN 'Due Tomorrow'
                WHEN sales_order_due_date BETWEEN CURDATE() + INTERVAL 2 DAY AND CURDATE() + INTERVAL 7 DAY THEN 'Due Soon'
                ELSE 'Pending'
            END AS ar_status
            FROM {$this->tblSalesOrder} 
            WHERE " . implode(" AND ", $where) . "
            {$havingClause}
            ORDER BY ar_status ASC
            LIMIT :start, :total";

        try {
            $stmt = $this->connection->prepare($sql);

            // Bind filter values as strings/floats
            foreach ($params as $key => $val) {
                $stmt->bindValue(":$key", $val);
            }

            // Bind pagination params strictly as integers
            $stmt->bindValue(':start', max(0, (int)$this->column_start - 1), PDO::PARAM_INT);
            $stmt->bindValue(':total', (int)$this->column_total, PDO::PARAM_INT);

            $stmt->execute();
            return $stmt;
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            return false;
        }
    }

    // read all
    public function readByInstallment()
    {
        try {
            $sql = "select *, installment_payment_aid as id, ";
            $sql .= "DATE_FORMAT(installment_payment_due_date, '%b %d, %Y') as installment_payment_due_date ";
            $sql .= "from {$this->tblinstallmentPayment} ";
            $sql .= "where installment_payment_code_number = :installment_payment_code_number ";
            $sql .= "and installment_payment_code = 'sales-order' ";
            $sql .= "order by installment_payment_code_number asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "installment_payment_code_number" => $this->sales_order_number,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAllSaleByOrderNumber()
    {
        try {
            $sql = "select * ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= "where sales_order_number = :sales_order_number ";
            $sql .= "order by sales_order_number asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_number" => $this->installment_payment_code_number,
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
            $sql = "update {$this->tblinstallmentPayment} set ";
            $sql .= "installment_payment_is_paid = :installment_payment_is_paid, ";
            $sql .= "installment_payment_received_id = :installment_payment_received_id, ";
            $sql .= "installment_payment_received_name = :installment_payment_received_name, ";
            $sql .= "installment_payment_paid_amount = :installment_payment_paid_amount, ";
            $sql .= "installment_payment_updated = :installment_payment_updated ";
            $sql .= "where installment_payment_aid = :installment_payment_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "installment_payment_is_paid" => $this->installment_payment_is_paid,
                "installment_payment_received_id" => $this->installment_payment_received_id,
                "installment_payment_received_name" => $this->installment_payment_received_name,
                "installment_payment_paid_amount" => $this->installment_payment_paid_amount,
                "installment_payment_updated" => $this->installment_payment_updated,
                "installment_payment_aid" => $this->installment_payment_aid,
            ]);
        } catch (PDOException $ex) {

            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // update
    public function updateSales()
    {
        try {
            $sql = "update {$this->tblSalesOrder} set ";
            $sql .= "sales_order_balance_per_product = :sales_order_balance_per_product, ";
            $sql .= "sales_order_paid_per_product = :sales_order_paid_per_product, ";
            $sql .= "sales_order_total_balance_amount = :sales_order_total_balance_amount, ";
            $sql .= "sales_order_paid_amount = :sales_order_paid_amount, ";
            $sql .= "sales_order_status = :sales_order_status, ";
            $sql .= "sales_order_due_date = :sales_order_due_date, ";
            $sql .= "sales_order_updated = :sales_order_updated ";
            $sql .= "where sales_order_aid = :sales_order_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_balance_per_product" => $this->sales_order_balance_per_product,
                "sales_order_paid_per_product" => $this->sales_order_paid_per_product,
                "sales_order_total_balance_amount" => $this->sales_order_total_balance_amount,
                "sales_order_paid_amount" => $this->sales_order_paid_amount,
                "sales_order_status" => $this->sales_order_status,
                "sales_order_due_date" => $this->sales_order_due_date,
                "sales_order_updated" => $this->sales_order_updated,
                "sales_order_aid" => $this->sales_order_aid,
            ]);
        } catch (PDOException $ex) {

            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read by id
    public function readAllSales()
    {
        try {
            $sql = "select * ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= "group by sales_order_number ";
            $sql .= "order by sales_order_number asc ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read by id
    public function readLastSalesJournal()
    {
        try {
            $sql = "select sales_journal_balance ";
            $sql .= "from {$this->tblSalesJournal} ";
            $sql .= "order by sales_journal_aid desc ";
            $sql .= "limit 1 ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // create
    public function createSalesJornal()
    {
        try {
            $sql = "insert into {$this->tblSalesJournal} ";
            $sql .= "( sales_journal_order_number, ";
            $sql .= "sales_journal_order_id, ";
            $sql .= "sales_journal_debit, ";
            $sql .= "sales_journal_credit, ";
            $sql .= "sales_journal_balance, ";
            $sql .= "sales_journal_method, ";
            $sql .= "sales_journal_date, ";
            $sql .= "sales_journal_customer, ";
            $sql .= "sales_journal_customer_id, ";
            $sql .= "sales_journal_note, ";
            $sql .= "sales_journal_from, ";
            $sql .= "sales_journal_create, ";
            $sql .= "sales_journal_update ) values ( ";
            $sql .= ":sales_journal_order_number, ";
            $sql .= ":sales_journal_order_id, ";
            $sql .= ":sales_journal_debit, ";
            $sql .= ":sales_journal_credit, ";
            $sql .= ":sales_journal_balance, ";
            $sql .= ":sales_journal_method, ";
            $sql .= ":sales_journal_date, ";
            $sql .= ":sales_journal_customer, ";
            $sql .= ":sales_journal_customer_id, ";
            $sql .= ":sales_journal_note, ";
            $sql .= ":sales_journal_from, ";
            $sql .= ":sales_journal_create, ";
            $sql .= ":sales_journal_update ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_journal_order_number" => $this->sales_journal_order_number,
                "sales_journal_order_id" => $this->sales_journal_order_id,
                "sales_journal_debit" => $this->sales_journal_debit,
                "sales_journal_credit" => $this->sales_journal_credit,
                "sales_journal_balance" => $this->sales_journal_balance,
                "sales_journal_method" => $this->sales_journal_method,
                "sales_journal_date" => $this->sales_journal_date,
                "sales_journal_customer" => $this->sales_journal_customer,
                "sales_journal_customer_id" => $this->sales_journal_customer_id,
                "sales_journal_note" => $this->sales_journal_note,
                "sales_journal_from" => $this->sales_journal_from,
                "sales_journal_create" => $this->sales_journal_create,
                "sales_journal_update" => $this->sales_journal_update,
            ]);
        } catch (PDOException $ex) {
            returnError($ex);
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
}
