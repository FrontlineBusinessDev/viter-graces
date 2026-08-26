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
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

function checkAssociatedByProducts($object)
{
    $query = $object->associatedByProducts();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}
// Reset password
function checkAssociatedByMenu($object)
{
    checkAssociatedByActivityLog($object);
    checkAssociatedByProducts($object);
}

// check association
function allowedColumns()
{
    $query = [
        "user_account_first_name",
        "user_account_last_name",
        "user_account_email",
        "user_account_role",
    ];
    return $query;
}
