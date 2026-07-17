<?php

// set http header
require '../../../core/header.php';
// use needed functions
require '../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../models/developer/customer/Customer.php';
// ACTIVITY LOG DETAILS
require '../../../controllers/developer/activity-log/functions.php';
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

    $val->due_date = date('Y-m-d');
    $val->installmet_payment_customer_id = $data["id"];

    $val->column_search = $data["searchValue"];    // get data 
    $val->filters = $data['columnFilters'];
    $total_result_final = [];
    $queryOverdueBalance = checkReadAllOverdueBalance($val, allowedColumnsOverview());
    $dataSet = getResultData($queryOverdueBalance);
    $queryOpenBalance = checkReadAllOpenBalance($val, allowedColumnsOverview());
    $dataSetOP = getResultData($queryOpenBalance);

    $totalOpenBalance = 0;
    $totalOverdueBalance = 0;
    $totalNumberOfOrders = 0;
    $totalTotalAmountSpent = 0;

    if (count($dataSet) > 0) {

        $totalOverdueBalance = array_sum(array_column($dataSet, 'amount'));
    }

    if (count($dataSetOP) > 0) {
        $totalTotalAmountSpent = array_sum(array_column($dataSetOP, 'total_paid'));
        $totalNumberOfOrders = array_sum(array_column($dataSetOP, 'number_of_order'));
        $totalOpenBalance = array_sum(array_column($dataSetOP, 'balance'));
    }

    $total_result_final[] = [
        'open_balance' => $totalOpenBalance,
        'overdue_balance' => $totalOverdueBalance,
        'number_of_order' => $totalNumberOfOrders,
        'total_amount_spent' => $totalTotalAmountSpent
    ];

    http_response_code(200);

    $response = new Response();
    $returnData = [];
    $returnData["data"] = $total_result_final;
    $returnData["count"] = count($total_result_final);
    $returnData["server_datetime"] = date("Y-m-d H:i:s");
    $returnData["success"] = true;
    $response->setData($returnData);
    $response->send();
    exit;
}

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
