<?php

// set http header
require '../../../core/header.php';
// use needed functions
require '../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../models/developer/products/Products.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Products($conn);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();

    $val->filters = [];
    $query = checkReadAllActiveByName($val);
    http_response_code(200);
    getQueriedData($query);
}

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
