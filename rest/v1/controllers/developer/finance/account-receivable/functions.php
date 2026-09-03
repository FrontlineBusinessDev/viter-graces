<?php

// check association
function allowedColumns()
{
    $query = [
        "sales_order_aid",
        "sales_order_status",
        "sales_order_is_active",
        "sales_order_number",
        "sales_order_date",
        "sales_order_customer_id",
        "sales_order_customer_name",
        "sales_order_payment_method",
        "sales_order_product_id",
        "sales_order_product_name",
        "sales_order_qty",
        "sales_order_price",
        "sales_order_total",
        "sales_order_discount",
        "sales_order_tax",
        "sales_order_paid_amount",
        "sales_order_notes",
        "sales_order_received_by_id",
        "sales_order_received_by_name",
        "sales_order_product_owner_id",
        "sales_order_product_owner_name",
        "sales_order_installment",
        "sales_order_due_date",
        "sales_order_total_receivable_amount",
        "sales_order_payment_method",
        "sales_order_paid_per_product",
        "sales_order_total_balance_amount",
        // "status_text" and "days_overdue" are computed CASE-expression
        // aliases and can't be referenced in a WHERE clause
        "name",
        "id",
        "order_date",
        "is_active",
        "total_paid",
        "total_sub_amount",
        "total_amount",
        "is_status",
    ];
    return $query;
}

// Consumes $amount from the customer's available credit memo balance,
// oldest processed credit-memo return first. Mirrors the FIFO consumption in
// sales-order/functions.php's applyCreditMemoToReturns(), but kept as its
// own one-directional copy here (a payment collection only ever consumes,
// never releases, so it doesn't need that function's release-on-edit branch)
// to avoid requiring sales-order/functions.php, which would redeclare this
// file's own allowedColumns().
function applyCreditMemoForCollection($returnsObject, $customerId, $amount)
{
    if ($amount <= 0) {
        return;
    }

    $returnsObject->return_product_customer_id = $customerId;
    $query = $returnsObject->readCreditMemoReturnsByCustomerId();
    $returns = $query ? getResultData($query) : [];

    $remaining = $amount;

    foreach ($returns as $row) {
        if ($remaining <= 0) {
            break;
        }

        $rowAmount = (float)$row['return_product_amount'];
        $rowPaid = (float)$row['return_product_paid_amount'];
        $available = $rowAmount - $rowPaid;

        if ($available <= 0) {
            continue;
        }

        $applied = min($available, $remaining);
        $remaining -= $applied;

        $returnsObject->return_product_aid = $row['return_product_aid'];
        $returnsObject->return_product_status = $row['return_product_status'];
        $returnsObject->return_product_paid_amount = $rowPaid + $applied;
        $returnsObject->return_product_updated = date("Y-m-d H:i:s");
        checkUpdate($returnsObject);
    }
}

// Update Sales
function checkUpdateSales($object)
{
    $query = $object->updateSales();
    checkQuery($query, "There's a problem processing your request. (Update Sales)");
    return $query;
}

// Read YEARLY
function checkReadAllSales($object)
{
    $query = $object->readAllSales();
    checkQuery($query, "Empty records. (Read All Sales)");
    return $query;
}
// Read YEARLY
function checkReadLastSalesJournal($object)
{
    $query = $object->readLastSalesJournal();
    checkQuery($query, "Empty records. (Read Last Sales Journal)");
    return $query;
}

// Create 
function checkCreateSalesJornal($object)
{
    $now = date("Y-m-d H:i:s");

    // Bulk mapping repeated properties
    $object->sales_journal_customer = $object->sales_order_customer_name;
    $object->sales_journal_customer_id = $object->sales_order_customer_id;
    $object->sales_journal_order_number = $object->sales_order_number;
    $object->sales_journal_order_id = $object->lastInsertedId;
    $object->sales_journal_method = $object->sales_order_payment_method;
    $object->sales_journal_date = date("Y-m-d");
    $object->sales_journal_create = $now;
    $object->sales_journal_update = $now;
    $object->sales_journal_from = "sales-order";
    $object->sales_journal_note = "";

    $paidAmount = max((float)$object->sales_order_paid_amount, 0);

    $jornalCreditQuery = getResultData(checkReadLastSalesJournal($object))[0] ?? [];
    if (!empty($jornalCreditQuery)) {
        $lastBalance = (float)($jornalCreditQuery['sales_journal_balance'] ?? 0);

        if ($paidAmount > 0) {
            $object->sales_journal_debit = 0;
            $object->sales_journal_credit = $paidAmount;
            $object->sales_journal_balance = $lastBalance - $paidAmount;
            $query = $object->createSalesJornal();
        }
    }

    checkQuery($query, "There's a problem processing your request. (create Sales Jornal)");
    return $query;
}
