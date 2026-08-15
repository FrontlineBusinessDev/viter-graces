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

    // read all
    public function readAll($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...($this->column_search != "" ? [
                "sales_journal_order_number" => "%{$this->column_search}%",
                "sales_journal_customer" => "%{$this->column_search}%",
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
            $sql .= "DATE_FORMAT(sales_journal_date, '%b %d, %Y') as sales_journal_date ";
            $sql .= "from {$this->tblSalesJournal} ";
            $sql .= " where (CAST(sales_journal_debit AS DECIMAL(10, 2)) != 0 ";
            $sql .= " or CAST(sales_journal_credit AS DECIMAL(10, 2)) != 0) ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_journal_customer like :sales_journal_customer 
            or sales_journal_order_number like :sales_journal_order_number " : " ");
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
        $filterColumn = [];
        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...($this->column_search != "" ? [
                "sales_journal_order_number" => "%{$this->column_search}%",
                "sales_journal_customer" => "%{$this->column_search}%",
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
            $sql .= "DATE_FORMAT(sales_journal_date, '%b %d, %Y') as sales_journal_date ";
            $sql .= "from {$this->tblSalesJournal} ";
            $sql .= " where (CAST(sales_journal_debit AS DECIMAL(10, 2)) != 0 ";
            $sql .= " or CAST(sales_journal_credit AS DECIMAL(10, 2)) != 0) ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( sales_journal_customer like :sales_journal_customer 
            or sales_journal_order_number like :sales_journal_order_number " : " ");
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
