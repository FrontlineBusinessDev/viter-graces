<?php

// Read all
function checkReadAllSalesOrderAmount($object, $allowedColumns = [])
{
    $query = $object->readAllSalesOrderAmount($allowedColumns);
    checkQuery($query, "Empty records. (readAllSalesOrderAmount)");
    return $query;
}

// Read all
function checkReadAllExpensesAmount($object)
{
    $query = $object->readAllExpensesAmount();
    checkQuery($query, "Empty records. (readAllExpensesAmount)");
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

// Read all
function checkReadAllStockLevel($object, $allowedColumns = [])
{
    $query = $object->readAllStockLevel($allowedColumns);
    checkQuery($query, "Empty records. (checkReadAllStockLevel)");
    return $query;
}

// Read limit
function checkReadAllStockLevelLimit($object, $allowedColumns = [])
{
    $query = $object->readAllStockLevelLimit($allowedColumns);
    checkQuery($query, "Empty records. (limit)");
    return $query;
}

// Read all
function checkReadAllLowStock($object, $allowedColumns = [])
{
    $query = $object->readAllLowStock($allowedColumns);
    checkQuery($query, "Empty records. (checkReadAllLowStock)");
    return $query;
}

// Read limit
function checkReadAllLowStockLimit($object, $allowedColumns = [])
{
    $query = $object->readAllLowStockLimit($allowedColumns);
    checkQuery($query, "Empty records. (limit)");
    return $query;
}

// Read all
function checkReadAllInventoryMovement($object, $allowedColumns = [])
{
    $query = $object->readAllInventoryMovement($allowedColumns);
    checkQuery($query, "Empty records. (checkReadAllInventoryMovement)");
    return $query;
}

// Read limit
function checkReadAllInventoryMovementLimit($object, $allowedColumns = [])
{
    $query = $object->readAllInventoryMovementLimit($allowedColumns);
    checkQuery($query, "Empty records. (limit)");
    return $query;
}

// Read all
function checkReadAllExpenses($object, $allowedColumns = [])
{
    $query = $object->readAllExpenses($allowedColumns);
    checkQuery($query, "Empty records. (checkReadAllExpenses)");
    return $query;
}

// Read limit
function checkReadAllExpensesLimit($object, $allowedColumns = [])
{
    $query = $object->readAllExpensesLimit($allowedColumns);
    checkQuery($query, "Empty records. (limit)");
    return $query;
}

// Read all
function checkReadOverduePaymentWithLimit($object, $allowedColumns = [])
{
    $query = $object->readOverduePaymentWithLimit($allowedColumns);
    checkQuery($query, "Empty records. (readOverduePaymentWithLimit)");
    return $query;
}

// Read all
function checkReadAllOverduePayment($object, $allowedColumns = [])
{
    $query = $object->readAllOverduePayment($allowedColumns);
    checkQuery($query, "Empty records. (readAllOverduePayment)");
    return $query;
}

// Read limit
function checkReadAllOverduePaymentLimit($object, $allowedColumns = [])
{
    $query = $object->readAllOverduePaymentLimit($allowedColumns);
    checkQuery($query, "Empty records. (limit)");
    return $query;
}
// Read all
function checkReadAllAR($object, $allowedColumns = [])
{
    $query = $object->readAllAR($allowedColumns);
    checkQuery($query, "Empty records. (readAllAR)");
    return $query;
}

// Read limit
function checkReadARLimit($object, $allowedColumns = [])
{
    $query = $object->readARLimit($allowedColumns);
    checkQuery($query, "Empty records. (read AR Limit)");
    return $query;
}
// Read all
function checkReadAllAP($object, $allowedColumns = [])
{
    $query = $object->readAllAP($allowedColumns);
    checkQuery($query, "Empty records. (readAllAP)");
    return $query;
}

// Read limit
function checkReadAPLimit($object, $allowedColumns = [])
{
    $query = $object->readAPLimit($allowedColumns);
    checkQuery($query, "Empty records. (read AP Limit)");
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
        "sales_order_payment_method",
        "sales_order_paid_per_product",
        "total_amount_per_product",
        "name",
        "id",
        "order_date",
        "is_active",
        "total_paid",
        "total_sub_amount",
        "total_amount",
        "is_status",
        "current_qty",
        "inventory_status",
        "order_qty",
        "products_aid",
        "products_low_stock_threshold",
        "products_name",
        "products_owner_name",
        "products_price",
        "products_sku",
        "products_status",
        "products_category",
        "products_unit",
        "stock_movement_date",
        "stock_movement_is_active",
        "stock_movement_location",
        "stock_movement_product_name",
        "stock_movement_product_owner_name",
        "stock_qty",
        "amount",
        "purchase_order_number",
        "purchase_order_supplier_name",
        "purchase_order_date",
        "purchase_order_expected_delivery",
        "purchase_order_total_amount",
        "purchase_order_is_active",
        "purchase_order_status",
        "purchase_order_payment_status",
        "purchase_order_note",
        "purchase_order_product_name",
        "purchase_order_product_owner_name",
        "purchase_order_qty",
        "purchase_order_payment",
        "total_amount",
        "installment_payment_customer_name",
        "return_product_status",
        "return_product_date",
        "return_product_customer_name",
        "return_product_product_name",
        "return_product_owner_name",
        "return_product_amount",
        "return_product_resolution_type",
        "return_product_is_restocked",
    ];
    return $query;
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

// Read WEEKLY
function checkReadExpensesPerWeek($object)
{
    $query = $object->readExpensesPerWeek();
    checkQuery($query, "Empty records. (read sales per week)");
    return $query;
}


// Read MONTHLY
function checkReadExpensesPerMonth($object)
{
    $query = $object->readExpensesPerMonth();
    checkQuery($query, "Empty records. (read sales per month)");
    return $query;
}

// Read YEARLY
function checkReadExpensesPerYear($object)
{
    $query = $object->readExpensesPerYear();
    checkQuery($query, "Empty records. (read sales per year)");
    return $query;
}

// Read report profit and loss
function checkReadPalIncome($object)
{
    $query = $object->readPalIncome();
    checkQuery($query, "Empty records. (read profit and loss Income)");
    return $query;
}

// Read report profit and loss
function checkReadPalSupplierExpenses($object)
{
    $query = $object->readPalSupplierExpenses();
    checkQuery($query, "Empty records. (read profit and loss Supplier Expenses)");
    return $query;
}

// Read report profit and loss
function checkReadPalOperatingExpenses($object)
{
    $query = $object->readPalOperatingExpenses();
    checkQuery($query, "Empty records. (read profit and loss Operating Expenses)");
    return $query;
}

function checkReadPalReturns($object)
{
    $query = $object->readPalReturns();
    checkQuery($query, "Empty records. (read profit and loss Returns)");
    return $query;
}

// Update 
function updateConnectedMenu($object)
{
    // 


}

// Read all
function checkReadReturn($object)
{
    $query = $object->readReturn();
    checkQuery($query, "Empty records. (Read Return)");
    return $query;
}

// Read all
function checkReadAllReturns($object, $allowedColumns = [])
{
    $query = $object->readAllReturns($allowedColumns);
    checkQuery($query, "Empty records. (checkReadAllReturns)");
    return $query;
}

// Read limit
function checkReadAllReturnsLimit($object, $allowedColumns = [])
{
    $query = $object->readAllReturnsLimit($allowedColumns);
    checkQuery($query, "Empty records. (checkReadAllReturnsLimit)");
    return $query;
}
