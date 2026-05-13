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
            $query = false;
        }
        return $query;
    }

    // read all
    public function readByProductOwner()
    {
        $filterColumn = [];

        foreach ($this->filters as $item) {
            if (is_array($item['value'])) {
                if (is_array($item['value']) && $item["value"]["max"] === "") {
                    $filterColumn[] = $item['id'] . " BETWEEN " . $item["value"]["min"] . " AND " . $this->max . " ";
                } else {
                    $filterColumn[] = $item['id'] . " BETWEEN " . $item["value"]["min"] . " AND " . $item["value"]["max"] . " ";
                }
            } else {
                $filterColumn[] = $item['id'] . " LIKE '%" . $item['value'] . "%' ";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "user_account_aid as id, ";
            $sql .= "user_account_is_active as is_active, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) as name ";
            $sql .= "from {$this->tblUserAccount} ";
            $sql .= "where user_account_role = 'Product Owner' ";
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
            $query->execute([
                ...$this->column_search != "" ? [
                    "user_account_first_name" => "%{$this->column_search}%",
                    "user_account_last_name" => "%{$this->column_search}%",
                    "name" => "%{$this->column_search}%",
                    "fullname" => "%{$this->column_search}%",
                    "user_account_role" => "%{$this->column_search}%",
                ] : [],
            ]);
        } catch (PDOException $ex) {

            returnError($ex);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readByProductOwnerLimit()
    {
        $filterColumn = [];

        foreach ($this->filters as $item) {
            if (is_array($item['value'])) {
                if (is_array($item['value']) && $item["value"]["max"] === "") {
                    $filterColumn[] = $item['id'] . " BETWEEN " . $item["value"]["min"] . " AND " . $this->max . " ";
                } else {
                    $filterColumn[] = $item['id'] . " BETWEEN " . $item["value"]["min"] . " AND " . $item["value"]["max"] . " ";
                }
            } else {
                $filterColumn[] = $item['id'] . " LIKE '%" . $item['value'] . "%' ";
            }
        }
        try {
            $sql = "select *, ";
            $sql .= "user_account_aid as id, ";
            $sql .= "user_account_is_active as is_active, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) as name ";
            $sql .= "from {$this->tblUserAccount} ";
            $sql .= "where user_account_role = 'Product Owner' ";
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
            $query->execute([
                ...$this->column_search != "" ? [
                    "user_account_first_name" => "%{$this->column_search}%",
                    "user_account_last_name" => "%{$this->column_search}%",
                    "name" => "%{$this->column_search}%",
                    "fullname" => "%{$this->column_search}%",
                    "user_account_role" => "%{$this->column_search}%",
                ] : [],
                "start" => $this->column_start - 1,
                "total" => $this->column_total,
            ]);
        } catch (PDOException $ex) {

            returnError($ex);
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
            $query = false;
        }
        return $query;
    }
}
