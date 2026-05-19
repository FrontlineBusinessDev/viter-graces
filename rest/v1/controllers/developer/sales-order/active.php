<?php
// set http header
require '../../../core/header.php';
// use needed functions
require '../../../core/functions.php';
// use needed classes 
require '../../../models/developer/sales-order/SalesOrder.php';
// check database connection
// ACTIVITY LOG DETAILS
require '../../../controllers/developer/activity-log/functions.php';
require '../../../models/developer/activity-log/ActivityLog.php';
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new SalesOrder($conn);
$valActivity = new ActivityLog($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// get $_GET data
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    if (array_key_exists("id", $_GET)) {
        // check data
        checkPayload($data);
        $val->sales_order_aid = $_GET['id'];
        $val->sales_order_is_active = trim($data["isActive"]);


        if ($val->sales_order_is_active === 0) {
            $val->sales_order_status = "inactive";
        } else {
            $val->sales_order_status = "active";
        }

        $val->sales_order_updated = date("Y-m-d H:i:s");
        checkId($val->sales_order_aid);
        $query = checkActive($val);
        // create activity log
        createActivityLog($valActivity, $data);
        http_response_code(200);
        returnSuccess($val, "Customer", $query);
    }
    // return 404 error if endpoint not available
    checkEndpoint();
}

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
