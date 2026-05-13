<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new ProductOwner($conn);
$valActivity = new ActivityLog($conn);
// get $_GET data
$error = [];
$returnData = [];
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);

if (array_key_exists("id", $_GET)) {
    // check data
    checkPayload($data);
    // get data
    $val->user_account_aid = $_GET['id'];
    checkId($val->user_account_aid);

    $val->user_account_first_name = checkIndex($data, "user_account_first_name");
    $val->user_account_last_name = checkIndex($data, "user_account_last_name");
    $val->user_account_email = checkIndex($data, "user_account_email");
    $val->user_account_created = date("Y-m-d H:i:s");
    $val->user_account_updated = date("Y-m-d H:i:s");
    $val->column_fullname = $val->user_account_first_name . " " . $val->user_account_last_name;
    $val_name_old = $data['name'];

    // check name
    compareName($val, $val_name_old, $val->column_fullname);
    // update
    $query = checkUpdate($val);
    // create activity log
    createActivityLog($valActivity, $data);
    updateConnectedMenu($val);
    returnSuccess($val, "Role", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
