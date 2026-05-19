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
$val->sales_order_status = 'active';
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
$val->sales_order_created = date("Y-m-d H:i:s");
$val->sales_order_updated = date("Y-m-d H:i:s");

$val->sales_order_number = setIdNumber($val, "ORD");

$val->stock_movement_type = "";
$val->stock_movement_before_qty = 0;
$val->stock_movement_after_qty = (float)$val->stock_movement_before_qty + (float)$val->sales_order_qty;
$val->stock_movement_qty = (float)$val->sales_order_qty;

// create
$query = checkCreate($val);
checkCreateMovementStock($val);

// create activity log
createActivityLog($valActivity, $data);

returnSuccess($val, "Products", $query);
