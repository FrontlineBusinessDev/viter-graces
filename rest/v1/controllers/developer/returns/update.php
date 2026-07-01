<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Returns($conn);
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
    $val->return_product_aid = $_GET['id'];
    $val->return_product_status = $data["return_product_status"];
    $val->return_product_number = $data["return_product_number"];
    $val->return_product_order_id = $data["return_product_order_id"];
    $val->return_product_order_number = $data["return_product_order_number"];
    $val->return_product_customer_id = $data["return_product_customer_id"];
    $val->return_product_customer_name = $data["return_product_customer_name"];
    $val->return_product_date = $data["return_product_date"];
    $val->return_product_amount = $data["return_product_amount"];
    $val->return_product_product_id = $data["return_product_product_id"];
    $val->return_product_product_name = $data["return_product_product_name"];
    $val->return_product_qty = $data["return_product_qty"];
    $val->return_product_price = $data["return_product_price"];
    $val->return_product_reason = $data["return_product_reason"];
    $val->return_product_is_restocked = $data["return_product_is_restocked"];
    $val->return_product_owner_id = $data["return_product_owner_id"];
    $val->return_product_owner_name = $data["return_product_owner_name"];
    $val->return_product_updated = date("Y-m-d H:i:s");

    $return_product_number_old = $data["return_product_number_old"];

    checkId($val->return_product_aid);
    compareName($val, $return_product_number_old, $val->return_product_number);
    // update
    $query = checkUpdate($val);
    updateConnectedMenu($val);
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Return Products", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
