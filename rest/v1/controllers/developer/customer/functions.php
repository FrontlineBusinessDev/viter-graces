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
