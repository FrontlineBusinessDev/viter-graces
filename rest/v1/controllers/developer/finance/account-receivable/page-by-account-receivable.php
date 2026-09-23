<?php

// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../../models/developer/finance/AccountReceivable.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new AccountReceivable($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    // check data
    checkPayload($data);

    if (array_key_exists("start", $_GET)) {
        $val->sales_order_customer_id = $data["id"];    // get data
        $val->column_search = $data["searchValue"];    // get data
        $val->column_start = $_GET['start'];
        $val->column_total = 15;
        $val->max = PHP_INT_MAX;
        $total_result_final = [];

        // FOR MULTIPLE FILTER
        $val->filters = $data['columnFilters'];
        checkLimitId($val->column_start, $val->column_total);

        // Cashiers only see the receivables for orders they personally
        // created - scoped by sales_order_received_by_id, not the
        // product-owner scoping below.
        if (($data["role"] ?? "") === "cashier") {
            $val->userId = (float)($data["loggedInId"] ?? 0);
            $query = checkReadCashierLimit($val, allowedColumns());
            $total_result = checkReadCashierAll($val, allowedColumns());
        } else {
            $val->userId = (float)$data["userId"];
            $query = checkReadLimit($val, allowedColumns());
            $total_result = checkReadAll($val, allowedColumns());
        }
        $data = getResultData($query);

        for ($i = 0; $i < count($data); $i++) {

            $val->sales_order_number = $data[$i]["sales_order_number"];

            $queryInstallment = $val->readByInstallment();

            $queryInstallment = $queryInstallment
                ? getResultData($queryInstallment)
                : [];

            $data[$i]["installmentItems"] = $queryInstallment;

            $total_result_final[] = $data[$i];
        }

        http_response_code(200);

        $response = new Response();
        $returnData = [];

        $returnData["data"] = $total_result_final;
        $returnData["count"] = count($total_result_final);
        $returnData["total"] = $total_result->rowCount();
        $returnData["per_page"] = $val->column_total;
        $returnData["page"] = (int)$val->column_start;
        $returnData["total_pages"] = ceil($total_result->rowCount() / $val->column_total);
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
