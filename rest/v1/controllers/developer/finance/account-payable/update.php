<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new AccountPayable($conn);
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

    $id = $_GET['id'];
    $val->purchase_order_payment_status = ['purchase_order_payment_status'];
    $val->purchase_order_updated = date("Y-m-d H:i:s");

    $val->purchase_order_balance = max($data["totalBalanceAmount"], 0);
    $val->purchase_order_payment = $data["totalPaidAmount"];

    $val->purchase_order_status = 'completed';
    $val->purchase_order_payment_status = 'partially paid';
    if ((float)$val->purchase_order_balance <= 0) {
        $val->purchase_order_payment_status = 'paid';
    }
    if ((float)$val->purchase_order_payment <= 0) {
        $val->purchase_order_payment_status = 'partially paid';
    }
    // update 
    $ordersItems = $data["items"];
    if (count($ordersItems) == 0) {
        $ordersItems = [];
    }
    // Cast and parse static payload values once
    $totalAmount = (float)($data['totalAmount'] ?? 0);
    $discount = max(0, (float)($data['purchase_order_discount'] ?? 0));
    $payment = (float)($data["totalPaidAmount"] ?? 0);
    $percentTax = (float)($data['purchase_order_percent_tax'] ?? 0);
    // Normalize percentTax (handles both 12 and 0.12 inputs)
    $taxRate = ($percentTax > 1) ? ($percentTax / 100) : $percentTax;

    foreach ($ordersItems as $item) {
        // Prevent object reference mutation 

        $itemAid = (int)($item["purchase_order_aid"] ?? 0);
        $itemTotalAmount = (float)($item["purchase_order_total_amount_per_product"] ?? 0);

        // Item share calculation ratio (prevent division by zero)
        $percentagePerProduct = ($totalAmount > 0) ? ($itemTotalAmount / $totalAmount) : 0;

        // Item discount allocation
        $discountPerItem = $discount * $percentagePerProduct;
        $discountedBaseAmount = max(0, $itemTotalAmount - $discountPerItem);

        // Calculate Tax & Gross Amount per Item
        $vatAmount = $discountedBaseAmount * $taxRate;
        $grossTotalPerItem = $discountedBaseAmount + $vatAmount;

        // Allocate payment proportionally based on Gross Total
        $paidPerItem = $payment * $percentagePerProduct;
        $balancePerItem = $val->purchase_order_balance * $percentagePerProduct;

        // Assign properties to the clean object
        $val->purchase_order_aid = $itemAid;
        $val->purchase_order_total_amount = $itemTotalAmount;
        $val->purchase_order_total_amount_per_product = $grossTotalPerItem;
        $val->purchase_order_total_paid_per_product = $paidPerItem;
        $val->purchase_order_total_balance_per_product = $balancePerItem;

        checkId($itemAid);
        $query = checkUpdate($val);
    }
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Account Payable", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
