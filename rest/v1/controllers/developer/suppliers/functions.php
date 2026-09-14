<?php
// check association
function isUserAccountAssociated($object)
{
    $query = $object->checkUserAccountAssociated();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

// Create Product
function checkCreateProduct($object)
{
    $query = $object->createProduct();
    checkQuery($query, "There's a problem processing your request. (createProduct)");
    return $query;
}

// create Supplier Description
function checkCreateSupplierDescription($object)
{
    $query = $object->createSupplierDescription();
    checkQuery($query, "There's a problem processing your request. (createSupplierDescription)");
    return $query;
}

// Update 
function checkUpdateProductSupplier($object)
{
    $query = $object->updateProductSupplier();
    checkQuery($query, "There's a problem processing your request. (update product supplier)");
    return $query;
}

// check is associated by id
function checkAssociatedInPurchaseOrderById($object)
{
    $query = $object->associatedInPurchaseOrderById();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

// Update 
function updateConnectedMenu($object)
{
    checkUpdateProductSupplier($object);
}

// check association
function allowedColumns()
{
    $query = [
        "suppliers_is_active",
        "suppliers_name",
        "suppliers_email",
        "suppliers_phone",
        "suppliers_address",
        "suppliers_contact_person",
        "suppliers_delivery",
    ];
    return $query;
}

// Delete 
function checkDeleteSupplierProduct($object)
{
    $query = $object->deleteSupplierProduct();
    checkQuery($query, "There's a problem processing your request. (deleteSupplierProduct)");
    return $query;
}

// Read all
function checkReadSupplierInModal($object, $allowedColumns = [])
{
    $query = $object->readSupplierInModal($allowedColumns);
    checkQuery($query, "Empty records. (readSupplierInModal)");
    return $query;
}

// Read all
function checkReadBySupplierDescriptionName($object, $allowedColumns = [])
{
    $query = $object->readBySupplierDescriptionName($allowedColumns);
    checkQuery($query, "Empty records. (readBySupplierDescriptionName)");
    return $query;
}

// Read all
function checkReadGoupBySupplierDescriptionName($object, $allowedColumns = [])
{
    $query = $object->readGoupBySupplierDescriptionName($allowedColumns);
    checkQuery($query, "Empty records. (readGoupBySupplierDescriptionName)");
    return $query;
}

// Read all
function checkReadGoupBySupplierName($object, $allowedColumns = [])
{
    $query = $object->readGoupBySupplierName($allowedColumns);
    checkQuery($query, "Empty records. (readGoupBySupplierName)");
    return $query;
}

// Read all
function checkReadGoupBySupplierEmail($object, $allowedColumns = [])
{
    $query = $object->readGoupBySupplierEmail($allowedColumns);
    checkQuery($query, "Empty records. (readGoupBySupplierEmail)");
    return $query;
}
