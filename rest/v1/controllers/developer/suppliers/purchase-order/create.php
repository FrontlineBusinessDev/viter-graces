<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new SuppliersPurchaseOrder($conn);
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
$val->purchase_order_number = checkIndex($data, "purchase_order_number");
$val->purchase_order_supplier_id = $data["purchase_order_supplier_id"];
$val->purchase_order_supplier_name = $data["purchase_order_supplier_name"];
$val->purchase_order_date = $data["purchase_order_date"];
$val->purchase_order_expected_delivery = $data["purchase_order_expected_delivery"];
$val->purchase_order_payment = $data["purchase_order_payment"];
$val->purchase_order_is_active = 1;
$val->purchase_order_status = $data["purchase_order_status"];
$val->purchase_order_payment_status = $data["purchase_order_payment_status"];
$val->purchase_order_note = $data["purchase_order_note"];
$val->purchase_order_created = date("Y-m-d H:i:s");
$val->purchase_order_updated = date("Y-m-d H:i:s");

$purchase_order = $data["purchase_order"];
// check name
isNameExist($val, $val->purchase_order_number);

for ($i = 0; $i < count($purchase_order); $i++) {
    $val->purchase_order_product_id = $purchase_order[$i]["purchase_order_product_id"];
    $val->purchase_order_product_name = $purchase_order[$i]["purchase_order_product_name"];
    $val->purchase_order_product_owner_id = $purchase_order[$i]["purchase_order_product_owner_id"];
    $val->purchase_order_product_owner_name = $purchase_order[$i]["purchase_order_product_owner_name"];
    $val->purchase_order_qty = $purchase_order[$i]["purchase_order_qty"];
    $val->purchase_order_price = $purchase_order[$i]["purchase_order_price"];
    $val->purchase_order_total_amount = $purchase_order[$i]["purchase_order_total_amount"];
    // create
    $query = checkCreate($val);
}
// create activity log  
createActivityLog($valActivity, $data);
returnSuccess($val, "Suppliers Product", $query);
