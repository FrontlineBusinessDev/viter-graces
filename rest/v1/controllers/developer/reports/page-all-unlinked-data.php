<?php

// set http header
require '../../../core/header.php';
// use needed functions
require '../../../core/functions.php';
// use needed classes
require '../../../models/developer/report/UnlinkedData.php';
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$val = new UnlinkedData($conn);
// get payload
$body = file_get_contents("php://input");
$data = json_decode($body, true);
// validate api key
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    checkApiKey();
    // check data
    checkPayload($data);

    if (array_key_exists("start", $_GET)) {
        // Developer only. The role is read from the database using the logged in id.
        if (!isDeveloperRequester($conn, ["activity_log_user_id" => $data["loggedInId"] ?? 0])) {
            returnError("Only a Developer can view this report.");
        }

        // columns that can be filtered from the table header
        $allowedColumns = ["module", "linked_as", "missing_user_name"];

        $val->column_search = $data["searchValue"] ?? "";
        $val->column_start = $_GET['start'];
        $val->column_total = 15;
        // FOR MULTIPLE FILTER
        $val->filters = $data['columnFilters'] ?? [];

        checkLimitId($val->column_start, $val->column_total);

        $query = $val->readLimit($allowedColumns);
        checkQuery($query, "Empty records. (read unlinked data)");
        $total_result = $val->readAll($allowedColumns);
        checkQuery($total_result, "Empty records. (read all unlinked data)");
        http_response_code(200);

        checkReadQuery(
            $query,
            $total_result,
            $val->column_total,
            $val->column_start
        );
    }
}

http_response_code(200);
// when authentication is cancelled
// header('HTTP/1.0 401 Unauthorized');
checkAccess();
