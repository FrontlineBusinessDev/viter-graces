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
require '../../../models/developer/activity-log/ActivityLog.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Customer($conn);
$valActivity = new ActivityLog($conn);
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
        $val->max = PHP_INT_MAX;

        $total_result_final = [];

        // FOR MULTIPLE FILTER 
        $val->filters = $data['columnFilters'];
        checkLimitId($val->column_start, $val->column_total);

        $query = checkReadLimit($val, allowedColumns());
        $total_result = checkReadAll($val, allowedColumns());

        $data = getResultData($query);

        for ($i = 0; $i < count($data); $i++) {

            $val->customer_aid = $data[$i]["customer_aid"];

            $queryLogin = $val->readSalesOrderByCustomerId();

            $queryLogin = $queryLogin
                ? getResultData($queryLogin)
                : [];

            if (count($queryLogin) > 0) {
                $data[$i]["outstanding_balance"] = $queryLogin[0]['outstanding_balance'];
                $data[$i]["number_of_orders"] = $queryLogin[0]['number_of_orders'];
                $data[$i]["total_amount_spent"] = $queryLogin[0]['total_amount_spent'];
                $data[$i]["open_credit_memo"] = 0;
            } else {
                $data[$i]["outstanding_balance"] = 0;
                $data[$i]["number_of_orders"] = 0;
                $data[$i]["total_amount_spent"] = 0;
                $data[$i]["open_credit_memo"] = 0;
            }

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
