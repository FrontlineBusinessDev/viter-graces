<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Suppliers($conn);
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
    $val->suppliers_aid  = $_GET['id'];
    $val->suppliers_name = checkIndex($data, "suppliers_name");
    $val->suppliers_email = $data["suppliers_email"];
    $val->suppliers_phone = $data["suppliers_phone"];
    $val->suppliers_address = $data["suppliers_address"];
    $val->suppliers_messenger = $data["suppliers_messenger"];
    $val->suppliers_whatsapp = $data["suppliers_whatsapp"];
    $val->suppliers_other = $data["suppliers_other"];
    $val->suppliers_notes = $data["suppliers_notes"];
    $val->suppliers_delivery = $data["suppliers_delivery"];
    $val->suppliers_contact_person = $data["suppliers_contact_person"];
    $val->suppliers_description_id = $data["suppliers_description_id"];
    $val->suppliers_description_value = $data["suppliers_description_value"];
    $val->suppliers_description_value_other = $data["suppliers_description_value_other"];
    $val->suppliers_updated = date("Y-m-d H:i:s");

    $val_name_old = $data['suppliers_name_old'];

    checkId($val->suppliers_aid);
    compareName($val, $val_name_old, $val->suppliers_name);

    if (strtolower($data["suppliers_description_value"]) == "other") {

        $querySupplierDescription = getResultData($val->readSupplierDescriptionExist());
        if (count($querySupplierDescription) == 0) {
            // Create Supplier Description
            checkCreateSupplierDescription($val);
            $val->suppliers_description_id = $val->lastInsertedSupplierDescriptionId;
            $val->suppliers_description_value = $data["suppliers_description_value_other"];
        } else {
            $val->suppliers_description_id = $querySupplierDescription[0]["supplier_description_aid"];
            $val->suppliers_description_value = $querySupplierDescription[0]["supplier_description_name"];
        }
    }

    // update
    $query = checkUpdate($val);
    updateConnectedMenu($val);
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Suppliers", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
