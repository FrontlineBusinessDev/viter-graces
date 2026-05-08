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
