<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Customer($conn);
$valActivity = new ActivityLog($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // check data
    checkPayload($data);
    // get data
    $val->customer_aid  = $_GET['id'];
    $val->customer_name = checkIndex($data, "customer_name");
    $val->customer_email = $data["customer_email"];
    $val->customer_phone = $data["customer_phone"];
    $val->customer_address = $data["customer_address"];
    $val->customer_messenger = $data["customer_messenger"];
    $val->customer_whatsapp = $data["customer_whatsapp"];
    $val->customer_other = $data["customer_other"];
    $val->customer_notes = $data["customer_notes"];
    $val->customer_updated = date("Y-m-d H:i:s");

    $val_name_old = $data['customer_name_old'];

    checkId($val->customer_aid);
    compareName($val, $val_name_old, $val->customer_name);
    // update
    $query = checkUpdate($val);
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Customer", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
