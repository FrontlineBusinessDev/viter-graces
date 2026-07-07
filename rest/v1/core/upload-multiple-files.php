<?php

require "Response.php";
require "env.php";
// use needed classes
$response = new Response();
$error = [];
$returnData = [];
// FILE UPLOADING DIRECTORY
$uploadDir = __DIR__ . UPLOAD_MULTIPLE_PATH;
// MAKE FOLDER IF FILE NOT EXIST
if (!is_dir($uploadDir)) mkdir($uploadDir, 0775, true);
// TRY TO UPLOAD THE FILE AND STORE IT IN SERVER FOLDER
if ($_FILES) {
    try {
        // loop and save file to public img 
        $file = $_FILES["photo"]["name"];
        move_uploaded_file($_FILES["photo"]["tmp_name"], $uploadDir . strtolower($file));
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
