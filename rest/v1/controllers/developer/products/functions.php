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
function checkReadAllActive($object, $allowedColumns = [])
{
    $query = $object->readAllActive($allowedColumns);
    checkQuery($query, "Empty records. (read all active )");
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
// Read all
function checkReadAllCategory($object)
{
    $query = $object->readAllCategory();
    checkQuery($query, "Empty records. (read All Category)");
    return $query;
}

// Update 
function updateConnectedMenu($object)
{
    // 


}
// Update 
function updateProductOwner($object)
{

    $queryPOSO = $object->updateProductOwnerSalesOrder();
    checkQuery($queryPOSO, "There's a problem processing your request. (updateProductOwnerSalesOrder)");
    $queryPOSM = $object->updateProductOwnerStockMovement();
    checkQuery($queryPOSM, "There's a problem processing your request. (updateProductOwnerStockMovement)");
    $queryPOSM = $object->updateProductOwnerRetun();
    checkQuery($queryPOSM, "There's a problem processing your request. (updateProductOwnerRetun)");

    return;
}

// Delete 
function checkDeleteMovementStock($object)
{
    $query = $object->deleteMovementStock();
    checkQuery($query, "There's a problem processing your request. (deleteMovementStock)");
    return $query;
}
// check association
function isAssociatedWithOtherModule($object)
{
    $query = $object->checkAssociationSaleOrder();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
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
