<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Role($conn);
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("roleid", $_GET)) {
    // get data
    $val->role_aid = $_GET['roleid'];
    $column_name = strtolower($data['role_name']);
    checkId($val->role_aid);
    // delete 
    isUserAccountAssociated($val);

    $query = checkDelete($val);
    returnSuccess($val, "Role", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
