<?php
// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
require '../../../../lib/jwt/vendor/autoload.php';
// use needed classes
require '../../../../models/developer/settings/User.php';

// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new User($conn);
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
}

http_response_code(200);
