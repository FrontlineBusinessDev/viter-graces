<?php
// check association
function isUserAccountAssociated($object)
{
    $query = $object->checkUserAccountAssociated();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

// Read all
function checkReadExpensesToday($object)
{
    $query = $object->readExpensesToday();
    checkQuery($query, "Empty records. (read expenses today)");
    return $query;
}

// check association
function allowedColumns()
{
    $query = [
        "purchase_order_number",
        "purchase_order_supplier_name",
        "purchase_order_date",
        "purchase_order_expected_delivery",
        "purchase_order_total_amount",
        "purchase_order_is_active",
        "purchase_order_status",
        "purchase_order_payment_status",
        "purchase_order_note",
        "purchase_order_product_name",
        "purchase_order_product_owner_name",
        "purchase_order_qty",
        "purchase_order_payment",
        "total_amount",
    ];
    return $query;
}

// Delete 
function checkDeleteById($object)
{
    $query = $object->deleteById();
    checkQuery($query, "There's a problem processing your request. (deleteById)");
    return $query;
}

// Read all
function deliveryStatus($val, $data)
{

    $purchase_order = $data["purchase_order"];
    $isHaveNotDelivered = $data["isHaveNotDelivered"];

    $val->purchase_order_delivery_status = "for delivery";

    if ($isHaveNotDelivered > 0 && $val->purchase_order_payment_status == "paid") {
        $val->purchase_order_delivery_status = "delivered - incomplete / paid";
    }
    if ($isHaveNotDelivered > 0 && $val->purchase_order_payment_status == "unpaid") {
        $val->purchase_order_delivery_status = "delivered - incomplete / unpaid";
    }
    if ($isHaveNotDelivered == 0 && $val->purchase_order_payment_status == "paid") {
        $val->purchase_order_delivery_status = "delivered - completed / paid";
    }
    if ($isHaveNotDelivered == 0 && $val->purchase_order_payment_status == "unpaid") {
        $val->purchase_order_delivery_status = "delivered - completed / unpaid";
    }
    if ($isHaveNotDelivered == count($purchase_order) && $val->purchase_order_payment_status == "paid") {
        $val->purchase_order_delivery_status = "not delivered / paid";
    }
    if ($isHaveNotDelivered == count($purchase_order) && $val->purchase_order_payment_status == "unpaid") {
        $val->purchase_order_delivery_status = "not delivered / unpaid";
    }
    return;
}
