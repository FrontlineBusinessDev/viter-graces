<?php
// check database connection
require '../../../../lib/notifications/verify-account.php';
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new ProductOwner($conn);
$valActivity = new ActivityLog($conn);
$encrypt = new Encryption();
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
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
$val->user_account_is_active = 1;
$val->user_account_created = date("Y-m-d H:i:s");
$val->user_account_updated = date("Y-m-d H:i:s");
$val->column_fullname = $val->user_account_first_name . " " . $val->user_account_last_name;
// check name
isNameExist($val, $val->column_fullname);
// create

$queryRole = getResultData($val->readProductOwnerRole());
if (count($queryRole) > 0) {
    $val->user_account_role_id = $queryRole[0]["id"];
    $val->user_account_role = $queryRole[0]["name"];
} else {
    returnError("Invalid Role code please contact developer.");
}

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
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Role", $query);
}
