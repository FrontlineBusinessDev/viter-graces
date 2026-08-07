<?php

// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../../models/developer/finance/Overview.php';

// check database connection
$conn = null;
$conn = checkDbConnection();

// make instance of classes
$val = new Overview($conn);

// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();

    $total_result_final = [];
    $SalesExpensProfit = [];
    $totalData = [];

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
    $totalDataWeekly = [];

    $revenue = 0;
    $expenses = 0;
    $unpaid = 0;

    foreach ($days as $key => $label) {
        $profitW   = (float)($weekAllData[$key] ?? 0);
        $expensesW = (float)($weekExpAllData[$key] ?? 0);
        $balanceW  = (float)($weekAllData["balance_" . $key] ?? 0);

        $revenue  += $profitW;
        $expenses += $expensesW;
        $unpaid   += $balanceW;

        $weeklyData[] = [
            "label"    => $label,
            "profit"   => (string)$profitW,
            "expenses" => (string)$expensesW,
            "revenue"  => (string)($profitW - $expensesW)
        ];
    }

    $netProfit = (float)$revenue - (float)$expenses;

    $totalDataWeekly[] = [
        "revenue"   => (string)$revenue,
        "expenses"  => (string)$expenses,
        "unpaid"    => (string)$unpaid,
        "netProfit" => (string)$netProfit
    ];


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
    $totalDataMonthly = [];

    $revenueMonthly  = 0;
    $expensesMonthly = 0;
    $unpaidMonthly   = 0;

    foreach ($months as $key => $label) {
        $profitM   = (float)($monthAllData[$key] ?? 0);
        $expensesM = (float)($monthExpAllData[$key] ?? 0);
        $balanceM  = (float)($monthAllData["balance_" . $key] ?? 0);

        $revenueMonthly  += $profitM;
        $expensesMonthly += $expensesM;
        $unpaidMonthly   += $balanceM;

        $monthlyData[] = [
            "label"    => $label,
            "profit"   => (string)$profitM,
            "expenses" => (string)$expensesM,
            "revenue"  => (string)($profitM - $expensesM)
        ];
    }

    $netProfitMonthly = (float)$revenueMonthly - (float)$expensesMonthly;

    $totalDataMonthly[] = [
        "revenue"   => (string)$revenueMonthly,
        "expenses"  => (string)$expensesMonthly,
        "unpaid"    => (string)$unpaidMonthly,
        "netProfit" => (string)$netProfitMonthly
    ];


    // YEARLY SALES

    $queryYS = checkReadSalesPerYear($val);
    $yearAllData = getResultData($queryYS)[0] ?? [];

    $queryYE = checkReadExpensesPerYear($val);
    $yearExpAllDataYE = getResultData($queryYE)[0] ?? [];

    $currentYear = (int)date('Y');
    $yearlyData = [];
    $totalDataYearly = [];

    $revenueYearly  = 0;
    $expensesYearly = 0;
    $unpaidYearly   = 0;

    // Loop from 5 years ago up to the current year
    for ($i = 5; $i >= 0; $i--) {
        $key   = 'year_' . $i;
        $label = (string)($currentYear - $i);

        // Fixed: Read sales from $yearAllData instead of $yearExpAllDataYE
        $profitY   = (float)($yearAllData[$key] ?? 0);
        $expensesY = (float)($yearExpAllDataYE[$key] ?? 0);
        $balanceY  = (float)($yearAllData["balance_" . $key] ?? 0);

        $revenueYearly  += $profitY;
        $expensesYearly += $expensesY;
        $unpaidYearly   += $balanceY;

        $yearlyData[] = [
            "label"    => $label,
            "profit"   => (string)$profitY,
            "expenses" => (string)$expensesY,
            "revenue"  => (string)($profitY - $expensesY)
        ];
    }

    $netProfitYearly = (float)$revenueYearly - (float)$expensesYearly;

    $totalDataYearly[] = [
        "revenue"   => (string)$revenueYearly,
        "expenses"  => (string)$expensesYearly,
        "unpaid"    => (string)$unpaidYearly,
        "netProfit" => (string)$netProfitYearly
    ];

    // RESPONSE AGGREGATION 
    $SalesExpensProfit[] = [
        "weekly"  => $weeklyData,
        "monthly" => $monthlyData,
        "yearly"  => $yearlyData,
    ];

    $totalData[] = [
        "weekly"  => $totalDataWeekly,
        "monthly" => $totalDataMonthly,
        "yearly"  => $totalDataYearly,
    ];

    http_response_code(200);
    $total_result_final[] = [
        "amount" => $totalData,
        "graph"  => $SalesExpensProfit,
    ];

    $response = new Response();
    $returnData = [];
    $returnData["data"]            = $total_result_final;
    $returnData["count"]           = 1;
    $returnData["server_datetime"] = date("Y-m-d H:i:s");
    $returnData["success"]        = true;

    $response->setData($returnData);
    $response->send();
    exit;
}

http_response_code(200);
checkAccess();
