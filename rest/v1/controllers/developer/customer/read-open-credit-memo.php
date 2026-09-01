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

    $queryReturn = $val->readReturnByOpenCreditMemo();
    $queryReturn = $queryReturn
        ? getResultData($queryReturn)
        : [];

    $openCreditMemo = count($queryReturn) > 0
        ? $queryReturn[0]['open_credit_memo']
        : 0;

    $total_result_final = [
        [
            'open_credit_memo' => $openCreditMemo,
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
