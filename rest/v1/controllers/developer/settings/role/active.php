<?php
// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
// use needed classes
require '../../../../models/developer/settings/Role.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Role($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// get $_GET data
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    if (array_key_exists("id", $_GET)) {
        // check data
        checkPayload($data);
        $val->role_aid = $_GET['id'];
        $val->role_is_active = trim($data["isActive"]);
        $val->role_updated = date("Y-m-d H:i:s");
        checkId($val->role_aid);
        $query = checkActive($val);
        http_response_code(200);
        returnSuccess($val, "Role", $query);
    }
    // return 404 error if endpoint not available
    checkEndpoint();
}

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
