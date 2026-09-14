<?php

// set http header
require '../../../core/header.php';
// use needed functions
require '../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../models/developer/customer/Customer.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Customer($conn);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    $val->filters = [];
    // Get the requested type
    $type = isset($_GET['type']) ? $_GET['type'] : '';

    switch ($type) {

        case 'customers':
            $query = checkReadAllCustomers($val);
            break;

        case 'email':
            $query = checkReadAllEmail($val);
            break;

        case 'contact':
            $query = checkReadAllContact($val);
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