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
    $val->return_product_status = $data["return_product_status"];

    // check name - fetched early so the fields below (order/customer/product
    // identity) can fall back onto the existing row: the edit modal only
    // ever sends the fields it actually lets the user change (reason, notes,
    // date, status, resolution, refund method, restocked) - the return's
    // linked order/product/amount are set at creation and aren't part of
    // that payload, so reading them straight from $data would silently
    // null them out (and threw "undefined array key" warnings that broke
    // the JSON response the frontend was trying to parse).
    checkId($val->return_product_aid);
    $existingReturn = checkReturnIsEditable($val);

    // normalize: ModalReturns sends "yes"/"no", the inline status dropdown
    // resends the row's existing 0/1 value - accept either shape
    $restockedInput = $data["return_product_is_restocked"] ?? $existingReturn["return_product_is_restocked"];
    $val->return_product_is_restocked = ($restockedInput === "yes" || (float)$restockedInput == 1) ? 1 : 0;

    $val->return_product_reason = $data["return_product_reason"] ?? $existingReturn["return_product_reason"];
    $val->return_product_notes = $data["return_product_notes"] ?? $existingReturn["return_product_notes"];
    $val->return_product_created = date("Y-m-d H:i:s");
    $val->return_product_updated = date("Y-m-d H:i:s");

    $returnDate = $data["return_product_date"] ?? '';
    $val->return_product_date = !empty($returnDate) ? date("Y-m-d", strtotime($returnDate)) : $existingReturn["return_product_date"];

    $val->return_product_order_id = $data["return_product_order_id"] ?? $existingReturn["return_product_order_id"];
    $val->return_product_order_number = $data["return_product_order_number"] ?? $existingReturn["return_product_order_number"];
    $val->return_product_customer_id = $data["return_product_customer_id"] ?? $existingReturn["return_product_customer_id"];
    $val->return_product_customer_name = $data["return_product_customer_name"] ?? $existingReturn["return_product_customer_name"];
    $val->return_product_amount = $data["return_product_amount"] ?? $existingReturn["return_product_amount"];
    $val->return_product_paid_amount = $data["return_product_paid_amount"] ?? $existingReturn["return_product_paid_amount"];
    $val->return_product_product_id = $data["return_product_product_id"] ?? $existingReturn["return_product_product_id"];
    $val->return_product_product_name = $data["return_product_product_name"] ?? $existingReturn["return_product_product_name"];
    $val->return_product_qty = $data["return_product_qty"] ?? $existingReturn["return_product_qty"];
    $val->return_product_price = $data["return_product_price"] ?? $existingReturn["return_product_price"];
    $val->return_product_owner_id = $data["return_product_owner_id"] ?? $existingReturn["return_product_owner_id"];
    $val->return_product_owner_name = $data["return_product_owner_name"] ?? $existingReturn["return_product_owner_name"];
    $val->return_product_number = $data["return_product_number"] ?? $existingReturn["return_product_number"];
    $val->return_product_resolution_type = $data["return_product_resolution_type"] ?? $existingReturn["return_product_resolution_type"];
    $val->return_product_refund_method = $data["return_product_refund_method"] ?? $existingReturn["return_product_refund_method"];

    if ($val->return_product_status === "processed" && (float)$val->return_product_is_restocked == 0 && $val->return_product_resolution_type === "refund") {
        $val->return_product_paid_amount = $val->return_product_amount;
    }

    if ($val->return_product_status !== "processed" && (float)$val->return_product_is_restocked == 0 && $val->return_product_resolution_type !== "credit memo") {
        $val->return_product_paid_amount = 0;
    }

    if ($val->return_product_resolution_type === "replacement") {
        $val->return_product_paid_amount = 0;
    }

    $wasProcessedAndRestocked = ($existingReturn['return_product_status'] ?? null) === "processed"
        && (float)($existingReturn['return_product_is_restocked'] ?? 0) == 1;
    $isNowProcessedAndRestocked = $val->return_product_status === "processed"
        && (float)$val->return_product_is_restocked == 1;

    $conn->beginTransaction();

    $query = checkUpdate($val);
    updateConnectedMenu($val);

    // Processed + restocked: add the "stock in - return" movement so the
    // returned qty counts back into stock (current_qty is a SUM over movements)
    if ($isNowProcessedAndRestocked && !$wasProcessedAndRestocked) {
        $val->stock_movement_type = "stock in - return";
        $val->stock_movement_status = "active";
        $val->stock_movement_date = $val->return_product_date;
        $val->stock_movement_return_id = $val->return_product_aid;
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

    // Reopened back to pending/rejected: remove the movement created when it
    // was processed, so the restocked qty is backed out of current_qty
    if ($wasProcessedAndRestocked && !$isNowProcessedAndRestocked) {
        $val->stock_movement_return_id = $val->return_product_aid;
        checkDeleteReturnMovement($val);
    }

    $conn->commit();

    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Return Products", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
