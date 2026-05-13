<?php
// check database connection
require '../../../core/google-api.php';
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Products($conn);
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

$val->products_is_active = 1;
$val->products_status = 'active';
$val->products_name = $data["products_name"];
$val->products_image = $data["products_image"];
$val->products_sku = $data["products_sku"];
$val->products_category = $data["products_category"];
$val->products_price = $data["products_price"];
$val->products_cost = $data["products_cost"];
$val->products_stocks = $data["products_stocks"];
$val->products_owner_id = $data["products_owner_id"];
$val->products_owner_name = $data["products_owner_name"];
$val->products_suppliers_id = $data["products_suppliers_id"];
$val->products_suppliers_name = $data["products_suppliers_name"];
$val->products_sales = $data["products_sales"];
$val->products_unit = $data["products_unit"];
$val->products_barcode = $data["products_barcode"];
$val->products_low_stock_threshold = $data["products_low_stock_threshold"];
$val->products_description = $data["products_description"];
$val->products_created = date("Y-m-d H:i:s");
$val->products_updated = date("Y-m-d H:i:s");

// $val->products_image = checkToUploadGoogleDrive($data['products_image'], '', 'Products');

// check name
isNameExist($val, $val->products_name);
// create
$query = checkCreate($val);
returnSuccess($val, "Products", $query);
