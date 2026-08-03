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

    $total_result_final = [];

    // WEEKLY SALES 
    $query = checkReadSalesPerWeek($val);
    $weekAllData = getResultData($query)[0] ?? [];

    http_response_code(200);


    $weeklyData = [
        [
            "label" => "Mon",
            "in" => (string)($weekAllData['monday'] ?? 0),
            "out" => (string)($weekAllData['monday'] ?? 0),
            "balance" => (string)($weekAllData['monday'] ?? 0)
        ],
        [
            "label" => "Tue",
            "in" => (string)($weekAllData['tuesday'] ?? 0),
            "out" => (string)($weekAllData['tuesday'] ?? 0),
            "balance" => (string)($weekAllData['tuesday'] ?? 0)
        ],
        [
            "label" => "Wed",
            "in" => (string)($weekAllData['wednesday'] ?? 0),
            "out" => (string)($weekAllData['wednesday'] ?? 0),
            "balance" => (string)($weekAllData['wednesday'] ?? 0)
        ],
        [
            "label" => "Thu",
            "in" => (string)($weekAllData['thursday'] ?? 0),
            "out" => (string)($weekAllData['thursday'] ?? 0),
            "balance" => (string)($weekAllData['thursday'] ?? 0)
        ],
        [
            "label" => "Fri",
            "in" => (string)($weekAllData['friday'] ?? 0),
            "out" => (string)($weekAllData['friday'] ?? 0),
            "balance" => (string)($weekAllData['friday'] ?? 0)
        ],
        [
            "label" => "Sat",
            "in" => (string)($weekAllData['saturday'] ?? 0),
            "out" => (string)($weekAllData['saturday'] ?? 0),
            "balance" => (string)($weekAllData['saturday'] ?? 0)
        ],
        [
            "label" => "Sun",
            "in" => (string)($weekAllData['sunday'] ?? 0),
            "out" => (string)($weekAllData['sunday'] ?? 0),
            "balance" => (string)($weekAllData['sunday'] ?? 0)
        ],
    ];

    // MONTHLY SALES 
    $query = checkReadSalesPerMonth($val);
    $monthAllData = getResultData($query)[0] ?? [];

    http_response_code(200);
    $monthlyData = [
        [
            "label" => "Jan",
            "in" => (string)($monthAllData['january'] ?? 0),
            "out" => (string)($monthAllData['january'] ?? 0),
            "balance" => (string)($monthAllData['january'] ?? 0)
        ],
        [
            "label" => "Feb",
            "in" => (string)($monthAllData['february'] ?? 0),
            "out" => (string)($monthAllData['february'] ?? 0),
            "balance" => (string)($monthAllData['february'] ?? 0)
        ],
        [
            "label" => "Mar",
            "in" => (string)($monthAllData['march'] ?? 0),
            "out" => (string)($monthAllData['march'] ?? 0),
            "balance" => (string)($monthAllData['march'] ?? 0)
        ],
        [
            "label" => "Apr",
            "in" => (string)($monthAllData['april'] ?? 0),
            "out" => (string)($monthAllData['april'] ?? 0),
            "balance" => (string)($monthAllData['april'] ?? 0)
        ],
        [
            "label" => "May",
            "in" => (string)($monthAllData['may'] ?? 0),
            "out" => (string)($monthAllData['may'] ?? 0),
            "balance" => (string)($monthAllData['may'] ?? 0)
        ],
        [
            "label" => "Jun",
            "in" => (string)($monthAllData['june'] ?? 0),
            "out" => (string)($monthAllData['june'] ?? 0),
            "balance" => (string)($monthAllData['june'] ?? 0)
        ],
        [
            "label" => "Jul",
            "in" => (string)($monthAllData['july'] ?? 0),
            "out" => (string)($monthAllData['july'] ?? 0),
            "balance" => (string)($monthAllData['july'] ?? 0)
        ],
        [
            "label" => "Aug",
            "in" => (string)($monthAllData['august'] ?? 0),
            "out" => (string)($monthAllData['august'] ?? 0),
            "balance" => (string)($monthAllData['august'] ?? 0)
        ],
        [
            "label" => "Sep",
            "in" => (string)($monthAllData['september'] ?? 0),
            "out" => (string)($monthAllData['september'] ?? 0),
            "balance" => (string)($monthAllData['september'] ?? 0)
        ],
        [
            "label" => "Oct",
            "in" => (string)($monthAllData['october'] ?? 0),
            "out" => (string)($monthAllData['october'] ?? 0),
            "balance" => (string)($monthAllData['october'] ?? 0)
        ],
        [
            "label" => "Nov",
            "in" => (string)($monthAllData['november'] ?? 0),
            "out" => (string)($monthAllData['november'] ?? 0),
            "balance" => (string)($monthAllData['november'] ?? 0)
        ],
        [
            "label" => "Dec",
            "in" => (string)($monthAllData['december'] ?? 0),
            "out" => (string)($monthAllData['december'] ?? 0),
            "balance" => (string)($monthAllData['december'] ?? 0)
        ],
    ];

    // YEARLY SALES 
    $query = checkReadSalesPerYear($val);
    $yearAllData = getResultData($query)[0] ?? [];

    http_response_code(200);

    $currentYear = (int)date('Y');

    $yearlyData = [
        [
            "label" => (string)($currentYear - 5),
            "in" => (string)($yearAllData['year_5'] ?? 0),
            "out" => (string)($yearAllData['year_5'] ?? 0),
            "balance" => (string)($yearAllData['year_5'] ?? 0)
        ],
        [
            "label" => (string)($currentYear - 4),
            "in" => (string)($yearAllData['year_4'] ?? 0),
            "out" => (string)($yearAllData['year_4'] ?? 0),
            "balance" => (string)($yearAllData['year_4'] ?? 0)
        ],
        [
            "label" => (string)($currentYear - 3),
            "in" => (string)($yearAllData['year_3'] ?? 0),
            "out" => (string)($yearAllData['year_3'] ?? 0),
            "balance" => (string)($yearAllData['year_3'] ?? 0)
        ],
        [
            "label" => (string)($currentYear - 2),
            "in" => (string)($yearAllData['year_2'] ?? 0),
            "out" => (string)($yearAllData['year_2'] ?? 0),
            "balance" => (string)($yearAllData['year_2'] ?? 0)
        ],
        [
            "label" => (string)($currentYear - 1),
            "in" => (string)($yearAllData['year_1'] ?? 0),
            "out" => (string)($yearAllData['year_1'] ?? 0),
            "balance" => (string)($yearAllData['year_1'] ?? 0)
        ],
        [
            "label" => (string)$currentYear,
            "in" => (string)($yearAllData['year_0'] ?? 0),
            "out" => (string)($yearAllData['year_0'] ?? 0),
            "balance" => (string)($yearAllData['year_0'] ?? 0)
        ],
    ];

    $total_result_final[] = [
        "weekly" => $weeklyData,
        "monthly" => $monthlyData,
        "yearly" => $yearlyData
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
