<?php
class SalesJournal
{

    public $sales_journal_aid;
    public $sales_journal_order_number;
    public $sales_journal_order_id;
    public $sales_journal_debit;
    public $sales_journal_credit;
    public $sales_journal_balance;
    public $sales_journal_method;
    public $sales_journal_date;
    public $sales_journal_create;
    public $sales_journal_update;

    public $date_today;
    public $date_yesterday;

    public $connection;
    public $lastInsertedId;
    public $tblSalesJournal;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;



    public function __construct($db)
    {
        $this->connection = $db;
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
            ...($this->column_search != "" ? [
                "sales_journal_order_number" => "%{$this->column_search}%",
                "sales_journal_customer" => "%{$this->column_search}%",
            ] : []),
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "DATE_FORMAT(sales_journal_date, '%b %d, %Y') as sales_journal_date ";
            $sql .= "from {$this->tblSalesJournal} ";
            $sql .= " where (CAST(sales_journal_debit AS DECIMAL(10, 2)) != 0 ";
            $sql .= " or CAST(sales_journal_credit AS DECIMAL(10, 2)) != 0) ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_journal_customer like :sales_journal_customer
            or sales_journal_order_number like :sales_journal_order_number ) " : " ");
            }
            $sql .= " order by sales_journal_aid desc ";
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
            ...($this->column_search != "" ? [
                "sales_journal_order_number" => "%{$this->column_search}%",
                "sales_journal_customer" => "%{$this->column_search}%",
            ] : []),
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "DATE_FORMAT(sales_journal_date, '%b %d, %Y') as sales_journal_date ";
            $sql .= "from {$this->tblSalesJournal} ";
            $sql .= " where (CAST(sales_journal_debit AS DECIMAL(10, 2)) != 0 ";
            $sql .= " or CAST(sales_journal_credit AS DECIMAL(10, 2)) != 0) ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_journal_customer like :sales_journal_customer
            or sales_journal_order_number like :sales_journal_order_number ) " : " ");
            }
            $sql .= " order by sales_journal_aid desc ";
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
