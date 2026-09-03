<?php

// set http header
require '../../../core/header.php';
// use needed functions
require '../../../core/functions.php';
require 'functions.php';
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

    $val->customer_aid = $data["id"];
    // excludes the order currently being edited so it doesn't count
    // its own previously-applied credit memo against itself
    $val->sales_order_number = $data["excludeSalesOrderNumber"] ?? "";

    $queryReturn = $val->readReturnByOpenCreditMemo();
    $queryReturn = $queryReturn
        ? getResultData($queryReturn)
        : [];

    $openCreditMemo = count($queryReturn) > 0
        ? $queryReturn[0]['open_credit_memo']
        : 0;

    $queryApplied = $val->readAppliedCreditMemoByCustomerId();
    $queryApplied = $queryApplied
        ? getResultData($queryApplied)
        : [];

    $appliedCreditMemo = count($queryApplied) > 0
        ? $queryApplied[0]['applied_credit_memo']
        : 0;

    $total_result_final = [
        [
            'open_credit_memo' => max(0, (float)$openCreditMemo - (float)$appliedCreditMemo),
        ],
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
