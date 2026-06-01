<?php
class User
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
    public function readAll($allowedColumns)
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
            $sql .= "where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->isDeveloper != "1" ? "and user_account_role != 'Developer'  " : " ");
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


            $query = false;
        }
        return $query;
    }

    // read all
    public function readLimit($allowedColumns)
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
            $sql .= "where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->isDeveloper != "1" ? "and user_account_role != 'Developer'  " : " ");
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
            $query->execute($params);
        } catch (PDOException $ex) {


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
            $query->execute($params);
        } catch (PDOException $ex) {


            $query = false;
        }
        return $query;
    }

    public function search()
    {
        try {
            $sql = "select *, ";
            $sql .= "user_account_aid as id, ";
            $sql .= "user_account_is_active as is_active, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) as name ";
            $sql .= "from ";
            $sql .= " {$this->tblUserAccount} ";
            $sql .= "where ( user_account_first_name like :user_account_first_name ";
            $sql .= "or user_account_last_name like :user_account_last_name ";
            $sql .= "or CONCAT(user_account_first_name, ' ', user_account_last_name) like :name ";
            $sql .= "or CONCAT(user_account_last_name, ', ', user_account_first_name) like :fullname ";
            $sql .= "or user_account_role like :user_account_role ";
            $sql .= ") ";
            $sql .= " order by user_account_is_active desc, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "user_account_first_name" => "%{$this->column_search}%",
                "user_account_last_name" => "%{$this->column_search}%",
                "name" => "%{$this->column_search}%",
                "fullname" => "%{$this->column_search}%",
                "user_account_role" => "%{$this->column_search}%",
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // read by id
    public function readById()
    {
        try {
            $sql = "select *, ";
            $sql .= "user_account_aid as id, ";
            $sql .= "user_account_is_active as is_active, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) as name ";
            $sql .= "from {$this->tblUserAccount} ";
            $sql .= "where user_account_aid = :user_account_aid ";
            $sql .= "order by user_account_first_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "user_account_aid" => $this->user_account_aid,
            ]);
        } catch (PDOException $ex) {
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
            $sql .= "user_account_role_id = :user_account_role_id, ";
            $sql .= "user_account_role = :user_account_role, ";
            $sql .= "user_account_updated = :user_account_updated ";
            $sql .= "where user_account_aid  = :user_account_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "user_account_first_name" => $this->user_account_first_name,
                "user_account_last_name" => $this->user_account_last_name,
                "user_account_email" => $this->user_account_email,
                "user_account_role_id" => $this->user_account_role_id,
                "user_account_role" => $this->user_account_role,
                "user_account_updated" => $this->user_account_updated,
                "user_account_aid" => $this->user_account_aid,
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

    // name
    public function checkEmail()
    {
        try {
            $sql = "select user_account_email ";
            $sql .= "from {$this->tblUserAccount} ";
            $sql .= "where user_account_email = :user_account_email ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "user_account_email" => "{$this->user_account_email}",
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // read key
    public function readKey()
    {
        try {
            $sql = "select user_account_key, ";
            $sql .= "user_account_aid as id, ";
            $sql .= "user_account_role as role, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) as name ";
            $sql .= "from {$this->tblUserAccount} ";
            $sql .= "where user_account_key = :user_account_key ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "user_account_key" => $this->user_account_key,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // set password
    public function setPassword()
    {
        try {
            $sql = "update {$this->tblUserAccount} set ";
            $sql .= "user_account_password = :user_account_password, ";
            $sql .= "user_account_key = '', ";
            $sql .= "user_account_updated = :user_account_updated ";
            $sql .= "where user_account_key  = :user_account_key ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "user_account_password" => $this->user_account_password,
                "user_account_updated" => $this->user_account_updated,
                "user_account_key" => $this->user_account_key,
            ]);
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
    // set password
    public function resetPasswordByEmail()
    {
        try {
            $sql = "update {$this->tblUserAccount} set ";
            $sql .= "user_account_key = :user_account_key, ";
            $sql .= "user_account_updated = :user_account_updated ";
            $sql .= "where user_account_email = :user_account_email ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "user_account_updated" => $this->user_account_updated,
                "user_account_key" => $this->user_account_key,
                "user_account_email" => $this->user_account_email,
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
            $sql = "select *, ";
            $sql .= "user_account_is_active as is_active, ";
            $sql .= "user_account_aid as activity_log_user_id, ";
            $sql .= "user_account_role as activity_log_user_role, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) as activity_log_user_name, ";
            $sql .= "user_account_aid as id, ";
            $sql .= "user_account_role as role, ";
            $sql .= "CONCAT(user_account_first_name, ' ', user_account_last_name) as name ";
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

    // name
    public function associatedByActivityLog()
    {
        try {
            $sql = "select activity_log_user_name ";
            $sql .= "from {$this->tblActivityLog} ";
            $sql .= "where activity_log_user_id = :activity_log_user_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "activity_log_user_id" => $this->user_account_aid,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // name
    public function associatedByProducts()
    {
        try {
            $sql = "select products_owner_name ";
            $sql .= "from {$this->tblActivityLog} ";
            $sql .= "where products_owner_id = :products_owner_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "products_owner_id" => $this->user_account_aid,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }
}
