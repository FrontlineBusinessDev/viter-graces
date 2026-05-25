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

// Update 
function updateConnectedMenu($object)
{
    // 


}

// check association
function allowedColumns()
{
    $query = [
        "products_is_active",
        "products_status",
        "products_name",
        "products_sku",
        "products_category",
        "products_price",
        "products_cost",
        "products_stocks",
        "products_suppliers_name",
        "products_owner_name",
        "products_sales",
        "products_unit",
        "products_barcode",
        "products_low_stock_threshold",
        "products_description",
    ];
    return $query;
}
