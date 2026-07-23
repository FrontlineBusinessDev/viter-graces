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

    $oldData = $ordersItems[$i]["allData"];
    // get data 
    $val->purchase_order_supplier_id = $oldData["purchase_order_supplier_id"];
    $val->purchase_order_supplier_name = $oldData["purchase_order_supplier_name"];
    $val->purchase_order_payment = $oldData["purchase_order_payment"];
    $val->purchase_order_is_active = $oldData["purchase_order_is_active"];
    $val->purchase_order_status = $oldData["purchase_order_status"];
    $val->purchase_order_payment_status = $oldData["purchase_order_payment_status"];
    $val->purchase_order_note = $oldData["purchase_order_note"];
    $val->purchase_order_balance = $oldData["purchase_order_balance"];
    $val->purchase_order_tax = $oldData["purchase_order_tax"];
    $val->purchase_order_discount = max(0, $oldData["purchase_order_discount"]);
    $val->purchase_order_number = $oldData["purchase_order_number"];
    $val->purchase_order_delivery_status = $oldData["purchase_order_delivery_status"];
    $val->purchase_order_delivery_is_status = $oldData["purchase_order_delivery_is_status"];
    $val->purchase_order_price = $oldData["purchase_order_price"];
    $val->purchase_order_total_amount = $oldData["purchase_order_total_amount"];
    $val->purchase_order_expected_delivery = $oldData["purchase_order_expected_delivery"];

    $val->purchase_order_transfer_from_id = $ordersItems[$i]["purchase_order_transfer_from_id"];
    $val->purchase_order_product_owner_id = $ordersItems[$i]["purchase_order_product_owner_id"];
    $val->purchase_order_product_owner_name = $ordersItems[$i]["purchase_order_product_owner_name"];
    $val->purchase_order_product_id = $ordersItems[$i]["purchase_order_product_id"];
    $val->purchase_order_product_name = $ordersItems[$i]["purchase_order_product_name"];

    $val->purchase_order_qty = $ordersItems[$i]["current_order_qty"];
    $val->purchase_order_before_qty = 0;
    $val->purchase_order_after_qty = $val->purchase_order_qty;

    // check name  
    $query = checkCreate($val);

    $val->purchase_order_aid = $ordersItems[$i]["purchase_order_transfer_from_id"];
    $val->purchase_order_qty = (float)$ordersItems[$i]["purchase_order_qty"] - (float)$ordersItems[$i]["current_order_qty"];
    $val->purchase_order_before_qty = $ordersItems[$i]["purchase_order_qty"];
    $val->purchase_order_after_qty = (float)$ordersItems[$i]["purchase_order_qty"] - (float)$ordersItems[$i]["current_order_qty"];

    $query = checkUpdate($val);
}
// create activity log  
createActivityLog($valActivity, $data);

returnSuccess($val, "Suppliers Product", $query);
