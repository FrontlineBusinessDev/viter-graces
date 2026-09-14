<?php

// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../../models/developer/suppliers/SuppliersPurchaseOrder.php';

// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new SuppliersPurchaseOrder($conn);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    if (empty($_GET)) {
        $response = new Response();
        $returnData = [];
        $returnData["data"] = [];
        $returnData["count"] = 0;
        $returnData["server_datetime"] = date("Y-m-d H:i:s");
        $returnData["success"] = true;
        $response->setData($returnData);
        $response->send();
        exit;
    } else {

        $val->filters = [];
        $action = isset($_GET['type']) ? (string) $_GET['type'] : '';

        switch ($action) {
            case 'poNumberSupplier':
                $query = checkReadGoupByPurchaseOrderNumber($val, allowedColumns());;
                break;

            case '':
            default:
                $response = new Response();
                $returnData = [];
                $returnData["data"] = [];
                $returnData["count"] = 0;
                $returnData["server_datetime"] = date("Y-m-d H:i:s");
                $returnData["success"] = true;
                $response->setData($returnData);
                $response->send();
                exit;
        }

        http_response_code(200);
        getQueriedData($query);
    }
}

// return 404 error if endpoint not available
checkEndpoint();
