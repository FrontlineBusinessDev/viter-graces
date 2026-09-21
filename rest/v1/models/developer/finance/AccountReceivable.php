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
    public $sales_order_cash;
    public $sales_order_check;
    public $sales_order_online_transaction;
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
    public $installment_payment_created;
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

    // Builds the "columnFilters" WHERE fragments shared by every read*()
    // method below, and writes the matching bound params into &$params.
    // - {min, max} value  -> numeric BETWEEN (e.g. price/cost/stocks range)
    // - array value       -> multi-select OR match via IN (...)
    // - plain value       -> single LIKE match (legacy single-select filter)
    private function buildFilterColumns($allowedColumns, &$params)
    {
        $filterColumn = [];

        // status_text isn't a plain column alias - it's a computed CASE
        // label built in readAll()/readLimit() from paid/balance amounts and
        // the due date, so it can't be referenced in a WHERE clause by
        // name. Re-running the identical CASE expression here (instead of
        // the bare column) lets the generic IN(...) branch below filter on
        // it directly, without duplicating the surrounding filter logic.
        $columnAliasMap = [
            "status_text" => "(CASE WHEN sales_order_paid_amount > 0 AND CAST(sales_order_total_balance_amount AS DECIMAL(10,2)) > 0 THEN 'Partial' "
                . "WHEN sales_order_due_date < CURDATE() THEN 'Overdue' "
                . "WHEN sales_order_due_date = CURDATE() THEN 'Due Today' "
                . "WHEN sales_order_due_date = CURDATE() + INTERVAL 1 DAY THEN 'Due Tomorrow' "
                . "WHEN sales_order_due_date BETWEEN CURDATE() + INTERVAL 2 DAY AND CURDATE() + INTERVAL 7 DAY THEN 'Due Soon' "
                . "ELSE 'Pending' END)",
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $columnAliasMap[$item['id']] ?? $item['id'];
            $value = $item['value'];

            if (is_array($value) && array_key_exists('start', $value)) {
                $hasStart = trim((string) $value['start']) !== '';
                $hasEnd = trim((string) $value['end']) !== '';
                if (!$hasStart && !$hasEnd) {
                    continue;
                }
                if ($hasStart && $hasEnd) {
                    $params["start$i"] = trim($value['start']);
                    $params["end$i"] = trim($value['end']);
                    $filterColumn[] = "DATE($col) BETWEEN :start$i AND :end$i";
                } elseif ($hasStart) {
                    $params["start$i"] = trim($value['start']);
                    $filterColumn[] = "DATE($col) >= :start$i";
                } else {
                    $params["end$i"] = trim($value['end']);
                    $filterColumn[] = "DATE($col) <= :end$i";
                }
            } elseif (is_array($value) && array_key_exists('min', $value)) {
                $params["min$i"] = (float) $value['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $value['max'] === ""
                    ? (float) $this->max
                    : (float) $value['max'];
            } elseif (
                is_array($value)
                && isset($value[0])
                && is_array($value[0])
                && array_key_exists('start', $value[0])
            ) {
                $rangeClauses = [];

                foreach ($value as $j => $range) {
                    $hasStart = isset($range['start']) && trim((string) $range['start']) !== '';
                    $hasEnd = isset($range['end']) && trim((string) $range['end']) !== '';

                    if (!$hasStart && !$hasEnd) {
                        continue;
                    }

                    $startKey = "daterange{$i}_{$j}_start";
                    $endKey = "daterange{$i}_{$j}_end";

                    if ($hasStart && $hasEnd) {
                        $params[$startKey] = trim($range['start']);
                        $params[$endKey] = trim($range['end']);
                        $rangeClauses[] = "DATE($col) BETWEEN :$startKey AND :$endKey";
                    } elseif ($hasStart) {
                        $params[$startKey] = trim($range['start']);
                        $rangeClauses[] = "DATE($col) >= :$startKey";
                    } else {
                        $params[$endKey] = trim($range['end']);
                        $rangeClauses[] = "DATE($col) <= :$endKey";
                    }
                }

                if (empty($rangeClauses)) {
                    continue;
                }

                $filterColumn[] = "(" . implode(" OR ", $rangeClauses) . ")";
            } elseif (is_array($value) && isset($value[0]) && is_array($value[0])) {
                $rangeClauses = [];

                foreach ($value as $j => $range) {
                    $hasMin = isset($range['min']) && $range['min'] !== '';
                    $hasMax = isset($range['max']) && $range['max'] !== '';

                    if (!$hasMin && !$hasMax) {
                        continue;
                    }

                    $minKey = "range{$i}_{$j}_min";
                    $maxKey = "range{$i}_{$j}_max";
                    $params[$minKey] = $hasMin ? (float) $range['min'] : 0.0;
                    $params[$maxKey] = $hasMax ? (float) $range['max'] : (float) $this->max;
                    $rangeClauses[] = "$col BETWEEN :$minKey AND :$maxKey";
                }

                if (empty($rangeClauses)) {
                    continue;
                }

                $filterColumn[] = "(" . implode(" OR ", $rangeClauses) . ")";
            } elseif (is_array($value)) {
                $selectedValues = array_values(array_filter(
                    $value,
                    fn ($v) => trim((string) $v) !== ""
                ));

                if (empty($selectedValues)) {
                    continue;
                }

                $placeholders = [];
                foreach ($selectedValues as $j => $selectedValue) {
                    $paramKey = "filter{$i}_{$j}";
                    $placeholders[] = ":$paramKey";
                    $params[$paramKey] = trim($selectedValue);
                }

                $filterColumn[] = "$col IN (" . implode(", ", $placeholders) . ")";
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($value) . "%";
            }
        }

        return $filterColumn;
    }

    // read all
    public function readAll($allowedColumns)
    {
        $params = [
            ...$this->userId != 0 ? ["sales_order_product_owner_id" => $this->userId] : [],
            ...($this->column_search != "" ? [
                "sales_order_number" => "%{$this->column_search}%",
                "sales_order_customer_name" => "%{$this->column_search}%",
                "sales_order_product_name" => "%{$this->column_search}%",
                "sales_order_received_by_name" => "%{$this->column_search}%",
                "sales_order_product_owner_name" => "%{$this->column_search}%",
            ] : []),
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "CASE WHEN sales_order_paid_amount > 0 AND CAST(sales_order_total_balance_amount AS DECIMAL(10,2)) > 0 THEN 'Partial' ";
            $sql .= "WHEN sales_order_due_date < CURDATE() THEN 'Overdue' ";
            $sql .= "WHEN sales_order_due_date = CURDATE() THEN 'Due Today' ";
            $sql .= "WHEN sales_order_due_date = CURDATE() + INTERVAL 1 DAY THEN 'Due Tomorrow' ";
            $sql .= "WHEN sales_order_due_date BETWEEN CURDATE() + INTERVAL 2 DAY AND CURDATE() + INTERVAL 7 DAY THEN 'Due Soon' ";
            $sql .= "ELSE 'Pending' END AS status_text, ";
            $sql .= "CASE WHEN sales_order_due_date < CURDATE() THEN DATEDIFF(CURDATE(), sales_order_due_date) ELSE 0 END AS days_overdue, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where CAST(sales_order_total_balance_amount AS DECIMAL(10, 2)) != 0 ";
            $sql .= ($this->userId != 0 ? "and sales_order_product_owner_id = :sales_order_product_owner_id " : " ");
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
            $sql .= " order by days_overdue desc, ";
            $sql .= "DATE(sales_order_due_date) desc, ";
            $sql .= "sales_order_number asc ";
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
        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->userId != 0 ? ["sales_order_product_owner_id" => $this->userId] : [],
            ...($this->column_search != "" ? [
                "sales_order_number" => "%{$this->column_search}%",
                "sales_order_customer_name" => "%{$this->column_search}%",
                "sales_order_product_name" => "%{$this->column_search}%",
                "sales_order_received_by_name" => "%{$this->column_search}%",
                "sales_order_product_owner_name" => "%{$this->column_search}%",
            ] : []),
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "CASE WHEN sales_order_paid_amount > 0 AND CAST(sales_order_total_balance_amount AS DECIMAL(10,2)) > 0 THEN 'Partial' ";
            $sql .= "WHEN sales_order_due_date < CURDATE() THEN 'Overdue' ";
            $sql .= "WHEN sales_order_due_date = CURDATE() THEN 'Due Today' ";
            $sql .= "WHEN sales_order_due_date = CURDATE() + INTERVAL 1 DAY THEN 'Due Tomorrow' ";
            $sql .= "WHEN sales_order_due_date BETWEEN CURDATE() + INTERVAL 2 DAY AND CURDATE() + INTERVAL 7 DAY THEN 'Due Soon' ";
            $sql .= "ELSE 'Pending' END AS status_text, ";
            $sql .= "CASE WHEN sales_order_due_date < CURDATE() THEN DATEDIFF(CURDATE(), sales_order_due_date) ELSE 0 END AS days_overdue, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where CAST(sales_order_total_balance_amount AS DECIMAL(10, 2)) != 0 ";
            $sql .= ($this->userId != 0 ? "and sales_order_product_owner_id = :sales_order_product_owner_id " : " ");
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
            // Priority 1: status rank (Due Soon > Due Tomorrow > Due Today >
            // Pending > Overdue > Partial > anything else) - references the
            // status_text alias computed above, not the raw column.
            // Priority 2: due date ascending (earliest first); a null due
            // date (flexible installment plans - see installmentDetails())
            // is pushed to the end rather than sorting first. Table-qualified
            // to read the raw date, since sales_order_due_date is re-aliased
            // above to its DATE_FORMAT()'d display string.
            // Priority 3: order number, alphanumeric ascending.
            $sql .= " order by ";
            $sql .= "CASE status_text ";
            $sql .= "WHEN 'Due Soon' THEN 1 ";
            $sql .= "WHEN 'Due Tomorrow' THEN 2 ";
            $sql .= "WHEN 'Due Today' THEN 3 ";
            $sql .= "WHEN 'Pending' THEN 4 ";
            $sql .= "WHEN 'Overdue' THEN 5 ";
            $sql .= "WHEN 'Partial' THEN 6 ";
            $sql .= "ELSE 7 END asc, ";
            $sql .= "({$this->tblSalesOrder}.sales_order_due_date IS NULL) asc, ";
            $sql .= "{$this->tblSalesOrder}.sales_order_due_date asc, ";
            $sql .= "sales_order_number asc ";
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

    // read all - scoped to the orders a single cashier (sales_order_received_by_id) created
    public function readCashierAll($allowedColumns)
    {
        $params = [
            ...$this->userId != 0 ? ["sales_order_received_by_id" => $this->userId] : [],
            ...($this->column_search != "" ? [
                "sales_order_number" => "%{$this->column_search}%",
                "sales_order_customer_name" => "%{$this->column_search}%",
                "sales_order_product_name" => "%{$this->column_search}%",
                "sales_order_received_by_name" => "%{$this->column_search}%",
                "sales_order_product_owner_name" => "%{$this->column_search}%",
            ] : []),
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "CASE WHEN sales_order_paid_amount > 0 AND CAST(sales_order_total_balance_amount AS DECIMAL(10,2)) > 0 THEN 'Partial' ";
            $sql .= "WHEN sales_order_due_date < CURDATE() THEN 'Overdue' ";
            $sql .= "WHEN sales_order_due_date = CURDATE() THEN 'Due Today' ";
            $sql .= "WHEN sales_order_due_date = CURDATE() + INTERVAL 1 DAY THEN 'Due Tomorrow' ";
            $sql .= "WHEN sales_order_due_date BETWEEN CURDATE() + INTERVAL 2 DAY AND CURDATE() + INTERVAL 7 DAY THEN 'Due Soon' ";
            $sql .= "ELSE 'Pending' END AS status_text, ";
            $sql .= "CASE WHEN sales_order_due_date < CURDATE() THEN DATEDIFF(CURDATE(), sales_order_due_date) ELSE 0 END AS days_overdue, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where CAST(sales_order_total_balance_amount AS DECIMAL(10, 2)) != 0 ";
            $sql .= ($this->userId != 0 ? "and sales_order_received_by_id = :sales_order_received_by_id " : " ");
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
            $sql .= " order by days_overdue desc, ";
            $sql .= "DATE(sales_order_due_date) desc, ";
            $sql .= "sales_order_number asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read limit - scoped to the orders a single cashier (sales_order_received_by_id) created
    public function readCashierLimit($allowedColumns)
    {
        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->userId != 0 ? ["sales_order_received_by_id" => $this->userId] : [],
            ...($this->column_search != "" ? [
                "sales_order_number" => "%{$this->column_search}%",
                "sales_order_customer_name" => "%{$this->column_search}%",
                "sales_order_product_name" => "%{$this->column_search}%",
                "sales_order_received_by_name" => "%{$this->column_search}%",
                "sales_order_product_owner_name" => "%{$this->column_search}%",
            ] : []),
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "CASE WHEN sales_order_paid_amount > 0 AND CAST(sales_order_total_balance_amount AS DECIMAL(10,2)) > 0 THEN 'Partial' ";
            $sql .= "WHEN sales_order_due_date < CURDATE() THEN 'Overdue' ";
            $sql .= "WHEN sales_order_due_date = CURDATE() THEN 'Due Today' ";
            $sql .= "WHEN sales_order_due_date = CURDATE() + INTERVAL 1 DAY THEN 'Due Tomorrow' ";
            $sql .= "WHEN sales_order_due_date BETWEEN CURDATE() + INTERVAL 2 DAY AND CURDATE() + INTERVAL 7 DAY THEN 'Due Soon' ";
            $sql .= "ELSE 'Pending' END AS status_text, ";
            $sql .= "CASE WHEN sales_order_due_date < CURDATE() THEN DATEDIFF(CURDATE(), sales_order_due_date) ELSE 0 END AS days_overdue, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " where CAST(sales_order_total_balance_amount AS DECIMAL(10, 2)) != 0 ";
            $sql .= ($this->userId != 0 ? "and sales_order_received_by_id = :sales_order_received_by_id " : " ");
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
            $sql .= " order by ";
            $sql .= "CASE status_text ";
            $sql .= "WHEN 'Due Soon' THEN 1 ";
            $sql .= "WHEN 'Due Tomorrow' THEN 2 ";
            $sql .= "WHEN 'Due Today' THEN 3 ";
            $sql .= "WHEN 'Pending' THEN 4 ";
            $sql .= "WHEN 'Overdue' THEN 5 ";
            $sql .= "WHEN 'Partial' THEN 6 ";
            $sql .= "ELSE 7 END asc, ";
            $sql .= "({$this->tblSalesOrder}.sales_order_due_date IS NULL) asc, ";
            $sql .= "{$this->tblSalesOrder}.sales_order_due_date asc, ";
            $sql .= "sales_order_number asc ";
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

    // create
    // Records a brand-new, already-paid installment row for a Flexible-type
    // order (date + amount + method entered directly in Accounts Receivable) -
    // the counterpart to SalesOrder::createInstallment() for the
    // auto-generated monthly/weekly schedule.
    public function createInstallmentPayment()
    {
        try {
            $sql = "insert into {$this->tblinstallmentPayment} ";
            $sql .= "( installment_payment_code_id, ";
            $sql .= "installment_payment_code, ";
            $sql .= "installment_payment_is_paid, ";
            $sql .= "installment_payment_due_date, ";
            $sql .= "installment_payment_code_number, ";
            $sql .= "installment_payment_amount, ";
            $sql .= "installment_payment_method, ";
            $sql .= "installment_payment_customer_id, ";
            $sql .= "installment_payment_customer_name, ";
            $sql .= "installment_payment_paid_amount, ";
            $sql .= "installment_payment_received_id, ";
            $sql .= "installment_payment_received_name, ";
            $sql .= "installment_payment_created, ";
            $sql .= "installment_payment_updated ) values ( ";
            $sql .= ":installment_payment_code_id, ";
            $sql .= ":installment_payment_code, ";
            $sql .= ":installment_payment_is_paid, ";
            $sql .= ":installment_payment_due_date, ";
            $sql .= ":installment_payment_code_number, ";
            $sql .= ":installment_payment_amount, ";
            $sql .= ":installment_payment_method, ";
            $sql .= ":installment_payment_customer_id, ";
            $sql .= ":installment_payment_customer_name, ";
            $sql .= ":installment_payment_paid_amount, ";
            $sql .= ":installment_payment_received_id, ";
            $sql .= ":installment_payment_received_name, ";
            $sql .= ":installment_payment_created, ";
            $sql .= ":installment_payment_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "installment_payment_code_id" => $this->installment_payment_code_id,
                "installment_payment_code" => $this->installment_payment_code,
                "installment_payment_is_paid" => $this->installment_payment_is_paid,
                "installment_payment_due_date" => $this->installment_payment_due_date,
                "installment_payment_code_number" => $this->installment_payment_code_number,
                "installment_payment_amount" => $this->installment_payment_amount,
                "installment_payment_method" => $this->installment_payment_method,
                "installment_payment_customer_id" => $this->installment_payment_customer_id,
                "installment_payment_customer_name" => $this->installment_payment_customer_name,
                "installment_payment_paid_amount" => $this->installment_payment_paid_amount,
                "installment_payment_received_id" => $this->installment_payment_received_id,
                "installment_payment_received_name" => $this->installment_payment_received_name,
                "installment_payment_created" => $this->installment_payment_created,
                "installment_payment_updated" => $this->installment_payment_updated,
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
            $sql .= "installment_payment_method = :installment_payment_method, ";
            $sql .= "installment_payment_updated = :installment_payment_updated ";
            $sql .= "where installment_payment_aid = :installment_payment_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "installment_payment_is_paid" => $this->installment_payment_is_paid,
                "installment_payment_received_id" => $this->installment_payment_received_id,
                "installment_payment_received_name" => $this->installment_payment_received_name,
                "installment_payment_paid_amount" => $this->installment_payment_paid_amount,
                "installment_payment_method" => $this->installment_payment_method,
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
            $sql .= "sales_order_cash = :sales_order_cash, ";
            $sql .= "sales_order_check = :sales_order_check, ";
            $sql .= "sales_order_online_transaction = :sales_order_online_transaction, ";
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
                "sales_order_cash" => $this->sales_order_cash,
                "sales_order_check" => $this->sales_order_check,
                "sales_order_online_transaction" => $this->sales_order_online_transaction,
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
