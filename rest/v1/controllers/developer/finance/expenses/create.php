<?php

// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Expenses($conn);
$valSupplier = new Suppliers($conn);
$valSP = new SuppliersProduct($conn);
$valSPO = new SuppliersPurchaseOrder($conn);
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

$now = date("Y-m-d H:i:s");

$purchase_order_product_name_other = $data['purchase_order_product_name_other'];

$querySupplier = getResultData($valSupplier->readOtherSupplier());
if (count($querySupplier) == 0) {
    checkCreateOtherSupplier($valSupplier);
    $valSPO->purchase_order_supplier_id = $valSupplier->lastInsertedId;
} else {
    $valSPO->purchase_order_supplier_id = $querySupplier[0]["suppliers_aid"];
}

$valSPO->purchase_order_supplier_name = "other";
$valSPO->purchase_order_date = $data["purchase_order_date"];
$valSPO->purchase_order_payment = $data["purchase_order_payment"];
$valSPO->purchase_order_payment_status = $data["purchase_order_payment_status"];
$valSPO->purchase_order_note = $data["purchase_order_note"];
$valSPO->purchase_order_product_id = $data["purchase_order_product_id"];
$valSPO->purchase_order_product_name = $data["purchase_order_product_name"];
$valSPO->purchase_order_product_owner_id = $data["purchase_order_product_owner_id"];
$valSPO->purchase_order_product_owner_name = $data["purchase_order_product_owner_name"];
$valSPO->purchase_order_price = $data["purchase_order_price"];
$valSPO->purchase_order_transact_id = $data["purchase_order_transact_id"];
$valSPO->purchase_order_transact_name = $data["purchase_order_transact_name"];

$valSPO->purchase_order_expected_delivery = $valSPO->purchase_order_date;
$valSPO->purchase_order_total_amount = $valSPO->purchase_order_price;
$valSPO->purchase_order_total_amount_per_product = $valSPO->purchase_order_price;
$valSPO->purchase_order_total_paid_per_product = $valSPO->purchase_order_payment;
$valSPO->purchase_order_delivery_status = "";
$valSPO->purchase_order_is_active = 1;
$valSPO->purchase_order_status = "completed";
$valSPO->purchase_order_movement_status = "stock in";
$valSPO->purchase_order_created = $now;
$valSPO->purchase_order_updated = $now;
$totalBalance = (float)$valSPO->purchase_order_price - (float)$valSPO->purchase_order_payment;
$valSPO->purchase_order_balance = max(0, (float)($totalBalance ?? 0));;
$valSPO->purchase_order_discount = 0;
$valSPO->purchase_order_qty = 1;
$valSPO->purchase_order_before_qty = 0;
$valSPO->purchase_order_after_qty = 1;
$valSPO->purchase_order_tax = 0;
$valSPO->purchase_order_percent_tax = "";
$valSPO->purchase_order_total_balance_per_product = 0;

deliveryStatus($val, $data);
$valSPO->purchase_order_delivery_is_status = ($data["purchase_order_payment_status"] === "paid") ? 1 : 0;

$valSPO->purchase_order_number = setIdNumber($valSPO, "PO-");

if ($purchase_order_product_name_other != "" && $valSPO->purchase_order_product_name != "") {
    // get data 
    $valSP->suppliers_product_name = $data['purchase_order_product_name_other'];
    $valSP->suppliers_product_price = $data["purchase_order_price"];
    $valSP->suppliers_product_unit = 1;
    $valSP->suppliers_product_is_active = 1;
    $valSP->suppliers_product_supplier_id = $valSPO->purchase_order_supplier_id;
    $valSP->suppliers_product_supplier_name = $valSPO->purchase_order_supplier_name;
    $valSP->suppliers_product_created = $now;
    $valSP->suppliers_product_updated = $now;

    // create
    checkCreate($valSP);
    $valSPO->purchase_order_product_id = $valSP->lastInsertedId;
    $valSPO->purchase_order_product_name = $data["purchase_order_product_name_other"];
}
// create
$query = checkCreate($valSPO);
// create activity log  
createActivityLog($valActivity, $data);
returnSuccess($val, "Expenses", $query);
