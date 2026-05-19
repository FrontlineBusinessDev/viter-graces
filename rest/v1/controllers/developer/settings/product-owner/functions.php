<?php


// Read all
function checkReadByProductOwner($object)
{
    $query = $object->readByProductOwner();
    checkQuery($query, "Empty records. (read All)");
    return $query;
}

// Read limit
function checkReadByProductOwnerLimit($object)
{
    $query = $object->readByProductOwnerLimit();
    checkQuery($query, "Empty records. (limit)");
    return $query;
}

function checkUpdateActivityLog($object)
{
    $query = $object->updateActivityLog();
    checkQuery($query, "There's a problem processing your request. (UpdateActivityLog)");
    return $query;
}

function checkUpdateProducts($object)
{
    $query = $object->updateProducts();
    checkQuery($query, "There's a problem processing your request. (UpdateProducts)");
    return $query;
}

function checkUpdatePurchaseOrder($object)
{
    $query = $object->updatePurchaseOrder();
    checkQuery($query, "There's a problem processing your request. (UpdatePurchaseOrder)");
    return $query;
}
// Update 
function checkUpdateSuppliersProduct($object)
{
    $query = $object->updateSuppliersProduct();
    checkQuery($query, "There's a problem processing your request. (Update Suppliers Product)");
    return $query;
}


// Reset password
function updateConnectedMenu($object)
{
    checkUpdateActivityLog($object);
    checkUpdateProducts($object);
    checkUpdatePurchaseOrder($object);
    checkUpdateSuppliersProduct($object);
}
