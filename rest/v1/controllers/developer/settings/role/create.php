<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Role($conn);
// get should not be present
if (array_key_exists("roleid", $_GET)) {
    checkEndpoint();
}
// check data
checkPayload($data);
// get data
$val->role_name = checkIndex($data, "role_name");
$val->role_description = checkIndex($data, "role_description");
$val->role_code = "r_is_" . strtolower($val->role_name);
$val->role_is_active = 1;
$val->role_created = date("Y-m-d H:i:s");
$val->role_updated = date("Y-m-d H:i:s");
// check name
isNameExist($val, $val->role_name);
// create
$query = checkCreate($val);
returnSuccess($val, "Role", $query);
