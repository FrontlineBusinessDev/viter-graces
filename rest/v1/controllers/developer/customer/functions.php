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
    $object->customer_created = date("Y-m-d H:i:s");
    $object->customer_updated = date("Y-m-d H:i:s");

    $query = $object->createWalkInCustomer();
    checkQuery($query, "There's a problem processing your request. (create walk in customer)");
    return $query;
}
