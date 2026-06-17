<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Products($conn);
// get $_GET data
$error = [];
$returnData = [];

if (array_key_exists("id", $_GET)) {
    $val->filters = [];
    $val->products_aid = $_GET['id'];
    checkId($val->products_aid);
    $query = checkReadById($val);
    http_response_code(200);
    getQueriedData($query);
}

if (empty($_GET)) {
    $val->filters = [];
    $query = checkReadAll($val);
    http_response_code(200);
    getQueriedData($query);
}

// return 404 error if endpoint not available
checkEndpoint();
