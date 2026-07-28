<?php
// check association
function isUserAccountAssociated($object)
{
    $query = $object->checkUserAccountAssociated();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

// check association
function allowedColumns()
{
    $query = [
        "customer_is_active",
        "customer_name",
        "customer_email",
        "customer_phone",
        "customer_address",
        "customer_notes",
    ];
    return $query;
}

// Read all
function checkReadAllOverdueBalance($object, $allowedColumns = [])
{
    $query = $object->readAllOverdueBalance($allowedColumns);
    checkQuery($query, "Empty records. (read all overdue balance)");
    return $query;
}

// Read all
function checkReadAllOpenBalance($object, $allowedColumns = [])
{
    $query = $object->readAllOpenBalance($allowedColumns);
    checkQuery($query, "Empty records. (read all open balance)");
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
function checkReadWalkInCustomer($object)
{
    $query = $object->readWalkInCustomer();
    checkQuery($query, "Empty records. (readWalkInCustomer)");
    return $query;
}

// Create 
function checkCreateWalkInCustomer($object)
{
    $object->customer_name = "Walk in customer";
    $object->customer_is_active = 1;
    $object->customer_is_walk_in_customer = 1;
    $object->customer_email = "";
    $object->customer_phone = "";
    $object->customer_address = "";
    $object->customer_messenger = "";
    $object->customer_whatsapp = "";
    $object->customer_other = "";
    $object->customer_notes = "";
    $object->customer_created = date("Y-m-d H:i:s");
    $object->customer_updated = date("Y-m-d H:i:s");


    $query = $object->create();
    checkQuery($query, "There's a problem processing your request. (create walk in customer data.)");
    return $query;
}

// check association
function allowedColumnsOverview()
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
        "due_date",
        "installment_payment_aid",
        "installment_payment_is_paid",
        "installment_payment_code",
        "installment_payment_code_id",
        "installment_payment_code_number",
        "installment_payment_due_date",
        "installment_payment_method",
        "installment_payment_amount",
        "installment_payment_customer_id",
        "installment_payment_customer_name",
    ];
    return $query;
}
