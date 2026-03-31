<?php
// check database connection
$conn = null;
$conn = checkDbConnection();
// make instance of classes
$role = new Role($conn);
// get $_GET data
$error = [];
$returnData = [];
if (array_key_exists("roleid", $_GET)) {
    // get data
    $role->role_aid = $_GET['roleid'];
    $column_name = strtolower($data['item']['role_name']);
    checkId($role->role_aid);
    // delete
    if ($column_name == "developer") {
        isUserSystemAssociated($role);
    } else {
        isUserOtherAssociated($role);
    }

    $query = checkDelete($role);
    returnSuccess($role, "Role", $query);
}

// return 404 error if endpoint not available
checkEndpoint();
