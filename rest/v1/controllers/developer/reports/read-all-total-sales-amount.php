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
    $queryExpenses = checkReadAllExpensesAmount($val, allowedColumns());

    $dataSet = getResultData($query);
    $querySetExpenses = getResultData($queryExpenses);

    if (count($dataSet) > 0) {
        $totalExpenses = array_sum(array_column($querySetExpenses, 'purchase_order_total_amount_per_product'));
        $totalReceivable = array_sum(array_column($dataSet, 'sales_order_discounted_with_vat_amount'));

        $totalQty = array_sum(array_column($dataSet, 'qty'));

        $totalAllSalesAmount = (float)$totalReceivable - (float)$totalExpenses;
        $totalAmount = (float)$totalReceivable;

        $total_result_final[] = [
            'total_sales' => $totalAmount,
            'total_qty' => $totalQty,
            'net_revenue' => $totalAllSalesAmount
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

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
