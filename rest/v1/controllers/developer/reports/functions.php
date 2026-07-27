<?php

// Read all
function checkReadAllSalesOrderAmount($object, $allowedColumns = [])
{
    $query = $object->readAllSalesOrderAmount($allowedColumns);
    checkQuery($query, "Empty records. (readAllSalesOrderAmount)");
    return $query;
}

// Read all
function checkReadAllExpensesAmount($object, $allowedColumns = [])
{
    $query = $object->readAllExpensesAmount($allowedColumns);
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
        "current_qty",
        "inventory_status",
        "is_active",
        "name",
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
        "amount"
    ];
    return $query;
}

// Update 
function updateConnectedMenu($object)
{
    // 


}
