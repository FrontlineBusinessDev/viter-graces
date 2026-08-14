<?php
class Overview
{
    public $sales_order_aid;

    public $date_today;
    public $date_yesterday;

    public $connection;
    public $lastInsertedId;
    public $tblSalesOrder;
    public $tblSuppliersPurchaseOrder;

    public $userId;
    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;



    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblSalesOrder = "graces_sales_order";
        $this->tblSuppliersPurchaseOrder = "graces_suppliers_purchase_order";
    }

    // read all
    public function readSalesPerWeek()
    {

        try {
            $sql = "select ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'monday' ";
            $sql .= "THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS monday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'tuesday' ";
            $sql .= "THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS tuesday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'wednesday' ";
            $sql .= "THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS wednesday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'thursday' ";
            $sql .= "THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS thursday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'friday' ";
            $sql .= "THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS friday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'saturday' ";
            $sql .= "THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS saturday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'sunday' ";
            $sql .= "THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS sunday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'monday' ";
            $sql .= "THEN sales_order_balance_per_product ELSE 0 END) AS balance_monday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'tuesday' ";
            $sql .= "THEN sales_order_balance_per_product ELSE 0 END) AS balance_tuesday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'wednesday' ";
            $sql .= "THEN sales_order_balance_per_product ELSE 0 END) AS balance_wednesday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'thursday' ";
            $sql .= "THEN sales_order_balance_per_product ELSE 0 END) AS balance_thursday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'friday' ";
            $sql .= "THEN sales_order_balance_per_product ELSE 0 END) AS balance_friday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'saturday' ";
            $sql .= "THEN sales_order_balance_per_product ELSE 0 END) AS balance_saturday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(sales_order_date)) = 'sunday' ";
            $sql .= "THEN sales_order_balance_per_product ELSE 0 END) AS balance_sunday ";
            $sql .= "from {$this->tblSalesOrder} ";
            $sql .= "WHERE sales_order_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) ";
            $sql .= ($this->userId != 0 ? "and sales_order_product_owner_id = :sales_order_product_owner_id " : " ");
            $sql .= " group by MONTH(sales_order_date) ";
            $sql .= " order by MONTH(sales_order_date) desc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->userId != 0 ? ["sales_order_product_owner_id" => $this->userId] : [],
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readSalesPerMonth()
    {
        try {
            $sql = "select  ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 1 THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS january, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 2 THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS february, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 3 THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS march, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 4 THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS april, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 5 THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS may, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 6 THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS june, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 7 THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS july, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 8 THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS august, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 9 THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS september, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 10 THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS october, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 11 THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS november, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 12 THEN sales_order_discounted_with_vat_amount ELSE 0 END) AS december, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 1 THEN sales_order_balance_per_product ELSE 0 END) AS balance_january, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 2 THEN sales_order_balance_per_product ELSE 0 END) AS balance_february, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 3 THEN sales_order_balance_per_product ELSE 0 END) AS balance_march, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 4 THEN sales_order_balance_per_product ELSE 0 END) AS balance_april, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 5 THEN sales_order_balance_per_product ELSE 0 END) AS balance_may, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 6 THEN sales_order_balance_per_product ELSE 0 END) AS balance_june, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 7 THEN sales_order_balance_per_product ELSE 0 END) AS balance_july, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 8 THEN sales_order_balance_per_product ELSE 0 END) AS balance_august, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 9 THEN sales_order_balance_per_product ELSE 0 END) AS balance_september, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 10 THEN sales_order_balance_per_product ELSE 0 END) AS balance_october, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 11 THEN sales_order_balance_per_product ELSE 0 END) AS balance_november, ";
            $sql .= "SUM(CASE WHEN MONTH(sales_order_date) = 12 THEN sales_order_balance_per_product ELSE 0 END) AS balance_december ";
            $sql .= "FROM {$this->tblSalesOrder} ";
            $sql .= "WHERE YEAR(sales_order_date) = YEAR(CURDATE()) ";
            $sql .= ($this->userId != 0 ? "and sales_order_product_owner_id = :sales_order_product_owner_id " : " ");
            $sql .= "GROUP BY YEAR(sales_order_date) ";
            $sql .= "ORDER BY YEAR(sales_order_date) DESC ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->userId != 0 ? ["sales_order_product_owner_id" => $this->userId] : [],
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readSalesPerYear()
    {

        try {
            $sql  = "select ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) THEN sales_order_paid_per_product ELSE 0 END) AS year_0, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 1 THEN sales_order_paid_per_product ELSE 0 END) AS year_1, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 2 THEN sales_order_paid_per_product ELSE 0 END) AS year_2, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 3 THEN sales_order_paid_per_product ELSE 0 END) AS year_3, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 4 THEN sales_order_paid_per_product ELSE 0 END) AS year_4, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 5 THEN sales_order_paid_per_product ELSE 0 END) AS year_5, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) THEN sales_order_balance_per_product ELSE 0 END) AS balance_year_0, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 1 THEN sales_order_balance_per_product ELSE 0 END) AS balance_year_1, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 2 THEN sales_order_balance_per_product ELSE 0 END) AS balance_year_2, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 3 THEN sales_order_balance_per_product ELSE 0 END) AS balance_year_3, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 4 THEN sales_order_balance_per_product ELSE 0 END) AS balance_year_4, ";
            $sql .= "SUM(CASE WHEN YEAR(sales_order_date) = YEAR(CURDATE()) - 5 THEN sales_order_balance_per_product ELSE 0 END) AS balance_year_5 ";
            $sql .= "FROM {$this->tblSalesOrder} ";
            $sql .= "WHERE sales_order_date >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR) ";
            $sql .= ($this->userId != 0 ? "and sales_order_product_owner_id = :sales_order_product_owner_id " : " ");
            $sql .= "and CAST(sales_order_paid_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= "GROUP BY DATE_SUB(CURDATE(), INTERVAL 5 YEAR) ";
            $sql .= "ORDER BY DATE_SUB(CURDATE(), INTERVAL 5 YEAR) DESC ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->userId != 0 ? ["sales_order_product_owner_id" => $this->userId] : [],
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    public function readAllExpensesPaidAmount()
    {
        try {
            $sql = "select *, ";
            $sql .= "SUM(purchase_order_total_paid_per_product) as total_paid ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= " where true ";
            // $sql .= " where CAST(purchase_order_total_paid_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= ($this->userId != 0 ? "and purchase_order_product_owner_id = :purchase_order_product_owner_id " : " ");
            $sql .= " group by purchase_order_number ";
            $sql .= " order by purchase_order_number ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->userId != 0 ? ["purchase_order_product_owner_id" => $this->userId] : [],
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
    // read all
    public function readExpensesPerWeek()
    {

        try {
            $sql = "select ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'monday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS monday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'tuesday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS tuesday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'wednesday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS wednesday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'thursday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS thursday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'friday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS friday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'saturday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS saturday, ";
            $sql .= "SUM(CASE WHEN LOWER(DAYNAME(purchase_order_date)) = 'sunday' ";
            $sql .= "THEN purchase_order_total_paid_per_product ELSE 0 END) AS sunday ";
            $sql .= "from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "WHERE purchase_order_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) ";
            $sql .= ($this->userId != 0 ? "and purchase_order_product_owner_id = :purchase_order_product_owner_id " : " ");
            // $sql .= "and CAST(purchase_order_total_paid_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= " group by MONTH(purchase_order_date) ";
            $sql .= " order by MONTH(purchase_order_date) desc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->userId != 0 ? ["purchase_order_product_owner_id" => $this->userId] : [],
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readExpensesPerMonth()
    {
        try {
            $sql = "select  ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 1 THEN purchase_order_total_paid_per_product ELSE 0 END) AS january, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 2 THEN purchase_order_total_paid_per_product ELSE 0 END) AS february, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 3 THEN purchase_order_total_paid_per_product ELSE 0 END) AS march, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 4 THEN purchase_order_total_paid_per_product ELSE 0 END) AS april, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 5 THEN purchase_order_total_paid_per_product ELSE 0 END) AS may, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 6 THEN purchase_order_total_paid_per_product ELSE 0 END) AS june, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 7 THEN purchase_order_total_paid_per_product ELSE 0 END) AS july, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 8 THEN purchase_order_total_paid_per_product ELSE 0 END) AS august, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 9 THEN purchase_order_total_paid_per_product ELSE 0 END) AS september, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 10 THEN purchase_order_total_paid_per_product ELSE 0 END) AS october, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 11 THEN purchase_order_total_paid_per_product ELSE 0 END) AS november, ";
            $sql .= "SUM(CASE WHEN MONTH(purchase_order_date) = 12 THEN purchase_order_total_paid_per_product ELSE 0 END) AS december ";
            $sql .= "FROM {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "WHERE YEAR(purchase_order_date) = YEAR(CURDATE()) ";
            $sql .= ($this->userId != 0 ? "and purchase_order_product_owner_id = :purchase_order_product_owner_id " : " ");
            // $sql .= "and CAST(purchase_order_total_paid_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= "GROUP BY YEAR(purchase_order_date) ";
            $sql .= "ORDER BY YEAR(purchase_order_date) DESC ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->userId != 0 ? ["purchase_order_product_owner_id" => $this->userId] : [],
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readExpensesPerYear()
    {

        try {
            $sql  = "select ";
            $sql .= "SUM(CASE WHEN YEAR(purchase_order_date) = YEAR(CURDATE()) THEN purchase_order_total_paid_per_product ELSE 0 END) AS year_0, ";
            $sql .= "SUM(CASE WHEN YEAR(purchase_order_date) = YEAR(CURDATE()) - 1 THEN purchase_order_total_paid_per_product ELSE 0 END) AS year_1, ";
            $sql .= "SUM(CASE WHEN YEAR(purchase_order_date) = YEAR(CURDATE()) - 2 THEN purchase_order_total_paid_per_product ELSE 0 END) AS year_2, ";
            $sql .= "SUM(CASE WHEN YEAR(purchase_order_date) = YEAR(CURDATE()) - 3 THEN purchase_order_total_paid_per_product ELSE 0 END) AS year_3, ";
            $sql .= "SUM(CASE WHEN YEAR(purchase_order_date) = YEAR(CURDATE()) - 4 THEN purchase_order_total_paid_per_product ELSE 0 END) AS year_4, ";
            $sql .= "SUM(CASE WHEN YEAR(purchase_order_date) = YEAR(CURDATE()) - 5 THEN purchase_order_total_paid_per_product ELSE 0 END) AS year_5 ";
            $sql .= "FROM {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "WHERE purchase_order_date >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR) ";
            $sql .= ($this->userId != 0 ? "and purchase_order_product_owner_id = :purchase_order_product_owner_id " : " ");
            // $sql .= "and CAST(purchase_order_total_paid_per_product AS DECIMAL(10, 2)) != 0 ";
            $sql .= "GROUP BY DATE_SUB(CURDATE(), INTERVAL 5 YEAR) ";
            $sql .= "ORDER BY DATE_SUB(CURDATE(), INTERVAL 5 YEAR) DESC ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->userId != 0 ? ["purchase_order_product_owner_id" => $this->userId] : [],
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
}
