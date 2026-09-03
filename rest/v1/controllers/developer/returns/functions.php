<?php
// check association
function isUserAccountAssociated($object)
{
    $query = $object->checkUserAccountAssociated();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

// Create 
function checkCreateMovementStock($object)
{
    $query = $object->createMovementStock();
    checkQuery($query, "There's a problem processing your request. (Create Movement Stock)");
    return $query;
}

// Read all
function checkReadAllActiveByName($object)
{
    $query = $object->readAllActiveByName();
    checkQuery($query, "Empty records. (read all active by name)");
    return $query;
}
// Read all
function checkReadAllThatHaveStock($object)
{
    $query = $object->readAllThatHaveStock();
    checkQuery($query, "Empty records. (read all that have stock)");
    return $query;
}

// Update 
function updateConnectedMenu($object)
{
    //  
}

// check association
function allowedColumns()
{
    $query = [
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
    ];
    return $query;
}
