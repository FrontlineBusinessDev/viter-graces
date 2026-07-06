<?php
// check association
function isUserAccountAssociated($object)
{
    $query = $object->checkUserAccountAssociated();
    $count = $query->rowCount();
    checkExistence($count, "You cannot delete this item because it is already associated with other module.");
}

// Create 
function checkCreateMovementStock($object)
{
    $query = $object->createMovementStock();
    checkQuery($query, "There's a problem processing your request. (Create Movement Stock)");
    return $query;
}

// Create 
function checkCreateInstallment($object)
{
    $query = $object->createInstallment();
    checkQuery($query, "There's a problem processing your request. (Create Installment)");
    return $query;
}

// Read all
function checkReadAllActiveByName($object)
{
    $query = $object->readAllActiveByName();
    checkQuery($query, "Empty records. (read all active by name)");
    return $query;
}

// Read all
function checkReadSalesToday($object)
{
    $query = $object->readSalesToday();
    checkQuery($query, "Empty records. (read sales today)");
    return $query;
}

// Read all
function checkReadTopSellingProduct($object)
{
    $query = $object->readTopSellingProduct();
    checkQuery($query, "Empty records. (read top selling product)");
    return $query;
}

// Delete 
function checkDeleteById($object)
{
    $query = $object->deleteById();
    checkQuery($query, "There's a problem processing your request. (deleteById)");
    return $query;
}

// Delete 
function checkDeleteInstallment($object)
{
    $query = $object->deleteInstallment();
    checkQuery($query, "There's a problem processing your request. (deleteInstallment)");
    return $query;
}

// Read all
function checkReadByCustomerId($object, $allowedColumns = [])
{
    $query = $object->readByCustomerId($allowedColumns);
    checkQuery($query, "Empty records. (read All)");
    return $query;
}

// Read limit
function checkReadLimitByCustomerId($object, $allowedColumns = [])
{
    $query = $object->readLimitByCustomerId($allowedColumns);
    checkQuery($query, "Empty records. (limit)");
    return $query;
}

// Read all
function checkReadAllSalesOrder($object, $allowedColumns = [])
{
    $query = $object->readAllSalesOrder($allowedColumns);
    checkQuery($query, "Empty records. (checkReadAllSalesOrder)");
    return $query;
}

// Read limit
function checkReadAllSalesOrderLimit($object, $allowedColumns = [])
{
    $query = $object->readAllSalesOrderLimit($allowedColumns);
    checkQuery($query, "Empty records. (limit)");
    return $query;
}

// check association
function allowedColumns()
{
    $query = [
        "sales_order_aid",
        "sales_order_status",
        "sales_order_is_active",
        "sales_order_number",
        "sales_order_date",
        "sales_order_customer_id",
        "sales_order_customer_name",
        "sales_order_payment_method",
        "sales_order_product_id",
        "sales_order_product_name",
        "sales_order_qty",
        "sales_order_price",
        "sales_order_total",
        "sales_order_discount",
        "sales_order_tax",
        "sales_order_paid_amount",
        "sales_order_notes",
        "sales_order_received_by_id",
        "sales_order_received_by_name",
        "sales_order_product_owner_id",
        "sales_order_product_owner_name",
        "sales_order_installment",
        "sales_order_due_date",
        "sales_order_total_payable_amount",
    ];
    return $query;
}

// Update 
function checkUpdateInstallment($object)
{
    $query = $object->updateInstallment();
    checkQuery($query, "There's a problem processing your request. (update installment)");
    return $query;
}

// Update 
function updateStatus($val, $data)
{
    // DEFAULT VALUE
    $val->sales_order_status = 'paid';
    $installmentData = $data["installmentItems"];
    $val->sales_order_paid_amount = $data["sales_order_paid_amount"];
    $val->sales_order_total_payable_amount = $data["sales_order_total_payable_amount"];

    //  IF THE PAYMENT IS PARTIAL AND HAVE INSTALLMENT DATA
    if ((float)$val->sales_order_paid_amount < (float)$val->sales_order_total_payable_amount) {
        $val->sales_order_status = 'partial';
    }
    //  IF THE PAYMENT IS 0, NEGATIVE OR INSTALLMENT
    if ((float)$val->sales_order_paid_amount == 0) {
        $val->sales_order_status = 'unpaid';
    }
    if ((float)$val->sales_order_paid_amount == 0 && count($installmentData) == 0) {
        $val->sales_order_status = 'unpaid';
    }
    //  IF THE PAYMENT IS PARTIAL BUT NO INSTALLMENT DATA
    if (
        $val->sales_order_due_date == "" &&
        (float)$val->sales_order_paid_amount < (float)$val->sales_order_total_payable_amount
        && count($installmentData) == 0
    ) {
        $val->sales_order_status = 'overdue';
    }

    $due_date = date('Y-m-d');
    $timestamp = strtotime($val->sales_order_due_date);
    $val->sales_order_due_date = date("Y-m-d", $timestamp);

    //  IF THE NEXT DUEDATE IS IN NEXT 3 DAY
    if (
        $val->sales_order_due_date <= $due_date &&
        (float)$val->sales_order_paid_amount < (float)$val->sales_order_total_payable_amount
    ) {
        $val->sales_order_status = 'overdue';
    }

    return;
}

// Update 
function updateConnectedMenu($object)
{
    // 


}

// Read all
function checkReadSalesOrder($object, $allowedColumns = [])
{
    $query = $object->readSalesOrder($allowedColumns);
    checkQuery($query, "Empty records. (Read Sales Order)");
    return $query;
}
