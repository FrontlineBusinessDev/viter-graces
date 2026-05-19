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
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // check data
    checkPayload($data);
    // get data
    $val->sales_order_aid  = $_GET['id'];
    $val->sales_order_date = $data["sales_order_date"];
    $val->sales_order_customer_id = $data["sales_order_customer_id"];
    $val->sales_order_customer_name = $data["sales_order_customer_name"];
    $val->sales_order_payment_method = $data["sales_order_payment_method"];
    $val->sales_order_product_id = $data["sales_order_product_id"];
    $val->sales_order_product_name = $data["sales_order_product_name"];
    $val->sales_order_qty = $data["sales_order_qty"];
    $val->sales_order_price = $data["sales_order_price"];
    $val->sales_order_total = $data["sales_order_total"];
    $val->sales_order_discount = $data["sales_order_discount"];
    $val->sales_order_tax = $data["sales_order_tax"];
    $val->sales_order_paid_amount = $data["sales_order_paid_amount"];
    $val->sales_order_notes = $data["sales_order_notes"];
    $val->sales_order_received_by_id = $data["sales_order_received_by_id"];
    $val->sales_order_received_by_name = $data["sales_order_received_by_name"];
    $val->sales_order_product_owner_id = $data["sales_order_product_owner_id"];
    $val->sales_order_product_owner_name = $data["sales_order_product_owner_name"];
    $val->sales_order_installment = $data["sales_order_installment"];
    $val->sales_order_due_date = $data["sales_order_due_date"];
    $val->sales_order_updated = date("Y-m-d H:i:s");

    checkId($val->sales_order_aid);

    // update
    $query = checkUpdate($val);
    updateConnectedMenu($val);
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Products", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
