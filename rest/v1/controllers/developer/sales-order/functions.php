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
function checkDeleteinstallmentById($object)
{
    $query = $object->deleteinstallmentById();
    checkQuery($query, "There's a problem processing your request. (deleteinstallmentById)");
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
        "sales_order_total_receivable_amount",
        "sales_order_paid_per_product",
        "name",
        "id",
        "order_date",
        "is_active",
        "total_paid",
        "total_sub_amount",
        "total_amount",
        "is_status",
    ];
    return $query;
}

// Update 
function checkUpdateInstallment($object)
{
    $query = $object->updateInstallment();
    checkQuery($query, "There's a problem processing your request. (Update installment)");
    return $query;
}

// Update 
function checkUpdateSalesJournal($object)
{
    $now = date("Y-m-d H:i:s");

    $query = checkReadAllSalesJournal($object); // Ensure this query uses ASC ordering!
    $dataVal = getResultData($query) ?? [];

    $journal_balance = 0.00;
    $last_query = true;

    $thefirstLoopMatches = 0;

    for ($i = 0; $i < count($dataVal); $i++) {
        $row = $dataVal[$i];
        $object->sales_journal_aid = $row['sales_journal_aid'];

        $debit = (float)($row['sales_journal_debit'] ?? 0);
        $credit = (float)($row['sales_journal_credit'] ?? 0);

        $isMatchingOrder = (trim($object->sales_order_number) == trim($row['sales_journal_order_number']));

        // Update values based on specific entry type rather than overwriting all rows
        if ($isMatchingOrder && $row['sales_journal_from'] == 'sales-order') {
            $thefirstLoopMatches += 1;
            if ((float)$object->sales_order_total_receivable_amount > 0 && (float)$thefirstLoopMatches == 1) {
                $debit = (float)$object->sales_order_total_receivable_amount;
                $credit = 0.00;
            }
            if ((float)$object->sales_order_paid_amount > 0 && (float)$thefirstLoopMatches != 1) {
                $debit = 0.00;
                $credit = (float)$object->sales_order_paid_amount;
            }
        }

        // Initialize running balance with existing starting balance on first iteration
        if ($i == 0) {
            $debit =  $isMatchingOrder
                ? (float)($object->sales_order_total_receivable_amount ?? 0) : (float)($row['sales_journal_balance'] ?? 0);
            $journal_balance += $isMatchingOrder
                ? (float)($object->sales_order_total_receivable_amount ?? 0)
                : (float)($row['sales_journal_balance'] ?? ($debit - $credit));
        } else {
            $journal_balance += ($debit - $credit);
        }

        // Assign property values
        $object->sales_journal_debit = number_format($debit, 2, '.', '');
        $object->sales_journal_credit = number_format($credit, 2, '.', '');
        $object->sales_journal_balance = number_format($journal_balance, 2, '.', '');
        $object->sales_journal_update = $now;

        // Update individual row
        $last_query = $object->updateSalesJournal();
    }

    checkQuery($last_query, "There's a problem processing your request. (Update Sales Journal)");
    return $last_query;
}

// Update 
function checkUpdateDeleteSalesJournal($object)
{
    $now = date("Y-m-d H:i:s");

    $query = checkReadAllSalesJournal($object); // Ensure this query uses ASC ordering!
    $dataVal = getResultData($query) ?? [];

    $journal_balance = 0.00;
    $last_query = true;

    $thefirstLoopMatches = 0;

    for ($i = 0; $i < count($dataVal); $i++) {
        $row = $dataVal[$i];
        $object->sales_journal_aid = $row['sales_journal_aid'];

        $debit = (float)($row['sales_journal_debit'] ?? 0);
        $credit = (float)($row['sales_journal_credit'] ?? 0);

        $journal_balance += ($debit - $credit);

        // Assign property values
        $object->sales_journal_debit = number_format($debit, 2, '.', '');
        $object->sales_journal_credit = number_format($credit, 2, '.', '');
        $object->sales_journal_balance = number_format($journal_balance, 2, '.', '');
        $object->sales_journal_update = $now;

        // Update individual row
        $last_query = $object->updateSalesJournal();
    }

    checkQuery($last_query, "There's a problem processing your request. (Update Sales Journal)");
    return $last_query;
}

// Update 
function checkUpdateSalesJournalRemovedByOrderId($object)
{
    $query = $object->updateSalesJournalRemovedByOrderId();
    checkQuery($query, "There's a problem processing your request. (Update Sales Journal Removed By Id)");
    return $query;
}

// Update 
function updateStatus($val, $data)
{
    // DEFAULT VALUE
    $val->sales_order_status = 'paid';
    $installmentData = $data["installmentItems"];
    $val->sales_order_paid_amount = $val->sales_order_paid_amount;
    $val->sales_order_total_receivable_amount = $data["sales_order_total_receivable_amount"];

    //  IF THE PAYMENT IS PARTIAL AND HAVE INSTALLMENT DATA
    if ((float)$val->sales_order_paid_amount < (float)$val->sales_order_total_receivable_amount) {
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
        (float)$val->sales_order_paid_amount < (float)$val->sales_order_total_receivable_amount
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
        (float)$val->sales_order_paid_amount < (float)$val->sales_order_total_receivable_amount
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

// Update 
function installmentDetails($val, $installmentItems)
{
    $val->installment_payment_received_id = "";
    $val->installment_payment_received_name = "";
    $val->installment_payment_paid_amount = 0;
    if (strtolower($val->sales_order_payment_terms) == "installment") {
        if (count($installmentItems) > 0) {
            // CREATE INSTALLMENT PAYMENT
            for ($a = 0; $a < count($installmentItems); $a++) {
                if ($a == 0) {
                    $val->sales_order_due_date = $installmentItems[$a]["installment_payment_due_date"];
                }
                $val->installment_payment_code_id = 0;
                $val->installment_payment_is_paid = 0;
                $val->installment_payment_aid = $installmentItems[$a]["installment_payment_aid"];
                $val->installment_payment_code = $installmentItems[$a]["installment_payment_code"];
                $val->installment_payment_due_date = $installmentItems[$a]["installment_payment_due_date"];
                $val->installment_payment_code_number = $val->sales_order_number;
                $val->installment_payment_customer_id = $val->sales_order_customer_id;
                $val->installment_payment_customer_name = $val->sales_order_customer_name;
                $val->installment_payment_method = $val->sales_order_payment_method;
                $val->installment_payment_amount = $installmentItems[$a]["installment_payment_amount"];
                $val->installment_payment_paid_amount = $installmentItems[$a]["installment_payment_paid_amount"];

                if ((float)$val->installment_payment_amount <= (float)$val->installment_payment_paid_amount) {
                    $val->installment_payment_is_paid = 1;
                }

                if ((float)$val->installment_payment_aid == 0) {
                    checkCreateInstallment($val);
                } else {
                    checkId($val->installment_payment_aid);
                    checkUpdateInstallment($val);
                }
            }
        }
    }
    if (strtolower($val->sales_order_payment_terms) != "installment" && strtolower($val->sales_order_payment_terms) != "due on receipt - due on the same day the sales order") {
        $termsDays = strtolower($val->sales_order_payment_terms);
        $termsDaysCount = 0;

        // \d+ matches one or more consecutive digits
        if (preg_match('/\d+/', $termsDays, $matches)) {
            $termsDaysCount = $matches[0];
        } else {
            $termsDaysCount = 0;
        }

        $val->sales_order_due_date = date("Y-m-d", strtotime($val->sales_order_date . ' +' . (float)$termsDaysCount . ' days'));

        $val->installment_payment_code_id = 0;
        $val->installment_payment_is_paid = 0;
        $val->installment_payment_aid = 0;
        $val->installment_payment_code = 'sales-order';
        $val->installment_payment_due_date = $val->sales_order_due_date;
        $val->installment_payment_code_number = $val->sales_order_number;
        $val->installment_payment_customer_id = $val->sales_order_customer_id;
        $val->installment_payment_customer_name = $val->sales_order_customer_name;
        $val->installment_payment_method = $val->sales_order_payment_method;
        $val->installment_payment_amount = $val->sales_order_total_balance_amount;

        if ((float)$val->sales_order_total_balance_amount <= 0) {
            $val->installment_payment_is_paid = 1;
            $val->installment_payment_paid_amount = $val->installment_payment_amount;
            $val->installment_payment_received_id = $val->sales_order_received_by_id;
            $val->installment_payment_received_name = $val->sales_order_received_by_name;
        }
        checkCreateInstallment($val);

        if (count($installmentItems) > 0) {
            // if cahnges in to not due on receipt and not inatallment
            for ($a = 0; $a < count($installmentItems); $a++) {
                $val->installment_payment_aid = $installmentItems[$a]['installment_payment_aid'];
                checkDeleteinstallmentById($val);
            }
        }
    }

    if (strtolower($val->sales_order_payment_terms) == "due on receipt - due on the same day the sales order") {

        // if changes in to due on receipt
        for ($a = 0; $a < count($installmentItems); $a++) {
            $val->installment_payment_aid = $installmentItems[$a]['installment_payment_aid'];
            checkDeleteinstallmentById($val);
        }

        $val->sales_order_due_date = $val->sales_order_date;

        $val->installment_payment_code_id = 0;
        $val->installment_payment_is_paid = 0;
        $val->installment_payment_aid = 0;
        $val->installment_payment_code = 'sales-order';
        $val->installment_payment_due_date = $val->sales_order_due_date;
        $val->installment_payment_code_number = $val->sales_order_number;
        $val->installment_payment_customer_id = $val->sales_order_customer_id;
        $val->installment_payment_customer_name = $val->sales_order_customer_name;
        $val->installment_payment_method = $val->sales_order_payment_method;
        $val->installment_payment_amount = $val->sales_order_total_balance_amount;

        if ((float)$val->sales_order_total_balance_amount <= 0) {
            $val->installment_payment_is_paid = 1;
            $val->installment_payment_paid_amount = $val->installment_payment_amount;
            $val->installment_payment_received_id = $val->sales_order_received_by_id;
            $val->installment_payment_received_name = $val->sales_order_received_by_name;
        }

        checkCreateInstallment($val);

        if (count($installmentItems) > 0) {
            // if cahnges in to not due on receipt and not inatallment
            for ($a = 0; $a < count($installmentItems); $a++) {
                $val->installment_payment_aid = $installmentItems[$a]['installment_payment_aid'];
                checkDeleteinstallmentById($val);
            }
        }
    }

    return;
}

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

// Read YEARLY
function checkReadAllSales($object)
{
    $query = $object->readAllSales();
    checkQuery($query, "Empty records. (Read All Sales)");
    return $query;
}

// Read YEARLY
function checkReadAllSalesJournal($object)
{
    $query = $object->readAllSalesJournal();
    checkQuery($query, "Empty records. (Read All Sales Journal)");
    return $query;
}
// Read YEARLY
function checkReadLastSalesJournal($object)
{
    $query = $object->readLastSalesJournal();
    checkQuery($query, "Empty records. (Read Last Sales Journal)");
    return $query;
}

// Create 
function checkCreateSalesJornal($object)
{
    $now = date("Y-m-d H:i:s");

    // Bulk mapping repeated properties
    $object->sales_journal_customer = $object->sales_order_customer_name;
    $object->sales_journal_customer_id = $object->sales_order_customer_id;
    $object->sales_journal_order_number = $object->sales_order_number;
    $object->sales_journal_order_id = $object->lastInsertedId;
    $object->sales_journal_method = $object->sales_order_payment_method;
    $object->sales_journal_date = date("Y-m-d");
    $object->sales_journal_create = $now;
    $object->sales_journal_update = $now;
    $object->sales_journal_from = "sales-order";
    $object->sales_journal_note = "";

    $countQuery = getResultData(checkReadAllSales($object)) ?? [];

    $isFirstEntry = (count($countQuery) == 1);
    $paidAmount = max((float)$object->sales_order_paid_amount, 0);
    $dueAmount = max((float)$object->sales_order_total_receivable_amount, 0);

    if ($isFirstEntry) {
        $object->sales_journal_debit = $dueAmount;
        $object->sales_journal_credit = 0;
        $object->sales_journal_balance = $dueAmount;
        $query = $object->createSalesJornal(); // First journal entry
    }

    $jornalDebitQuery = getResultData(checkReadLastSalesJournal($object))[0] ?? [];
    if (!empty($jornalDebitQuery)) {
        $lastBalance = (float)($jornalDebitQuery['sales_journal_balance'] ?? 0);
        if (!$isFirstEntry && $dueAmount > 0) {
            $object->sales_journal_debit = $dueAmount;
            $object->sales_journal_credit = 0;
            $object->sales_journal_balance = $dueAmount + $lastBalance;
            $query = $object->createSalesJornal();
        }
    }

    $jornalCreditQuery = getResultData(checkReadLastSalesJournal($object))[0] ?? [];
    if (!empty($jornalCreditQuery)) {
        $lastBalance = (float)($jornalCreditQuery['sales_journal_balance'] ?? 0);

        // if ($paidAmount > 0) {
        $object->sales_journal_debit = 0;
        $object->sales_journal_credit = max(0, $paidAmount);
        $object->sales_journal_balance = $lastBalance - $paidAmount;
        $query = $object->createSalesJornal();
        // }
    }

    checkQuery($query, "There's a problem processing your request. (create Sales Jornal)");
    return $query;
}

// Read all
function checkCreateSalesJournalRemoved($object, $data)
{
    $now = date("Y-m-d H:i:s");
    $dueAmount = max((float)$data['sales_order_total_balance_amount'], 0);
    $paidAmount = max((float)$data['sales_order_paid_amount'], 0);
    $totalAmount = max((float)$data['sales_order_discounted_with_vat_amount'], 0);

    // Bulk mapping repeated properties
    $object->sales_journal_customer = $data['sales_order_customer_name'];
    $object->sales_journal_customer_id = $data['sales_order_customer_id'];
    $object->sales_journal_order_number = $object->sales_order_number;
    $object->sales_journal_order_id = $object->sales_order_aid;
    $object->sales_journal_method = $object->sales_order_payment_method;
    $object->sales_journal_date = date("Y-m-d");
    $object->sales_journal_create = $now;
    $object->sales_journal_update = $now;
    $object->sales_journal_debit = 0;
    $object->sales_journal_credit = 0;
    $object->sales_journal_balance = 0;
    $object->sales_journal_note = "Deleted details in sales order total amount of {$totalAmount}, total paid amount {$paidAmount} the total balance amount is {$dueAmount}.";

    $jornalCreditQuery = getResultData(checkReadLastSalesJournal($object))[0] ?? [];
    if (!empty($jornalCreditQuery)) {
        $lastBalance = (float)($jornalCreditQuery['sales_journal_balance'] ?? 0);
        $object->sales_journal_balance = $lastBalance - $dueAmount;
    }

    $query = $object->createSalesJornal();
    checkQuery($query, "There's a problem processing your request. (create Sales Jornal)");
    return $query;
}

// Delete 
function checkDeleteSalesJournal($object)
{
    $query = $object->deleteSalesJournal();
    checkQuery($query, "There's a problem processing your request. (deleteSalesJournal)");
    return $query;
}
