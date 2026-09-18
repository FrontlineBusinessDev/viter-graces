-- Adds the "Payment Method" field surfaced next to Payment Status in the
-- Purchase Order modal. The model/controller code already reads and writes
-- purchase_order_payment_method; only the column was missing, causing
-- SQLSTATE[42S22]: Unknown column 'purchase_order_payment_method'.
-- Guarded with a schema check since MySQL/MariaDB has no
-- "ADD COLUMN IF NOT EXISTS" before MariaDB 10.5.

SET @column_exists = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'graces_suppliers_purchase_order'
      AND COLUMN_NAME = 'purchase_order_payment_method'
);

SET @ddl = IF(
    @column_exists = 0,
    'ALTER TABLE graces_suppliers_purchase_order ADD COLUMN purchase_order_payment_method VARCHAR(50) DEFAULT ''cash'' AFTER purchase_order_payment',
    'SELECT 1'
);

PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
