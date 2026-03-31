<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$role = new Role($conn);
// get should not be present
if (array_key_exists("roleid", $_GET)) {
    checkEndpoint();
}
// check data
checkPayload($data);
// get data
$role->role_name = checkIndex($data, "role_name");
$role->role_description = checkIndex($data, "role_description");
$role->role_code = "r_is_" . strtolower($role->role_name);
$role->role_is_active = 1;
$role->role_created = date("Y-m-d H:i:s");
$role->role_datetime = date("Y-m-d H:i:s");
// check name
isNameExist($role, $role->role_name);
// create
$query = checkCreate($role);
returnSuccess($role, "Role", $query);
