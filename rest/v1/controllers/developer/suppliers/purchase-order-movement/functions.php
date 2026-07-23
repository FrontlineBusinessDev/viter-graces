<?php

// check association
function allowedColumns()
{
    $query = [
        "purchase_order_number",
        "purchase_order_supplier_name",
        "purchase_order_date",
        "purchase_order_expected_delivery",
        "purchase_order_total_amount",
        "purchase_order_is_active",
        "purchase_order_status",
        "purchase_order_payment_status",
        "purchase_order_note",
        "purchase_order_product_name",
        "purchase_order_product_owner_name",
        "purchase_order_qty",
        "purchase_order_payment",
        "purchase_order_movement_status",
        "purchase_order_before_qty",
        "purchase_order_after_qty",
    ];
    return $query;
}
