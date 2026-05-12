<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new SuppliersProduct($conn);
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
$val->suppliers_product_name = checkIndex($data, "suppliers_product_name");
$val->suppliers_product_price = $data["suppliers_product_price"];
$val->suppliers_product_unit = $data["suppliers_product_unit"];
$val->suppliers_product_is_active = 1;
$val->suppliers_product_supplier_id = $data["suppliers_product_supplier_id"];
$val->suppliers_product_supplier_name = $data["suppliers_product_supplier_name"];
$val->suppliers_product_created = date("Y-m-d H:i:s");
$val->suppliers_product_updated = date("Y-m-d H:i:s");

// check name
isNameExist($val, $val->suppliers_product_name);
// create
$query = checkCreate($val);
returnSuccess($val, "Suppliers Product", $query);
