<?php
class CashSales
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
    public $installment_payment_due_date;
    public $installment_payment_code_number;
    public $installment_payment_method;
    public $installment_payment_amount;
    public $installment_payment_customer_id;
    public $installment_payment_customer_name;

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

    public $userId;
    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;



    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblSalesOrder = "graces_sales_order";
    }

    // Builds the "columnFilters" WHERE fragments shared by every read*()
    // method below, and writes the matching bound params into &$params.
    // - {min, max} value  -> numeric BETWEEN (e.g. price/cost/stocks range)
    // - array value       -> multi-select OR match via IN (...)
    // - plain value       -> single LIKE match (legacy single-select filter)
    private function buildFilterColumns($allowedColumns, &$params)
    {
        $filterColumn = [];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
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
                    fn($v) => trim((string) $v) !== ""
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
            $sql .= "(sales_order_paid_per_product + sales_order_balance_per_product) as total_amount_per_product, ";
            $sql .= "sales_order_number, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_total_receivable_amount as total_amount, ";
            $sql .= "sales_order_total_amount as total_sub_amount, ";
            $sql .= "sales_order_paid_amount as total_paid, ";
            $sql .= "sales_order_cash as total_paid_in_cash, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " WHERE sales_order_cash != 0 and sales_order_cash IS NOT NULL";
            $sql .= " and CAST(sales_order_paid_per_product AS DECIMAL(10, 2)) != 0 ";
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
            $sql .= " order by DATE(sales_order_date) desc, ";
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
        $params = [
            ...$this->userId != 0 ? ["sales_order_product_owner_id" => $this->userId] : [],
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

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "(sales_order_paid_per_product + sales_order_balance_per_product) as total_amount_per_product, ";
            $sql .= "sales_order_number, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_total_receivable_amount as total_amount, ";
            $sql .= "sales_order_total_amount as total_sub_amount, ";
            $sql .= "sales_order_paid_amount as total_paid, ";
            $sql .= "sales_order_cash as total_paid_in_cash, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " WHERE sales_order_cash != 0 and sales_order_cash IS NOT NULL";
            $sql .= " and CAST(sales_order_paid_per_product AS DECIMAL(10, 2)) != 0 ";
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
            $sql .= "(sales_order_paid_per_product + sales_order_balance_per_product) as total_amount_per_product, ";
            $sql .= "sales_order_number, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_total_receivable_amount as total_amount, ";
            $sql .= "sales_order_total_amount as total_sub_amount, ";
            $sql .= "sales_order_paid_amount as total_paid, ";
            $sql .= "sales_order_cash as total_paid_in_cash, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " WHERE sales_order_cash != 0 and sales_order_cash IS NOT NULL";
            $sql .= " and CAST(sales_order_paid_per_product AS DECIMAL(10, 2)) != 0 ";
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
            $sql .= " order by DATE(sales_order_date) desc, ";
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
    public function readCashierLimit($allowedColumns)
    {
        $params = [
            ...$this->userId != 0 ? ["sales_order_received_by_id" => $this->userId] : [],
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

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "(sales_order_paid_per_product + sales_order_balance_per_product) as total_amount_per_product, ";
            $sql .= "sales_order_number, ";
            $sql .= "sales_order_status as is_status, ";
            $sql .= "sales_order_total_receivable_amount as total_amount, ";
            $sql .= "sales_order_total_amount as total_sub_amount, ";
            $sql .= "sales_order_paid_amount as total_paid, ";
            $sql .= "sales_order_cash as total_paid_in_cash, ";
            $sql .= "sales_order_aid as id, ";
            $sql .= "sales_order_is_active as is_active, ";
            $sql .= "sales_order_date as order_date, ";
            $sql .= "DATE_FORMAT(sales_order_date, '%b %d, %Y') as sales_order_date, ";
            $sql .= "DATE_FORMAT(sales_order_due_date, '%b %d, %Y') as sales_order_due_date, ";
            $sql .= "sales_order_customer_name as name ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= " WHERE sales_order_cash != 0 and sales_order_cash IS NOT NULL";
            $sql .= " and CAST(sales_order_paid_per_product AS DECIMAL(10, 2)) != 0 ";
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
}
