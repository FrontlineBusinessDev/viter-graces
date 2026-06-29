<?php
// check association
function isUserAccountAssociated($object)
{
    $query = $object->checkUserAccountAssociated();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

// Read all
function checkReadExpensesToday($object)
{
    $query = $object->readExpensesToday();
    checkQuery($query, "Empty records. (read expenses today)");
    return $query;
}

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
        "purchase_order_price",
    ];
    return $query;
}

// Delete 
function checkDeleteById($object)
{
    $query = $object->deleteById();
    checkQuery($query, "There's a problem processing your request. (deleteById)");
    return $query;
}
