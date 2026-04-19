<?php

require "Response.php";
require "env.php";
// use needed classes
$response = new Response();
$error = [];
$returnData = [];

if ($_FILES) {
    try {
        // loop and save file to public img
        for ($i = 0; $i < count($_FILES); $i++) {
            $file = $_FILES["file$i"]["name"];
            move_uploaded_file($_FILES["file$i"]["tmp_name"], UPLOAD_MULTIPLE_PATH . strtolower($file)); // if localhost
        }
        $returnData["success"] = true;
        $returnData["message"] = "File success.";
        $response->setData($returnData);
        $response->send();
        exit;
    } catch (Exception $e) {
        $response->setSuccess(false);
        $error["success"] = false;
        $error['error'] = "File error.";
        $response->setData($error);
        $response->send();
        exit;
    }
} else {
    $response->setSuccess(false);
    $error["count"] = 0;
    $error["success"] = false;
    $error['error'] = "File empty`.";
    $response->setData($error);
    $response->send();
    exit;
}
