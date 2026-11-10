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

// allowed filter columns
function allowedColumns()
{
    $query = [
        "user_account_first_name",
        "user_account_last_name",
        "user_account_email",
        "user_account_role",
        "user_account_is_active",
    ];
    return $query;
}

// Read all
function checkReadGoupByName($object, $readByProductOwner = [])
{
    $query = $object->readGoupByName($readByProductOwner);
    checkQuery($query, "Empty records. (Read Goup By Name)");
    return $query;
}

// Read all
function checkReadGoupByEmail($object, $readByProductOwner = [])
{
    $query = $object->readGoupByEmail($readByProductOwner);
    checkQuery($query, "Empty records. (Read Goup By Email)");
    return $query;
}

// Read all
function checkReadGoupByRole($object, $readByProductOwner = [])
{
    $query = $object->readGoupByRole($readByProductOwner);
    checkQuery($query, "Empty records. (Read Goup By Role)");
    return $query;
}

// Read all
function checkReadGoupByProductOwner($object, $readByProductOwner = [])
{
    $query = $object->readGoupByProductOwner($readByProductOwner);
    checkQuery($query, "Empty records. (Read Goup By Product Owner)");
    return $query;
}

// Read all
function checkReadGoupByProductOwnerEmail($object, $readByProductOwner = [])
{
    $query = $object->readGoupByProductOwnerEmail($readByProductOwner);
    checkQuery($query, "Empty records. (Read Goup By Product Owner Email)");
    return $query;
}
