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
    return;
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
        // "formated_date" is a DATE_FORMAT(...) computed alias (real
        // column is purchase_order_date) and can't be referenced in a
        // WHERE clause under this filter id
    ];
    return $query;
}
