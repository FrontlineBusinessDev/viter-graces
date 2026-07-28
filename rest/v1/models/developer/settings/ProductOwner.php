<?php
class ProductOwner
{
    public $user_account_aid;
    public $user_account_is_active;
    public $user_account_first_name;
    public $user_account_last_name;
    public $user_account_email;
    public $user_account_role_id;
    public $user_account_role;
    public $user_account_key;
    public $user_account_password;
    public $user_account_created;
    public $user_account_updated;

    public $isDeveloper;

    public $connection;
    public $lastInsertedId;
    public $tblUserAccount;
    public $tblRole;
    public $tblActivityLog;
    public $tblProducts;
    public $tblSuppliersPurchaseOrder;
    public $tblSuppliersProduct;
    public $tblSalesOrder;
    public $tblMovementStock;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $column_fullname;
    public $max;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblUserAccount = "graces_user_account";
        $this->tblRole = "graces_roles";
        $this->tblActivityLog = "graces_activity_log";
        $this->tblProducts = "graces_products";
        $this->tblSuppliersPurchaseOrder = "graces_suppliers_purchase_order";
        $this->tblSuppliersProduct = "graces_suppliers_product";
        $this->tblSalesOrder = "graces_sales_order";
        $this->tblMovementStock = "graces_stock_movement";
    }

    // create
    public function create()
    {
        try {
            $sql = "insert into {$this->tblUserAccount} ";
            $sql .= "( user_account_first_name, ";
            $sql .= "user_account_last_name, ";
            $sql .= "user_account_email, ";
            $sql .= "user_account_role_id, ";
            $sql .= "user_account_role, ";
            $sql .= "user_account_is_active, ";
            $sql .= "user_account_key, ";
            $sql .= "user_account_created, ";
            $sql .= "user_account_updated ) values ( ";
            $sql .= ":user_account_first_name, ";
            $sql .= ":user_account_last_name, ";
            $sql .= ":user_account_email, ";
            $sql .= ":user_account_role_id, ";
            $sql .= ":user_account_role, ";
            $sql .= ":user_account_is_active, ";
            $sql .= ":user_account_key, ";
            $sql .= ":user_account_created, ";
            $sql .= ":user_account_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "user_account_first_name" => $this->user_account_first_name,
                "user_account_last_name" => $this->user_account_last_name,
                "user_account_email" => $this->user_account_email,
                "user_account_role_id" => $this->user_account_role_id,
                "user_account_role" => $this->user_account_role,
                "user_account_is_active" => $this->user_account_is_active,
                "user_account_key" => $this->user_account_key,
                "user_account_created" => $this->user_account_created,
                "user_account_updated" => $this->user_account_updated,
            ]);
            $this->lastInsertedId = $this->connection->lastInsertId();
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readByReceivedBy($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...$this->column_search != "" ? [
                "user_account_first_name" => "%{$this->column_search}%",
                "user_account_last_name" => "%{$this->column_search}%",
                "name" => "%{$this->column_search}%",
                "fullname" => "%{$this->column_search}%",
                "user_account_role" => "%{$this->column_search}%",
            ] : [],
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "user_account_aid as id, ";
            $sql .= "user_account_is_active as is_active, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) as name ";
            $sql .= "from {$this->tblUserAccount} ";
            $sql .= "where user_account_role != 'developer' ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (user_account_first_name like :user_account_first_name 
                or user_account_last_name like :user_account_last_name 
                or CONCAT(user_account_first_name, ' ', user_account_last_name) like :name 
                or CONCAT(user_account_last_name, ', ', user_account_first_name) like :fullname 
                or user_account_role like :user_account_role ) " : " ");
            }
            $sql .= " order by user_account_is_active desc, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readByProductOwner($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...$this->column_search != "" ? [
                "user_account_first_name" => "%{$this->column_search}%",
                "user_account_last_name" => "%{$this->column_search}%",
                "name" => "%{$this->column_search}%",
                "fullname" => "%{$this->column_search}%",
                "user_account_role" => "%{$this->column_search}%",
            ] : [],
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "user_account_aid as id, ";
            $sql .= "user_account_is_active as is_active, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) as name ";
            $sql .= "from {$this->tblUserAccount} ";
            $sql .= "where user_account_role = 'product owner' ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (user_account_first_name like :user_account_first_name 
                                                    or user_account_last_name like :user_account_last_name 
                                                    or CONCAT(user_account_first_name, ' ', user_account_last_name) like :name 
                                                    or CONCAT(user_account_last_name, ', ', user_account_first_name) like :fullname 
                                                    or user_account_role like :user_account_role ) " : " ");
            }
            $sql .= " order by user_account_is_active desc, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readByProductOwnerLimit($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...$this->column_search != "" ? [
                "user_account_first_name" => "%{$this->column_search}%",
                "user_account_last_name" => "%{$this->column_search}%",
                "name" => "%{$this->column_search}%",
                "fullname" => "%{$this->column_search}%",
                "user_account_role" => "%{$this->column_search}%",
            ] : [],
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "user_account_aid as id, ";
            $sql .= "user_account_is_active as is_active, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) as name ";
            $sql .= "from {$this->tblUserAccount} ";
            $sql .= "where user_account_role = 'product owner' ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and (user_account_first_name like :user_account_first_name 
                                                    or user_account_last_name like :user_account_last_name 
                                                    or CONCAT(user_account_first_name, ' ', user_account_last_name) like :name 
                                                    or CONCAT(user_account_last_name, ', ', user_account_first_name) like :fullname 
                                                    or user_account_role like :user_account_role ) " : " ");
            }
            $sql .= " order by user_account_is_active desc, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) asc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // update
    public function update()
    {
        try {
            $sql = "update {$this->tblUserAccount} set ";
            $sql .= "user_account_first_name = :user_account_first_name, ";
            $sql .= "user_account_last_name = :user_account_last_name, ";
            $sql .= "user_account_email = :user_account_email, ";
            $sql .= "user_account_updated = :user_account_updated ";
            $sql .= "where user_account_aid  = :user_account_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "user_account_first_name" => $this->user_account_first_name,
                "user_account_last_name" => $this->user_account_last_name,
                "user_account_email" => $this->user_account_email,
                "user_account_updated" => $this->user_account_updated,
                "user_account_aid" => $this->user_account_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readProductOwnerRole()
    {
        try {
            $sql = "select ";
            $sql .= "role_aid as id, ";
            $sql .= "role_name as name ";
            $sql .= "from {$this->tblRole} ";
            $sql .= "Where role_code = 'r_is_product_owner' ";
            $sql .= "order by role_name asc ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // set password
    public function resetPassword()
    {
        try {
            $sql = "update {$this->tblUserAccount} set ";
            $sql .= "user_account_key = :user_account_key, ";
            $sql .= "user_account_updated = :user_account_updated ";
            $sql .= "where user_account_aid = :user_account_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "user_account_updated" => $this->user_account_updated,
                "user_account_key" => $this->user_account_key,
                "user_account_aid" => $this->user_account_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read login
    public function readLogin()
    {
        try {
            $sql = "select * ";
            $sql .= "from {$this->tblUserAccount} ";
            $sql .= "where user_account_email = :user_account_email ";
            $sql .= "and user_account_is_active = 1 ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "user_account_email" => $this->user_account_email,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // active
    public function active()
    {
        try {
            $sql = "update {$this->tblUserAccount} set ";
            $sql .= "user_account_is_active = :user_account_is_active, ";
            $sql .= "user_account_updated = :user_account_updated ";
            $sql .= "where user_account_aid = :user_account_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "user_account_is_active" => $this->user_account_is_active,
                "user_account_updated" => $this->user_account_updated,
                "user_account_aid" => $this->user_account_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // name
    public function checkName()
    {
        try {
            $sql = "select CONCAT(user_account_first_name, ' ', user_account_last_name) as name ";
            $sql .= "from {$this->tblUserAccount} ";
            $sql .= "where CONCAT(user_account_first_name, ' ', user_account_last_name) = :name ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "name" => "{$this->column_fullname}",
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // update  
    public function updateActivityLog()
    {
        try {
            $sql = "update {$this->tblActivityLog} set ";
            $sql .= "activity_log_user_name = :activity_log_user_name, ";
            $sql .= "activity_log_created = :activity_log_created ";
            $sql .= "where activity_log_user_id = :activity_log_user_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "activity_log_user_name" => $this->column_fullname,
                "activity_log_created" => $this->user_account_updated,
                "activity_log_user_id" => $this->user_account_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
    public function updateProducts()
    {
        try {
            $sql = "update {$this->tblProducts} set ";
            $sql .= "products_owner_name = :products_owner_name, ";
            $sql .= "products_updated = :products_updated ";
            $sql .= "where products_owner_id = :products_owner_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "products_owner_name" => $this->column_fullname,
                "products_updated" => $this->user_account_updated,
                "products_owner_id" => $this->user_account_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
    public function updatePurchaseOrder()
    {
        try {
            $sql = "update {$this->tblSuppliersPurchaseOrder} set ";
            $sql .= "purchase_order_product_owner_name = :purchase_order_product_owner_name, ";
            $sql .= "purchase_order_updated = :purchase_order_updated ";
            $sql .= "where purchase_order_product_owner_id = :purchase_order_product_owner_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "purchase_order_product_owner_name" => $this->column_fullname,
                "purchase_order_updated" => $this->user_account_updated,
                "purchase_order_product_owner_id" => $this->user_account_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
    public function updateSuppliersProduct()
    {
        try {
            $sql = "update {$this->tblSuppliersProduct} set ";
            $sql .= "suppliers_product_supplier_name = :suppliers_product_supplier_name, ";
            $sql .= "suppliers_product_updated = :suppliers_product_updated ";
            $sql .= "where suppliers_product_supplier_id = :suppliers_product_supplier_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_product_supplier_name" => $this->column_fullname,
                "suppliers_product_updated" => $this->user_account_updated,
                "suppliers_product_supplier_id" => $this->user_account_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
    public function updateSalesOrder()
    {
        try {
            $sql = "update {$this->tblSalesOrder} set ";
            $sql .= "sales_order_product_owner_name = :sales_order_product_owner_name, ";
            $sql .= "sales_order_updated = :sales_order_updated ";
            $sql .= "where sales_order_product_owner_id = :sales_order_product_owner_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "sales_order_product_owner_name" => $this->column_fullname,
                "sales_order_updated" => $this->user_account_updated,
                "sales_order_product_owner_id" => $this->user_account_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // delete
    public function delete()
    {
        try {
            $sql = "delete from {$this->tblUserAccount} ";
            $sql .= "where user_account_aid = :user_account_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "user_account_aid" => $this->user_account_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    public function readByProductId($allowedColumns)
    {
        $filterColumn = [];
        $inventoryStatusFilter = "";

        $params = [
            "user_account_aid" => $this->user_account_aid,
            ...(
                $this->column_search != ""
                ? [
                    "stock_movement_product_name" => "%{$this->column_search}%",
                    "stock_movement_product_owner_name" => "%{$this->column_search}%",
                ]
                : []
            ),
        ];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            // Special handling for inventory_status
            if ($item['id'] === 'inventory_status') {
                $inventoryStatusFilter = strtolower(trim($item['value']));
                continue;
            }


            $col = $item['id'];
            if (is_array($item['value'])) {
                $params["min$i"] = (float) $item['value']['min'];

                $params["max$i"] = $item['value']['max'] === ""
                    ? (float) $this->max
                    : (float) $item['value']['max'];

                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($item['value']) . "%";
            }
        }
        try {
            $sql = " select inventory_data.*, ";
            $sql .= "CASE WHEN inventory_data.current_qty <= 0 THEN 'out of stock' ";
            $sql .= "WHEN inventory_data.current_qty <= inventory_data.products_low_stock_threshold THEN 'low stock' ";
            $sql .= "ELSE 'in stock' ";
            $sql .= "END as inventory_status ";
            $sql .= "from ( select MAX(p.products_low_stock_threshold) as products_low_stock_threshold, ";
            $sql .= "MAX(p.products_sku) as products_sku, ";
            $sql .= "MAX(p.products_unit) as products_unit, ";
            $sql .= "MAX(p.products_status) as products_status, ";
            $sql .= "MAX(p.products_price) as products_price, ";
            $sql .= "MAX(p.products_name) as products_name, ";
            $sql .= "MAX(p.products_owner_id) as products_owner_id, ";
            $sql .= "MAX(p.products_owner_name) as products_owner_name, ";
            $sql .= "MAX(p.products_aid) as products_aid, ";
            $sql .= "MAX(ms.stock_movement_location) as stock_movement_location, ";
            $sql .= "MAX(ms.stock_movement_product_name) as name, ";
            $sql .= "MAX(ms.stock_movement_is_active) as is_active, ";
            $sql .= "MAX(ms.stock_movement_is_active) as stock_movement_is_active, ";
            $sql .= "MAX(ms.stock_movement_product_name) as stock_movement_product_name, ";
            $sql .= "MAX(ms.stock_movement_product_owner_name) as stock_movement_product_owner_name, ";
            $sql .= "DATE_FORMAT(MAX(ms.stock_movement_date), '%b %d, %Y') AS stock_movement_date, ";
            $sql .= "SUM( CASE WHEN ms.stock_movement_type IN ( 'in stock', 'stock in - return', 'purchases', 'stock in adjustments' ) ";
            $sql .= "THEN ms.stock_movement_qty WHEN ms.stock_movement_type IN ( 'stock out - reject/defective items', 'stock out - return item' ) ";
            $sql .= "THEN -ms.stock_movement_qty ELSE 0 END ) as stock_qty, ";
            $sql .= "MAX(IFNULL(so.order_qty, 0)) as order_qty, ";
            $sql .= "( SUM( CASE WHEN ms.stock_movement_type IN ( 'in stock', 'stock in - return', 'purchases', 'stock in adjustments' ) ";
            $sql .= "THEN ms.stock_movement_qty WHEN ms.stock_movement_type IN ( 'stock out - reject/defective items', ";
            $sql .= "'stock out - return item' ) THEN -ms.stock_movement_qty ELSE 0 END ) - MAX(IFNULL(so.order_qty, 0))) as current_qty ";
            $sql .= "from {$this->tblMovementStock} AS ms INNER JOIN {$this->tblProducts} as p ";
            $sql .= "ON ms.stock_movement_product_id = p.products_aid LEFT JOIN ( ";
            $sql .= "select sales_order_product_id, SUM(sales_order_qty) AS order_qty ";
            $sql .= "from {$this->tblSalesOrder} group by sales_order_product_id ) as so ";
            $sql .= "ON so.sales_order_product_id = p.products_aid ";
            $sql .= "group by p.products_aid ) AS inventory_data ";
            $sql .= " where inventory_data.products_owner_id = :user_account_aid ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } elseif ($this->column_search !== "") {
                $sql .= " and ( inventory_data.products_name LIKE :stock_movement_product_name
                OR inventory_data.products_owner_name LIKE :stock_movement_product_owner_name ) ";
            }
            if ($inventoryStatusFilter === 'out of stock') {
                $sql .= " and inventory_data.current_qty <= 0 ";
            } elseif ($inventoryStatusFilter === 'low stock') {
                $sql .= " and inventory_data.current_qty > 0 ";
                $sql .= " and inventory_data.current_qty <= inventory_data.products_low_stock_threshold ";
            } elseif ($inventoryStatusFilter === 'in stock') {
                $sql .= " and inventory_data.current_qty > inventory_data.products_low_stock_threshold ";
            }
            $sql .= " order by inventory_data.current_qty asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError(
                $ex->getMessage(),
                $ex->getFile(),
                [
                    'line' => $ex->getLine(),
                    'code' => $ex->getCode()
                ]
            );

            $query = false;
        }
        return $query;
    }
}
