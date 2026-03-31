<?php
// check association
function isUserSystemAssociated($object)
{
    $query = $object->checkUserSystemAssociation();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

function isUserOtherAssociated($object)
{
    $query = $object->checkUserOtherAssociation();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}
