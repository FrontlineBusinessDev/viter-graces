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

    $val->return_product_is_restocked = $data["return_product_is_restocked"] == "no" ? 0 : 1;
    $val->return_product_reason = $data["return_product_reason"];
    $val->return_product_notes = $data["return_product_notes"];
    $val->return_product_created = date("Y-m-d H:i:s");
    $val->return_product_updated = date("Y-m-d H:i:s");

    $returnDate = $data["return_product_date"] ?? '';
    $val->return_product_date = !empty($returnDate) ? date("Y-m-d", strtotime($returnDate)) : '';

    $val->return_product_status = $data["return_product_status"];
    $val->return_product_order_id = $data["return_product_order_id"];
    $val->return_product_order_number = $data["return_product_order_number"];
    $val->return_product_customer_id = $data["return_product_customer_id"];
    $val->return_product_customer_name = $data["return_product_customer_name"];
    $val->return_product_amount = $data["return_product_amount"];
    $val->return_product_product_id = $data["return_product_product_id"];
    $val->return_product_product_name = $data["return_product_product_name"];
    $val->return_product_qty = $data["return_product_qty"];
    $val->return_product_price = $data["return_product_price"];
    $val->return_product_owner_id = $data["return_product_owner_id"];
    $val->return_product_owner_name = $data["return_product_owner_name"];
    $val->return_product_number = $data["return_product_number"];
    // check name
    checkId($val->return_product_aid);
    $query = checkUpdate($val);
    updateConnectedMenu($val);

    if ((float)$val->return_product_is_restocked == 1 && $val->return_product_status == "processed") {
        $val->stock_movement_type = "stock in - return";
        $val->stock_movement_status = "active";
        $val->stock_movement_date = $val->return_product_date;
        $val->stock_movement_is_active = 1;
        $val->stock_movement_location = "";

        $queryQty = getResultData($val->readtotalQTY());
        if (count($queryQty) > 0) {
            $val->stock_movement_before_qty = (float)$queryQty[0]['current_qty'];
            $val->stock_movement_after_qty = (float)$queryQty[0]['current_qty'] + (float)$val->return_product_qty;
        } else {
            $val->stock_movement_before_qty = 0;
            $val->stock_movement_after_qty = 0;
        };
        $val->stock_movement_qty = (float)$val->return_product_qty;

        checkCreateMovementStock($val);
    }

    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Return Products", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
