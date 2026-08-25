<?php

// Check database connection
$conn = checkDbConnection();

// Instantiate models
$val = new SuppliersPurchaseOrder($conn);
$valActivity = new ActivityLog($conn);

// Parse JSON payload safely
$body = file_get_contents("php://input");
$data = json_decode($body, true) ?? [];

// Validate request format
if (isset($_GET['id'])) {
    checkEndpoint();
}
checkPayload($data);

// Cast and parse static payload values once
$totalAmount = (float)($data['order_total_amount'] ?? 0);
$discount = max(0, (float)($data['purchase_order_discount'] ?? 0));
$payment = (float)($data['purchase_order_payment'] ?? 0);
$percentTax = (float)($data['purchase_order_percent_tax'] ?? 0);
$isVatExclusive = (abs($percentTax - 0.12) < 0.00001); // Safe floating-point comparison

$now = date("Y-m-d H:i:s");
$suppliersDeliveryDay = strtolower($data['suppliers_delivery'] ?? 'monday');
$expectedDeliveryDate = date('Y-m-d', strtotime('next ' . $suppliersDeliveryDay));

// Map static attributes to the purchase order object
$val->purchase_order_supplier_id = $data["purchase_order_supplier_id"];
$val->purchase_order_supplier_name = $data["purchase_order_supplier_name"];
$val->purchase_order_date = $data["purchase_order_date"];
$val->purchase_order_payment = $payment;
$val->purchase_order_is_active = 1;
$val->purchase_order_status = $data["purchase_order_status"];
$val->purchase_order_payment_status = $data["purchase_order_payment_status"];
$val->purchase_order_note = $data["purchase_order_note"];
$val->purchase_order_balance = max(0, (float)($data["purchase_order_balance"] ?? 0));
$val->purchase_order_tax = $data["purchase_order_tax"];
$val->purchase_order_percent_tax = $percentTax;
$val->purchase_order_transact_id = $data["purchase_order_transact_id"];
$val->purchase_order_transact_name = $data["purchase_order_transact_name"];
$val->purchase_order_discount = $discount;
$val->purchase_order_created = $now;
$val->purchase_order_updated = $now;
$val->purchase_order_movement_status = "stock in";
$val->purchase_order_expected_delivery = $expectedDeliveryDate;
$val->purchase_order_total_amount_per_product = 0;

if ($val->purchase_order_status == 'received') {
    $val->purchase_order_delivery_is_status = 1;
}

$val->purchase_order_number = setIdNumber($val, "PO-");

if ((float)($payment) > 1) {
    $val->purchase_order_payment_status = "partially paid";
}
if ((float)($payment) <= 0) {
    $val->purchase_order_payment_status = "unpaid";
}
if ((float)($payment) >= (float)$totalAmount) {
    $val->purchase_order_payment_status = "paid";
}

// Handle delivery status logic
deliveryStatus($val, $data);
$val->purchase_order_delivery_status = "";
$val->purchase_order_delivery_is_status = ($data["purchase_order_payment_status"] === "paid") ? 1 : 0;

// Process individual line items
$purchaseOrderItems = $data["purchase_order"] ?? [];
$query = false;

foreach ($purchaseOrderItems as $item) {
    $itemTotalAmount = (float)($item["purchase_order_total_amount"] ?? 0);

    // Populate item-specific properties
    $val->purchase_order_product_id = $item["purchase_order_product_id"];
    $val->purchase_order_product_name = $item["purchase_order_product_name"];
    $val->purchase_order_product_owner_id = $item["purchase_order_product_owner_id"];
    $val->purchase_order_product_owner_name = $item["purchase_order_product_owner_name"];
    $val->purchase_order_qty = $item["purchase_order_qty"];
    $val->purchase_order_before_qty = 0;
    $val->purchase_order_after_qty = $val->purchase_order_qty;
    $val->purchase_order_price = $item["purchase_order_price"];
    $val->purchase_order_total_amount = $itemTotalAmount;

    // Item share calculation ratio
    $percentagePerProduct = ($totalAmount > 0) ? ($itemTotalAmount / $totalAmount) : 0;

    // Discount calculations
    $discountPerItem = ($discount > 0) ? ($discount * $percentagePerProduct) : 0;
    $discountedAmount = $itemTotalAmount - $discountPerItem;
    $balanceTotalNoVat = $payment * $percentagePerProduct;

    // Dynamic tax & balance calculations
    if ($isVatExclusive) {
        $totalVatPerItems = $discountedAmount * 0.12;
        $totalVatItem = $discountedAmount * 1.12;
        $val->purchase_order_total_balance_per_product = $totalVatItem - $balanceTotalNoVat;
    } else {
        $totalVatPerItems = 0;
        $val->purchase_order_total_balance_per_product = $discountedAmount - $balanceTotalNoVat;
    }

    $val->purchase_order_total_amount_per_product = max(0, $discountedAmount) + $totalVatPerItems;

    $amountTotalPaid = $val->purchase_order_total_amount_per_product - $val->purchase_order_total_balance_per_product;
    $val->purchase_order_total_paid_per_product = max(0, $amountTotalPaid);
    // Database insertion call
    $query = checkCreate($val);
}

// Log activity and output response
createActivityLog($valActivity, $data);
returnSuccess($val, "Suppliers Product", $query);
