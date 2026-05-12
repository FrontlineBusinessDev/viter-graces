<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Suppliers($conn);
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
$val->suppliers_is_active = 1;
$val->suppliers_created = date("Y-m-d H:i:s");
$val->suppliers_updated = date("Y-m-d H:i:s");

// check name
isNameExist($val, $val->suppliers_name);
// create
$query = checkCreate($val);

$suppliers_products = $data["suppliers_products"];

for ($i = 0; $i < count($suppliers_products); $i++) {

    $val->suppliers_product_name = $suppliers_products[$i]["product_name"];
    $val->suppliers_product_price = $suppliers_products[$i]["price"];
    $val->suppliers_product_unit = $suppliers_products[$i]["unit"];
    $val->suppliers_product_supplier_name = $val->suppliers_name;
    $val->suppliers_product_is_active = 1;
    $val->suppliers_product_created = date("Y-m-d H:i:s");
    $val->suppliers_product_updated = date("Y-m-d H:i:s");
    $query = checkCreateProduct($val);
}

returnSuccess($val, "Suppliers", $query);
