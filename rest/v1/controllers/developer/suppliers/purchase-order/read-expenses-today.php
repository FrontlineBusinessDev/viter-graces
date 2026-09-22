<?php

// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../../models/developer/suppliers/SuppliersPurchaseOrder.php';

// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new SuppliersPurchaseOrder($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true) ?? [];
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();

    $val->date_today = date("Y-m-d");
    $val->date_yesterday = date('Y-m-d', strtotime('-1 day'));
    $val->userId = (float)($data["id"] ?? 0);

    $val->filters = [];
    $query = checkReadExpensesToday($val);
    http_response_code(200);
    getQueriedData($query);
}

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
