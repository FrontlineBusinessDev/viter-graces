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

// Order grand total (post-discount, post-VAT), as computed by the client;
// fall back to the raw subtotal when it isn't supplied.
$orderGrandTotal = (float)($data['total_amount'] ?? $totalAmount);

// Cap the paid amount to the order's grand total so overpayment is never
// stored, and floor the balance at 0 so it never goes negative. Capping the
// paid amount here also caps every product line's share of it further down,
// since each line's paid amount is this same $payment allocated proportionally.
$payment = min($payment, $orderGrandTotal);
$balance = max(0, $orderGrandTotal - $payment);

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
$val->purchase_order_balance = $balance;
$val->purchase_order_tax = $data["purchase_order_tax"] ?? 0;
$val->purchase_order_percent_tax = $percentTax;
$val->purchase_order_vat = $percentTax;
$val->purchase_order_discount = $discount;
$val->purchase_order_discount_type = $data["purchase_order_discount_type"] ?? "";
$val->purchase_order_discount_percentage = $data["purchase_order_discount_percentage"] ?? "";
$val->purchase_order_created = $now;
$val->purchase_order_updated = $now;
$val->purchase_order_total_amount_per_product = 0;

// Compare old and new number
$valNameOld = $data['purchase_order_number_old'] ?? "";
compareName($val, $valNameOld, $val->purchase_order_number);

if ($payment > 1) {
    $val->purchase_order_payment_status = "partially paid";
}
if ($payment <= 0) {
    $val->purchase_order_payment_status = "unpaid";
}
if ($payment >= $orderGrandTotal && $orderGrandTotal > 0) {
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
        $val->purchase_order_total_balance_per_product = max(0, $totalVatItem - $balanceTotalNoVat);
    } else {
        $totalVatPerItems = 0;
        $val->purchase_order_total_balance_per_product = max(0, $discountedAmount - $balanceTotalNoVat);
    }

    $val->purchase_order_total_amount_per_product = max(0, $discountedAmount) + $totalVatPerItems;
    $val->purchase_order_vat_amount = $totalVatPerItems;

    $amountTotalPaid = $val->purchase_order_total_amount_per_product - $val->purchase_order_total_balance_per_product;
    $val->purchase_order_total_paid_per_product = max(0, $amountTotalPaid);

    if ($val->purchase_order_balance <= 0) {
        $val->purchase_order_total_balance_per_product = 0;
    }
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
