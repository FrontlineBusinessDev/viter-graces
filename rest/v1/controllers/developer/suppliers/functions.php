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
