<?php
// check association
function createActivityLog($object, $data)
{
    $object->activity_log_menu = $data["activity_log_menu"];
    $object->activity_log_action = $data["activity_log_action"];
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
    $object->activity_log_menu = $menu;
    $object->activity_log_action = $action;
    $object->activity_log_user_id = $data["activity_log_user_id"];
    $object->activity_log_user_name = strtolower($data["activity_log_user_name"]);
    $object->activity_log_user_role = strtolower($data["activity_log_user_role"]);
    $object->activity_log_description = json_encode($val);
    $object->activity_log_created = date("Y-m-d H:i:s");


    // create
    checkCreate($object);
}
