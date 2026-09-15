<?php
// check association
function isUserAccountAssociated($object)
{
    $query = $object->checkUserAccountAssociated();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

// only pending/rejected returns may be updated or deleted - the one
// exception is reopening a processed return back to pending/rejected,
// which is how a wrongly-processed return gets its stock movement undone
function checkReturnIsEditable($object)
{
    $existing = getResultData($object->readById())[0] ?? null;
    $existingStatus = $existing['return_product_status'] ?? null;
    $isReopening = $existingStatus === "processed" &&
        in_array($object->return_product_status, ["pending", "rejected"]);

    if (!$existing || (!in_array($existingStatus, ["pending", "rejected"]) && !$isReopening)) {
        $response = new Response();
        $error = [];
        $response->setSuccess(false);
        $error['error'] = "Only pending or rejected returns can be updated or deleted.";
        $error["success"] = false;
        $response->setData($error);
        $response->send();
        exit;
    }

    return $existing;
}

// Create
function checkCreateMovementStock($object)
{
    $query = $object->createMovementStock();
    checkQuery($query, "There's a problem processing your request. (Create Movement Stock)");
    return $query;
}

// Delete the "stock in - return" movement tied to a reopened return, so the
// restocked qty is backed out of current_qty (computed from movement rows)
function checkDeleteReturnMovement($object)
{
    $query = $object->deleteMovementByReturnId();
    checkQuery($query, "There's a problem processing your request. (Delete Movement Stock)");
    return $query;
}

// Read all
function checkReadAllActiveByName($object)
{
    $query = $object->readAllActiveByName();
    checkQuery($query, "Empty records. (read all active by name)");
    return $query;
}
// Read all
function checkReadAllThatHaveStock($object)
{
    $query = $object->readAllThatHaveStock();
    checkQuery($query, "Empty records. (read all that have stock)");
    return $query;
}

// Update 
function updateConnectedMenu($object)
{
    //  
}

// check association
function allowedColumns()
{
    $query = [
        "return_product_status",
        // aliased as "is_status" and "resolution_type" in Returns.php's
        // readAll()/readLimit() SELECT - both frontend-facing alias ids are
        // listed here too since the filter id sent by the UI is the alias,
        // not the real column; Returns.php's buildFilterColumns() maps them
        // back to the real column via $columnAliasMap before the WHERE
        "is_status",
        "resolution_type",
        "return_product_number",
        "return_product_order_id",
        "return_product_order_number",
        "return_product_customer_id",
        "return_product_customer_name",
        "return_product_date",
        "return_product_amount",
        "return_product_product_id",
        "return_product_product_name",
        "return_product_qty",
        "return_product_price",
        "return_product_reason",
        "return_product_is_restocked",
        "return_product_owner_id",
        "return_product_owner_name",
        "return_product_resolution_type",
    ];
    return $query;
}

// read all returned order numbers
function checkReadAllReturnedOrderNumbers($object, $allowedColumns = [])
{
    $query = $object->readAllReturnedOrderNumbers($allowedColumns);
    checkQuery($query, "Empty records. (read all returned order numbers)");
    return $query;
}

// read all returned product numbers
function checkReadAllReturnedProductNumbers($object, $allowedColumns = [])
{
    $query = $object->readAllReturnedProductNumbers($allowedColumns);
    checkQuery($query, "Empty records. (read all returned product numbers)");
    return $query;
}

// read all returned product reasons
function checkReadAllReturnedProductReasons($object, $allowedColumns = [])
{
    $query = $object->readAllReturnedProductReasons($allowedColumns);
    checkQuery($query, "Empty records. (read all returned product reasons)");
    return $query;
}
