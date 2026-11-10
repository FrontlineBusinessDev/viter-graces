<?php

// set http header
require '../../../core/header.php';
// use needed functions
require '../../../core/functions.php';
// ACTIVITY LOG DETAILS
require '../../../controllers/developer/activity-log/functions.php';
require '../../../models/developer/activity-log/ActivityLog.php';
// use needed classes
require '../../../models/developer/report/UnlinkedData.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new UnlinkedData($conn);
$valActivity = new ActivityLog($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && array_key_exists("id", $_GET)) {
        // check data
        checkPayload($data);

        // Developer only. The role is read from the database using the logged in id.
        if (!isDeveloperRequester($conn, ["activity_log_user_id" => $data["activity_log_user_id"] ?? 0])) {
            returnError("Only a Developer can delete this record.");
        }

        // delete ONE orphaned record (checks again that its user account is really gone)
        try {
            $query = $val->deleteById($_GET['id']);
        } catch (RuntimeException $ex) {
            returnError($ex->getMessage());
        }
        checkQuery($query, "There's a problem processing your request. (delete unlinked data)");

        // create activity log (the menu sent by the table is the long api path, so use a readable one)
        $data["activity_log_menu"] = "unlinked data";
        $data["activity_log_action"] = "delete";
        createActivityLog($valActivity, $data);
        returnSuccess($val, "Unlinked Data", $query);
    }
}

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
