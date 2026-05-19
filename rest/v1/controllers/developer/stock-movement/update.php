<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new StockMovement($conn);
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
    $val->stock_movement_aid = $_GET['id'];
    $val->stock_movement_type = $data["stock_movement_type"];
    $val->stock_movement_status = $data["stock_movement_status"];
    $val->stock_movement_is_active = $data["stock_movement_is_active"];
    $val->stock_movement_product_id = $data["stock_movement_product_id"];
    $val->stock_movement_product_name = $data["stock_movement_product_name"];
    $val->stock_movement_before_qty = 0;
    $val->stock_movement_after_qty = 0;
    // $val->stock_movement_before_qty = $data["stock_movement_before_qty"];
    // $val->stock_movement_after_qty = $data["stock_movement_after_qty"];
    $val->stock_movement_qty = $data["stock_movement_qty"];
    $val->stock_movement_location = $data["stock_movement_location"];
    $val->stock_movement_product_owner_id = $data["stock_movement_product_owner_id"];
    $val->stock_movement_product_owner_name = $data["stock_movement_product_owner_name"];
    $val->stock_movement_notes = $data["stock_movement_notes"];
    $val->stock_movement_updated = date("Y-m-d H:i:s");

    checkId($val->stock_movement_aid);

    // update
    $query = checkUpdate($val);
    updateConnectedMenu($val);
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Products", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
