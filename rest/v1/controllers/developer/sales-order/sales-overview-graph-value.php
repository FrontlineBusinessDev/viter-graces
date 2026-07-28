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

    http_response_code(200);


    $weeklyData = [
        ["label" => "Mon", "value" => (string)($weekAllData['monday'] ?? 0)],
        ["label" => "Tue", "value" => (string)($weekAllData['tuesday'] ?? 0)],
        ["label" => "Wed", "value" => (string)($weekAllData['wednesday'] ?? 0)],
        ["label" => "Thu", "value" => (string)($weekAllData['thursday'] ?? 0)],
        ["label" => "Fri", "value" => (string)($weekAllData['friday'] ?? 0)],
        ["label" => "Sat", "value" => (string)($weekAllData['saturday'] ?? 0)],
        ["label" => "Sun", "value" => (string)($weekAllData['sunday'] ?? 0)],
    ];

    // MONTHLY SALES 
    $query = checkReadSalesPerMonth($val);
    $monthAllData = getResultData($query)[0] ?? [];

    http_response_code(200);
    $monthlyData = [
        ["label" => "Jan", "value" => (string)($monthAllData['january'] ?? 0)],
        ["label" => "Feb", "value" => (string)($monthAllData['february'] ?? 0)],
        ["label" => "Mar", "value" => (string)($monthAllData['march'] ?? 0)],
        ["label" => "Apr", "value" => (string)($monthAllData['april'] ?? 0)],
        ["label" => "May", "value" => (string)($monthAllData['may'] ?? 0)],
        ["label" => "Jun", "value" => (string)($monthAllData['june'] ?? 0)],
        ["label" => "Jul", "value" => (string)($monthAllData['july'] ?? 0)],
        ["label" => "Aug", "value" => (string)($monthAllData['august'] ?? 0)],
        ["label" => "Sep", "value" => (string)($monthAllData['september'] ?? 0)],
        ["label" => "Oct", "value" => (string)($monthAllData['october'] ?? 0)],
        ["label" => "Nov", "value" => (string)($monthAllData['november'] ?? 0)],
        ["label" => "Dec", "value" => (string)($monthAllData['december'] ?? 0)],
    ];

    // YEARLY SALES 
    $query = checkReadSalesPerYear($val);
    $yearAllData = getResultData($query)[0] ?? [];

    http_response_code(200);

    $currentYear = (int)date('Y');

    $yearlyData = [
        ["label" => (string)($currentYear - 5), "value" => (string)($yearAllData['year_5'] ?? 0)],
        ["label" => (string)($currentYear - 4), "value" => (string)($yearAllData['year_4'] ?? 0)],
        ["label" => (string)($currentYear - 3), "value" => (string)($yearAllData['year_3'] ?? 0)],
        ["label" => (string)($currentYear - 2), "value" => (string)($yearAllData['year_2'] ?? 0)],
        ["label" => (string)($currentYear - 1), "value" => (string)($yearAllData['year_1'] ?? 0)],
        ["label" => (string)$currentYear,       "value" => (string)($yearAllData['year_0'] ?? 0)],
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

    // Weekly: [
    //   { label: "Mon", value: 2700 },
    //   { label: "Tue", value: 3400 },
    //   { label: "Wed", value: 900 },
    //   { label: "Thu", value: 1800 },
    //   { label: "Fri", value: 2900 },
    //   { label: "Sat", value: 2300 },
    //   { label: "Sun", value: 2600 },
    // ],
    // Monthly: [
    //   { label: "Jan", value: 50000 },
    //   { label: "Feb", value: 42000 },
    //   { label: "Mar", value: 61000 },
    //   { label: "Apr", value: 58000 },
    //   { label: "May", value: 72000 },
    //   { label: "Jun", value: 69000 },
    //   { label: "Jul", value: 75000 },
    //   { label: "Aug", value: 80000 },
    //   { label: "Sep", value: 77000 },
    //   { label: "Oct", value: 82000 },
    //   { label: "Nov", value: 90000 },
    //   { label: "Dec", value: 95000 },
    // ],
    // Yearly: [
    //   { label: "2020", value: 50000 },
    //   { label: "2021", value: 42000 },
    //   { label: "2022", value: 61000 },
    //   { label: "2023", value: 58000 },
    //   { label: "2024", value: 72000 },
    //   { label: "2025", value: 69000 },
    // ],
}

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
