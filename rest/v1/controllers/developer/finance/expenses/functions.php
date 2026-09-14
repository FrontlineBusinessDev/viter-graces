<?php


// Read all
function deliveryStatus($val, $data)
{

    if ($val->purchase_order_payment_status == "paid") {
        $val->purchase_order_delivery_status = "delivered - completed / paid";
    }
    if ($val->purchase_order_payment_status == "partially paid") {
        $val->purchase_order_delivery_status = "delivered - completed / partially paid";
    }
    if ($val->purchase_order_payment_status == "unpaid") {
        $val->purchase_order_delivery_status = "delivered - completed / unpaid";
    }
    return;
}


// Compute discount, VAT, final total, and balance for an expense payload.
// Mirrors the calculation ModalExpenses.jsx already performs client-side, so
// the persisted totals can't drift from (or be bypassed by) a stale/tampered
// client payload. Shared by create.php and update.php.
function calculateExpenseTotals($data)
{
    $subtotal = (float)($data["purchase_order_total_amount"] ?? 0);
    $discountType = $data["purchase_order_discount_type"] ?? "amount";
    $discountPercentage = (float)($data["purchase_order_discount_percentage"] ?? 0);

    // Discount: a flat amount, or a percentage of the subtotal.
    $discount = ($discountType === "percentage")
        ? $subtotal * ($discountPercentage / 100)
        : (float)($data["purchase_order_discount"] ?? 0);

    $discountedAmount = $subtotal - $discount;

    // VAT: 1.12 = inclusive (already part of the discounted amount),
    // 0.12 = exclusive (added on top), anything else = no VAT.
    $vatRate = (float)($data["purchase_order_vat"] ?? 0);
    if (abs($vatRate - 1.12) < 0.00001) {
        $vatAmount = $discountedAmount - ($discountedAmount / 1.12);
        $totalAmount = $discountedAmount;
    } elseif (abs($vatRate - 0.12) < 0.00001) {
        $vatAmount = $discountedAmount * 0.12;
        $totalAmount = $discountedAmount + $vatAmount;
    } else {
        $vatAmount = 0;
        $totalAmount = $discountedAmount;
    }

    $paid = (float)($data["purchase_order_payment"] ?? 0);
    $balance = max(0, $totalAmount - $paid);

    return [
        "vat_rate" => $vatRate,
        "discount" => $discount,
        "vat_amount" => $vatAmount,
        "total_amount" => $totalAmount,
        "paid" => $paid,
        "balance" => $balance,
    ];
}

// check association
function allowedColumns()
{
    $query = [
        "purchase_order_supplier_name",
        "purchase_order_number",
        "purchase_order_product_name",
        "purchase_order_product_owner_name",
        "purchase_order_total_paid_per_product",
        "formated_date",
    ];
    return $query;
}
