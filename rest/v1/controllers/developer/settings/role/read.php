<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Role($conn);
// get $_GET data
$error = [];
$returnData = [];

if (array_key_exists("roleid", $_GET)) {
    $val->role_aid = $_GET['roleid'];
    checkId($val->role_aid);
    $query = checkReadById($val);
    http_response_code(200);
    getQueriedData($query);
}

if (empty($_GET)) {
    $query = checkReadAll($val);
    http_response_code(200);
    getQueriedData($query);
}

// return 404 error if endpoint not available
checkEndpoint();
