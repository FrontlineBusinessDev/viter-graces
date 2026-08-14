<?php

// Read WEEKLY
function checkReadSalesPerWeek($object)
{
    $query = $object->readSalesPerWeek();
    checkQuery($query, "Empty records. (read sales per week)");
    return $query;
}

// Read MONTHLY
function checkReadSalesPerMonth($object)
{
    $query = $object->readSalesPerMonth();
    checkQuery($query, "Empty records. (read sales per month)");
    return $query;
}

// Read YEARLY
function checkReadSalesPerYear($object)
{
    $query = $object->readSalesPerYear();
    checkQuery($query, "Empty records. (read sales per year)");
    return $query;
}

// Read WEEKLY
function checkReadExpensesPerWeek($object)
{
    $query = $object->readExpensesPerWeek();
    checkQuery($query, "Empty records. (read expenses per week)");
    return $query;
}


// Read MONTHLY
function checkReadExpensesPerMonth($object)
{
    $query = $object->readExpensesPerMonth();
    checkQuery($query, "Empty records. (read expenses per month)");
    return $query;
}

// Read YEARLY
function checkReadExpensesPerYear($object)
{
    $query = $object->readExpensesPerYear();
    checkQuery($query, "Empty records. (read expenses per year)");
    return $query;
}
