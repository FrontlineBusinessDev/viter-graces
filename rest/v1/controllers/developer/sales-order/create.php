<?php
// check database connection 
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new SalesOrder($conn);
$valActivity = new ActivityLog($conn);
$valReturns = new Returns($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// get should not be present
if (array_key_exists("id", $_GET)) {
    checkEndpoint();
}
// check data
checkPayload($data);
// get data

$val->sales_order_is_active = 1;
$val->sales_order_is_return = 0;
$val->sales_order_status = 'paid';
$val->sales_order_date = $data["sales_order_date"];
$val->sales_order_customer_id = $data["sales_order_customer_id"];
$val->sales_order_customer_name = $data["sales_order_customer_name"];
$val->sales_order_payment_method = $data["sales_order_payment_method"];
$val->sales_order_payment_terms = $data["sales_order_payment_terms"];
$val->sales_order_discount = $data["sales_order_discount"];
$val->sales_order_tax = $data["sales_order_tax"];
$val->sales_order_paid_amount = $data["sales_order_paid_amount"];
$val->sales_order_notes = $data["sales_order_notes"];
$val->sales_order_received_by_id = $data["sales_order_received_by_id"];
$val->sales_order_received_by_name = $data["sales_order_received_by_name"];
$val->sales_order_installment = $data["sales_order_installment"];
$val->sales_order_total_receivable_amount = $data["sales_order_total_receivable_amount"];
$val->sales_order_total_amount = $data["sales_order_total_amount"];
$val->sales_order_tax_amount = $data["sales_order_tax_amount"];
$val->sales_order_total_balance_amount = max(0, $data["sales_order_total_balance_amount"]); // not accepting negative
$val->sales_order_created = date("Y-m-d H:i:s");
$val->sales_order_updated = date("Y-m-d H:i:s");
$val->stock_movement_status = "active";
$val->sales_order_due_date = date("Y-m-d");

$val->sales_order_cash = $data['sales_order_cash'];
$val->sales_order_check = $data['sales_order_check'];
$val->sales_order_online_transaction = $data['sales_order_online_transaction'];
$val->sales_order_credit_memo = $data['sales_order_credit_memo'];
$val->sales_order_installment_type = $data['sales_order_installment_type'];
$val->sales_order_installment_type_day = $data['sales_order_installment_type_day'];
$val->sales_order_installment_count = $data['sales_order_installment_count'];
$val->sales_order_installment_amount = $data['sales_order_installment_amount'];
$val->sales_order_discount_percentage = $data['sales_order_discount_percentage'];
$val->sales_order_discount_type = $data['sales_order_discount_type'];

if ((float)$data["sales_order_paid_amount"] >= (float)$data["sales_order_total_receivable_amount"]) {
    $val->sales_order_paid_amount = $data["sales_order_total_receivable_amount"];
}

if ($val->sales_order_payment_method == "cash") {
    $val->sales_order_cash = $val->sales_order_paid_amount;
}
if ($val->sales_order_payment_method == "check") {
    $val->sales_order_check = $val->sales_order_paid_amount;
}
if ($val->sales_order_payment_method == "online transaction") {
    $val->sales_order_online_transaction = $val->sales_order_paid_amount;
}
if ($val->sales_order_payment_method == "credit memo") {
    $val->sales_order_credit_memo = $val->sales_order_paid_amount;
}

// new order - nothing previously saved, so the full applied amount is the delta
applyCreditMemoToReturns($valReturns, $val->sales_order_customer_id, (float)$val->sales_order_credit_memo);

$val->sales_order_number = setIdNumber($val, "ORD");

$installmentItems = $data["installmentItems"];
installmentDetails($val, $installmentItems, $data);

// INSTALLMENT DATA
updateStatus($val, $data);
$val->sales_order_number = setIdNumber($val, "ORD");

$ordersItems = $data["items"];
// CREATE STOCK MOVEMENT

// Extract fixed order-level values once outside the loop
$totalOrderAmount = (float)($val->sales_order_total_amount ?? 0);
$totalOrderDiscount = (float)($val->sales_order_discount ?? 0);
$totalPaidAmount = (float)($val->sales_order_paid_amount ?? 0);
$hasBalance = (float)($val->sales_order_total_balance_amount ?? 0) != 0;
$taxRate = (float)($val->sales_order_tax ?? 0);

foreach ($ordersItems as $item) {
    // Map item properties directly
    $val->sales_order_product_id = $item["sales_order_product_id"];
    $val->sales_order_product_name = $item["sales_order_product_name"];
    $val->sales_order_product_owner_id = $item["sales_order_product_owner_id"];
    $val->sales_order_product_owner_name = $item["sales_order_product_owner_name"];
    $val->sales_order_qty = (float)$item["sales_order_qty"];
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

    $val->sales_order_vat = $vatPerItem;
    $val->sales_order_discounted_with_vat_amount = max(0, $discountedAmount) + $vatPerItem;
    $val->sales_order_paid_per_product = max(0, $remainingPerItem);

    if ((float)$data["sales_order_paid_amount"] >= (float)$data["sales_order_total_receivable_amount"]) {
        $val->sales_order_paid_per_product = max(0, $remainingPerItem);
    }

    if ((float)$balancePerItem <= 0) {
        $val->sales_order_balance_per_product = 0;
    }
    if ((float)$totalPaidAmount <= 0) {
        $val->sales_order_balance_per_product = $val->sales_order_discounted_with_vat_amount;
    }

    // 2. Database & Stock Updates
    $query = checkCreate($val);
    $val->stock_movement_type = "stock out - sales";

    $queryQty = getResultData($val->readtotalQTY());
    if (!empty($queryQty)) {
        $currentQty = (float)$queryQty[0]['current_qty'];
        $val->stock_movement_before_qty = $currentQty + $val->sales_order_qty;
        $val->stock_movement_after_qty  = $currentQty;
    } else {
        $val->stock_movement_before_qty = 0;
        $val->stock_movement_after_qty  = 0;
    }

    $val->stock_movement_qty = $val->sales_order_qty;
    checkCreateMovementStock($val);
}

// create activity log
checkCreateSalesJornal($val);
createActivityLog($valActivity, $data);

returnSuccess($val, "Products", $query);
