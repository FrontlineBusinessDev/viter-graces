<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Returns($conn);
$valActivity = new ActivityLog($conn);
// get $_GET data
$body = file_get_contents("php://input");
$data = json_decode($body, true);
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // check data
    checkPayload($data);
    // get data
    $val->return_product_aid = $_GET['id'];
    checkId($val->return_product_aid);

    $query = checkDelete($val);
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Customer", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
