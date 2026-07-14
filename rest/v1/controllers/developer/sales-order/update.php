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
    $val->sales_order_status = $data["sales_order_status"];
    $val->sales_order_date = $data["sales_order_date"];
    $val->sales_order_customer_id = $data["sales_order_customer_id"];
    $val->sales_order_customer_name = $data["sales_order_customer_name"];
    $val->sales_order_payment_method = $data["sales_order_payment_method"];
    $val->sales_order_discount = $data["sales_order_discount"];
    $val->sales_order_payment_terms = $data["sales_order_payment_terms"];
    $val->sales_order_tax = $data["sales_order_tax"];
    $val->sales_order_paid_amount = $data["sales_order_paid_amount"];
    $val->sales_order_notes = $data["sales_order_notes"];
    $val->sales_order_received_by_id = $data["sales_order_received_by_id"];
    $val->sales_order_received_by_name = $data["sales_order_received_by_name"];
    $val->sales_order_installment = $data["sales_order_installment"];
    $val->sales_order_due_date = $data["sales_order_due_date"];
    $val->sales_order_total_receivable_amount = $data["sales_order_total_receivable_amount"];
    $val->sales_order_total_amount = $data["sales_order_total_amount"];
    $val->sales_order_tax_amount = $data["sales_order_tax_amount"];
    $val->sales_order_number = $data["sales_order_number"];
    $val->sales_order_total_balance_amount = max(0, $data["sales_order_total_balance_amount"]);
    $val->sales_order_created = date("Y-m-d H:i:s");
    $val->sales_order_updated = date("Y-m-d H:i:s");

    $val->sales_order_customer_id = $data["sales_order_customer_id"];
    $val->sales_order_customer_name = $data["sales_order_customer_name"];

    $installmentItems = $data["installmentItems"];
    $installmentItemsDelete = $data["installmentItemsDelete"];

    if ($val->sales_order_payment_terms === "installment") {
        if (count($installmentItems) > 0) {
            // CREATE INSTALLMENT PAYMENT
            for ($a = 0; $a < count($installmentItems); $a++) {
                if ($a === 0) {
                    $val->sales_order_due_date = $installmentItems[$a]["installmet_payment_due_date"];
                }
                $val->installmet_payment_code_id = 0;
                $val->installmet_payment_is_paid = 0;
                $val->installmet_payment_aid = $installmentItems[$a]["installmet_payment_aid"];
                $val->installmet_payment_code = $installmentItems[$a]["installmet_payment_code"];
                $val->installmet_payment_due_date = $installmentItems[$a]["installmet_payment_due_date"];
                $val->installmet_payment_code_number = $val->sales_order_number;
                $val->installmet_payment_customer_id = $val->sales_order_customer_id;
                $val->installmet_payment_customer_name = $val->sales_order_customer_name;
                $val->installmet_payment_method = "";
                $val->installmet_payment_amount = $installmentItems[$a]["installmet_payment_amount"];
                if ((float)$val->installmet_payment_aid == 0) {
                    checkCreateInstallment($val);
                } else {
                    checkId($val->installmet_payment_aid);
                    checkUpdateInstallment($val);
                }
            }
        }
    } else {
        $poDate = date("Y-m-d", strtotime($val->sales_order_date));
        $val->sales_order_due_date = date($poDate, strtotime('+' . (float)$val->sales_order_payment_terms . ' day'));
        for ($a = 0; $a < count($installmentItems); $a++) {
            $val->installmet_payment_aid = $installmentItems[$a]['installmet_payment_aid'];
            $query = checkDeleteById($val);
        }
    }
    // INSTALLMENT DATA
    updateStatus($val, $data);
    for ($i = 0; $i < count($installmentItemsDelete); $i++) {
        $val->installmet_payment_aid = $installmentItemsDelete[$i]['installmet_payment_aid'];
        $query = checkDeleteById($val);
    }

    $ordersItems = $data["items"];
    $itemsDelete = $data["itemsDelete"];

    for ($i = 0; $i < count($ordersItems); $i++) {
        $val->sales_order_aid = $ordersItems[$i]['sales_order_aid'];
        $val->sales_order_product_id = $ordersItems[$i]["sales_order_product_id"];
        $val->sales_order_product_name = $ordersItems[$i]["sales_order_product_name"];
        $val->sales_order_product_owner_id = $ordersItems[$i]["sales_order_product_owner_id"];
        $val->sales_order_product_owner_name = $ordersItems[$i]["sales_order_product_owner_name"];
        $val->sales_order_qty = $ordersItems[$i]["sales_order_qty"];
        $val->sales_order_price = $ordersItems[$i]["sales_order_price"];
        // $sales_order_qty_old = $ordersItems[$i]["sales_order_qty_old"];
        $val->sales_order_total = $ordersItems[$i]["sales_order_total"];

        // this is for total amount - discount + VAT
        $discountPerItems = (float)$val->sales_order_discount / count($installmentItems);
        $discountedAmountPerItem = (float)$val->sales_order_total - (float)$discountPerItems;
        $totalVatPerItems = 0;

        // COMPUTATION OF EXCLUSIVE TAX
        if ((float)$val->sales_order_tax == 0.12) {
            $totalVatPerItems = (float)$discountedAmountPerItem * 0.12;
        }

        $val->sales_order_discounted_with_vat_amount = max(0, (float)$discountedAmountPerItem); // not accepting negative

        if ((float)$val->sales_order_aid == 0) {
            $query = checkCreate($val);
        } else {
            checkId($val->sales_order_aid);
            $query = checkUpdate($val);
        }

        $val->lastInsertedId = $val->sales_order_product_id;
        $val->stock_movement_type = "stock out - sales";
        $queryQty = getResultData($val->readtotalQTY());
        if (count($queryQty) > 0) {
            $val->stock_movement_before_qty = $queryQty[0]['current_qty'] + (float)$val->sales_order_qty;
            $val->stock_movement_after_qty = $queryQty[0]['current_qty'];
        } else {
            $val->stock_movement_before_qty = 0;
            $val->stock_movement_after_qty = 0;
        };
        $val->stock_movement_qty = (float)$val->sales_order_qty;
        $val->stock_movement_status = "active";

        // if ((float)$val->sales_order_qty != (float)$sales_order_qty_old) {
        $query = checkCreateMovementStock($val);
        // }
    }

    for ($i = 0; $i < count($itemsDelete); $i++) {
        $val->sales_order_aid = $itemsDelete[$i]['sales_order_aid'];
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
