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
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // check data
    checkPayload($data);
    // get data

    $val->sales_order_is_active = 1;
    $val->sales_order_status = 'active';
    $val->sales_order_date = $data["sales_order_date"];
    $val->sales_order_customer_id = $data["sales_order_customer_id"];
    $val->sales_order_customer_name = $data["sales_order_customer_name"];
    $val->sales_order_payment_method = $data["sales_order_payment_method"];
    $val->sales_order_discount = $data["sales_order_discount"];
    $val->sales_order_tax = $data["sales_order_tax"];
    $val->sales_order_paid_amount = $data["sales_order_paid_amount"];
    $val->sales_order_notes = $data["sales_order_notes"];
    $val->sales_order_received_by_id = $data["sales_order_received_by_id"];
    $val->sales_order_received_by_name = $data["sales_order_received_by_name"];
    $val->sales_order_installment = $data["sales_order_installment"];
    $val->sales_order_due_date = $data["sales_order_due_date"];
    $val->sales_order_overall_amount = $data["sales_order_overall_amount"];
    $val->sales_order_created = date("Y-m-d H:i:s");
    $val->sales_order_updated = date("Y-m-d H:i:s");
    $val->sales_order_number = $data["sales_order_number"];

    $ordersItems = $data["items"];
    $itemsDelete = $data["itemsDelete"];
    // create

    for ($i = 0; $i < count($ordersItems); $i++) {

        $val->sales_order_aid = $ordersItems[$i]['sales_order_aid'];
        $val->sales_order_product_id = $ordersItems[$i]["sales_order_product_id"];
        $val->sales_order_product_name = $ordersItems[$i]["sales_order_product_name"];
        $val->sales_order_product_owner_id = $ordersItems[$i]["sales_order_product_owner_id"];
        $val->sales_order_product_owner_name = $ordersItems[$i]["sales_order_product_owner_name"];
        $val->sales_order_qty = $ordersItems[$i]["sales_order_qty"];
        $val->sales_order_price = $ordersItems[$i]["sales_order_price"];
        $val->sales_order_total = $ordersItems[$i]["sales_order_total"];

        if ((float)$val->sales_order_aid == 0) {
            $query = checkCreate($val);
        } else {
            checkId($val->sales_order_aid);
            $query = checkUpdate($val);
        }

        $val->lastInsertedId = $val->sales_order_product_id;
        $val->stock_movement_type = "stock out - sales";
        $val->stock_movement_before_qty = 0;
        $val->stock_movement_after_qty = (float)$val->stock_movement_before_qty + (float)$val->sales_order_qty;
        $val->stock_movement_qty = (float)$val->sales_order_qty;

        $query = checkCreateMovementStock($val);
    }

    for ($i = 0; $i < count($itemsDelete); $i++) {
        $val->sales_order_aid = $data['id'];
        $query = checkDeleteById($val);
    }

    // update
    updateConnectedMenu($val);
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Products", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
