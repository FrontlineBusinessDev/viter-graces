<?php

// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
require 'functions.php';
// use needed classes 
require '../../../../models/developer/inventory/StockOverview.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new StockOverview($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    // check data
    checkPayload($data);

    $val->filters = [];
    $query = checkReadCountLowStock($val);
    http_response_code(200);
    getQueriedData($query);
}

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
