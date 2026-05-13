<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Role($conn);
$valActivity = new ActivityLog($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // get data
    $val->role_aid = $_GET['id'];
    $column_name = strtolower($data['role_name']);
    checkId($val->role_aid);
    // delete 
    isUserAccountAssociated($val);

    $query = checkDelete($val);
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Role", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
