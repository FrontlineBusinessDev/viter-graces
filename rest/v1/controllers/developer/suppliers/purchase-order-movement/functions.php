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
        // the frontend's status/date filters send the SELECT alias ids
        // actually used by the column, not the raw column names above
        "is_status",
        "formated_date",
        "formated_delivery_date",
    ];
    return $query;
}

// Read all
function checkReadAllActive($object, $allowedColumns = [])
{
    $query = $object->readAllActive($allowedColumns);
    checkQuery($query, "Empty records. (read All)");
    return $query;
}
// Read all
function checkReadAllActiveById($object, $allowedColumns = [])
{
    $query = $object->readAllActiveById($allowedColumns);
    checkQuery($query, "Empty records. (read by po id)");
    return $query;
}
