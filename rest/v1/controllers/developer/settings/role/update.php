<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Role($conn);
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // check data
    checkPayload($data);
    // get data
    $val->role_aid = $_GET['id'];
    $val->role_name = checkIndex($data, "role_name");
    $val->role_code = "r_is_" . strtolower($val->role_name);
    $val->role_description = checkIndex($data, "role_description");
    $val->role_updated = date("Y-m-d H:i:s");

    $val_name_old = $data['role_name_old'];

    checkId($val->role_aid);
    compareName($val, $val_name_old, $val->role_name);
    // update
    $query = checkUpdate($val);
    returnSuccess($val, "Role", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
