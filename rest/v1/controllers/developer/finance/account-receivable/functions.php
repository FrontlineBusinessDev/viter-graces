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
        // status_text is a computed CASE-expression alias - mapped back to
        // the identical CASE expression via $columnAliasMap in
        // AccountReceivable.php's buildFilterColumns() before it reaches
        // the WHERE clause. days_overdue has no filter UI and is left out.
        "status_text",
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

// Read all cashier
function checkReadCashierAll($object, $allowedColumns = [])
{
    $query = $object->readCashierAll($allowedColumns);
    checkQuery($query, "Empty records. (read All)");
    return $query;
}

// Read limit cashier
function checkReadCashierLimit($object, $allowedColumns = [])
{
    $query = $object->readCashierLimit($allowedColumns);
    checkQuery($query, "Empty records. (limit)");
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
        // Returns::update() writes these columns on every call - carry them
        // through so this consumption-only update doesn't blank them out.
        $returnsObject->return_product_resolution_type = $row['return_product_resolution_type'];
        $returnsObject->return_product_refund_method = $row['return_product_refund_method'];
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

// Applies the accounting side effects of one installment payment - cash/check/
// online breakdown, credit memo consumption, per-product balance recompute,
// order status, and next due date - shared by update.php (paying an existing
// installment row) and create.php (recording a brand-new ad-hoc payment for a
// Flexible-type order). $val must already carry installment_payment_aid /
// installment_payment_new_amount-relevant fields; this only touches the
// sales_order side.
function applyOrderPaymentEffects($val, $data, $valReturns)
{
    $ordersItems = getResultData($val->readAllSaleByOrderNumber());
    if (count($ordersItems) == 0) {
        $ordersItems = [];
    }

    $val->sales_order_customer_name = $data["sales_order_customer_name"];
    $val->sales_order_customer_id = $data["sales_order_customer_id"];
    $val->sales_order_number = $data["sales_order_number"];
    $val->sales_order_payment_method = $data["sales_order_payment_method"];
    $val->sales_order_total_receivable_amount = 0;

    // PAYMENT METHOD BREAKDOWN
    // Increment sales_order_cash/check/online_transaction on top of whatever the
    // order already has, based on which method was used for THIS payment (not
    // necessarily the order's original payment method).
    $existingCash = (float)($ordersItems[0]['sales_order_cash'] ?? 0);
    $existingCheck = (float)($ordersItems[0]['sales_order_check'] ?? 0);
    $existingOnline = (float)($ordersItems[0]['sales_order_online_transaction'] ?? 0);
    // Use the delta (this transaction only), not installment_payment_paid_amount
    // (the row's cumulative total) - otherwise a second partial payment on the
    // same row would double-count the first one into these balances.
    $paymentAmount = (float)($data['installment_payment_new_amount'] ?? 0);
    $cashDelta = 0;
    $checkDelta = 0;
    $onlineDelta = 0;

    if ($val->sales_order_payment_method === 'cash') {
        $cashDelta = $paymentAmount;
    } elseif ($val->sales_order_payment_method === 'check') {
        $checkDelta = $paymentAmount;
    } elseif ($val->sales_order_payment_method === 'online transaction') {
        $onlineDelta = $paymentAmount;
    } elseif ($val->sales_order_payment_method === 'mutiple payment') {
        $cashDelta = (float)($data['payment_cash_amount'] ?? 0);
        $checkDelta = (float)($data['payment_check_amount'] ?? 0);
        $onlineDelta = (float)($data['payment_online_amount'] ?? 0);
    }

    $val->sales_order_cash = $existingCash + $cashDelta;
    $val->sales_order_check = $existingCheck + $checkDelta;
    $val->sales_order_online_transaction = $existingOnline + $onlineDelta;

    // Credit memo: consume this payment's amount from the customer's
    // available credit memo balance (oldest processed return first) so it
    // can't be spent again elsewhere.
    if ($val->sales_order_payment_method === 'credit memo') {
        applyCreditMemoForCollection($valReturns, $val->sales_order_customer_id, $paymentAmount);
    }

    $val->sales_order_total_amount = $data["sales_order_total_amount"];
    $val->sales_order_discount = $data["sales_order_discount"];
    $val->sales_order_paid_amount = max($data["totalPaidAmount"], 0);
    $val->sales_order_total_balance_amount = max($data["totalBalanceAmount"], 0);
    $val->sales_order_tax = $data["sales_order_tax"];
    $totalPaidAmount = $val->sales_order_paid_amount;
    $totalBalanceAmount = $val->sales_order_total_balance_amount;

    // Extract fixed order-level values once outside the loop
    $totalOrderAmount = (float)($val->sales_order_total_amount ?? 0);
    $totalOrderDiscount = (float)($val->sales_order_discount ?? 0);
    $totalPaidAmount = (float)($totalPaidAmount ?? 0);
    $hasBalance = (float)($totalBalanceAmount ?? 0) != 0;
    $taxRate = (float)($val->sales_order_tax ?? 0);

    $installmentItems = $data["installmentItems"] ?? [];
    usort($installmentItems, fn($a, $b) => strtotime($a['installment_payment_due_date']) <=> strtotime($b['installment_payment_due_date']));
    $val->sales_order_due_date = "";

    foreach ($installmentItems as $item) {
        if ((float)$item['installment_payment_paid_amount'] == 0) {
            $val->sales_order_due_date = date('Y-m-d', strtotime($item['installment_payment_due_date']));
            break; // Stops checking further items once set
        }
    }

    // No unpaid schedule row to advance to - this is the normal case for
    // Due On Receipt / Net-terms orders (and a fully-settled fixed Installment
    // plan), since graces_installment_payment no longer gets a row for those
    // terms (see installmentDetails() in sales-order/functions.php). Keep the
    // due date already on graces_sales_order instead of resetting it to
    // today's date.
    if ($val->sales_order_due_date == "") {
        $existingDueDate = $ordersItems[0]['sales_order_due_date'] ?? null;
        $val->sales_order_due_date = $existingDueDate
            ? date('Y-m-d', strtotime($existingDueDate))
            : date("Y-m-d");
    }

    foreach ($ordersItems as $item) {
        // Map item properties directly
        $val->sales_order_aid = $item["sales_order_aid"];
        $val->sales_order_price = (float)$item["sales_order_price"];
        $val->sales_order_total = (float)$item["sales_order_total"];

        // 1. Financial Calculations
        // Prevent division by zero if $totalOrderAmount is 0
        $share = ($totalOrderAmount > 0) ? ($val->sales_order_total / $totalOrderAmount) : 0;

        $discountPerItem = ($totalOrderDiscount != 0) ? ($totalOrderDiscount * $share) : 0;
        $discountedAmount = $val->sales_order_total - $discountPerItem;

        $balancePerItem = $hasBalance ? ($totalPaidAmount * $share) : 0;
        $remainingPerItem = $val->sales_order_paid_amount ? ($val->sales_order_paid_amount * $share) : 0;

        // Default balance calculation (Exclusive Tax handling)
        if ($taxRate === 0.12) {
            $totalVatItem = $discountedAmount * 1.12;
            $val->sales_order_balance_per_product = $totalVatItem - $balancePerItem;
        } else {
            $val->sales_order_balance_per_product = $discountedAmount - $balancePerItem;
        }

        $val->sales_order_paid_per_product = max(0, $remainingPerItem);

        if ((float)$balancePerItem <= 0) {
            $val->sales_order_balance_per_product = 0;
        }

        if ($totalPaidAmount >= 0) {
            $val->sales_order_status = "partial";
        }

        if ($totalBalanceAmount <= 0) {
            $val->sales_order_status = "paid";
            $val->sales_order_paid_amount = (float)$item['sales_order_total_receivable_amount'];
        }

        if ($totalPaidAmount <= 0) {
            $val->sales_order_status = "unpaid";
        }

        checkUpdateSales($val);
    }
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
