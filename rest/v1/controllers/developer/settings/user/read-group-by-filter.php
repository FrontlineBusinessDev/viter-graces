<?php

// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../../models/developer/settings/User.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new User($conn);
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
            case 'name':
                $query = checkReadGoupByName($val, allowedColumns());;
                break;

            case 'email':
                // Safely extract and type-cast the ID parameter
                $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
                $query = checkReadGoupByEmail($val, allowedColumns());;
                break;

            case 'role':
                // Safely extract and type-cast the ID parameter
                $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
                $query = checkReadGoupByRole($val, allowedColumns());;
                break;

            case 'product-owner':
                // Safely extract and type-cast the ID parameter
                $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
                $query = checkReadGoupByProductOwner($val, allowedColumns());;
                break;

            case 'product-owner-email':
                // Safely extract and type-cast the ID parameter
                $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
                $query = checkReadGoupByProductOwnerEmail($val, allowedColumns());;
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

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
