<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new ProductOwner($conn);
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

    if (isDeveloperRequester($conn, $data)) {
        // Developer: delete the product owner together with all of its connected data
        if ((int) $data['activity_log_user_id'] === (int) $val->user_account_aid) {
            returnError("You cannot delete your own account.");
        }
        $query = deleteUserAccountWithConnectedData($conn, (int) $val->user_account_aid);
        checkQuery($query, "There's a problem processing your request. (delete with connected data)");
    } else {
        // others: block delete if the product owner is already used by other modules
        checkAssociatedById($val);
        $query = checkDelete($val);
    }
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "User Account", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
