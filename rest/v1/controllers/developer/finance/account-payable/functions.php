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
        "purchase_order_note",
        "purchase_order_product_name",
        "purchase_order_product_owner_name",
        "purchase_order_qty",
        "purchase_order_payment",
        // "payment_status" (aliased from purchase_order_payment_status),
        // "amount", "paid_amount" and "balance_amount" are computed/SUM()
        // aggregate aliases in AccountPayable.php's readAll()/readLimit()
        // and can't be referenced in a WHERE clause
    ];
    return $query;
}

// Update Sales 
function checkUpdateSales($object)
{
    $query = $object->updateSales();
    checkQuery($query, "There's a problem processing your request. (Update Sales)");
    return $query;
}
