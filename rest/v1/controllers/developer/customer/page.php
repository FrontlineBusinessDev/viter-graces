<?php

// set http header
require '../../../core/header.php';
// use needed functions
require '../../../core/functions.php';
// use needed classes
require '../../../models/developer/customer/Customer.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Customer($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    // check data
    checkPayload($data);

    if (array_key_exists("start", $_GET)) {
        $val->column_search = $data["searchValue"];    // get data 
        $val->column_start = $_GET['start'];
        $val->column_total = 15;

        // FOR MULTIPLE FILTER 
        $val->filters = $data['columnFilters'];
        checkLimitId($val->column_start, $val->column_total);

        $query = checkReadLimit($val);
        $total_result = checkReadAll($val);
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
