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
// get should not be present
if (array_key_exists("id", $_GET)) {
    checkEndpoint();
}
// check data
checkPayload($data);
// get data


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
$val->return_product_created = date("Y-m-d H:i:s");
$val->return_product_updated = date("Y-m-d H:i:s");

$val->return_product_number = setIdNumber($val, "RET");
// check name
isNameExist($val, $val->return_product_number);
// create
$query = checkCreate($val);

$val->stock_movement_type = "stock in - return";

$queryQty = getResultData($val->readtotalQTY());
if (count($queryQty) > 0) {
    $val->stock_movement_before_qty = (float)$queryQty[0]['current_qty'] + (float)$val->return_product_qty;
    $val->stock_movement_after_qty = (float)$queryQty[0]['current_qty'];
} else {
    $val->stock_movement_before_qty = 0;
    $val->stock_movement_after_qty = 0;
};
$val->stock_movement_qty = (float)$val->return_product_qty;

checkCreateMovementStock($val);

// create activity log
createActivityLog($valActivity, $data);

returnSuccess($val, "Return Products", $query);
