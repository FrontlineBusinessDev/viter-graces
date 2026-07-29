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
        "sales_order_aid",
        "sales_order_status",
        "sales_order_is_active",
        "sales_order_number",
        "sales_order_date",
        "sales_order_customer_id",
        "sales_order_customer_name",
        "sales_order_payment_method",
        "sales_order_product_id",
        "sales_order_product_name",
        "sales_order_qty",
        "sales_order_price",
        "sales_order_total",
        "sales_order_discount",
        "sales_order_tax",
        "sales_order_paid_amount",
        "sales_order_notes",
        "sales_order_received_by_id",
        "sales_order_received_by_name",
        "sales_order_product_owner_id",
        "sales_order_product_owner_name",
        "sales_order_installment",
        "sales_order_due_date",
        "sales_order_total_receivable_amount",
        "sales_order_payment_method",
        "sales_order_paid_per_product",
        "total_amount_per_product",
        "name",
        "id",
        "order_date",
        "is_active",
        "total_paid",
        "total_sub_amount",
        "total_amount",
        "is_status",
    ];
    return $query;
}
