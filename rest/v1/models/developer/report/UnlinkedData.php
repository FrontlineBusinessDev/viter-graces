<?php
// Report: records that still point to a user account that no longer exists.
// Reading never changes data. deleteById() permanently deletes ONE orphaned record.
class UnlinkedData
{
    public $connection;
    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $lastInsertedId;

    public $tblUserAccount;
    public $tblActivityLog;
    public $tblProducts;
    public $tblSalesOrder;
    public $tblSuppliersPurchaseOrder;
    public $tblMovementStock;
    public $tblReturnProduct;
    public $tblInstallmentPayment;
    public $tblSalesJournal;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblUserAccount = "graces_user_account";
        $this->tblActivityLog = "graces_activity_log";
        $this->tblProducts = "graces_products";
        $this->tblSalesOrder = "graces_sales_order";
        $this->tblSuppliersPurchaseOrder = "graces_suppliers_purchase_order";
        $this->tblMovementStock = "graces_stock_movement";
        $this->tblReturnProduct = "graces_return_product";
        $this->tblInstallmentPayment = "graces_installment_payment";
        $this->tblSalesJournal = "graces_sales_journal";
    }

    // Records that can be deleted from the report, by the "type" used in the row id (e.g. "products-5").
    // Only links where the user is the OWNER of the record are listed here. Rows that only name the user
    // as "Received By" / "Transacted By" belong to another, existing owner, so they can never be deleted.
    // type => [table, primary key, user link column]
    private function deletableTypes()
    {
        return [
            "activity-log" => [$this->tblActivityLog, "activity_log_aid", "activity_log_user_id"],
            "products" => [$this->tblProducts, "products_aid", "products_owner_id"],
            "sales-order" => [$this->tblSalesOrder, "sales_order_aid", "sales_order_product_owner_id"],
            "purchase-order" => [$this->tblSuppliersPurchaseOrder, "purchase_order_aid", "purchase_order_product_owner_id"],
            "stock-movement" => [$this->tblMovementStock, "stock_movement_aid", "stock_movement_product_owner_id"],
            "returns" => [$this->tblReturnProduct, "return_product_aid", "return_product_owner_id"],
        ];
    }

    // One SELECT per user link. A link only counts when it holds a real id (not NULL, 0 or blank)
    // that has no matching row in the user account table.
    // Columns: row_key, module, linked_as, record_id, reference, details, missing_user_id, missing_user_name, record_date
    private function unlinkedSql()
    {
        $u = $this->tblUserAccount;
        $orphan = fn($col) => "$col is not null and $col != 0 and not exists (select 1 from $u ua where ua.user_account_aid = $col)";
        // $a = alias, everything else is a SQL expression
        $part = fn($key, $module, $linkedAs, $a, $id, $reference, $details, $userId, $userName, $created) =>
            "select concat('$key-', $a.$id) as row_key, '$module' as module, '$linkedAs' as linked_as, $a.$id as record_id, "
            . "$reference as reference, $details as details, cast($userId as char) as missing_user_id, "
            . "$userName as missing_user_name, $created as record_date from ";

        // installment_payment_received_id is a varchar: only numeric, non-zero values are real ids
        $iRecv = "i.installment_payment_received_id";
        $iRecvOk = "$iRecv regexp '^[0-9]+\$' and cast($iRecv as unsigned) != 0 "
            . "and not exists (select 1 from $u ua where ua.user_account_aid = cast($iRecv as unsigned))";

        $parts = [
            $part("activity-log", "Activity Log", "User", "a", "activity_log_aid",
                "concat_ws(' / ', a.activity_log_menu, a.activity_log_action)", "a.activity_log_user_role",
                "a.activity_log_user_id", "a.activity_log_user_name", "a.activity_log_created")
                . "{$this->tblActivityLog} a where " . $orphan("a.activity_log_user_id"),

            $part("products", "Products", "Product Owner", "p", "products_aid",
                "p.products_name", "concat_ws(' | ', p.products_sku, p.products_category)",
                "p.products_owner_id", "p.products_owner_name", "p.products_created")
                . "{$this->tblProducts} p where " . $orphan("p.products_owner_id"),

            $part("sales-order", "Sales Order", "Product Owner", "s", "sales_order_aid",
                "s.sales_order_number", "concat_ws(' | ', s.sales_order_customer_name, s.sales_order_product_name)",
                "s.sales_order_product_owner_id", "s.sales_order_product_owner_name", "s.sales_order_created")
                . "{$this->tblSalesOrder} s where " . $orphan("s.sales_order_product_owner_id"),

            $part("sales-order-received", "Sales Order", "Received By", "s", "sales_order_aid",
                "s.sales_order_number", "concat_ws(' | ', s.sales_order_customer_name, s.sales_order_product_name)",
                "s.sales_order_received_by_id", "s.sales_order_received_by_name", "s.sales_order_created")
                . "{$this->tblSalesOrder} s where " . $orphan("s.sales_order_received_by_id"),

            $part("purchase-order", "Purchase Order", "Product Owner", "o", "purchase_order_aid",
                "o.purchase_order_number", "concat_ws(' | ', o.purchase_order_supplier_name, o.purchase_order_product_name)",
                "o.purchase_order_product_owner_id", "o.purchase_order_product_owner_name", "o.purchase_order_created")
                . "{$this->tblSuppliersPurchaseOrder} o where " . $orphan("o.purchase_order_product_owner_id"),

            $part("purchase-order-transact", "Purchase Order", "Transacted By", "o", "purchase_order_aid",
                "o.purchase_order_number", "concat_ws(' | ', o.purchase_order_supplier_name, o.purchase_order_product_name)",
                "o.purchase_order_transact_id", "o.purchase_order_transact_name", "o.purchase_order_created")
                . "{$this->tblSuppliersPurchaseOrder} o where " . $orphan("o.purchase_order_transact_id"),

            $part("stock-movement", "Stock Movement", "Product Owner", "m", "stock_movement_aid",
                "m.stock_movement_product_name", "concat_ws(' | ', m.stock_movement_type, m.stock_movement_qty)",
                "m.stock_movement_product_owner_id", "m.stock_movement_product_owner_name", "m.stock_movement_created")
                . "{$this->tblMovementStock} m where " . $orphan("m.stock_movement_product_owner_id"),

            $part("returns", "Returns", "Product Owner", "r", "return_product_aid",
                "r.return_product_number", "concat_ws(' | ', r.return_product_order_number, r.return_product_product_name)",
                "r.return_product_owner_id", "r.return_product_owner_name", "r.return_product_created")
                . "{$this->tblReturnProduct} r where " . $orphan("r.return_product_owner_id"),

            $part("installment-received", "Installment Payment", "Received By", "i", "installment_payment_aid",
                "i.installment_payment_code_number", "concat_ws(' | ', i.installment_payment_customer_name, i.installment_payment_amount)",
                "i.installment_payment_received_id", "i.installment_payment_received_name", "i.installment_payment_created")
                . "{$this->tblInstallmentPayment} i where " . $iRecvOk,
        ];

        return implode(" union all ", $parts);
    }

    // WHERE fragments for the search box and the column filters.
    // Only the columns in $allowedColumns can be filtered (it is also what keeps the SQL safe).
    private function buildWhere($allowedColumns, &$params)
    {
        $where = [];

        if ($this->column_search != "") {
            $where[] = "(t.module like :search_module or t.linked_as like :search_linked_as
                or t.reference like :search_reference or t.details like :search_details
                or t.missing_user_name like :search_user_name or t.missing_user_id like :search_user_id)";
            foreach (["module", "linked_as", "reference", "details", "user_name", "user_id"] as $key) {
                $params["search_$key"] = "%{$this->column_search}%";
            }
        }

        foreach (($this->filters ?: []) as $i => $item) {
            if (!isset($item['id']) || !in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = "t." . $item['id'];
            $value = $item['value'] ?? "";

            if (is_array($value)) {
                $selected = array_values(array_filter($value, fn($v) => !is_array($v) && trim((string) $v) !== ""));
                if (empty($selected)) {
                    continue;
                }
                $placeholders = [];
                foreach ($selected as $j => $selectedValue) {
                    $key = "filter{$i}_{$j}";
                    $placeholders[] = ":$key";
                    $params[$key] = trim($selectedValue);
                }
                $where[] = "$col in (" . implode(", ", $placeholders) . ")";
            } elseif (trim((string) $value) !== "") {
                $where[] = "$col like :filter$i";
                $params["filter$i"] = "%" . trim($value) . "%";
            }
        }

        return $where;
    }

    private function run($allowedColumns, $limit)
    {
        $params = [];
        $where = $this->buildWhere($allowedColumns, $params);
        try {
            $sql = "select t.row_key as id, concat(t.module, ': ', t.reference) as name, ";
            $sql .= "t.module, t.linked_as, t.record_id, t.reference, t.details, ";
            $sql .= "t.missing_user_id, t.missing_user_name, ";
            $sql .= "date_format(t.record_date, '%b %d, %Y %h:%i %p') as record_date ";
            $sql .= "from (" . $this->unlinkedSql() . ") as t ";
            if (!empty($where)) {
                $sql .= "where " . implode(" and ", $where) . " ";
            }
            $sql .= "order by t.record_date desc, t.module asc, t.record_id desc ";
            if ($limit) {
                $sql .= "limit :start, :total ";
                $params["start"] = (int) $this->column_start - 1;
                $params["total"] = (int) $this->column_total;
            }
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // all rows (used for the total count)
    public function readAll($allowedColumns)
    {
        return $this->run($allowedColumns, false);
    }

    // one page of rows
    public function readLimit($allowedColumns)
    {
        return $this->run($allowedColumns, true);
    }

    // Permanently delete ONE orphaned record. $rowId looks like "products-5" (the id sent by the report).
    // Safety rules:
    //  - only the owner links in deletableTypes() can be deleted ("Received By" rows never can);
    //  - the record must STILL be orphaned: if its user exists again, nothing is deleted;
    //  - for a sales order line, the journal and installment payments of its order number are deleted too,
    //    but only when no other line of that order is left (another owner may still have lines in it).
    // Everything runs in one transaction. Throws RuntimeException with a message for the user when it
    // cannot delete; returns the PDOStatement of the delete on success, false on a database error.
    public function deleteById($rowId)
    {
        if (!preg_match('/^([a-z-]+)-([0-9]+)$/', (string) $rowId, $m) || !isset($this->deletableTypes()[$m[1]])) {
            throw new RuntimeException("This record cannot be deleted here.");
        }
        [$table, $pk, $userColumn] = $this->deletableTypes()[$m[1]];
        $aid = (int) $m[2];

        try {
            $this->connection->beginTransaction();

            $check = $this->connection->prepare(
                "select * from {$table} t where t.{$pk} = :aid and t.{$userColumn} is not null and t.{$userColumn} != 0
                and not exists (select 1 from {$this->tblUserAccount} ua where ua.user_account_aid = t.{$userColumn}) for update"
            );
            $check->execute(["aid" => $aid]);
            $record = $check->fetch();
            if (!$record) {
                $this->connection->rollBack();
                throw new RuntimeException("This record was not found or is already linked to an existing user account.");
            }

            $query = $this->connection->prepare("delete from {$table} where {$pk} = :aid");
            $query->execute(["aid" => $aid]);

            if ($m[1] === "sales-order") {
                $number = $record["sales_order_number"];
                $left = $this->connection->prepare("select 1 from {$this->tblSalesOrder} where sales_order_number = :number limit 1");
                $left->execute(["number" => $number]);
                if ($left->rowCount() === 0) {
                    $this->connection->prepare("delete from {$this->tblSalesJournal} where sales_journal_order_number = :number")
                        ->execute(["number" => $number]);
                    $this->connection->prepare("delete from {$this->tblInstallmentPayment} where installment_payment_code_number = :number")
                        ->execute(["number" => $number]);
                }
            }

            $this->connection->commit();
            return $query;
        } catch (PDOException $ex) {
            if ($this->connection->inTransaction()) {
                $this->connection->rollBack();
            }
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            return false;
        }
    }
}
