<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new User($conn);
$encrypt = new Encryption();
require '../../../../lib/notifications/verify-account.php';
// get should not be present
if (array_key_exists("roleid", $_GET)) {
    checkEndpoint();
}
// check data
checkPayload($data);
// get data
$val->user_account_first_name = checkIndex($data, "user_account_first_name");
$val->user_account_last_name = checkIndex($data, "user_account_last_name");
$val->user_account_email = trim(checkIndex($data, "user_account_email"));
$val->user_account_role_id = checkIndex($data, "user_account_role_id");
$val->user_account_role = checkIndex($data, "user_account_role");
$val->user_account_is_active = 1;
$val->user_account_created = date("Y-m-d H:i:s");
$val->user_account_updated = date("Y-m-d H:i:s");
$val->column_fullname = $val->user_account_first_name . " " . $val->user_account_last_name;
// check name
isNameExist($val, $val->column_fullname);
// create

$val->user_account_key = $encrypt->doHash(rand());
$password_link = checkIndex($data, "password_link");

$emailIsSent = sendEmail(
    $password_link,
    $val->column_fullname,
    $val->user_account_email,
    $val->user_account_key
);

if (!$emailIsSent['mail_success']) {
    returnError("Invalid create account error in sending verification email");
} else {

    $query = checkCreate($val);
    returnSuccess($val, "Role", $query);
}
