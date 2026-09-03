<?php

// check association
function allowedColumns()
{
    $query = [
        "sales_journal_order_number",
        "sales_journal_date",
        "sales_journal_customer",
        "sales_journal_method",
        "sales_journal_debit",
        "sales_journal_credit",
        "sales_journal_balance",
    ];
    return $query;
}
