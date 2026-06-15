<?php

// set http header
require '../../../core/header.php';
// use needed functions
require '../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../models/developer/activity-log/ActivityLog.php';
require '../../../controllers/developer/customer/functions.php';
require '../../../models/developer/customer/Customer.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new ActivityLog($conn);
$valCustomer = new Customer($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    // check data
    checkPayload($data);

    if (empty($_GET)) {

        $queryCustomer = getResultData($valCustomer->readWalkInCustomer());
        if (count($queryCustomer) == 0) {
            checkCreateWalkInCustomer($valCustomer);
        }

        $val->column_total = $data['limit'];
        $query = checkReadByLimit($val);
        http_response_code(200);
        getQueriedData($query);
    }
}

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
