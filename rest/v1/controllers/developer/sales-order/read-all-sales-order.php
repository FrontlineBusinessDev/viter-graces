<?php

// set http header
require '../../../core/header.php';
// use needed functions
require '../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../models/developer/sales-order/SalesOrder.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new SalesOrder($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    // check data
    checkPayload($data);

    if (empty($_GET)) {
        $val->column_search = $data["searchValue"];    // get data  
        $val->max = PHP_INT_MAX;
        $total_result_final = [];
        // FOR MULTIPLE FILTER 
        $val->filters = $data['columnFilters'];

        $query = checkReadSalesOrder($val);
        // query
        $data = getResultData($query);
        for ($i = 0; $i < count($data); $i++) {

            $val->sales_order_number = $data[$i]["sales_order_number"];
            $queryLogin = $val->readBySoNumber();
            $queryInstallment = $val->readByInstallment();

            $queryDataLogin = $queryLogin
                ? getResultData($queryLogin)
                : [];
            $queryDataInstallment = $queryInstallment
                ? getResultData($queryInstallment)
                : [];

            $total_result_final[] = [
                ...$data[$i],
                "items" => $queryDataLogin,
                "installmentItems" => $queryDataInstallment
            ];
        }

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
}

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
