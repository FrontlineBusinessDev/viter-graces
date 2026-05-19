<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new Products($conn);
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
    $val->products_aid  = $_GET['id'];
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
    $val->products_updated = date("Y-m-d H:i:s");

    checkId($val->products_aid);

    $val_name_old = $data['products_name_old'];
    $pendingDeleteFile = $data["pendingDeleteFile"];
    $products_image_old = $data["products_image_old"];

    // $val->products_image = checkToUploadGoogleDrive(
    //     $val->products_image,
    //     $products_image_old,
    //     'Products'
    // );

    compareName($val, $val_name_old, $val->products_name);
    // update
    $query = checkUpdate($val);
    updateConnectedMenu($val);
    // create activity log
    createActivityLog($valActivity, $data);
    returnSuccess($val, "Products", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
