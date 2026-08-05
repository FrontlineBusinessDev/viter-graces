<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new SalesOrder($conn);
$valActivity = new ActivityLog($conn);
// get $_GET data
$body = file_get_contents("php://input");
$data = json_decode($body, true);
$error = [];
$returnData = [];
if (array_key_exists("id", $_GET)) {
    // check data
    checkPayload($data);
    // get data
    $val->sales_order_aid = $_GET['id'];
    $val->sales_order_number = trim($data["sales_order_number"]);
    checkId($val->sales_order_aid);

    $val->sales_journal_order_id = $_GET['id'];
    $val->sales_journal_update = date("Y-m-d H:i:s");


    checkUpdateSalesJournalRemovedByOrderId($val);
    // checkCreateSalesJournalRemoved($val, $data);
    checkDeleteInstallment($val);
    $query = checkDelete($val);
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Customer", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
