<?php

use \Firebase\JWT\JWT;

require "Database.php";
require "Response.php";

function checkApiKey()
{
    // validate apikey
    http_response_code(200);
    $apiKey = WEB_APP_API_KEY;
    $auth_array = explode(" ", $_SERVER['HTTP_AUTHORIZATION']);
    $un_pw = explode(":", base64_decode($auth_array[1]));
    $un = $un_pw[0];

    if ($un !== $apiKey["graces_key"]) {
        $response = new Response();
        $error = [];
        $response->setSuccess(false);
        $error['type'] = "invalid_request_error";
        $error['error'] = "Invalid API key.";
        $error["success"] = false;
        $error["data"] = [];
        $error["count"] = 0;
        $response->setData($error);
        $response->send();
        exit;
    }
}

function checkDbConnection()
{
    try {
        $conn = Database::connectDb();
        return $conn;
    } catch (PDOException $ex) {
        $response = new Response();
        $error = [];
        $response->setSuccess(false);
        $error['type'] = "invalid_request_error";
        $error["success"] = false;
        $error['error'] = "Database connection failed.";
        $response->setData($error);
        $response->send();
        exit;
    }
}

function checkQuery($query, $msg)
{
    if (!$query) {
        $response = new Response();
        $error = [];
        $response->setSuccess(false);
        $error["count"] = 0;
        $error["success"] = false;
        $error['type'] = "invalid_request_error";
        $error['error'] = $msg;
        $response->setData($error);
        $response->send();
        exit;
    }
}

function invalidInput()
{
    $response = new Response();
    $error = [];
    $response->setSuccess(false);
    $error["count"] = 0;
    $error["success"] = false;
    $error['error'] = "Invalid input.";
    $response->setData($error);
    $response->send();
    exit;
}

// check payload
function checkPayload($jsonData)
{
    if (
        empty($jsonData) || $jsonData === null
    ) {
        invalidInput();
    }
}

// check payload index
function checkIndex($jsonData, $index)
{
    if (
        !isset($jsonData[$index]) || $jsonData[$index] === ""
    ) {
        invalidInput();
    }

    return trim($jsonData[$index]);
    // return addslashes(trim($jsonData[$index]));
}

// check id
function checkId($id)
{
    $response = new Response();
    if ($id == '' || !is_numeric($id)) {
        $response->setSuccess(false);
        $error = [];
        $error['code'] = "400";
        $error['error'] = "ID cannot be blank or must be numeric.";
        $error["success"] = false;
        $response->setData($error);
        $response->send();
        exit;
    }
}

// check search param
function checkKeyword($keyword)
{
    $response = new Response();
    if ($keyword == '') {
        $response->setSuccess(false);
        $error = [];
        $error['code'] = "400";
        $error['error'] = "Search keyword cannot be blank.";
        $error["success"] = false;
        $error["keyword"] = $keyword;
        $response->setData($error);
        $response->send();
        exit;
    }
}

// check limit id
function checkLimitId($start, $total)
{
    $response = new Response();
    if ($start == '' || !is_numeric($start) || $total == '' || !is_numeric($total)) {
        $response->setSuccess(false);
        $error = [];
        $error['code'] = "400";
        $error['error'] = "Limit ID cannot be blank or must be numeric.";
        $error["success"] = false;
        $response->setData($error);
        $response->send();
        exit;
    }
}

// Create 
function checkCreate($object)
{
    $query = $object->create();
    checkQuery($query, "There's a problem processing your request. (create)");
    return $query;
}

// Login
function checkLogin($object)
{
    $response = new Response();
    $query = $object->readLogin();
    if ($query->rowCount() == 0) {
        $response->setSuccess(false);
        $error["count"] = 0;
        $error["success"] = false;
        $error['error'] = "Invalid email or password.";
        $error["error_type"] = 'invalid_account';
        $error["server_date"] = date('Y-m-d');
        $error["server_datetime"] = date('Y-m-d H:i:s');
        $response->setData($error);
        $response->send();
        exit;
    }
    return $query;
}

// Login access
function loginAccess(
    $password,
    $hash_password,
    $email,
    $row,
    $result,
    $key
) {
    $response = new Response();
    $error = [];
    $returnData = [];
    if (password_verify($password, $hash_password)) {
        try {
            $payload = array(
                "iss" => "localhost", // A string containing the name or identifier of the issuer application.
                "aud" => "tm",
                "iat" => time(),  // timestamp of token issuing.
                "data" => array("email" => $email, "data" => $row), // App payload
            );
            $jwt = JWT::encode($payload, $key, 'HS256');

            if ($row['role_code'] == 'r_is_developer') {
                $user_key = $row['user_system_password'];
                $role = strtolower($row['role_name']);
                $fname = mb_substr($row['user_system_fname'], 0, 1);
                $lname = mb_substr($row['user_system_lname'], 0, 1);
                $nickName = "$lname$fname";
            } else {
                $user_key = $row['user_other_password'];
                $role = strtolower($row['role_name']);
                $fname = mb_substr($row['user_other_fname'], 0, 1);
                $lname = mb_substr($row['user_other_lname'], 0, 1);
                $nickName = "$lname$fname";
            }

            http_response_code(200);
            $returnData["data"] = [
                array_merge(
                    (array)$row,
                    array('user_key' => $user_key),
                    array('role' => $role),
                    array('nickName' => $nickName),
                    array('server_datetime' => date('Y-m-d H:i:s')),
                    array('server_date' => date('Y-m-d'))
                ),
                $jwt
            ];
            $returnData["count"] = $result->rowCount();
            $returnData["success"] = true;
            $returnData["message"] = "Access granted.";
            $response->setData($returnData);
            $response->send();
            exit;
        } catch (Throwable $e) {
            returnHandleError('Error', "Login Error", $e->getMessage());
        }
    } else {
        $response->setSuccess(false);
        $error["count"] = 0;
        $error["success"] = false;
        $error['error'] = "Invalid email or password.";
        $response->setData($error);
        $response->send();
        exit;
    }
    checkEndpoint();
    http_response_code(200);
    checkAccess();
}

// Token for system user
function tokenOther(
    $object,
    $token,
    $key
) {
    $response = new Response();
    $returnData = [];
    if (!empty($token)) {
        try {
            $decoded = JWT::decode($token, $key, array('HS256'));
            $object->user_other_email = $decoded->data->email;
            $result = checkLogin($object);
            $row = $result->fetch(PDO::FETCH_ASSOC);
            // THROW PHP ERROR IF DATA NOT DEFINE.
            if (!isset($decoded->data->data->user_other_fname)) throw new Error('Invalid account.');
            http_response_code(200);
            $fname = mb_substr($decoded->data->data->user_other_fname, 0, 1);
            $lname = mb_substr($decoded->data->data->user_other_lname, 0, 1);
            $donorId = $decoded->data->data->user_other_practitioner_id ?? 0; //
            $nickName = "$lname$fname";
            $donorData = []; //

            if ($donorId > 0) { //
                $object->user_other_practitioner_id = $donorId; //
                $donorQuery = $object->readDonorById(); //
                $donorData = $donorQuery->fetch(PDO::FETCH_ASSOC); //
                if ($donorData['practitioner_is_active'] == 0) returnError('Access denied.'); //
            } //

            $returnData["data"] = array_merge(
                (array)$row,
                (array)$donorData,
                array('user_key' => $decoded->data->data->user_other_password), // data from login
                array('role' => strtolower($decoded->data->data->role_name)),
                array('nickName' => $nickName),
                array('server_date' => date('Y-m-d'))
            );
            $returnData["count"] = $result->rowCount();
            $returnData["success"] = true;
            $returnData["server_datetime"] = date("Y-m-d H:i:s");
            $returnData["message"] = "Access granted.";
            $response->setData($returnData);
            $response->send();
            return $returnData;
        } catch (Throwable $e) {
            returnHandleError('Error', "Login Error", $e->getMessage());
        }
    } else {
        returnHandleError('No token found.', 'Invalid credentials.', 'Invalid credentials.');
    }
    checkEndpoint();
    http_response_code(200);
    checkAccess();
}

// Token for system user
function tokenSystem(
    $object,
    $token,
    $key
) {
    $response = new Response();
    $error = [];
    $returnData = [];

    if (!empty($token)) {
        try {
            $decoded = JWT::decode($token, $key, array('HS256'));
            $object->user_system_email = $decoded->data->email;
            $result = checkLogin($object);
            $row = $result->fetch(PDO::FETCH_ASSOC);
            // THROW PHP ERROR IF DATA NOT DEFINE.
            if (!isset($decoded->data->data->user_system_fname)) throw new Error('Invalid account.');
            http_response_code(200);
            $fname = mb_substr($decoded->data->data->user_system_fname, 0, 1);
            $lname = mb_substr($decoded->data->data->user_system_lname, 0, 1);
            $nickName = "$lname$fname";

            $returnData["data"] = array_merge(
                (array)$row,
                array('user_key' => $decoded->data->data->user_system_password), // data from login
                array('role' => strtolower($decoded->data->data->role_name)),
                array('nickName' => $nickName),
                array('server_date' => date('Y-m-d'))
            );
            $returnData["count"] = $result->rowCount();
            $returnData["success"] = true;
            $returnData["server_datetime"] = date("Y-m-d H:i:s");
            $returnData["message"] = "Access granted.";
            $response->setData($returnData);
            $response->send();
            return $returnData;
        } catch (Throwable $e) {
            returnHandleError('Error', "Login System Error", $e->getMessage());
        }
    } else {
        $response->setSuccess(false);
        $error["count"] = 0;
        $error["success"] = false;
        $error['error'] = "No token found.";
        $response->setData($error);
        $response->send();
        exit;
    }
    checkEndpoint();
    http_response_code(200);
    checkAccess();
}


// Read
function checkReadQuery($query, $total_result, $object_total, $object_start)
{
    $response = new Response();
    $returnData = [];

    $returnData["data"] = getResultData($query);
    $returnData["count"] = $query->rowCount();
    $returnData["total"] = $total_result->rowCount();
    $returnData["per_page"] = $object_total;
    $returnData["page"] = (int)$object_start;
    $returnData["total_pages"] = ceil($total_result->rowCount() / $object_total);
    $returnData["success"] = true;
    $response->setData($returnData);
    $response->send();
    exit;
}

// Read all
function checkReadAll($object)
{
    $query = $object->readAll();
    checkQuery($query, "Empty records. (read All)");
    return $query;
}

// Read limit
function checkReadLimit($object)
{
    $query = $object->readLimit();
    checkQuery($query, "Empty records. (limit)");
    return $query;
}

// Read search
function checkSearch($object)
{
    $query = $object->search();
    checkQuery($query, "Empty records. (search core)");
    return $query;
}

// Read by id
function checkReadById($object)
{
    $query = $object->readById();
    checkQuery($query, "Empty records. (by id)");
    return $query;
}

// Read by id
function checkReadKey($object)
{
    $query = $object->readKey();
    checkQuery($query, "Empty records. (key)");
    return $query;
}

// Update 
function checkUpdate($object)
{
    $query = $object->update();
    checkQuery($query, "There's a problem processing your request. (update)");
    return $query;
}

// Update email
function checkUpdateEmailForUser($object)
{
    $query = $object->updateEmailForUser();
    checkQuery($query, "There's a problem processing your request. (update email)");
    return $query;
}

function checkUpdateUserKeyAndNewEmail($object)
{
    $query = $object->updateUserKeyAndNewEmail();
    checkQuery($query, "There's a problem processing your request. (update user key and new email)");
    return $query;
}

function checkUpdateUserOTPcode($object)
{
    $query = $object->updateUserOTPcode();
    checkQuery($query, "There's a problem processing your request. (update user key and new email)");
    return $query;
}

// Set password
function checkSetPassword($object)
{
    $query = $object->setPassword();
    checkQuery($query, "There's a problem processing your request. (set password)");
    return $query;
}

// Reset password
function checkResetPassword($object)
{
    $query = $object->resetPassword();
    checkQuery($query, "There's a problem processing your request. (reset password)");
    return $query;
}

// Active 
function checkActive($object)
{
    $query = $object->active();
    checkQuery($query, "There's a problem processing your request. (active)");
    return $query;
}

// Delete 
function checkDelete($object)
{
    $query = $object->delete();
    checkQuery($query, "There's a problem processing your request. (delete)");
    return $query;
}

// Approve

function checkApprove($object)
{
    $query = $object->approve();
    checkQuery($query, "There's a problem processing your request. (approve)");
    return $query;
}

// Decline 
function checkDecline($object)
{
    $query = $object->decline();
    checkQuery($query, "There's a problem processing your request. (decline)");
    return $query;
}

// check is associated by id
function checkAssociatedById($object)
{
    $query = $object->associatedById();
    checkQuery($query, "There's a problem processing your request. (check is associated by id)");
    return $query;
}

// check is associated by name
function checkAssociatedByName($object)
{
    $query = $object->associatedByName();
    checkQuery($query, "There's a problem processing your request. (check is associated by name)");
    return $query;
}

// Result data
function getResultData($query)
{
    $data = $query->fetchAll();
    return $data;
}

// send response
function sendResponse($result)
{
    $response = new Response();
    $response->setSuccess(true);
    $response->setStatusCode(200);
    $response->setData($result);
    $response->send();
}

// forbidden access
function checkAccess()
{
    $response = new Response();
    $error = [];
    $response->setSuccess(false);
    $error['code'] = "401";
    $error['error'] = "Forbidden access.";
    $response->setData($error);
    $response->send();
    exit;
}

// check endpoint
function checkEndpoint()
{
    $response = new Response();
    $error = [];
    $response->setSuccess(false);
    $error['code'] = "404";
    $error['error'] = "Endpoint not found.";
    $error["success"] = false;
    $response->setData($error);
    $response->send();
    exit;
}

// validator

// check existence
function checkExistence($count, $msg = "")
{
    if ($count > 0) {
        $response = new Response();
        $error = [];
        $response->setSuccess(false);
        $error['error'] = $msg;
        $error["success"] = false;
        $response->setData($error);
        $response->send();
        exit;
    }
}

// check name
function isNameExist($object, $name)
{
    $query = $object->checkName();
    $count = $query->rowCount();
    checkExistence($count, "{$name} already exist.");
}

// check email
function isEmailExist($object, $email)
{
    $query = $object->checkEmail();
    $count = $query->rowCount();
    checkExistence($count, "{$email} already exist.");
}

// check id
function isIdExist($object)
{
    $query = $object->checkId();
    $count = $query->rowCount();
    checkExistence($count, "A record already exist.");
}

// compare name
function compareName($object, $name_old, $name)
{
    if (strtolower($name_old) !=  strtolower($name)) {
        isNameExist($object, $name);
    }
}

// compare email
function compareEmail($object, $email_old, $email)
{
    if (strtolower($email_old) !=  strtolower($email)) {
        isEmailExist($object, $email);
    }
}


// check association
function isAssociated($object)
{
    $query = $object->checkAssociation();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

// compare two values
function compareTwoValues($object, $name_old, $name, $id_old, $id)
{
    if (strtolower($name_old) !=  strtolower($name) || strtolower($id_old) !=  strtolower($id)) {
        isNameExist($object, $name);
    }
}

// return success
function returnSuccess($object, $name, $query, $data = "")
{
    $response = new Response();
    $returnData = [];
    $returnData["data"] = [$data];
    $returnData["count"] = $query->rowCount();
    $returnData["{$name} ID"] = $object->lastInsertedId;
    $returnData["server_datetime"] = date("Y-m-d H:i:s");
    $returnData["success"] = true;
    // return $returnData;
    $response->setData($returnData);
    $response->send();
    exit;
}

// return error
function returnError($msg)
{
    $response = new Response();
    $error = [];
    $response->setSuccess(false);
    $error["count"] = 0;
    $error["success"] = false;
    $error['error'] = $msg;
    $error['server_datetime'] = date("Y-m-d H:i:s");
    $response->setData($error);
    $response->send();
    exit;
}

// return handle Error
function returnHandleError(
    $msg,
    $error_message = 'Something went wrong',
    $error_description = "",
    $error_code = 'invalid_request_error'
) {
    $response = new Response();
    $error = [];
    $response->setSuccess(false);
    $error["count"] = 0;
    $error["success"] = false;
    $error['error'] = $msg;
    $error['error_message'] = $error_message;
    $error['error_description'] = $error_description;
    $error['error_code'] = $error_code;
    $response->setData($error);
    $response->send();
    exit;
}

// return success
function getQueriedData($query)
{
    $response = new Response();
    $returnData = [];
    $returnData["data"] = getResultData($query);
    $returnData["count"] = $query->rowCount();
    $returnData["server_datetime"] = date("Y-m-d H:i:s");
    $returnData["success"] = true;
    $response->setData($returnData);
    $response->send();
    exit;
}
// get total time spent
function getTimeSpent($time_in, $time_out)
{
    // // Creating DateTime objects
    // $timeObject1 = date_create($time_in);
    // $timeObject2 = date_create($time_out);

    // // Calculating the difference between time objects
    // $interval = date_diff($timeObject1, $timeObject2);
    // // $hours = $interval->h;

    // $minutes = $interval->days * 24 * 60;
    // $minutes += $interval->h * 60;
    // $minutes += $interval->i;

    // $totalHrsDecimal = $minutes * (1 / 60);
    // return number_format($totalHrsDecimal, 4);

    $start = new DateTime($time_in);
    $end = new DateTime($time_out);
    $diff = $start->diff($end);

    $daysInSecs = $diff->format('%r%a') * 24 * 60 * 60;
    $hoursInSecs = $diff->h * 60 * 60;
    $minsInSecs = $diff->i * 60;

    $seconds = $daysInSecs + $hoursInSecs + $minsInSecs + $diff->s;

    $totalHrsDecimal = $seconds * (1 / 3600);

    return number_format($totalHrsDecimal, 2);
}

// get total time spent in seconds
function calculateTimeSpent($time_in, $time_out)
{

    $start = new DateTime($time_in);
    $end = new DateTime($time_out);
    $diff = $start->diff($end);

    $daysInSecs = $diff->format('%r%a') * 24 * 60 * 60;
    $hoursInSecs = $diff->h * 60 * 60;
    $minsInSecs = $diff->i * 60;

    $seconds = $daysInSecs + $hoursInSecs + $minsInSecs + $diff->s;

    return $seconds;
}

function console_log($output, $with_script_tags = true)
{
    $js_code = 'console.log(' . json_encode($output, JSON_HEX_TAG) . ');';
    if ($with_script_tags) {
        $js_code = '<script>' . $js_code . '</script>';
    }
    echo $js_code;
}

function checkFilterByStatus($object)
{
    $query = $object->filterByStatus();
    checkQuery($query, "Empty records. (filter by status)");
    return $query;
}

// Read all
function checkFilterByStatusAndSearch($object)
{
    $query = $object->filterByStatusAndSearch();
    checkQuery($query, "Empty records. (filter by status and search)");
    return $query;
}

// Read status date
function checkFilterDate($object)
{
    $query = $object->filterDate();
    checkQuery($query, "Empty records. (filter by date)");
    return $query;
}

// Read status date
function checkFilterStatusDate($object)
{
    $query = $object->filterStatusDate();
    checkQuery($query, "Empty records. (filter by status date)");
    return $query;
}

// Read status date and search
function checkFilterDateAndSearch($object)
{
    $query = $object->filterDateAndSearch();
    checkQuery($query, "Empty records. (filter by date search)");
    return $query;
}

// Read status date range
function checkFilterDateRange($object)
{
    $query = $object->filterDateRange();
    checkQuery($query, "Empty records. (filter by date range)");
    return $query;
}

// Read status date
function checkFilterStatusDateRange($object)
{
    $query = $object->filterStatusDateRange();
    checkQuery($query, "Empty records. (filter by status date range)");
    return $query;
}

// Read status date range search
function checkFilterDateRangeAndSearch($object)
{
    $query = $object->filterDateRangeAndSearch();
    checkQuery($query, "Empty records. (filter by date range and search)");
    return $query;
}

// Read status date and search
function checkFilterStatusDateAndSearch($object)
{
    $query = $object->filterStatusDateAndSearch();
    checkQuery($query, "Empty records. (filter status, date and search)");
    return $query;
}

// Read status date range and search
function checkFilterStatusDateRangeAndSearch($object)
{
    $query = $object->filterStatusDateRangeAndSearch();
    checkQuery($query, "Empty records. (filter status, date and search)");
    return $query;
}

function deleteImgFile($fileName = '')
{
    // $localPath = __DIR__ . '/../../../public/img/'; // localhost
    $localPath = __DIR__ . '/../../../img/'; // production

    if ($fileName == '' || !$fileName) return false;
    try {
        unlink($localPath . $fileName);
        return true;
    } catch (Exception $e) {
        return false;
    }
}
