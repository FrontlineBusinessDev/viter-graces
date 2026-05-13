<?php

// Reset password
function checkResetPasswordByEmail($object)
{
    $query = $object->resetPasswordByEmail();
    checkQuery($query, "There's a problem processing your request. (reset password)");
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

// Reset password
function updateConnectedMenu($object)
{
    checkUpdateActivityLog($object);
    checkUpdateProducts($object);
}

function checkAssociatedByActivityLog($object)
{
    $query = $object->associatedByActivityLog();
    checkQuery($query, "There's a problem processing your request. (associatedByActivityLog)");
    return $query;
}

function checkAssociatedByProducts($object)
{
    $query = $object->associatedByProducts();
    checkQuery($query, "There's a problem processing your request. (associatedByProducts)");
    return $query;
}
// Reset password
function checkAssociatedByMenu($object)
{
    checkAssociatedByActivityLog($object);
    checkAssociatedByProducts($object);
}
