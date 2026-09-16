<?php

// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Expenses($conn);
$valSupplier = new Suppliers($conn);
$valSPO = new SuppliersPurchaseOrder($conn);
$valActivity = new ActivityLog($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// get should be present
if (!array_key_exists("id", $_GET)) {
    checkEndpoint();
}
// check data
checkPayload($data);
checkId($_GET['id']);

$now = date("Y-m-d H:i:s");

$querySupplier = getResultData($valSupplier->readOtherSupplier());
if (count($querySupplier) == 0) {
    checkCreateOtherSupplier($valSupplier);
    $valSPO->purchase_order_supplier_id = $valSupplier->lastInsertedId;
} else {
    $valSPO->purchase_order_supplier_id = $querySupplier[0]["suppliers_aid"];
}

$valSPO->purchase_order_aid = $_GET['id'];
$valSPO->purchase_order_number = $data["purchase_order_number"] ?? "";
$valSPO->purchase_order_supplier_name = "Other operating expenses";
$valSPO->purchase_order_date = $data["purchase_order_date"];
$valSPO->purchase_order_payment = $data["purchase_order_payment"];
$valSPO->purchase_order_payment_method = $data["purchase_order_payment_method"] ?? "cash";
$valSPO->purchase_order_note = $data["purchase_order_note"];
$valSPO->purchase_order_product_id = $data["purchase_order_product_id"];
$valSPO->purchase_order_product_name = $data["purchase_order_product_name"];
$valSPO->purchase_order_product_owner_id = $data["purchase_order_product_owner_id"];
$valSPO->purchase_order_product_owner_name = $data["purchase_order_product_owner_name"];
$valSPO->purchase_order_price = $data["purchase_order_price"];
$valSPO->purchase_order_vat = $data["purchase_order_vat"];
$valSPO->purchase_order_discount_percentage = $data["purchase_order_discount_percentage"];
$valSPO->purchase_order_discount_type = $data["purchase_order_discount_type"] ?? "amount";

$totals = calculateExpenseTotals($data);
$valSPO->purchase_order_payment_status = calculatePaymentStatus(
    $totals["paid"],
    $totals["total_amount"]
);

$valSPO->purchase_order_expected_delivery = $valSPO->purchase_order_date;
$valSPO->purchase_order_total_amount = $totals["total_amount"];
$valSPO->purchase_order_total_amount_per_product = $totals["total_amount"];
$valSPO->purchase_order_total_paid_per_product = $totals["paid"];
$valSPO->purchase_order_delivery_status = "";
$valSPO->purchase_order_is_active = 1;
$valSPO->purchase_order_status = "completed";
$valSPO->purchase_order_qty = 1;
$valSPO->purchase_order_discount = $totals["discount"];
$valSPO->purchase_order_vat_amount = $totals["vat_amount"];
$valSPO->purchase_order_tax = $totals["vat_rate"];
$valSPO->purchase_order_percent_tax = $totals["vat_rate"];
$valSPO->purchase_order_balance = $totals["balance"];
$valSPO->purchase_order_total_balance_per_product = $totals["balance"];
$valSPO->purchase_order_updated = $now;

deliveryStatus($valSPO, $data);
$valSPO->purchase_order_delivery_is_status = ($valSPO->purchase_order_payment_status === "paid") ? 1 : 0;

// update
$query = checkUpdate($valSPO);
// create activity log
createActivityLog($valActivity, $data);
returnSuccess($val, "Expenses", $query);
