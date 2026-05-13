<?php
// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
require 'functions.php';
require '../../../../core/Encryption.php';
// use needed classes
require '../../../../models/developer/settings/User.php';
// use notification template
require '../../../../lib/notifications/reset-password.php';
// ACTIVITY LOG DETAILS
require '../../../../controllers/developer/activity-log/functions.php';
require '../../../../models/developer/activity-log/ActivityLog.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new User($conn);
$valActivity = new ActivityLog($conn);
$encrypt = new Encryption();
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// get $_GET data
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    // check data
    checkPayload($data);
    // get data 

    $val->user_account_key = $encrypt->doHash(rand());
    $val->user_account_updated = date("Y-m-d H:i:s");
    $val->user_account_email = trim($data["user_account_email"]);
    $password_link = "/create-password";

    $queryLogin = getResultData($val->readLogin());
    if (count($queryLogin) == 0) {
        returnError("Invalid email. Please use a registered one.");
    };
    $mail = sendEmail(
        $password_link,
        $val->user_account_email,
        $val->user_account_key
    );

    $query = checkResetPasswordByEmail($val);
    // create activity log 
    createActivityLogWithPhp($valActivity, $val, "user", "forget password", $queryLogin[0]);
    http_response_code(200);
    returnSuccess($val, "User Account", $query);
    // return 404 error if endpoint not available
    checkEndpoint();
}

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
