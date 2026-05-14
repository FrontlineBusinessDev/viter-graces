<?php

// set http header
require '../../../../core/header.php';
// use needed functions
require '../../../../core/functions.php';
// use needed classes
require '../../../../models/developer/suppliers/SuppliersProduct.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new SuppliersProduct($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    // check data
    checkPayload($data);

    if (array_key_exists("id", $_GET)) {
        $val->suppliers_product_supplier_id = $_GET["id"];    // get data 
        $val->filters = [];
        checkId($val->suppliers_product_supplier_id);
        $query = checkReadAll($val);
        http_response_code(200);
        getQueriedData($query);
    }

    if (empty($_GET)) {
        $val->suppliers_product_supplier_id = $data["id"];    // get data 
        $val->filters = [];
        checkId($val->suppliers_product_supplier_id);
        $query = checkReadAll($val);
        http_response_code(200);
        getQueriedData($query);
    }
}

// return 404 error if endpoint not available
checkEndpoint();
