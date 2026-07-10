<?php

// Require Response 
require_once 'Response.php';
require_once "env.php";
require_once __DIR__ . '/../lib/bootstrap.php';
require_once __DIR__ . '/../lib/google-api/vendor/autoload.php';

use Google\Client;
use Google\Service\Drive;

$response = new Response();
$error = [];
$returnData = [];

function getDefaultFolderId($folderId = '')
{
    // Since this script runs natively as you, it naturally has full access to your folders
    return "13YZwBez1gDYEfvU5t2uGxQ6O9KJwfyGo";
}

function getDirectoryPath()
{
    return __DIR__ . $_ENV['GOOGLE_API_DIRECTORY_PATH'];
}

function getClientService()
{
    $client = new Client();

    // Fallback checks to read from both $_ENV and native environment
    $clientId = $_ENV['GOOGLE_CLIENT_ID'] ?? getenv('GOOGLE_CLIENT_ID');
    $clientSecret = $_ENV['GOOGLE_CLIENT_SECRET'] ?? getenv('GOOGLE_CLIENT_SECRET');
    $refreshToken = $_ENV['GOOGLE_REFRESH_TOKEN'] ?? getenv('GOOGLE_REFRESH_TOKEN');

    // Fail-safe check so you know exactly what is missing
    if (!$refreshToken) {
        throw new Exception("Configuration Error: GOOGLE_REFRESH_TOKEN is empty or not loaded properly from env.php.");
    }
    if (!$clientId || !$clientSecret) {
        throw new Exception("Configuration Error: Client ID or Client Secret is missing.");
    }

    $client->setClientId($clientId);
    $client->setClientSecret($clientSecret);
    $client->addScope(Drive::DRIVE);

    // Authenticate using the validated token string
    $client->refreshToken($refreshToken);

    return $client;
}

function getServiceDrive()
{
    return new Drive(getClientService());
}

function checkFileInput($fileId, $msg = 'File Empty')
{
    if (!$fileId || $fileId == "") returnError($msg);
}

// START GOOGLE DRIVE FOLDER

function createFolder($folderName, $appProperties = [])
{
    try {
        $driveService = getServiceDrive();
        $returnData = array();
        $fileMetadata = new Drive\DriveFile(array(
            'name' => $folderName,
            'parents' => [getDefaultFolderId()],
            'mimeType' => 'application/vnd.google-apps.folder',
            'appProperties' => $appProperties
        ));

        $file = $driveService->files->create($fileMetadata, array('fields' => 'id'));
        $returnData['folderId'] = $file['id'];

        $permissionMetaData = new Drive\Permission(array(
            'type' => 'anyone',
            'role' => "reader",
            'allowFileDiscovery' => true,
            'withLink' => true
        ));

        $permissionData = $driveService->permissions->create($file['id'], $permissionMetaData, array('fields' => 'id'));
        $returnData['permissionId'] = $permissionData['id'];
        $returnData['success'] = true;
        return $returnData;
    } catch (Exception $e) {
        $error["count"] = 0;
        $error["success"] = false;
        $error["driveErrMsg"] = "$e";
        $error['error'] = 'Authentication Failed.';
        return $error;
    }
}

function checkFolderIfExistOrCreate($folderName, $appProperties = [])
{
    try {
        $defaultFolderId = getDefaultFolderId();
        $query = "name = '{$folderName}' and '{$defaultFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
        $driveService = getServiceDrive();
        $parameters = [
            'q' => $query,
            'spaces' => 'drive',
            'fields' => 'files(id, name)',
        ];
        $results = $driveService->files->listFiles($parameters);
        $files = $results->getFiles();
        if (count($files) > 0) {
            return $files[0]->getId();
        } else {
            $fileMetadata = new Drive\DriveFile(array(
                'name' => $folderName,
                'mimeType' => 'application/vnd.google-apps.folder',
                'parents' => [$defaultFolderId],
                'appProperties' => $appProperties
            ));

            $file = $driveService->files->create($fileMetadata, array('fields' => 'id'));
            $returnData['folderId'] = $file['id'];

            $permissionMetaData = new Drive\Permission(array(
                'type' => 'anyone',
                'role' => "reader",
                'allowFileDiscovery' => true,
                'withLink' => true
            ));

            $permissionData = $driveService->permissions->create($file['id'], $permissionMetaData, array('fields' => 'id'));
            return $file['id'];
        }
    } catch (Exception $e) {
        returnError("$e");
    }
}

function deleteGoogleFileByFileId($fileId)
{
    checkFileInput($fileId);
    try {
        $driveService = getServiceDrive();
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

function fileUploadToGoogleDriveWithPublicPermission($photo, $appProperties = [], $folderId = '')
{
    checkFileInput($photo);
    try {
        $driveService = getServiceDrive();
        $googleIds = array();
        $content = file_get_contents(getDirectoryPath() . strtolower($photo));
        $mimeType = mime_content_type(getDirectoryPath() . strtolower($photo));
        $folderIdPath = getDefaultFolderId($folderId);

        $fileMetadata = new Drive\DriveFile(array(
            'name' => $photo,
            'parents' => [$folderIdPath],
            'writersCanShare' => true,
            'ignoreDefaultVisibility' => true,
            "appProperties" => $appProperties
        ));

        $requestCreateFile = $driveService->files->create($fileMetadata, array(
            'data' => $content,
            'mimeType' => $mimeType,
            'uploadType' => 'multipart',
            'fields' => 'id',
        ));

        $googleIds['file_id'] = $requestCreateFile['id'];

        $permissionMetaData = new Drive\Permission(array(
            'type' => 'anyone',
            'role' => 'reader',
            'allowFileDiscovery' => true,
            'withLink' => true
        ));

        $requestNewPermissions = $driveService->permissions->create($googleIds['file_id'], $permissionMetaData, array('fields' => 'id'));
        $googleIds['permission'] = $requestNewPermissions['id'];
        $returnData['success'] = true;
        $returnData['id'] = $googleIds;
        unlink(getDirectoryPath() . strtolower($photo));
        return $returnData;
    } catch (Exception $e) {
        unlink(getDirectoryPath() . strtolower($photo));
        $error["count"] = 0;
        $error["success"] = false;
        $error["driveErrMsg"] = "$e";
        $error['error'] = "Authentication Failed. \n" . $e->getMessage();
        return $error;
    }
}

function multipleFileUploadToGoogleDriveWithPublicPermission($photoArray, $filterFileWithoutId = '', $appProperties = [], $folderId = '')
{
    $resultArray = [];
    $error = [];
    $fileData = $filterFileWithoutId == '' ? $photoArray : $filterFileWithoutId;
    sort($fileData);

    for ($i = 0; $i < count($photoArray); $i++) {
        $uploadData = fileUploadToGoogleDriveWithPublicPermission($photoArray[$i], $appProperties, $folderId);
        if ($uploadData['success'] == true) {
            $arrayData = (array)$fileData[$i];
            $arrayData['name'] = $photoArray[$i];
            $arrayData['id'] = $uploadData['id']['file_id'];
            $arrayData['datetime'] = date('Y-m-d H:i:s');
            array_push($resultArray, $arrayData);
        } else {
            $error = $uploadData;
            break;
        }
    }
    if (count($error) != 0) return $error;
    $resultArray['success'] = true;
    return $resultArray;
}

function renameFile($fileId = '', $newTitle = '')
{
    if ($fileId == '' || !$fileId) return false;
    try {
        $driveService = getServiceDrive();
        $file = new Drive\DriveFile();
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

function checkToUploadGoogleDrive($files, $oldFiles, $folderName = '', $folderId = '')
{
    $resultFolderId = '';
    // $resultFolderId = $folderName != '' ? checkFolderIfExistOrCreate($folderName) : $folderId ?? '';
    $result = is_string($files) ? $files : '';
    $convertFiles = is_string($files) ? (array)json_decode($files) : $files;
    if ($files != $oldFiles && count($convertFiles) > 0) {
        $jsonDecodeFiles = array_map(fn($value) => is_string($value) ? json_decode($value) : $value, $convertFiles);
        $filterFileWithoutId = array_filter($jsonDecodeFiles, fn($val) => $val->id == '');
        $getArrayFileNames = array_map(fn($value) => $value->name, array_values($filterFileWithoutId));
        $uploadToGoogleData = multipleFileUploadToGoogleDriveWithPublicPermission($getArrayFileNames, $filterFileWithoutId, [], $resultFolderId);
        if ($uploadToGoogleData['success'] == false) returnError($uploadToGoogleData['error']);
        unset($uploadToGoogleData['success']);
        $oldDataConvertToJSON = json_decode($oldFiles, true);
        $oldData = is_array($oldDataConvertToJSON) ? $oldDataConvertToJSON : [];
        $newData = $uploadToGoogleData;
        $mergeDataArray = array_merge($oldData, $newData);
        $result = json_encode($mergeDataArray);
    }
    return $result;
}

function checkDeleteGoogleDriveApiFiles($files, $pendingDeleteFile = [])
{
    $value = $files;
    if (count($pendingDeleteFile) > 0) {
        $jsonDecodeFiles = $files;
        if ($files == '') $jsonDecodeFiles = [];
        if ($files != '' && is_string($files)) $jsonDecodeFiles = json_decode($files);
        $storeData = $jsonDecodeFiles;
        $filterFileId = array_map(fn($value) => $value->id, $storeData);
        $resultIds = [];
        for ($i = 0; $i < count($pendingDeleteFile); $i++) {
            $decodeItem = json_decode($pendingDeleteFile[$i]);
            $googleIds = is_object($decodeItem) ? $decodeItem->id : $decodeItem[0]->id;
            array_push($resultIds, $googleIds);
            deleteGoogleFileByFileId($googleIds);
        }
        for ($i = 0; $i < count($resultIds); $i++) {
            $indexToDelete = array_search($resultIds[$i], $filterFileId);
            unset($storeData[$indexToDelete]);
        }
        $result = array_values($storeData);
        $value = json_encode($result);
    }
    return $value;
}
