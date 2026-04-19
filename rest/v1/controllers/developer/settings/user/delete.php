<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new User($conn);
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // get data
    $val->user_account_aid = $_GET['id'];
    checkId($val->user_account_aid);

    $query = checkDelete($val);
    returnSuccess($val, "User Account", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
