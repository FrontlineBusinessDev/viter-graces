<?php
// Read all
function checkReadAllSalesOrder($object, $allowedColumns = [])
{
    $query = $object->readAllSalesOrder($allowedColumns);
    checkQuery($query, "Empty records. (checkReadAllSalesOrder)");
    return $query;
}
// Read all
function checkReadAllSalesOrderAmount($object, $allowedColumns = [])
{
    $query = $object->readAllSalesOrderAmount($allowedColumns);
    checkQuery($query, "Empty records. (readAllSalesOrderAmount)");
    return $query;
}

// Read limit
function checkReadAllSalesOrderLimit($object, $allowedColumns = [])
{
    $query = $object->readAllSalesOrderLimit($allowedColumns);
    checkQuery($query, "Empty records. (limit)");
    return $query;
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
        "sales_order_overall_amount",
    ];
    return $query;
}

// Update 
function updateConnectedMenu($object)
{
    // 


}
