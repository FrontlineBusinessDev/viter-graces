<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Products($conn);
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // get data
    $val->products_aid = $_GET['id'];
    checkId($val->products_aid);
    // delete 
    // isUserAccountAssociated($val);

    $query = checkDelete($val);
    returnSuccess($val, "Customer", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
