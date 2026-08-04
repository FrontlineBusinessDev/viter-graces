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
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();

    $total_result_final = [];
    // WEEKLY SALES 
    $query = checkReadSalesPerWeek($val);
    $weekAllData = getResultData($query)[0] ?? [];

    $days = [
        'monday'    => 'Mon',
        'tuesday'   => 'Tue',
        'wednesday' => 'Wed',
        'thursday'  => 'Thu',
        'friday'    => 'Fri',
        'saturday'  => 'Sat',
        'sunday'    => 'Sun',
    ];

    $weeklyData = [];

    foreach ($days as $key => $label) {
        $weeklyData[] = [
            "label" => $label,
            "value" => (string)($weekAllData[$key] ?? 0)
        ];
    }
    // MONTHLY SALES 
    $query = checkReadSalesPerMonth($val);
    $monthAllData = getResultData($query)[0] ?? [];

    $months = [
        'january'   => 'Jan',
        'february'  => 'Feb',
        'march'     => 'Mar',
        'april'     => 'Apr',
        'may'       => 'May',
        'june'      => 'Jun',
        'july'      => 'Jul',
        'august'    => 'Aug',
        'september' => 'Sep',
        'october'   => 'Oct',
        'november'  => 'Nov',
        'december'  => 'Dec',
    ];

    $monthlyData = [];
    foreach ($months as $key => $label) {
        $monthlyData[] = [
            "label" => $label,
            "value" => (string)($monthAllData[$key] ?? 0)
        ];
    }

    // YEARLY SALES 
    $query = checkReadSalesPerYear($val);
    $yearAllData = getResultData($query)[0] ?? [];

    $currentYear = (int)date('Y');
    $yearlyData = [];

    for ($i = 5; $i >= 0; $i--) {
        $yearlyData[] = [
            "label" => (string)($currentYear - $i),
            "value" => (string)($yearAllData['year_' . $i] ?? 0)
        ];
    }

    // Set status code once when building the response
    http_response_code(200);

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
