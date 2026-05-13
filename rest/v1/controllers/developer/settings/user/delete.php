<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new User($conn);
$valActivity = new ActivityLog($conn);
// get $_GET data
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // check data
    checkPayload($data);
    // get data
    $val->user_account_aid = $_GET['id'];
    checkId($val->user_account_aid);

    $query = checkDelete($val);
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "User Account", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
