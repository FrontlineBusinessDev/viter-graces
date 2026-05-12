<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new SuppliersProduct($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // check data
    checkPayload($data);
    // get data
    $val->suppliers_product_aid = $_GET['id'];
    $val->suppliers_product_name = $data["suppliers_product_name"];
    $val->suppliers_product_price = $data["suppliers_product_price"];
    $val->suppliers_product_unit = $data["suppliers_product_unit"];
    $val->suppliers_product_updated = date("Y-m-d H:i:s");

    $val_name_old = $data['suppliers_product_name_old'];

    checkId($val->suppliers_product_aid);
    compareName($val, $val_name_old, $val->suppliers_product_name);
    // update
    $query = checkUpdate($val);
    returnSuccess($val, "Suppliers Product", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
