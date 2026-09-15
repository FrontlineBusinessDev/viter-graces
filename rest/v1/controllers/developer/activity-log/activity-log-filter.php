<?php

// set http header
require '../../../core/header.php';
// use needed functions
require '../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../models/developer/activity-log/ActivityLog.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new ActivityLog($conn);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    $val->filters = [];
    // Get the requested type
    $type = isset($_GET['type']) ? $_GET['type'] : '';

    switch ($type) {

        case 'log-menu':
            $query = checkReadAllActivityLogMenu($val);
            break;

        case 'log-action':
            $query = checkReadAllActivityLogAction($val);
            break;

        case 'log-user':
            $query = checkReadAllActivityLogUser($val);
            break;

        case 'log-role':
            $query = checkReadAllActivityLogRole($val);
            break;

        default:
            http_response_code(400);

            echo json_encode([
                'status' => 400,
                'message' => 'Invalid type. Use location and notes.'
            ]);

            exit;
    }

    http_response_code(200);

    getQueriedData($query);

    exit;
}

checkAccess();