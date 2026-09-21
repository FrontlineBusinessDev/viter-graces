<?php
class FinanceReturns
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

    public $date_today;
    public $date_yesterday;
    public $userId;

    public $connection;
    public $lastInsertedId;
    public $tblReturnProducts;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;



    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblReturnProducts = "graces_return_product";
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

            if (is_array($value) && array_key_exists('min', $value)) {
                $params["min$i"] = (float) $value['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $value['max'] === ""
                    ? (float) $this->max
                    : (float) $value['max'];
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
            ...$this->userId != 0 ? ["return_product_owner_id" => $this->userId] : [],
            ...($this->column_search != "" ? [
                "return_product_number" => "%{$this->column_search}%",
                "return_product_order_number" => "%{$this->column_search}%",
                "return_product_customer_name" => "%{$this->column_search}%",
                "return_product_product_name" => "%{$this->column_search}%",
                "return_product_owner_name" => "%{$this->column_search}%",
            ] : []),
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "return_product_aid as id, ";
            $sql .= "return_product_status as is_status, ";
            $sql .= "SUM(return_product_paid_amount) as return_product_paid_amount, ";
            $sql .= "SUM(return_product_amount) as return_product_amount, ";
            $sql .= "DATE_FORMAT(return_product_date, '%b %d, %Y') as return_product_date, ";
            $sql .= "return_product_number as name ";
            $sql .= "from {$this->tblReturnProducts} ";
            $sql .= " where true ";
            $sql .= ($this->userId != 0 ? "and return_product_owner_id = :return_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn) . " ";
            } else {
                $sql .= ($this->column_search != "" ? "and ( return_product_number like :return_product_number
            or return_product_order_number like :return_product_order_number
            or return_product_customer_name like :return_product_customer_name
            or return_product_product_name like :return_product_product_name
            or return_product_owner_name like :return_product_owner_name ) " : " ");
            }
            $sql .= " group by return_product_customer_id, ";
            $sql .= " return_product_status, ";
            $sql .= " return_product_resolution_type, ";
            $sql .= " return_product_refund_method, ";
            $sql .= " return_product_owner_id ";
            $sql .= " order by CASE WHEN LOWER(return_product_status) = 'processed' THEN 1 ELSE 0 END asc, ";
            $sql .= "return_product_status asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read limit
    public function readLimit($allowedColumns)
    {
        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->userId != 0 ? ["return_product_owner_id" => $this->userId] : [],
            ...($this->column_search != "" ? [
                "return_product_number" => "%{$this->column_search}%",
                "return_product_order_number" => "%{$this->column_search}%",
                "return_product_customer_name" => "%{$this->column_search}%",
                "return_product_product_name" => "%{$this->column_search}%",
                "return_product_owner_name" => "%{$this->column_search}%",
            ] : []),
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "return_product_aid as id, ";
            $sql .= "return_product_status as is_status, ";
            $sql .= "SUM(return_product_paid_amount) as return_product_paid_amount, ";
            $sql .= "SUM(return_product_amount) as return_product_amount, ";
            $sql .= "DATE_FORMAT(return_product_date, '%b %d, %Y') as return_product_date, ";
            $sql .= "return_product_number as name ";
            $sql .= "from {$this->tblReturnProducts} ";
            $sql .= " where true ";
            $sql .= ($this->userId != 0 ? "and return_product_owner_id = :return_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn) . " ";
            } else {
                $sql .= ($this->column_search != "" ? "and ( return_product_number like :return_product_number
            or return_product_order_number like :return_product_order_number
            or return_product_customer_name like :return_product_customer_name
            or return_product_product_name like :return_product_product_name
            or return_product_owner_name like :return_product_owner_name ) " : " ");
            }
            $sql .= " group by return_product_customer_id, ";
            $sql .= " return_product_status, ";
            $sql .= " return_product_resolution_type, ";
            $sql .= " return_product_refund_method, ";
            $sql .= " return_product_owner_id ";
            $sql .= " order by CASE WHEN LOWER(return_product_status) = 'processed' THEN 1 ELSE 0 END asc, ";
            $sql .= "return_product_status asc ";
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
