<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new User($conn);
// get should not be present
if (array_key_exists("roleid", $_GET)) {
    checkEndpoint();
}
// check data
checkPayload($data);
// get data
$val->user_account_first_name = checkIndex($data, "user_account_first_name");
$val->user_account_last_name = checkIndex($data, "user_account_last_name");
$val->user_account_email = checkIndex($data, "user_account_email");
$val->user_account_id = checkIndex($data, "user_account_id");
$val->user_account_role = checkIndex($data, "user_account_role");
$val->user_account_is_active = 1;
$val->user_account_created = date("Y-m-d H:i:s");
$val->user_account_updated = date("Y-m-d H:i:s");
$val->column_fullname = $val->user_account_first_name . " " . $val->user_account_last_name;
// check name
isNameExist($val, $val->column_fullname);
// create
$query = checkCreate($val);
returnSuccess($val, "Role", $query);
