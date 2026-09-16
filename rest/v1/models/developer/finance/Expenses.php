<?php
class Expenses
{
    public $purchase_order_aid;
    public $purchase_order_number;
    public $purchase_order_supplier_id;
    public $purchase_order_supplier_name;
    public $purchase_order_date;
    public $purchase_order_expected_delivery;
    public $purchase_order_total_amount;
    public $purchase_order_payment;
    public $purchase_order_payment_method;
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

    public $userId;
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
        // this column (formated_date), not the real underlying column
        // name - aliases aren't visible to a WHERE clause, so map it back
        $columnAliasMap = [
            "formated_date" => "purchase_order_date",
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
            ...$this->userId != 0 ? ["purchase_order_product_owner_id" => $this->userId] : [],
            ...$this->column_search != "" ? [
                "purchase_order_number" => "%{$this->column_search}%",
                "purchase_order_supplier_name" => "%{$this->column_search}%",
                "purchase_order_product_owner_name" => "%{$this->column_search}%",
                "purchase_order_product_name" => "%{$this->column_search}%",
            ] : [],
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select spo.*, ";
            $sql .= "s.suppliers_delivery, ";
            $sql .= "DATE_FORMAT(spo.purchase_order_date, '%b %d, %Y') as formated_date, ";
            $sql .= "DATE_FORMAT(spo.purchase_order_expected_delivery, '%b %d, %Y') as formated_delivery_date, ";
            $sql .= "s.suppliers_is_default as is_view, ";
            $sql .= "spo.purchase_order_aid as id, ";
            $sql .= "spo.purchase_order_status as is_status, ";
            $sql .= "spo.purchase_order_payment_status as payment_status, ";
            $sql .= "spo.purchase_order_is_active as is_active, ";
            $sql .= "spo.purchase_order_price as amount, ";
            $sql .= "spo.purchase_order_total_amount_per_product as total_amount, ";
            $sql .= "spo.purchase_order_number as name ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} as spo, ";
            $sql .= "{$this->tblSuppliers} as s ";
            $sql .= " where spo.purchase_order_supplier_id = s.suppliers_aid ";
            // Expenses are purchase orders recorded against the fixed "Other
            // operating expenses" supplier (see readOtherSupplier() in
            // Suppliers.php / SuppliersProduct.php, used by this module's own
            // create.php/update.php) - the same marker SuppliersPurchaseOrder
            // excludes (!= 1) to keep expense entries out of the real
            // Purchase Orders list. Filtering by paid amount here instead
            // hid legitimate unpaid/partially-paid expenses (e.g. PO-008)
            // from their own list.
            $sql .= " and s.suppliers_is_default = 1 ";
            $sql .= ($this->userId != 0 ? "and spo.purchase_order_product_owner_id = :purchase_order_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (spo.purchase_order_number like :purchase_order_number
                or spo.purchase_order_supplier_name like :purchase_order_supplier_name
                or spo.purchase_order_product_owner_name like :purchase_order_product_owner_name
                or spo.purchase_order_product_name like :purchase_order_product_name) " : " ");
            }
            $sql .= " order by spo.purchase_order_is_active desc, ";
            $sql .= " spo.purchase_order_aid desc ";
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
            ...$this->column_search != "" ? [
                "purchase_order_number" => "%{$this->column_search}%",
                "purchase_order_supplier_name" => "%{$this->column_search}%",
                "purchase_order_product_owner_name" => "%{$this->column_search}%",
                "purchase_order_product_name" => "%{$this->column_search}%",
            ] : [],
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select spo.*, ";
            $sql .= "s.suppliers_delivery, ";
            $sql .= "DATE_FORMAT(spo.purchase_order_date, '%b %d, %Y') as formated_date, ";
            $sql .= "DATE_FORMAT(spo.purchase_order_expected_delivery, '%b %d, %Y') as formated_delivery_date, ";
            $sql .= "s.suppliers_is_default as is_view, ";
            $sql .= "spo.purchase_order_aid as id, ";
            $sql .= "spo.purchase_order_status as is_status, ";
            $sql .= "spo.purchase_order_payment_status as payment_status, ";
            $sql .= "spo.purchase_order_is_active as is_active, ";
            $sql .= "spo.purchase_order_price as amount, ";
            $sql .= "spo.purchase_order_total_amount_per_product as total_amount, ";
            $sql .= "spo.purchase_order_number as name ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} as spo, ";
            $sql .= "{$this->tblSuppliers} as s ";
            $sql .= " where spo.purchase_order_supplier_id = s.suppliers_aid ";
            // See readAll() above - expenses are identified by the fixed
            // "Other operating expenses" supplier, not by whether they've
            // been paid yet.
            $sql .= " and s.suppliers_is_default = 1 ";
            $sql .= ($this->userId != 0 ? "and spo.purchase_order_product_owner_id = :purchase_order_product_owner_id " : " ");
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (spo.purchase_order_number like :purchase_order_number
                or spo.purchase_order_supplier_name like :purchase_order_supplier_name
                or spo.purchase_order_product_owner_name like :purchase_order_product_owner_name
                or spo.purchase_order_product_name like :purchase_order_product_name) " : " ");
            }
            $sql .= " order by spo.purchase_order_is_active desc, ";
            $sql .= " spo.purchase_order_aid desc ";
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
