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

    // Builds the "columnFilters" WHERE fragments shared by every read*()
    // method below, and writes the matching bound params into &$params.
    // - {min, max} value  -> numeric BETWEEN (e.g. price/cost/stocks range)
    // - array value       -> multi-select OR match via IN (...)
    // - plain value       -> single LIKE match (legacy single-select filter)
    private function buildFilterColumns($allowedColumns, &$params)
    {
        $filterColumn = [];

        // the frontend sends the filter id matching the SELECT alias for
        // this column (payment_status), not the real underlying column
        // name - aliases aren't visible to a WHERE clause, so map it back
        $columnAliasMap = [
            "payment_status" => "purchase_order_payment_status",
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
    public function readByPurchaseNumber($allowedColumns)
    {
        $params = [
            "purchase_order_number" => $this->purchase_order_number,
            ...$this->column_search != "" ? [
                "purchase_order_number" => "%{$this->column_search}%",
                "purchase_order_supplier_name" => "%{$this->column_search}%",
                "purchase_order_product_owner_name" => "%{$this->column_search}%",
                "purchase_order_product_name" => "%{$this->column_search}%",
            ] : [],
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
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
            $sql .= " and purchase_order_number = :purchase_order_number ";
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
    public function readAll($allowedColumns)
    {
        $params = [
            ...$this->column_search != "" ? [
                "purchase_order_number" => "%{$this->column_search}%",
                "purchase_order_supplier_name" => "%{$this->column_search}%",
                "purchase_order_product_owner_name" => "%{$this->column_search}%",
                "purchase_order_product_name" => "%{$this->column_search}%",
            ] : [],
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "DATE_FORMAT(purchase_order_date, '%b %d, %Y') as purchase_order_date, ";
            $sql .= "DATE_FORMAT(purchase_order_expected_delivery, '%b %d, %Y') as purchase_order_expected_delivery, ";
            $sql .= "purchase_order_status as status, ";
            $sql .= "purchase_order_payment_status as payment_status, ";
            $sql .= "SUM(purchase_order_total_amount_per_product) as amount, ";
            $sql .= "SUM(purchase_order_total_amount_per_product) as paid_amount, ";
            $sql .= "SUM(purchase_order_total_balance_per_product) as balance_amount, ";
            $sql .= "GROUP_CONCAT(DISTINCT purchase_order_product_name ORDER BY purchase_order_product_name SEPARATOR ', ') as purchase_order_product_name, ";
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
            $sql .= " group by purchase_order_number ";
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

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "DATE_FORMAT(purchase_order_date, '%b %d, %Y') as purchase_order_date, ";
            $sql .= "DATE_FORMAT(purchase_order_expected_delivery, '%b %d, %Y') as purchase_order_expected_delivery, ";
            $sql .= "purchase_order_status as status, ";
            $sql .= "purchase_order_payment_status as payment_status, ";
            $sql .= "SUM(purchase_order_total_amount_per_product) as amount, ";
            $sql .= "SUM(purchase_order_total_paid_per_product) as paid_amount, ";
            $sql .= "SUM(purchase_order_total_balance_per_product) as balance_amount, ";
            $sql .= "GROUP_CONCAT(DISTINCT purchase_order_product_name ORDER BY purchase_order_product_name SEPARATOR ', ') as purchase_order_product_name, ";
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
            $sql .= " group by purchase_order_number ";
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


    // update
    public function update()
    {
        try {
            $sql = "update {$this->tblSuppliersPurchaseOrder} set ";
            $sql .= "purchase_order_status = :purchase_order_status, ";
            $sql .= "purchase_order_payment = :purchase_order_payment, ";
            $sql .= "purchase_order_balance = :purchase_order_balance, ";
            $sql .= "purchase_order_total_balance_per_product = :purchase_order_total_balance_per_product, ";
            $sql .= "purchase_order_total_paid_per_product = :purchase_order_total_paid_per_product, ";
            $sql .= "purchase_order_payment_status = :purchase_order_payment_status, ";
            $sql .= "purchase_order_updated = :purchase_order_updated ";
            $sql .= "where purchase_order_aid = :purchase_order_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "purchase_order_status" => $this->purchase_order_status,
                "purchase_order_payment" => $this->purchase_order_payment,
                "purchase_order_balance" => $this->purchase_order_balance,
                "purchase_order_total_balance_per_product" => $this->purchase_order_total_balance_per_product,
                "purchase_order_total_paid_per_product" => $this->purchase_order_total_paid_per_product,
                "purchase_order_payment_status" => $this->purchase_order_payment_status,
                "purchase_order_updated" => $this->purchase_order_updated,
                "purchase_order_aid" => $this->purchase_order_aid,
            ]);
        } catch (PDOException $ex) {

            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
}
