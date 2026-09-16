<?php

// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
require 'functions.php';
// use needed classes
require '../../../../models/developer/suppliers/SuppliersProduct.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new SuppliersProduct($conn);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    if (empty($_GET)) {

        $query = checkReadBySupplierDescriptionName($val, allowedColumns());
        http_response_code(200);
        getQueriedData($query);
    } else {

        $val->filters = [];
        $action = isset($_GET['type']) ? (string) $_GET['type'] : '';

        switch ($action) {
            case 'product-items':
                $val->suppliers_product_supplier_id = isset($_GET['suppliers_product_supplier_id'])
                    ? $_GET['suppliers_product_supplier_id']
                    : null;
                $query = checkReadGoupBySupplierProductItems($val, allowedColumns());;
                break;

            case 'product-unit':
                $val->suppliers_product_supplier_id = isset($_GET['suppliers_product_supplier_id'])
                    ? $_GET['suppliers_product_supplier_id']
                    : null;
                $query = checkReadGoupBySupplierProductUnit($val, allowedColumns());;
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
