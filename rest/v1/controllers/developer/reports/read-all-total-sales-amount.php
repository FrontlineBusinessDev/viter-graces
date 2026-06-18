<?php

// set http header
require '../../../core/header.php';
// use needed functions
require '../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../models/developer/report/ReportSalesOrder.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new ReportSalesOrder($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    // check data
    checkPayload($data);

    $val->column_search = $data["searchValue"];    // get data 
    $val->filters = $data['columnFilters'];
    $total_result_final = [];
    $query = checkReadAllSalesOrderAmount($val, allowedColumns());

    $dataSet = getResultData($query);

    if (count($dataSet) > 0) {
        $totalSales = array_sum(array_column($dataSet, 'sales_order_overall_amount'));
        $totalQty = array_sum(array_column($dataSet, 'sales_order_qty'));

        $total_result_final[] = [
            'total_sales' => $totalSales,
            'total_qty' => $totalQty,
            'net_revenue' => $totalQty
        ];
    }
    returnError($total_result_final);

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
