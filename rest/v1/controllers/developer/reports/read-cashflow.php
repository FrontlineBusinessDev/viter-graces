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
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();

    $total_result_final = [];

    // WEEKLY SALES 
    $queryS = checkReadSalesPerWeek($val);
    $weekAllData = getResultData($queryS)[0] ?? [];
    $queryE = checkReadExpensesPerWeek($val);
    $weekExpAllData = getResultData($queryE)[0] ?? [];

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
        $in  = (float)($weekAllData[$key] ?? 0);
        $out = (float)($weekExpAllData[$key] ?? 0);

        $weeklyData[] = [
            "label"   => $label,
            "in"      => (string)$in,
            "out"     => (string)$out,
            "balance" => (string)($in - $out)
        ];
    }
    // MONTHLY SALES 
    $queryMS = checkReadSalesPerMonth($val);
    $monthAllData = getResultData($queryMS)[0] ?? [];
    $queryME = checkReadExpensesPerMonth($val);
    $monthExpAllData = getResultData($queryME)[0] ?? [];

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
        $in  = (float)($monthAllData[$key] ?? 0);
        $out = (float)($monthExpAllData[$key] ?? 0);

        $monthlyData[] = [
            "label"   => $label,
            "in"      => (string)$in,
            "out"     => (string)$out,
            "balance" => (string)($in - $out)
        ];
    }
    // YEARLY SALES 
    $queryYS = checkReadSalesPerYear($val);
    $yearAllData = getResultData($queryYS)[0] ?? [];

    // Fixed function call from checkReadExpensesPerMonth to checkReadExpensesPerYear
    $queryYE = checkReadExpensesPerYear($val);
    $yearExpAllDataYE = getResultData($queryYE)[0] ?? [];

    $currentYear = (int)date('Y');
    $yearlyData = [];

    // Loop from 5 years ago up to the current year
    for ($i = 5; $i >= 0; $i--) {
        $key   = 'year_' . $i;
        $label = (string)($currentYear - $i);

        $in  = (float)($yearAllData[$key] ?? 0);
        $out = (float)($yearExpAllDataYE[$key] ?? 0);

        $yearlyData[] = [
            "label"   => $label,
            "in"      => (string)$in,
            "out"     => (string)$out,
            "balance" => (string)($in - $out)
        ];
    }

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
