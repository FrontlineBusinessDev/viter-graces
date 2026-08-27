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
        "name",
        "id",
        "is_status",
    ];
    return $query;
}
