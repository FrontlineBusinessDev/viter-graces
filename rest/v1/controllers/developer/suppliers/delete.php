<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Suppliers($conn);
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // get data
    $val->suppliers_aid = $_GET['id'];
    checkId($val->suppliers_aid);
    // delete 
    // isUserAccountAssociated($val);

    $query = checkDelete($val);
    returnSuccess($val, "Suppliers", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
