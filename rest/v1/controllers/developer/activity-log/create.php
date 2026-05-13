<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new ActivityLog($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// get should not be present
if (array_key_exists("id", $_GET)) {
    checkEndpoint();
}
// check data
checkPayload($data);
// get data
$val->activity_log_menu = checkIndex($data, "activity_log_menu");
$val->activity_log_action = $data["activity_log_action"];
$val->activity_log_user_id = $data["activity_log_user_id"];
$val->activity_log_user_name = $data["activity_log_user_name"];
$val->activity_log_user_role = $data["activity_log_user_role"];
$val->activity_log_description = $data["activity_log_description"];
$val->activity_log_created = date("Y-m-d H:i:s");
// create
$query = checkCreate($val);
returnSuccess($val, "Customer", $query);
