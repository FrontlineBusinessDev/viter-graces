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

    $val->sales_order_cash = $data['sales_order_cash'];
    $val->sales_order_check = $data['sales_order_check'];
    $val->sales_order_online_transaction = $data['sales_order_online_transaction'];
    $val->sales_order_installment_amount = $data['sales_order_installment_amount'];

    $val->sales_order_installment_type = $data['sales_order_installment_type'];
    $val->sales_order_installment_type_day = $data['sales_order_installment_type_day'];
    $val->sales_order_installment_count = $data['sales_order_installment_count'];
    $val->sales_order_installment_amount = $data['sales_order_installment_amount'];

    $val->sales_order_discount_percentage = $data['sales_order_discount_percentage'];
    $val->sales_order_discount_type = $data['sales_order_discount_type'];

    if ($val->sales_order_payment_method == "cash") {
        $val->sales_order_cash = $val->sales_order_paid_amount;
    }
    if ($val->sales_order_payment_method == "check") {
        $val->sales_order_check = $val->sales_order_paid_amount;
    }
    if ($val->sales_order_payment_method == "online transaction") {
        $val->sales_order_online_transaction = $val->sales_order_paid_amount;
    }


    if ((float)$data["sales_order_paid_amount"] > (float)$data["sales_order_total_receivable_amount"]) {
        $val->sales_order_paid_amount = $data["sales_order_total_receivable_amount"];
    }

    $val->sales_order_customer_id = $data["sales_order_customer_id"];
    $val->sales_order_customer_name = $data["sales_order_customer_name"];

    $installmentItems = $data["installmentItems"];

    installmentDetails($val, $installmentItems, $data);

    // INSTALLMENT DATA
    updateStatus($val, $data);

    $ordersItems = $data["items"];
    $itemsDelete = $data["itemsDelete"];
    // Extract fixed order-level values ONCE outside the loop to reduce redundant calls/casting
    $totalOrderAmount = (float)($val->sales_order_total_amount ?? 0);
    $totalDiscount = (float)($val->sales_order_discount ?? 0);
    $totalPaid = (float)($val->sales_order_paid_amount ?? 0);
    $hasBalance = (float)($val->sales_order_total_balance_amount ?? 0) != 0;
    $taxRate = (float)($val->sales_order_tax ?? 0);

    foreach ($ordersItems as $item) {
        // Map item properties directly
        $val->sales_order_aid = $item['sales_order_aid'] ?? 0;
        $val->sales_order_product_id = $item['sales_order_product_id'];
        $val->sales_order_product_name = $item['sales_order_product_name'];
        $val->sales_order_product_owner_id = $item['sales_order_product_owner_id'];
        $val->sales_order_product_owner_name = $item['sales_order_product_owner_name'];
        $val->sales_order_qty = (float)$item['sales_order_qty'];
        $val->sales_order_price = (float)$item['sales_order_price'];
        $val->sales_order_total = (float)$item['sales_order_total'];

        $qtyOld = (float)($item['sales_order_qty_old'] ?? 0);

        // 1. Financial Calculations
        // Safely calculate proportion share (prevents division by zero)
        $share = ($totalOrderAmount > 0) ? ($val->sales_order_total / $totalOrderAmount) : 0;

        $discountPerItem  = ($totalDiscount != 0) ? ($totalDiscount * $share) : 0;
        $discountedAmount = $val->sales_order_total - $discountPerItem;
        $balancePerItem   = $hasBalance ? ($totalPaid * $share) : 0;
        $remainingPerItem = $val->sales_order_paid_amount ? ($val->sales_order_paid_amount * $share) : 0;

        // Tax & Balance Handling
        if ($taxRate === 0.12) {
            $vatPerItem = $discountedAmount * 0.12;
            $totalVAT   = $discountedAmount * 1.12;
            $val->sales_order_balance_per_product = $totalVAT - $balancePerItem;
        } else {
            $vatPerItem = 0;
            $val->sales_order_balance_per_product = $discountedAmount - $balancePerItem;
        }

        $val->sales_order_vat = $vatPerItem;
        $val->sales_order_discounted_with_vat_amount = max(0, $discountedAmount) + $vatPerItem;
        $val->sales_order_paid_per_product = max(0, $remainingPerItem);

        if ((float)$balancePerItem <= 0) {
            $val->sales_order_balance_per_product = 0;
        }
        // 2. Insert or Update Record
        if ((int)$val->sales_order_aid === 0) {
            $query = checkCreate($val);
        } else {
            checkId($val->sales_order_aid);
            $query = checkUpdate($val);
        }

        // 3. Stock Movement Logic
        $val->lastInsertedId        = $val->sales_order_product_id;
        $val->stock_movement_type   = "stock out - sales";
        $val->stock_movement_status = "active";
        $val->stock_movement_qty    = $val->sales_order_qty;

        $queryQty = getResultData($val->readtotalQTY());

        if (!empty($queryQty)) {
            $currentQty = (float)$queryQty[0]['current_qty'];
            $val->stock_movement_before_qty = $currentQty + $val->sales_order_qty + $qtyOld;
            $val->stock_movement_after_qty  = $currentQty;
        } else {
            $val->stock_movement_before_qty = 0;
            $val->stock_movement_after_qty  = 0;
        }

        // Only log stock movement if quantity changed
        if ($val->sales_order_qty !== $qtyOld) {
            $query = checkCreateMovementStock($val);
        }
    }

    for ($i = 0; $i < count($itemsDelete); $i++) {
        $val->sales_order_aid = $itemsDelete[$i]['sales_order_aid'];
        $query = checkDeleteById($val);
    }

    // update
    checkUpdateSalesJournal($val);
    updateConnectedMenu($val);
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Products", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
