<?php

// Reset password
function checkResetPasswordByEmail($object)
{
    $query = $object->resetPasswordByEmail();
    checkQuery($query, "There's a problem processing your request. (reset password)");
    return $query;
}
