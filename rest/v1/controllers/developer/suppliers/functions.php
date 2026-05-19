<?php
// check association
function isUserAccountAssociated($object)
{
    $query = $object->checkUserAccountAssociated();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

// Create Product
function checkCreateProduct($object)
{
    $query = $object->createProduct();
    checkQuery($query, "There's a problem processing your request. (createProduct)");
    return $query;
}

// Update 
function checkUpdateProductSupplier($object)
{
    $query = $object->updateProductSupplier();
    checkQuery($query, "There's a problem processing your request. (update product supplier)");
    return $query;
}

// Update 
function updateConnectedMenu($object)
{
    checkUpdateProductSupplier($object);
}
