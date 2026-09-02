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

    $val->sales_order_product_owner_id = (float)$data["id"];    // get data 
    $val->from = $data["from"];    // get data 
    $val->to = $data["to"];    // get data 

    $total_result_final = [];
    $operating_expenses = [];
    $grossSales = 0;
    $lessDiscount = 0;
    $lessReturn = 0;
    $taxAmount = 0;
    $netSales = 0;
    $supplierAmount = 0;
    $totalOeAmount = 0;
    $netIncome = 0;

    // INCOME
    $queryIncome = checkReadPalIncome($val);
    $incomeQuery = getResultData($queryIncome) ?? [];

    if (count($incomeQuery) > 0) {
        $grossSales = array_sum(array_column($incomeQuery, 'total_amount'));
        $lessDiscount = array_sum(array_column($incomeQuery, 'discount_amount'));
        $taxAmount = array_sum(array_column($incomeQuery, 'tax_amount'));
        $netSales = array_sum(array_column($incomeQuery, 'discounted_with_vat_amount'));
    }

    $queryReturns = checkReadPalReturns($val);
    $returnsQuery = getResultData($queryReturns) ?? [];

    if (count($returnsQuery) > 0) {
        $lessReturn = array_sum(array_column($returnsQuery, 'amount'));
    }

    $netSales = (float)$netSales - (float)$lessReturn;

    // SUPPLIER EXPENSES
    $querySe = checkReadPalSupplierExpenses($val);
    $seQuery = getResultData($querySe) ?? [];

    if (count($seQuery) > 0) {
        $supplierAmount = array_sum(array_column($seQuery, 'amount'));
        $totalOeAmount += (float)$supplierAmount;
    }

    // OPERATING EXPENSES 
    $queryOe = checkReadPalOperatingExpenses($val);
    $oeQuery = getResultData($queryOe) ?? [];
    for ($i = 0; $i < count($oeQuery); $i++) {
        $operating_expenses[] = [
            "name" => $oeQuery[$i]['name'],
            "amount" => $oeQuery[$i]['amount'],
        ];

        $totalOeAmount += (float)$oeQuery[$i]['amount'];
    }

    $netIncome = (float)$netSales - (float)$totalOeAmount;


    http_response_code(200);
    $total_result_final[] = [
        "gross_sales" => $grossSales,
        "less_discount" => $lessDiscount,
        "less_return" => $lessReturn,
        "tax_amount" => $taxAmount,
        "net_sales" => $netSales,
        "supplier_amount" => $supplierAmount,
        "operating_expenses" => $operating_expenses,
        "total_oe_amount" => $totalOeAmount,
        "net_income" => $netIncome,
    ];

    $response = new Response();
    $returnData = [];
    $returnData["data"] = $total_result_final;
    $returnData["count"] = 1;
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
