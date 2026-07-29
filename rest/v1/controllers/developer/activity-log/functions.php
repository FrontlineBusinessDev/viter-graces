<?php
// check association
function createActivityLog($object, $data)
{
    $object->activity_log_menu = strtolower($data["activity_log_menu"]);
    $object->activity_log_action = strtolower($data["activity_log_action"]);
    $object->activity_log_user_id = $data["activity_log_user_id"];
    $object->activity_log_user_name = strtolower($data["activity_log_user_name"]);
    $object->activity_log_user_role = strtolower($data["activity_log_user_role"]);
    $object->activity_log_description = $data["activity_log_description"];
    $object->activity_log_created = date("Y-m-d H:i:s");
    // create
    checkCreate($object);
}
// check association
function createActivityLogWithPhp($object, $val, $menu, $action, $data)
{
    $object->activity_log_menu = strtolower($menu);
    $object->activity_log_action = strtolower($action);
    $object->activity_log_user_id = $data["activity_log_user_id"];
    $object->activity_log_user_name = strtolower($data["activity_log_user_name"]);
    $object->activity_log_user_role = strtolower($data["activity_log_user_role"]);
    $object->activity_log_description = json_encode($val);
    $object->activity_log_created = date("Y-m-d H:i:s");

    // create
    checkCreate($object);
}

// Read all
function checkReadByLimit($object)
{
    $query = $object->readByLimit();
    checkQuery($query, "Empty records. (read by limit)");
    return $query;
}

// check association
function allowedColumnsActivityLog()
{
    $query = [
        "activity_log_menu",
        "activity_log_action",
        "activity_log_user_name",
        "activity_log_user_role",
        "activity_log_description",
    ];
    return $query;
}

// Create 
function checkCreateWalkInCustomer($object)
{
    $object->customer_name = "Walk in customer";
    $object->customer_is_active = 1;
    $object->customer_is_walk_in_customer = 1;
    $object->customer_email = "";
    $object->customer_phone = "";
    $object->customer_address = "";
    $object->customer_messenger = "";
    $object->customer_whatsapp = "";
    $object->customer_other = "";
    $object->customer_notes = "";
    $object->customer_created = date("Y-m-d H:i:s");
    $object->customer_updated = date("Y-m-d H:i:s");


    $query = $object->create();
    checkQuery($query, "There's a problem processing your request. (create walk in customer data.)");
    return $query;
}

// Create Product
function checkCreateOtherSupplier($object)
{
    $object->suppliers_name = "Other";
    $object->suppliers_is_active = 1;
    $object->suppliers_is_default = 1;
    $object->suppliers_created = date("Y-m-d H:i:s");
    $object->suppliers_updated = date("Y-m-d H:i:s");

    $query = $object->createOtherSupplier();

    $object->suppliers_product_name = "other";
    $object->suppliers_product_price = "0";
    $object->suppliers_product_unit = "--";
    $object->suppliers_product_is_active = 1;
    $object->suppliers_product_supplier_id = $object->lastInsertedId;
    $object->suppliers_product_supplier_name = "Other";
    $object->suppliers_product_created = date("Y-m-d H:i:s");
    $object->suppliers_product_updated = date("Y-m-d H:i:s");

    $query = $object->createProduct();
    checkQuery($query, "There's a problem processing your request. (create other supplier)");
    return $query;
}
