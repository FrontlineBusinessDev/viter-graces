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
        "ms.stock_movement_date",
        "ms.stock_movement_type",
        "ms.stock_movement_status",
        "ms.stock_movement_is_active",
        "ms.stock_movement_product_name",
        "ms.stock_movement_before_qty",
        "ms.stock_movement_after_qty",
        "ms.stock_movement_qty",
        "ms.stock_movement_location",
        "ms.stock_movement_product_owner_name",
        "ms.stock_movement_notes",
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
function checkReadCountLowStock($object)
{
    $query = $object->readCountLowStock();
    checkQuery($query, "Empty records. (read All)");
    return $query;
}
