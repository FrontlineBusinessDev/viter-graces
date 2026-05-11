<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Customer($conn);
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
$val->customer_name = checkIndex($data, "customer_name");
$val->customer_email = $data["customer_email"];
$val->customer_phone = $data["customer_phone"];
$val->customer_address = $data["customer_address"];
$val->customer_messenger = $data["customer_messenger"];
$val->customer_whatsapp = $data["customer_whatsapp"];
$val->customer_other = $data["customer_other"];
$val->customer_notes = $data["customer_notes"];
$val->customer_is_active = 1;
$val->customer_created = date("Y-m-d H:i:s");
$val->customer_updated = date("Y-m-d H:i:s");
// check name
isNameExist($val, $val->customer_name);
// create
$query = checkCreate($val);
returnSuccess($val, "Customer", $query);
