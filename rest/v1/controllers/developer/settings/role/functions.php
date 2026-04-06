<?php
// check association
function isUserAccountAssociated($object)
{
    $query = $object->checkUserAccountAssociated();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

// Update 
function checkUpdateUserAccountRole($object)
{
    $query = $object->updateUserAccountRole();
    checkQuery($query, "There's a problem processing your request. (update role)");
    return $query;
}
