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

    if ($un !== $apiKey) {
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

// $detail, when provided, is the real underlying PDOException message the
// model caught and swallowed (see e.g. SuppliersPurchaseOrder::update()'s
// lastDbError property) - appending it here is what lets the client see the
// actual SQLSTATE/reason instead of only the generic "(update)"-style $msg,
// without changing behavior for the many call sites that don't pass it.
function checkQuery($query, $msg, $detail = null)
{
    if (!$query) {
        $response = new Response();
        $error = [];
        $response->setSuccess(false);
        $error["count"] = 0;
        $error["success"] = false;
        $error['type'] = "invalid_request_error";
        $error['error'] = $detail ? "{$msg} — {$detail}" : $msg;
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
    checkQuery($query, "There's a problem processing your request. (create)", $object->lastDbError ?? null);
    return $query;
}

// Login
function checkLogin($object)
{
    $response = new Response();
    $query = $object->readLogin();
    if ($query === false || $query->rowCount() == 0) {
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
    $key,
) {
    $response = new Response();
    $error = [];
    $returnData = [];
    if (password_verify($password, $hash_password)) {
        $payload = array(
            "iss" => "localhost", // A string containing the name or identifier of the issuer application.
            "aud" => "hr_local",
            "iat" => time(),  // timestamp of token issuing.
            "data" => array("email" => $email, "data" => $row), // App payload
        );
        $jwt = JWT::encode($payload, $key, 'HS256');

        http_response_code(200);
        $returnData["data"] = [$row, $jwt];
        $returnData["count"] = $result->rowCount();
        $returnData["success"] = true;
        $returnData["message"] = "Access granted.";
        $response->setData($returnData);
        $response->send();
        exit;
        // return $returnData;
    } else {
        $response->setSuccess(false);
        $error["count"] = 0;
        $error["success"] = false;
        $error['error'] = "Access denied.";
        $response->setData($error);
        $response->send();
        exit;
    }
    // checkEndpoint();
    // http_response_code(200);
    // checkAccess();
}

// Token for other user
function tokenOther(
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
            $object->user_account_email = $decoded->data->email;
            $result = checkLogin($object);
            $row = $result->fetch(PDO::FETCH_ASSOC);

            // the password hash embedded in the token reflects the account's
            // password at the time of login; if the current password differs,
            // it was changed since, so this token (and any other still holding
            // the old hash) is no longer valid.
            if ($decoded->data->data->user_account_password !== $row['user_account_password']) {
                http_response_code(401);
                $response->setSuccess(false);
                $error["count"] = 0;
                $error["success"] = false;
                $error["error"] = "Session expired. Password was changed.";
                $error["error_type"] = "password_changed";
                $response->setData($error);
                $response->send();
                exit;
            }

            http_response_code(200);
            $fname = mb_substr($decoded->data->data->user_account_first_name, 0, 1);
            $lname = mb_substr($decoded->data->data->user_account_last_name, 0, 1);
            $nickName = "$lname$fname";

            $returnData["data"] = array_merge(
                (array)$row,
                array('user_key' => $decoded->data->data->user_account_password), // data from login
                array('role' => strtolower(str_replace(' ', '_', $decoded->data->data->user_account_role))),
                array('nickName' => $nickName),
                array('server_date' => date('Y-m-d'))
            );
            $returnData["count"] = $result->rowCount();
            $returnData["success"] = true;
            $returnData["message"] = "Access granted.";
            $response->setData($returnData);
            $response->send();
            exit;
            // return $returnData;
        } catch (Exception $ex) {
            $response->setSuccess(false);
            $error["count"] = 0;
            $error["success"] = false;
            $error['error'] = "Catch no token found.";
            $response->setData($error);
            $response->send();
            exit;
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
    // checkEndpoint();
    // http_response_code(200);
    // checkAccess();
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
function checkReadAll($object, $allowedColumns = [])
{
    $query = $object->readAll($allowedColumns);
    checkQuery($query, "Empty records. (read All)");
    return $query;
}

// Read limit
function checkReadLimit($object, $allowedColumns = [])
{
    $query = $object->readLimit($allowedColumns);
    checkQuery($query, "Empty records. (limit)");
    return $query;
}

// Read all
function checkReadByUserId($object, $allowedColumns = [])
{
    $query = $object->readByUserId($allowedColumns);
    checkQuery($query, "Empty records. (Read by user id)");
    return $query;
}

// Read limit
function checkReadByUserIdLimit($object, $allowedColumns = [])
{
    $query = $object->readByUserIdLimit($allowedColumns);
    checkQuery($query, "Empty records. (Read by user id limit)");
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
    checkQuery($query, "There's a problem processing your request. (update)", $object->lastDbError ?? null);
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
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

// check is associated by name
function checkAssociatedByName($object)
{
    $query = $object->associatedByName();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

// Is the requester an active Developer?
// The requester id comes from the activity log payload, but the role is read from
// the database so a client cannot claim to be a Developer by editing the payload.
function isDeveloperRequester($conn, $data)
{
    $requesterId = $data['activity_log_user_id'] ?? 0;
    if (!is_numeric($requesterId) || (int) $requesterId <= 0) {
        return false;
    }
    try {
        $query = $conn->prepare(
            "select user_account_aid from graces_user_account
            where user_account_aid = :id
            and user_account_role = 'Developer'
            and user_account_is_active = 1"
        );
        $query->execute(["id" => (int) $requesterId]);
        return $query->rowCount() > 0;
    } catch (PDOException $ex) {
        logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
        return false;
    }
}

// Sales orders and purchase orders of the user that are shared with other product owners
// (the same order number also has lines owned by someone else). The stored journal / totals
// of such an order cover the whole order and cannot be split per owner, so deleting only
// this user's lines would leave them out of sync.
function getSharedOrderNumbers($conn, $userId)
{
    try {
        $sales = $conn->prepare(
            "select distinct o.sales_order_number from graces_sales_order o
            where o.sales_order_product_owner_id = :id
            and exists (select 1 from graces_sales_order x
                where x.sales_order_number = o.sales_order_number
                and x.sales_order_product_owner_id != :other_id)
            order by o.sales_order_number"
        );
        $sales->execute(["id" => $userId, "other_id" => $userId]);

        $purchase = $conn->prepare(
            "select distinct o.purchase_order_number from graces_suppliers_purchase_order o
            where o.purchase_order_product_owner_id = :id
            and exists (select 1 from graces_suppliers_purchase_order x
                where x.purchase_order_number = o.purchase_order_number
                and x.purchase_order_product_owner_id != :other_id)
            order by o.purchase_order_number"
        );
        $purchase->execute(["id" => $userId, "other_id" => $userId]);

        return [
            "sales" => array_map('trim', $sales->fetchAll(PDO::FETCH_COLUMN)),
            "purchase" => array_map('trim', $purchase->fetchAll(PDO::FETCH_COLUMN)),
        ];
    } catch (PDOException $ex) {
        logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
        returnError("There's a problem processing your request. (check shared orders)");
    }
}

// Stop the delete when the user shares sales orders / purchase orders with other product owners.
function checkNoSharedOrders($conn, $userId)
{
    $shared = getSharedOrderNumbers($conn, $userId);
    $format = function ($numbers) {
        $shown = array_slice($numbers, 0, 10);
        $more = count($numbers) - count($shown);
        return implode(", ", $shown) . ($more > 0 ? " and {$more} more" : "");
    };
    $parts = [];
    if (!empty($shared["sales"])) {
        $parts[] = "Sales Order: " . $format($shared["sales"]);
    }
    if (!empty($shared["purchase"])) {
        $parts[] = "Purchase Order: " . $format($shared["purchase"]);
    }
    if (!empty($parts)) {
        returnError(
            "You cannot delete this account because it shares orders with other product owners ("
                . implode("; ", $parts)
                . "). Resolve these orders first."
        );
    }
}

// Sales orders / purchase orders / installment payments that this user only received or
// transacted (the owner is someone else). That data belongs to other product owners, so it is
// never deleted together with the user: the delete is stopped instead.
function checkNoReceivedLinks($conn, $userId)
{
    try {
        $count = function ($sql, $param) use ($conn) {
            $query = $conn->prepare($sql);
            $query->execute(["id" => $param]);
            return (int) $query->fetchColumn();
        };
        $found = [
            "Sales Order (received)" => $count("select count(*) from graces_sales_order where sales_order_received_by_id = :id", $userId),
            "Purchase Order (transacted)" => $count("select count(*) from graces_suppliers_purchase_order where purchase_order_transact_id = :id", $userId),
            "Installment Payment (received)" => $count("select count(*) from graces_installment_payment where installment_payment_received_id = :id", (string) $userId),
        ];
    } catch (PDOException $ex) {
        logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
        returnError("There's a problem processing your request. (check received links)");
    }

    $parts = [];
    foreach ($found as $label => $total) {
        if ($total > 0) {
            $parts[] = "{$label}: {$total}";
        }
    }
    if (!empty($parts)) {
        returnError(
            "You cannot delete this account because it is already used in records owned by other users ("
                . implode("; ", $parts)
                . ")."
        );
    }
}

// Developer only: permanently delete a user account together with ALL data connected to it
// (activity log, products, sales orders, purchase orders, stock movements, returns).
// Call checkNoSharedOrders() first: orders shared with other product owners must not be deleted
// this way. The sales journal and installment payments of the user's orders are then deleted too.
// Everything runs in one transaction: either all of it is deleted or none.
// Returns the PDOStatement of the final user delete, or false on failure.
function deleteUserAccountWithConnectedData($conn, $userId)
{
    try {
        $conn->beginTransaction();
        $id = ["id" => $userId];

        // order numbers of the user's sales orders (needed before the lines are deleted)
        $query = $conn->prepare("select distinct sales_order_number from graces_sales_order where sales_order_product_owner_id = :id");
        $query->execute($id);
        $orderNumbers = $query->fetchAll(PDO::FETCH_COLUMN);

        $tables = [
            "graces_stock_movement" => "stock_movement_product_owner_id",
            "graces_return_product" => "return_product_owner_id",
            "graces_sales_order" => "sales_order_product_owner_id",
            "graces_suppliers_purchase_order" => "purchase_order_product_owner_id",
            "graces_products" => "products_owner_id",
            "graces_activity_log" => "activity_log_user_id",
        ];
        foreach ($tables as $table => $column) {
            $conn->prepare("delete from {$table} where {$column} = :id")->execute($id);
        }

        // journal and installments of orders that no longer have any line
        foreach ($orderNumbers as $orderNumber) {
            $query = $conn->prepare("select 1 from graces_sales_order where sales_order_number = :number limit 1");
            $query->execute(["number" => $orderNumber]);
            if ($query->rowCount() > 0) {
                continue; // another product owner still has a line in this order
            }
            $conn->prepare("delete from graces_sales_journal where sales_journal_order_number = :number")
                ->execute(["number" => $orderNumber]);
            $conn->prepare("delete from graces_installment_payment where installment_payment_code_number = :number")
                ->execute(["number" => $orderNumber]);
        }

        $query = $conn->prepare("delete from graces_user_account where user_account_aid = :id");
        $query->execute($id);
        $conn->commit();
        return $query;
    } catch (PDOException $ex) {
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
        return false;
    }
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

// Shared payment status rule for purchase orders / expenses / accounts
// payable: unpaid (nothing paid), partially paid (something paid but not
// the full amount), or paid (paid amount covers the total). Centralized
// here so every module derives it the same way instead of each controller
// re-implementing its own (and inevitably diverging) version.
function calculatePaymentStatus($paid, $total)
{
    $paid = (float)$paid;
    $total = (float)$total;

    if ($paid <= 0) {
        return "unpaid";
    }
    if ($paid >= $total) {
        return "paid";
    }
    return "partially paid";
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

// check name
function isIdNumberExist($object, $newCodeNumber)
{
    $query = $object->checkIdNumberExist($newCodeNumber);
    $count = $query->rowCount();
    checkExistence($count, "{$newCodeNumber} already exist.");
}

function setIdNumber($object, $val)
{
    $lastIdNumber = getResultData($object->checkLastIdNumber());

    if (count($lastIdNumber) == 0) {
        $newCodeNumber = $val . "001";
        return $newCodeNumber;
    }
    // value number of payroll id
    $lastPayNumber = intval(substr($lastIdNumber[0]['id_number'], 3));

    $newCodeNumber = $val . str_pad((string)($lastPayNumber + 1), 3, "0", STR_PAD_LEFT);
    // CHECK IF PAYROLL ID GENERATED IS EXIST IN SPECIFIC SUBSCRIBER ID
    isIdNumberExist($object, $newCodeNumber);

    return $newCodeNumber;
}

function logError(
    string $message,
    ?string $filePath = null,
    array $extra = []
): void {
    $log = [
        'level' => 'ERROR',
        'datetime' => date('c'), // ISO 8601
        'file' => $filePath,
        'message' => $message,
    ];

    if (!empty($extra)) {
        $log['extra'] = $extra;
    }

    file_put_contents(
        'php://stderr',
        json_encode($log, JSON_UNESCAPED_SLASHES) . PHP_EOL
    );
}

function deleteImageDirectory($imageFileName)
{
    $result = false;
    $directory = __DIR__ . UPLOAD_MULTIPLE_PATH;  // localhost link  

    if ($imageFileName == '') return; // if empty file name 

    $fileDirectory = "{$directory}{$imageFileName}"; // store file path
    if (file_exists($fileDirectory)) { // check if file exist
        $result = unlink($fileDirectory); // remove in server public img
    }

    return $result;
}
