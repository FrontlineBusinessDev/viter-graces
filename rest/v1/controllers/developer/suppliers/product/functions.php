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
        "suppliers_product_is_active",
        "suppliers_product_name",
        "suppliers_product_price",
        "suppliers_product_unit",
        "suppliers_product_supplier_name",
    ];
    return $query;
}
