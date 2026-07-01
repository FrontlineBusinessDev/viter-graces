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
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // check data
    checkPayload($data);
    // get data
    $val->purchase_order_aid = $_GET['id'];
    $val->purchase_order_number = $data["purchase_order_number"];
    $val->purchase_order_supplier_id = $data["purchase_order_supplier_id"];
    $val->purchase_order_supplier_name = $data["purchase_order_supplier_name"];
    $val->purchase_order_date = $data["purchase_order_date"];
    $val->purchase_order_expected_delivery = date('Y-m-d', strtotime('next ' . strtolower($data["suppliers_delivery"])));
    $val->purchase_order_payment = $data["purchase_order_payment"];
    $val->purchase_order_is_active = 1;
    $val->purchase_order_status = $data["purchase_order_status"];
    $val->purchase_order_payment_status = $data["purchase_order_payment_status"];
    $val->purchase_order_note = $data["purchase_order_note"];
    $val->purchase_order_created = date("Y-m-d H:i:s");
    $val->purchase_order_updated = date("Y-m-d H:i:s");

    $val_name_old = $data['purchase_order_number_old'];
    compareName($val, $val_name_old, $val->purchase_order_number);

    $purchase_order = $data["purchase_order"];
    deliveryStatus($val, $data);

    for ($i = 0; $i < count($purchase_order); $i++) {
        $val->purchase_order_aid = $purchase_order[$i]["purchase_order_aid"];
        $val->purchase_order_product_id = $purchase_order[$i]["purchase_order_product_id"];
        $val->purchase_order_product_name = $purchase_order[$i]["purchase_order_product_name"];
        $val->purchase_order_product_owner_id = $purchase_order[$i]["purchase_order_product_owner_id"];
        $val->purchase_order_product_owner_name = $purchase_order[$i]["purchase_order_product_owner_name"];
        $val->purchase_order_delivery_is_status = $purchase_order[$i]["purchase_order_delivery_is_status"];
        $val->purchase_order_qty = $purchase_order[$i]["purchase_order_qty"];
        $val->purchase_order_price = $purchase_order[$i]["purchase_order_price"];
        $val->purchase_order_total_amount = $purchase_order[$i]["purchase_order_total_amount"];

        // update
        if ((float)$val->purchase_order_aid == 0) {

            $query = checkCreate($val);
        } else { // create
            checkId($val->purchase_order_aid);

            $query = checkUpdate($val);
        }
    }
    $itemsDelete = $data["itemsDelete"];
    for ($i = 0; $i < count($itemsDelete); $i++) {
        $val->purchase_order_aid = $itemsDelete[$i]['purchase_order_aid'];
        $query = checkDeleteById($val);
    }

    // create activity log 
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Suppliers Purchase Order", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
