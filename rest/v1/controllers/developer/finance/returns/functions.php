<?php

// check association
function allowedColumns()
{
    $query = [
        "return_product_aid",
        "return_product_status",
        "return_product_number",
        "return_product_order_id",
        "return_product_order_number",
        "return_product_customer_id",
        "return_product_customer_name",
        "return_product_date",
        "return_product_amount",
        "return_product_product_id",
        "return_product_product_name",
        "return_product_qty",
        "return_product_price",
        "return_product_reason",
        "return_product_is_restocked",
        "return_product_owner_id",
        "return_product_owner_name",
        "return_product_resolution_type",
        "return_product_refund_method",
        "name",
        "id",
        "is_status",
    ];
    return $query;
}

// translates the UI-only "display_status" filter (Pending/Refunded/Open/
// Completed/Rejected) into a SQL condition on the real status + resolution
// type columns
function displayStatusCondition($value)
{
    $value = strtolower(trim($value));

    $map = [
        "pending" => "return_product_status = 'pending'",
        "rejected" => "return_product_status = 'rejected'",
        "refunded" => "return_product_status = 'processed' and return_product_resolution_type = 'refund'",
        "open" => "return_product_status = 'processed' and return_product_resolution_type = 'credit memo'",
        "completed" => "return_product_status = 'processed' and return_product_resolution_type = 'replacement'",
    ];

    return $map[$value] ?? "1 = 0";
}
