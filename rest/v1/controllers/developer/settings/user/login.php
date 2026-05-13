<?php
// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
require 'functions.php';
require '../../../../lib/jwt/vendor/autoload.php';
// use needed classes
require '../../../../models/developer/settings/User.php';
// ACTIVITY LOG DETAILS
require '../../../../controllers/developer/activity-log/functions.php';
require '../../../../models/developer/activity-log/ActivityLog.php';

// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new User($conn);
$valActivity = new ActivityLog($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// get $_GET data
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();

    $donorData = [];
    $val->user_account_email = $data['user_account_email'];
    $password = $data['password'];

    $key = "jwt_admin_ko_ito";

    $result = checkLogin($val);

    $row = $result->fetch(PDO::FETCH_ASSOC);
    extract($row);

    loginAccess(
        $password,
        $user_account_password,
        $user_account_email,
        $row,
        $result,
        $key
    );
    $queryLogin = getResultData($val->readLogin());
    if (count($queryLogin) > 0) {
        // create activity log
        createActivityLogWithPhp($valActivity, $val, "user", "login", $queryLogin[0]);
    };
}

http_response_code(200);
