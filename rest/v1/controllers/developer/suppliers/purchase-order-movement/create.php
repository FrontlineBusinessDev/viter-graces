<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new SuppliersPurchaseMovement($conn);
$valActivity = new ActivityLog($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// get should not be present
if (array_key_exists("id", $_GET)) {
    checkEndpoint();
}

$val->purchase_order_date = $data["purchase_order_date"];
$val->purchase_order_transfer_note = $data["purchase_order_transfer_note"];
$val->purchase_order_transact_id = $data["purchase_order_transact_id"];
$val->purchase_order_transact_name = $data["purchase_order_transact_name"];
$val->purchase_order_movement_status = "transferred";
$val->purchase_order_created = date("Y-m-d H:i:s");
$val->purchase_order_updated = date("Y-m-d H:i:s");

$ordersItems = $data["items"];
// CREATE STOCK MOVEMENT
for ($i = 0; $i < count($ordersItems); $i++) {

    // get data 
    $val->purchase_order_supplier_id = $data["purchase_order_supplier_id"];
    $val->purchase_order_supplier_name = $data["purchase_order_supplier_name"];
    $val->purchase_order_payment = $data["purchase_order_payment"];
    $val->purchase_order_is_active = $data["purchase_order_is_active"];
    $val->purchase_order_status = $data["purchase_order_status"];
    $val->purchase_order_payment_status = $data["purchase_order_payment_status"];
    $val->purchase_order_note = $data["purchase_order_note"];
    $val->purchase_order_balance = $data["purchase_order_balance"];
    $val->purchase_order_tax = $data["purchase_order_tax"];
    $val->purchase_order_discount = max(0, $data["purchase_order_discount"]);
    $val->purchase_order_number = $data["purchase_order_number"];
    $val->purchase_order_delivery_status = $data["purchase_order_delivery_status"];
    $val->purchase_order_delivery_is_status = $data["purchase_order_delivery_is_status"];
    $val->purchase_order_product_id = $data["purchase_order_product_id"];
    $val->purchase_order_product_name = $data["purchase_order_product_name"];
    $val->purchase_order_product_owner_id = $data["purchase_order_product_owner_id"];
    $val->purchase_order_product_owner_name = $data["purchase_order_product_owner_name"];
    $val->purchase_order_price = $data["purchase_order_price"];
    $val->purchase_order_total_amount = $data["purchase_order_total_amount"];
    $val->purchase_order_expected_delivery = $data["purchase_order_expected_delivery"];

    $val->purchase_order_transfer_from_id = $data["purchase_order_transfer_from_id"];

    $val->purchase_order_qty = $data["current_order_qty"];
    $val->purchase_order_before_qty = 0;
    $val->purchase_order_after_qty = $val->purchase_order_qty;

    // check name  
    $query = checkCreate($val);

    $val->purchase_order_aid = $data["purchase_order_transfer_from_id"];
    $val->purchase_order_qty = (float)$data["current_order_qty"] - (float)$data["purchase_order_qty"];
    $val->purchase_order_before_qty = $data["current_order_qty"];
    $val->purchase_order_after_qty = (float)$data["current_order_qty"] - (float)$data["purchase_order_qty"];

    $query = checkUpdate($val);
}
// create activity log  
createActivityLog($valActivity, $data);

returnSuccess($val, "Suppliers Product", $query);
