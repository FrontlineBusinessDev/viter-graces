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
// get should not be present
if (array_key_exists("id", $_GET)) {
    checkEndpoint();
}
// check data
checkPayload($data);
// get data

$val->sales_order_is_active = 1;
$val->sales_order_status = 'paid';
$val->sales_order_date = $data["sales_order_date"];
$val->sales_order_customer_id = $data["sales_order_customer_id"];
$val->sales_order_customer_name = $data["sales_order_customer_name"];
$val->sales_order_payment_method = $data["sales_order_payment_method"];
$val->sales_order_payment_terms = $data["sales_order_payment_terms"];
$val->sales_order_discount = $data["sales_order_discount"];
$val->sales_order_tax = $data["sales_order_tax"];
$val->sales_order_paid_amount = $data["sales_order_paid_amount"];
$val->sales_order_notes = $data["sales_order_notes"];
$val->sales_order_received_by_id = $data["sales_order_received_by_id"];
$val->sales_order_received_by_name = $data["sales_order_received_by_name"];
$val->sales_order_installment = $data["sales_order_installment"];
$val->sales_order_total_receivable_amount = $data["sales_order_total_receivable_amount"];
$val->sales_order_total_amount = $data["sales_order_total_amount"];
$val->sales_order_tax_amount = $data["sales_order_tax_amount"];
$val->sales_order_total_balance_amount = max(0, $data["sales_order_total_balance_amount"]); // not accepting negative
$val->sales_order_created = date("Y-m-d H:i:s");
$val->sales_order_updated = date("Y-m-d H:i:s");
$val->stock_movement_status = "active";
$val->sales_order_due_date = date("Y-m-d");

$val->sales_order_number = setIdNumber($val, "ORD");

$installmentItems = $data["installmentItems"];
installmentDetails($val, $installmentItems);

// INSTALLMENT DATA
updateStatus($val, $data);
$val->sales_order_number = setIdNumber($val, "ORD");

$ordersItems = $data["items"];
// CREATE STOCK MOVEMENT
for ($i = 0; $i < count($ordersItems); $i++) {

    $val->sales_order_product_id = $ordersItems[$i]["sales_order_product_id"];
    $val->sales_order_product_name = $ordersItems[$i]["sales_order_product_name"];
    $val->sales_order_product_owner_id = $ordersItems[$i]["sales_order_product_owner_id"];
    $val->sales_order_product_owner_name = $ordersItems[$i]["sales_order_product_owner_name"];
    $val->sales_order_qty = $ordersItems[$i]["sales_order_qty"];
    $val->sales_order_price = $ordersItems[$i]["sales_order_price"];
    $val->sales_order_total = $ordersItems[$i]["sales_order_total"];

    // this is for total amount - discount + VAT
    $discountPerItems = 0;
    if ((float)$val->sales_order_discount != 0) {
        $percentDiscount = (float)$val->sales_order_total / (float)$val->sales_order_total_amount;
        $discountPerItems = (float)$percentDiscount * (float)$val->sales_order_discount;
    }

    $discountedAmountPerItem = (float)$val->sales_order_total - (float)$discountPerItems;
    $totalVatPerItems = 0;

    // $val->sales_order_tax_amount = (float)$data["sales_order_tax_amount"] * 0.12;
    // COMPUTATION OF EXCLUSIVE TAX
    if ((float)$val->sales_order_tax == 0.12) {
        $totalVatPerItems = (float)$discountedAmountPerItem * 0.12;
    }

    $val->sales_order_vat = (float)$totalVatPerItems; // not accepting negative
    $val->sales_order_discounted_with_vat_amount = max(0, (float)$discountedAmountPerItem) + (float)$totalVatPerItems; // not accepting negative

    $query = checkCreate($val);
    $val->stock_movement_type = "stock out - sales";

    $queryQty = getResultData($val->readtotalQTY());
    if (count($queryQty) > 0) {
        $val->stock_movement_before_qty = (float)$queryQty[0]['current_qty'] + (float)$val->sales_order_qty;
        $val->stock_movement_after_qty = (float)$queryQty[0]['current_qty'];
    } else {
        $val->stock_movement_before_qty = 0;
        $val->stock_movement_after_qty = 0;
    };
    $val->stock_movement_qty = (float)$val->sales_order_qty;

    checkCreateMovementStock($val);
}

// create activity log
createActivityLog($valActivity, $data);

returnSuccess($val, "Products", $query);
