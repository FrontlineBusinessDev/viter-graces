<?php

// Check database connection
$conn = checkDbConnection();

// Instantiate models
$val = new SuppliersPurchaseOrder($conn);
$valActivity = new ActivityLog($conn);

// Parse JSON payload safely
$body = file_get_contents("php://input");
$data = json_decode($body, true) ?? [];

// Endpoint gatekeeper check
if (!isset($_GET['id'])) {
    checkEndpoint();
}

// Validate payload
checkPayload($data);

// Pre-calculate and cast static values once (Outside the loop)
$totalAmount = (float)($data['order_total_amount'] ?? 0);
$discount = max(0, (float)($data['purchase_order_discount'] ?? 0));
$payment = (float)($data['purchase_order_payment'] ?? 0);
$percentTax = (float)($data['purchase_order_percent_tax'] ?? 0);
$isVatExclusive = (abs($percentTax - 0.12) < 0.00001); // Safe floating-point comparison

$now = date("Y-m-d H:i:s");
$suppliersDeliveryDay = strtolower($data['suppliers_delivery'] ?? 'monday');
$expectedDeliveryDate = date('Y-m-d', strtotime('next ' . $suppliersDeliveryDay));

// Populate static purchase order properties
$val->purchase_order_aid = $_GET['id'];
$val->purchase_order_number = $data["purchase_order_number"] ?? "";
$val->purchase_order_supplier_id = $data["purchase_order_supplier_id"] ?? "";
$val->purchase_order_supplier_name = $data["purchase_order_supplier_name"] ?? "";
$val->purchase_order_date = $data["purchase_order_date"] ?? "";
$val->purchase_order_expected_delivery = $expectedDeliveryDate;
$val->purchase_order_payment = $payment;
$val->purchase_order_is_active = 1;
$val->purchase_order_status = $data["purchase_order_status"] ?? "";
$val->purchase_order_payment_status = $data["purchase_order_payment_status"] ?? "";
$val->purchase_order_note = $data["purchase_order_note"] ?? "";
$val->purchase_order_balance = max(0, (float)($data["purchase_order_balance"] ?? 0));
$val->purchase_order_tax = $data["purchase_order_tax"] ?? 0;
$val->purchase_order_percent_tax = $percentTax;
$val->purchase_order_discount = $discount;
$val->purchase_order_created = $now;
$val->purchase_order_updated = $now;
$val->purchase_order_total_amount_per_product = 0;

// Compare old and new number
$valNameOld = $data['purchase_order_number_old'] ?? "";
compareName($val, $valNameOld, $val->purchase_order_number);

if ((float)($payment) > 1) {
    $val->purchase_order_payment_status = "partially paid";
}
if ((float)($payment) <= 0) {
    $val->purchase_order_payment_status = "unpaid";
}
if ((float)($payment) >= (float)$totalAmount) {
    $val->purchase_order_payment_status = "paid";
}

// Process delivery status helper
deliveryStatus($val, $data);

// Process item updates/creations
$purchaseOrderItems = $data["purchase_order"] ?? [];
$query = false;

foreach ($purchaseOrderItems as $item) {
    $itemAid = (int)($item["purchase_order_aid"] ?? 0);
    $itemTotalAmount = (float)($item["purchase_order_total_amount"] ?? 0);

    // Populate item properties
    $val->purchase_order_aid = $itemAid;
    $val->purchase_order_product_id = $item["purchase_order_product_id"] ?? "";
    $val->purchase_order_product_name = $item["purchase_order_product_name"] ?? "";
    $val->purchase_order_product_owner_id = $item["purchase_order_product_owner_id"] ?? "";
    $val->purchase_order_product_owner_name = $item["purchase_order_product_owner_name"] ?? "";
    $val->purchase_order_delivery_is_status = $item["purchase_order_delivery_is_status"] ?? 0;
    $val->purchase_order_qty = $item["purchase_order_qty"] ?? 0;
    $val->purchase_order_price = $item["purchase_order_price"] ?? 0;
    $val->purchase_order_total_amount = $itemTotalAmount;

    // Item share calculation ratio (prevent division by zero)
    $percentagePerProduct = ($totalAmount > 0) ? ($itemTotalAmount / $totalAmount) : 0;

    // Discount calculation
    $discountPerItem = ($discount > 0) ? ($discount * $percentagePerProduct) : 0;
    $discountedAmount = $itemTotalAmount - $discountPerItem;
    $balanceTotalNoVat = $payment * $percentagePerProduct;

    // Dynamic tax & balance calculation
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

    // Determine whether to create a new row or update existing one
    if ($itemAid === 0) {
        $query = checkCreate($val);
    } else {
        checkId($itemAid);
        $query = checkUpdate($val);
    }
}

// Process deleted items
$itemsDelete = $data["itemsDelete"] ?? [];
foreach ($itemsDelete as $deleteItem) {
    if (!empty($deleteItem['purchase_order_aid'])) {
        $val->purchase_order_aid = $deleteItem['purchase_order_aid'];
        $query = checkDeleteById($val);
    }
}

// Log activity and return response
createActivityLog($valActivity, $data);
returnSuccess($val, "Suppliers Purchase Order", $query);
