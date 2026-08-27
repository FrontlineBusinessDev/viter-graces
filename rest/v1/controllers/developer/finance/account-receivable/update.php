<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new AccountReceivable($conn);
$valActivity = new ActivityLog($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // check data
    checkPayload($data);
    // get data

    $val->installment_payment_aid = $_GET['id'];
    $val->installment_payment_is_paid = 0;
    // Row's full due amount - was never being read from the payload, so the
    // is_paid check below always compared against 0, marking every payment
    // (partial or full) as fully paid.
    $val->installment_payment_amount = $data["installment_payment_amount"];
    $val->installment_payment_paid_amount = $data["installment_payment_paid_amount"];
    $val->installment_payment_received_id = $data["installment_payment_received_id"];
    $val->installment_payment_received_name = $data["installment_payment_received_name"];
    $val->installment_payment_code_number = $data["installment_payment_code_number"];
    $val->installment_payment_method = $data["installment_payment_method"];
    $val->installment_payment_updated = date("Y-m-d H:i:s");
    $val->sales_order_updated = date("Y-m-d H:i:s");

    if ((float)$val->installment_payment_amount <= (float)$val->installment_payment_paid_amount) {
        $val->installment_payment_is_paid = 1;
    }

    checkId($val->installment_payment_aid);
    // update

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

    $val->sales_order_total_amount = $data["sales_order_total_amount"];
    $val->sales_order_discount = $data["sales_order_discount"];
    $val->sales_order_paid_amount = max($data["totalPaidAmount"], 0);
    $val->sales_order_total_balance_amount = max($data["totalBalanceAmount"], 0);
    $val->sales_order_tax = $data["sales_order_tax"];
    $totalPaidAmount = $val->sales_order_paid_amount;
    $totalBalanceAmount = $val->sales_order_total_balance_amount;

    // CREATE STOCK MOVEMENT 
    // Extract fixed order-level values once outside the loop
    $totalOrderAmount = (float)($val->sales_order_total_amount ?? 0);
    $totalOrderDiscount = (float)($val->sales_order_discount ?? 0);
    $totalPaidAmount = (float)($totalPaidAmount ?? 0);
    $hasBalance = (float)($totalBalanceAmount ?? 0) != 0;
    $taxRate = (float)($val->sales_order_tax ?? 0);

    $installmentItems = $data["installmentItems"];
    usort($installmentItems, fn($a, $b) => strtotime($a['installment_payment_due_date']) <=> strtotime($b['installment_payment_due_date']));
    $val->sales_order_due_date = "";

    foreach ($installmentItems as $item) {
        if ((float)$item['installment_payment_paid_amount'] == 0) {
            $val->sales_order_due_date = date('Y-m-d', strtotime($item['installment_payment_due_date']));
            break; // Stops checking further items once set
        }
    }

    if (
        $val->sales_order_due_date == ""
    ) {

        $val->sales_order_due_date = date("Y-m-d");
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
        $paidPerItem = $val->sales_order_paid_amount ? ($val->sales_order_paid_amount * $share) : 0;
        $remainingPerItem = $val->sales_order_paid_amount ? ($val->sales_order_paid_amount * $share) : 0;

        // Default balance calculation (Exclusive Tax handling)
        if ($taxRate === 0.12) {
            $vatPerItem = $discountedAmount * 0.12;
            $totalVatItem = $discountedAmount * 1.12;
            $val->sales_order_balance_per_product = $totalVatItem - $balancePerItem;
        } else {
            $vatPerItem = 0;
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

    $query = checkUpdate($val);
    $val->lastInsertedId = $data["installment_payment_aid"];
    // Journal entry reflects only THIS transaction's amount, not the row's
    // cumulative paid total (see note above on installment_payment_new_amount).
    $val->sales_order_paid_amount = (float)($data["installment_payment_new_amount"] ?? 0);
    checkCreateSalesJornal($val);
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Account Receivable", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
