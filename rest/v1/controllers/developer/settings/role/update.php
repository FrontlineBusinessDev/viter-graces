<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$role = new Role($conn);
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("roleid", $_GET)) {
    // check data
    checkPayload($data);
    // get data
    $role->role_aid = $_GET['roleid'];
    $role->role_name = checkIndex($data, "role_name");
    $role->role_code = "r_is_" . strtolower($role->role_name);
    $role->role_description = checkIndex($data, "role_description");
    $role->role_datetime = date("Y-m-d H:i:s");

    $role_name_old = $data['role_name_old'];

    checkId($role->role_aid);
    compareName($role, $role_name_old, $role->role_name);
    // update
    $query = checkUpdate($role);
    returnSuccess($role, "Role", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
