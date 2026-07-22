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

$val->return_product_status = "pending";
$val->return_product_number = "";
$val->return_product_is_restocked = $data["return_product_is_restocked"];
$val->return_product_reason = $data["return_product_reason"];
$val->return_product_notes = $data["return_product_notes"];
$val->return_product_date = $data["return_product_date"];
$val->return_product_created = date("Y-m-d H:i:s");
$val->return_product_updated = date("Y-m-d H:i:s");

$selectedItems = $data["selectedItems"];

if (count($selectedItems) > 0) {
    // CREATE INSTALLMENT PAYMENT
    for ($a = 0; $a < count($selectedItems); $a++) {
        if ($selectedItems[$a]["selected"] == true) {
            $val->return_product_order_id = $selectedItems[$a]["sales_order_aid"];
            $val->return_product_order_number = $selectedItems[$a]["sales_order_number"];
            $val->return_product_customer_id = $selectedItems[$a]["sales_order_customer_id"];
            $val->return_product_customer_name = $selectedItems[$a]["sales_order_customer_name"];
            $val->return_product_amount = (float)$selectedItems[$a]["sales_order_price"] * (float)$selectedItems[$a]["qty"];
            $val->return_product_product_id = $selectedItems[$a]["sales_order_product_id"];
            $val->return_product_product_name = $selectedItems[$a]["sales_order_product_name"];
            $val->return_product_qty = $selectedItems[$a]["qty"];
            $val->return_product_price = $selectedItems[$a]["sales_order_price"];
            $val->return_product_owner_id = $selectedItems[$a]["products_owner_id"];
            $val->return_product_owner_name = $selectedItems[$a]["products_owner_name"];
            $val->return_product_number = setIdNumber($val, "RET");
            // check name
            isNameExist($val, $val->return_product_number);
            $query = checkCreate($val);
        }
    }
}

// create activity log
createActivityLog($valActivity, $data);

returnSuccess($val, "Return Products", $query);
