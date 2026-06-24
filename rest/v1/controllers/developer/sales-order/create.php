<?php
// check database connection 
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new SalesOrder($conn);
$valActivity = new ActivityLog($conn);
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
$val->sales_order_status = 'paid';
$val->sales_order_date = $data["sales_order_date"];
$val->sales_order_customer_id = $data["sales_order_customer_id"];
$val->sales_order_customer_name = $data["sales_order_customer_name"];
$val->sales_order_payment_method = $data["sales_order_payment_method"];
$val->sales_order_discount = $data["sales_order_discount"];
$val->sales_order_tax = $data["sales_order_tax"];
$val->sales_order_paid_amount = $data["sales_order_paid_amount"];
$val->sales_order_notes = $data["sales_order_notes"];
$val->sales_order_received_by_id = $data["sales_order_received_by_id"];
$val->sales_order_received_by_name = $data["sales_order_received_by_name"];
$val->sales_order_installment = $data["sales_order_installment"];
$val->sales_order_due_date = $data["sales_order_due_date"];
$val->sales_order_total_payable_amount = $data["sales_order_total_payable_amount"];
$val->sales_order_total_amount = $data["sales_order_total_amount"];
$val->sales_order_tax_amount = $data["sales_order_tax_amount"];
$val->sales_order_total_balance_amount = max(0, $data["sales_order_total_balance_amount"]); // not accepting negative
$val->sales_order_created = date("Y-m-d H:i:s");
$val->sales_order_updated = date("Y-m-d H:i:s");
$val->stock_movement_status = "active";

if ((float)$val->sales_order_paid_amount < (float)$val->sales_order_total_payable_amount) {
    $val->sales_order_status = 'partial';
}

if ((float)$val->sales_order_paid_amount == 0) {
    $val->sales_order_status = 'unpaid';
}

$val->sales_order_number = setIdNumber($val, "ORD");

$ordersItems = $data["items"];
$ordersItemsDelete = $data["itemsDelete"];
// CREATE STOCK MOVEMENT
for ($i = 0; $i < count($ordersItems); $i++) {

    $val->sales_order_product_id = $ordersItems[$i]["sales_order_product_id"];
    $val->sales_order_product_name = $ordersItems[$i]["sales_order_product_name"];
    $val->sales_order_product_owner_id = $ordersItems[$i]["sales_order_product_owner_id"];
    $val->sales_order_product_owner_name = $ordersItems[$i]["sales_order_product_owner_name"];
    $val->sales_order_qty = $ordersItems[$i]["sales_order_qty"];
    $val->sales_order_price = $ordersItems[$i]["sales_order_price"];
    $val->sales_order_total = $ordersItems[$i]["sales_order_total"];

    $query = checkCreate($val);
    $val->stock_movement_type = "stock out - sales";

    $queryQty = getResultData($val->readtotalQTY());
    if (count($queryQty) > 0) {
        $val->stock_movement_before_qty = $queryQty[0]['current_qty'];
    };
    $val->stock_movement_after_qty = (float)$val->stock_movement_before_qty + (float)$val->sales_order_qty;
    $val->stock_movement_qty = (float)$val->sales_order_qty;

    checkCreateMovementStock($val);
}

$installmentItems = $data["installmentItems"];
$installmentItemsDelete = $data["installmentItemsDelete"];

if (count($installmentItems) > 0) {
    // CREATE INSTALLMENT PAYMENT
    for ($a = 0; $a < count($installmentItems); $a++) {
        $val->installmet_payment_code = $installmentItems[$a]["installmet_payment_code"];
        $val->installmet_payment_due_date = $installmentItems[$a]["installmet_payment_due_date"];
        $val->installmet_payment_code_number = $val->sales_order_number;
        $val->installmet_payment_method = "";
        $val->installmet_payment_amount = $installmentItems[$a]["installmet_payment_amount"];
        $query = checkCreateInstallment($val);
    }
}

// create activity log
createActivityLog($valActivity, $data);

returnSuccess($val, "Products", $query);
