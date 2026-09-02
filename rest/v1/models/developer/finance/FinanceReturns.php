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

    // read all
    public function readAll($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...($this->column_search != "" ? [
                "return_product_number" => "%{$this->column_search}%",
                "return_product_order_number" => "%{$this->column_search}%",
                "return_product_customer_name" => "%{$this->column_search}%",
                "return_product_product_name" => "%{$this->column_search}%",
                "return_product_owner_name" => "%{$this->column_search}%",
            ] : []),
        ];

        foreach ($this->filters as $i => $item) {
            // "is_status" here is filtered as a composite of return_product_status
            // and return_product_resolution_type (Pending/Refunded/Open/Completed/Rejected)
            // - not a real column, so it needs its own WHERE clause instead of a LIKE.
            if ($item['id'] === 'is_status') {
                $filterColumn[] = displayStatusCondition($item['value']);
                continue;
            }
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
            $sql .= "return_product_aid as id, ";
            // is_status carries the human status Finance shows (Pending/Rejected
            // apply regardless of resolution; once processed, the label depends on
            // how the return was resolved - Refunded, Open for an available credit
            // memo, or Completed for a replacement).
            $sql .= "case ";
            $sql .= "when return_product_status = 'pending' then 'pending' ";
            $sql .= "when return_product_status = 'rejected' then 'rejected' ";
            $sql .= "when return_product_status = 'processed' and return_product_resolution_type = 'refund' then 'refunded' ";
            $sql .= "when return_product_status = 'processed' and return_product_resolution_type = 'credit memo' then 'open' ";
            $sql .= "when return_product_status = 'processed' and return_product_resolution_type = 'replacement' then 'completed' ";
            $sql .= "else return_product_status ";
            $sql .= "end as is_status, ";
            $sql .= "DATE_FORMAT(return_product_date, '%b %d, %Y') as return_product_date, ";
            $sql .= "return_product_number as name ";
            $sql .= "from {$this->tblReturnProducts} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn) . " ";
            } else {
                $sql .= ($this->column_search != "" ? "and ( return_product_number like :return_product_number
            or return_product_order_number like :return_product_order_number
            or return_product_customer_name like :return_product_customer_name
            or return_product_product_name like :return_product_product_name
            or return_product_owner_name like :return_product_owner_name ) " : " ");
            }
            $sql .= " order by return_product_aid desc ";
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
        $filterColumn = [];
        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...($this->column_search != "" ? [
                "return_product_number" => "%{$this->column_search}%",
                "return_product_order_number" => "%{$this->column_search}%",
                "return_product_customer_name" => "%{$this->column_search}%",
                "return_product_product_name" => "%{$this->column_search}%",
                "return_product_owner_name" => "%{$this->column_search}%",
            ] : []),
        ];

        foreach ($this->filters as $i => $item) {
            // "is_status" here is filtered as a composite of return_product_status
            // and return_product_resolution_type (Pending/Refunded/Open/Completed/Rejected)
            // - not a real column, so it needs its own WHERE clause instead of a LIKE.
            if ($item['id'] === 'is_status') {
                $filterColumn[] = displayStatusCondition($item['value']);
                continue;
            }
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
            $sql .= "return_product_aid as id, ";
            // is_status carries the human status Finance shows (Pending/Rejected
            // apply regardless of resolution; once processed, the label depends on
            // how the return was resolved - Refunded, Open for an available credit
            // memo, or Completed for a replacement).
            $sql .= "case ";
            $sql .= "when return_product_status = 'pending' then 'pending' ";
            $sql .= "when return_product_status = 'rejected' then 'rejected' ";
            $sql .= "when return_product_status = 'processed' and return_product_resolution_type = 'refund' then 'refunded' ";
            $sql .= "when return_product_status = 'processed' and return_product_resolution_type = 'credit memo' then 'open' ";
            $sql .= "when return_product_status = 'processed' and return_product_resolution_type = 'replacement' then 'completed' ";
            $sql .= "else return_product_status ";
            $sql .= "end as is_status, ";
            $sql .= "DATE_FORMAT(return_product_date, '%b %d, %Y') as return_product_date, ";
            $sql .= "return_product_number as name ";
            $sql .= "from {$this->tblReturnProducts} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn) . " ";
            } else {
                $sql .= ($this->column_search != "" ? "and ( return_product_number like :return_product_number
            or return_product_order_number like :return_product_order_number
            or return_product_customer_name like :return_product_customer_name
            or return_product_product_name like :return_product_product_name
            or return_product_owner_name like :return_product_owner_name ) " : " ");
            }
            $sql .= " order by return_product_aid desc ";
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
