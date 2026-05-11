<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Customer($conn);
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // get data
    $val->customer_aid = $_GET['id'];
    checkId($val->customer_aid);
    // delete 
    // isUserAccountAssociated($val);

    $query = checkDelete($val);
    returnSuccess($val, "Customer", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
