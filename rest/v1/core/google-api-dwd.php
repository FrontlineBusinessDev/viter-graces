<?php

// Require Response
require_once 'Response.php';
require "env.php";
// Required google api vendor
require_once __DIR__ . '/../google-api/vendor/autoload.php';

use Google\Client;
use Google\Service\Drive;
// use Google\Service\Drive\Permission;

$response = new Response();
$error = [];
$returnData = [];

// START CHANGE DIRECTORY PATH FOR LOCAL AND ONLINE PRODUCTION

function getSubjectEmail()
{

    $subject = GOOGLE_API_SUBJECT_EMAIL; // localhost 
    return $subject;
}

function getDirectoryPath()
{
    $localPath = GOOGLE_API_DIRECTORY_PATH; // localhost 
    return $localPath;
}

// GOOGLE API KEY
putenv('GOOGLE_APPLICATION_CREDENTIALS=' . __DIR__ . GOOGLE_API_GOOGLE_KEY); // production 

function getClientService()
{
    $client = new Client(); // use google client
    $client->useApplicationDefaultCredentials(); // use google api key or the GOOGLE_APPLICATION_CREDENTIALS variable
    $client->setSubject(getSubjectEmail()); // to impersonate a user for dwd
    $client->addScope(Drive::DRIVE); // Drive::DRIVE is equal to ['https://www.googleapis.com/auth/drive']
    return $client;
}

function getServiceDrive()
{
    $client = getClientService();
    $driveService = new Drive($client); // run dwd
    return $driveService;
}

function getDriveFile()
{
    $client = getClientService();
    $driveFile = new Drive\DriveFile($client); // run dwd
    return $driveFile;
}

function checkFileInput($fileId, $msg = 'File Empty')
{
    if (!$fileId || $fileId == "") returnError($msg);
}

// END CHANGE DIRECTORY PATH FOR LOCAL AND ONLINE PRODUCTION

function deleteGoogleFileByFileId($fileId)
{
    checkFileInput($fileId);
    try {
        $client = getClientService();
        $driveService = getServiceDrive($client);
        $queryResponse = $driveService->files->delete($fileId);

        $returnData["count"] = 0;
        $returnData["success"] = true;
        $returnData['data'] = $queryResponse;
        return $returnData;
    } catch (Exception $e) {
        $error["count"] = 0;
        $error["success"] = false;
        $error["driveErrMsg"] = "$e";
        $error['errorMsg'] = "Authentication failed. \n" . $e->getMessage();
        return $error;
    }
}

// upload file to google drive with public viewing
function fileUploadToGoogleDriveWithPublicPermission($photo, $appProperties = [])
{
    checkFileInput($photo);
    try {
        $client = getClientService();
        $driveService = getServiceDrive($client);
        $googleIds = array();       // store file id and permission id
        $content = file_get_contents(getDirectoryPath() . strtolower($photo)); // get file 
        $mimeType = mime_content_type(getDirectoryPath() . strtolower($photo));
        // CREATE METADATA
        $fileMetadata = new Drive\DriveFile(array(
            'name' => $photo,
            'writersCanShare' => true,
            'ignoreDefaultVisibility' => true,
            "appProperties" => $appProperties
        ));
        // CREATE FILE
        $requestCreateFile = $driveService->files->create($fileMetadata, array(
            'data' => $content,
            'mimeType' => $mimeType,
            'uploadType' => 'multipart',
            'fields' => 'id'
        ));
        // get file id
        $googleIds['file_id'] = $requestCreateFile['id'];
        // PERMISSION METADATA
        $permissionMetaData = new Drive\Permission(array(
            'type' => 'anyone',
            'role' => 'reader',
            'allowFileDiscovery' => true,
            'withLink' => true
        ));
        // CREATE PERMISSION
        $requestNewPermissions = $driveService->permissions->create(
            $googleIds['file_id'],
            $permissionMetaData,
            array('fields' => 'id')
        );
        $googleIds['permission'] = $requestNewPermissions['id']; // get permission id
        $returnData['success'] = true;
        $returnData['id'] = $googleIds;
        unlink(getDirectoryPath() . strtolower($photo)); // removed temporary img
        return $returnData;   // return success and ids
    } catch (DomainException $e) {
        unlink(getDirectoryPath() . strtolower($photo));
        $error["count"] = 0;
        $error["success"] = false;
        $error["driveErrMsg"] = "$e";
        $error['error'] = "Authentication Failed. \n" . $e->getMessage();
        return $error;
    } catch (Google_Service_Exception $e) {
        unlink(getDirectoryPath() . strtolower($photo)); // removed temporary img
        $error["count"] = 0;
        $error["success"] = false;
        $error["driveErrMsg"] = "$e";
        $errors = json_decode($e->getMessage(), true);
        $googleErrorMsg = '';
        if (isset($errors['error'])) $googleErrorMsg = $errors['error'];
        if (isset($errors['error']['message'])) $googleErrorMsg = $errors['error']['message'];
        $error['error'] = "Authentication Failed. \n" . $googleErrorMsg;
        return $error;
    } catch (Exception $e) {
        unlink(getDirectoryPath() . strtolower($photo)); // removed temporary img
        $error["count"] = 0;
        $error["success"] = false;
        $error["driveErrMsg"] = "$e";
        $error['error'] = "Authentication Failed. \n" . $e->getMessage();
        return $error;
    }
}

function multipleFileUploadToGoogleDriveWithPublicPermission($photoArray, $filterFileWithoutId = '', $appProperties = [])
{
    $resultArray = [];
    $error = [];
    $fileData = $filterFileWithoutId == '' ? $photoArray : $filterFileWithoutId;
    sort($fileData);
    // loop photos array
    for ($i = 0; $i < count($photoArray); $i++) {
        // upload photo and return id
        $uploadData = fileUploadToGoogleDriveWithPublicPermission($photoArray[$i], $appProperties);
        // if success store name and google id in result array 
        if ($uploadData['success'] == true) {
            $arrayData = (array)$fileData[$i]; // SAVE CURRENT METADATA
            $arrayData['name'] = $photoArray[$i];
            $arrayData['id'] = $uploadData['id']['file_id'];
            $arrayData['datetime'] = date('Y-m-d H:i:s');
            array_push($resultArray, $arrayData);
        } else {
            // if error return error message from upload photo function and break loop
            $error = $uploadData;
            break;
        }
    }
    if (count($error) != 0) return $error;   // if error uploading return error
    $resultArray['success'] = true;  // return success upload and data
    return $resultArray;
}

// rename file or folder in google drive api
function renameFile($fileId = '', $newTitle = '')
{
    if ($fileId == '' || !$fileId) return false;
    try {
        // SERVICE
        $client = getClientService();
        $driveService = getServiceDrive($client);
        $file = new Drive\DriveFile($client);
        $file->setName($newTitle);

        $updateFile = $driveService->files->update($fileId, $file);

        $returnData['data'] = $updateFile;
        $returnData['success'] = true;
        return $returnData;
    } catch (Exception $e) {
        $resultArray['success'] = false;
        return $resultArray;
    }
}

function checkToUploadGoogleDrive($files, $oldFiles)
{
    $result = is_string($files) ? $files : '';
    $convertFiles = is_string($files) ? (array)json_decode($files) : $files;
    if ($files != $oldFiles && count($convertFiles) > 0) {
        // DECODE ARRAY FILES
        $jsonDecodeFiles = array_map(fn($value) => is_string($value) ? json_decode($value) : $value, $convertFiles);
        // FILTER FILES WITHOUT IDS IN GOOGLE API
        $filterFileWithoutId = array_filter($jsonDecodeFiles, fn($val) => $val->id == '');
        // GET ALL FILE NAMES WITHOUT GOOGLE IDS
        $getArrayFileNames = array_map(fn($value) => $value->name, array_values($filterFileWithoutId));
        // UPLOAD ALL FILES WITHOUT GOOGLE IDS
        $uploadToGoogleData = multipleFileUploadToGoogleDriveWithPublicPermission($getArrayFileNames, $filterFileWithoutId);
        // IF GOOGLE API ERROR RETURN ERROR MSG
        if ($uploadToGoogleData['success'] == false) returnError($uploadToGoogleData['error']);
        unset($uploadToGoogleData['success']); // UNSET UNSET DATA
        // CONVERT STRINGIFY DATA TO ARRAY
        $oldDataConvertToJSON = json_decode($oldFiles, true);
        $oldData = is_array($oldDataConvertToJSON) ? $oldDataConvertToJSON : []; // RETURN OLD DATA TO ARRAY
        $newData = $uploadToGoogleData; // ALREADY AN ARRAY 
        $mergeDataArray = array_merge($oldData, $newData); // MERGE ARRAY 
        $result = json_encode($mergeDataArray);   // SAVE DATA AS STRINGIFY IN DATABASE
    }
    return $result;
}

function checkDeleteGoogleDriveApiFiles($files, $pendingDeleteFile = [])
{
    $value = $files;
    if (count($pendingDeleteFile) > 0) {
        $jsonDecodeFiles = $files;  // DECODE ARRAY FILES
        if ($files == '') $jsonDecodeFiles = [];
        if ($files != '' && is_string($files)) $jsonDecodeFiles = json_decode($files);
        $storeData = $jsonDecodeFiles; // STORE NEW DATA 
        $filterFileId = array_map(fn($value) => $value->id, $storeData); // FILTER ALL GOOGLE ID
        $resultIds = []; // STORE GOOGLE IDS
        // LOOP TO STORE TO DELETE ID
        for ($i = 0; $i < count($pendingDeleteFile); $i++) {
            $decodeItem = json_decode($pendingDeleteFile[$i]); // DECODE ID 
            $googleIds = is_object($decodeItem) ? $decodeItem->id : $decodeItem[0]->id; // GET ID
            array_push($resultIds, $googleIds); // PUSH TO ARRAY GOOGLE ALL ID
            deleteGoogleFileByFileId($googleIds); // DELETE FILE IN GOOGLE API
        }
        // LOOP REMAINING FILE TO REMOVED
        for ($i = 0; $i < count($resultIds); $i++) {
            $indexToDelete = array_search($resultIds[$i], $filterFileId); // SEARCH AND GET INDEX BY ID
            unset($storeData[$indexToDelete]);
        }
        $result = array_values($storeData); // RE INDEX ARRAY TO REMOVED ARRAY KEY
        $value = json_encode($result); // JSON ENCODE ARRAY
    }
    return $value;
}
