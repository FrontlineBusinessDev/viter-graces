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

// Read all
function checkReadAllLowStock($object, $allowedColumns = [])
{
    $query = $object->readAllLowStock($allowedColumns);
    checkQuery($query, "Empty records. (read All)");
    return $query;
}

// Read all
function checkReadByUserIdLowStock($object, $allowedColumns = [])
{
    $query = $object->readByUserIdLowStock($allowedColumns);
    checkQuery($query, "Empty records. (read All)");
    return $query;
}

// Read all
function checkReadCountLowStock($object)
{
    $query = $object->readCountLowStock();
    checkQuery($query, "Empty records. (read All)");
    return $query;
}
