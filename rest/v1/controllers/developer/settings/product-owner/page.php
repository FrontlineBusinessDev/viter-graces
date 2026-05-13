<?php

// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../../models/developer/settings/ProductOwner.php';
// ACTIVITY LOG DETAILS
require '../../../../controllers/developer/activity-log/functions.php';
require '../../../../models/developer/activity-log/ActivityLog.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new ProductOwner($conn);
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    checkPayload($data);

    if (array_key_exists("start", $_GET)) {
        $val->column_search = $data["searchValue"];    // get data 
        $val->column_start = $_GET['start'];
        $val->column_total = 15;
        $val->filters = [];
        $val->max = PHP_INT_MAX;

        checkLimitId($val->column_start, $val->column_total);

        $query = checkReadByProductOwnerLimit($val);
        $total_result = checkReadByProductOwner($val);
        http_response_code(200);

        checkReadQuery(
            $query,
            $total_result,
            $val->column_total,
            $val->column_start
        );

        // return 404 error if endpoint not available
        checkEndpoint();
    }
}

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
