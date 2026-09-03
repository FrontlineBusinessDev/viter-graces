<?php


// Read all
function checkReadByProductOwner($object, $readByProductOwner = [])
{
    $query = $object->readByProductOwner($readByProductOwner);
    checkQuery($query, "Empty records. (read All)");
    return $query;
}

// Read all
function checkReadByReceivedBy($object, $readByProductOwner = [])
{
    $query = $object->readByReceivedBy($readByProductOwner);
    checkQuery($query, "Empty records. (read All)");
    return $query;
}

// Read limit
function checkReadByProductOwnerLimit($object, $readByProductOwner = [])
{
    $query = $object->readByProductOwnerLimit($readByProductOwner);
    checkQuery($query, "Empty records. (limit)");
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

function checkUpdatePurchaseOrder($object)
{
    $query = $object->updatePurchaseOrder();
    checkQuery($query, "There's a problem processing your request. (UpdatePurchaseOrder)");
    return $query;
}
// Update 
function checkUpdateSuppliersProduct($object)
{
    $query = $object->updateSuppliersProduct();
    checkQuery($query, "There's a problem processing your request. (Update Suppliers Product)");
    return $query;
}
// Update 
function checkUpdateSuppliersProductOwnerName($object)
{
    $query = $object->updateSuppliersProductOwnerName();
    checkQuery($query, "There's a problem processing your request. (Update Suppliers Product owner name)");
    return $query;
}
// Update
function checkUpdateSalesOrder($object)
{
    $query = $object->updateSalesOrder();
    checkQuery($query, "There's a problem processing your request. (Update Sales Order)");
    return $query;
}
// Update
function checkUpdateStockMovement($object)
{
    $query = $object->updateStockMovement();
    checkQuery($query, "There's a problem processing your request. (Update Stock Movement)");
    return $query;
}
// Update
function checkUpdateReturnProduct($object)
{
    $query = $object->updateReturnProduct();
    checkQuery($query, "There's a problem processing your request. (Update Return Product)");
    return $query;
}


// Reset password
function updateConnectedMenu($object)
{
    // checkUpdateActivityLog($object);
    checkUpdateProducts($object);
    checkUpdatePurchaseOrder($object);
    checkUpdateSuppliersProductOwnerName($object);
    checkUpdateSalesOrder($object);
    checkUpdateStockMovement($object);
    checkUpdateReturnProduct($object);
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

// check association
function allowedProductColumns()
{
    $query = [
        "stock_movement_date",
        "stock_movement_type",
        "stock_movement_status",
        "stock_movement_is_active",
        "stock_movement_product_name",
        "stock_movement_before_qty",
        "stock_movement_after_qty",
        "stock_movement_qty",
        "stock_movement_location",
        "stock_movement_product_owner_name",
        "stock_movement_notes",
        "inventory_status"
    ];
    return $query;
}
