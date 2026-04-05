<?php
class Role
{
    public $role_aid;
    public $role_is_active;
    public $role_name;
    public $role_code;
    public $role_description;
    public $role_created;
    public $role_updated;

    public $connection;
    public $lastInsertedId;
    public $tblRole;
    public $tblUserSystem;
    public $tblUserOther;

    public $column_start;
    public $column_total;
    public $column_search;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblRole = "graces_roles";
        $this->tblUserSystem = "wfsv1_user_system";
        $this->tblUserOther = "wfsv1_user_other";
    }

    // create
    public function create()
    {
        try {
            $sql = "insert into {$this->tblRole} ";
            $sql .= "( role_name, ";
            $sql .= "role_code, ";
            $sql .= "role_description, ";
            $sql .= "role_is_active, ";
            $sql .= "role_created, ";
            $sql .= "role_updated ) values ( ";
            $sql .= ":role_name, ";
            $sql .= ":role_code, ";
            $sql .= ":role_description, ";
            $sql .= ":role_is_active, ";
            $sql .= ":role_created, ";
            $sql .= ":role_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "role_name" => $this->role_name,
                "role_code" => $this->role_code,
                "role_description" => $this->role_description,
                "role_is_active" => $this->role_is_active,
                "role_created" => $this->role_created,
                "role_updated" => $this->role_updated,
            ]);
            $this->lastInsertedId = $this->connection->lastInsertId();
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAll()
    {
        try {
            $sql = "select *, ";
            $sql .= "role_aid as id, ";
            $sql .= "role_is_active as is_active, ";
            $sql .= "role_name as name ";
            $sql .= "from {$this->tblRole} ";
            $sql .= "order by role_is_active desc, ";
            $sql .= "role_name asc ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // read all
    public function readLimit()
    {
        try {
            $sql = "select *, ";
            $sql .= "role_aid as id, ";
            $sql .= "role_is_active as is_active, ";
            $sql .= "role_name as name ";
            $sql .= "from {$this->tblRole} ";
            $sql .= "order by role_is_active desc, ";
            $sql .= "role_name asc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "start" => $this->column_start - 1,
                "total" => $this->column_total,
            ]);
        } catch (PDOException $ex) {

            returnError($ex);
            $query = false;
        }
        return $query;
    }

    public function search()
    {
        try {
            $sql = "select *, ";
            $sql .= "role_aid as id, ";
            $sql .= "role_is_active as is_active, ";
            $sql .= "role_name as name ";
            $sql .= "from ";
            $sql .= " {$this->tblRole} ";
            $sql .= "where ( role_name like :role_name ";
            $sql .= "or role_description like :role_description ";
            $sql .= ") ";
            $sql .= "order by role_is_active desc, ";
            $sql .= "role_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "role_name" => "%{$this->column_search}%",
                "role_description" => "%{$this->column_search}%",
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
            $sql .= "role_aid as id, ";
            $sql .= "role_is_active as is_active, ";
            $sql .= "role_name as name ";
            $sql .= "from {$this->tblRole} ";
            $sql .= "where role_aid = :role_aid ";
            $sql .= "order by role_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "role_aid" => $this->role_aid,
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
            $sql = "update {$this->tblRole} set ";
            $sql .= "role_name = :role_name, ";
            $sql .= "role_code = :role_code, ";
            $sql .= "role_description = :role_description, ";
            $sql .= "role_updated = :role_updated ";
            $sql .= "where role_aid  = :role_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "role_name" => $this->role_name,
                "role_code" => $this->role_code,
                "role_description" => $this->role_description,
                "role_updated" => $this->role_updated,
                "role_aid" => $this->role_aid,
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
            $sql = "update {$this->tblRole} set ";
            $sql .= "role_is_active = :role_is_active, ";
            $sql .= "role_updated = :role_updated ";
            $sql .= "where role_aid = :role_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "role_is_active" => $this->role_is_active,
                "role_updated" => $this->role_updated,
                "role_aid" => $this->role_aid,
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
            $sql = "delete from {$this->tblRole} ";
            $sql .= "where role_aid = :role_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "role_aid" => $this->role_aid,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // add column to database table
    public function addColumn($column_name)
    {
        try {
            $sql = "alter table {$this->tblRole} ";
            $sql .= "add column role_is_{$column_name} boolean ";
            $sql .= "NOT NULL ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            $query = false;
        }

        return $query;
    }

    // update
    public function updateColumnValue($column_name)
    {
        try {
            $sql = "update {$this->tblRole} set ";
            $sql .= "role_is_{$column_name} = :role_column_name, ";
            $sql .= "role_updated = :role_updated ";
            $sql .= "where role_name = :role_name ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "role_column_name" => $this->role_is_active,
                "role_updated" => $this->role_updated,
                "role_name" => $this->role_name,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // update column name to database table
    public function updateColumnName($column_name, $column_name_old)
    {
        try {
            $sql = "alter table {$this->tblRole} change ";
            $sql .= "role_is_{$column_name_old} ";
            $sql .= "role_is_{$column_name} boolean ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // drop column name to database table
    public function dropColumnName($column_name)
    {
        try {
            $sql = "alter table {$this->tblRole} ";
            $sql .= "drop role_is_{$column_name} ";

            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // validator

    // name
    public function checkName()
    {
        try {
            $sql = "select role_name from {$this->tblRole} ";
            $sql .= "where role_name = :role_name ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "role_name" => "{$this->role_name}",
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // association
    public function checkUserSystemAssociation()
    {
        try {
            $sql = "select user_system_role_id from {$this->tblUserSystem} ";
            $sql .= "where user_system_role_id = :role_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "role_aid" => "{$this->role_aid}",
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    public function checkUserOtherAssociation()
    {
        try {
            $sql = "select user_other_role_id from {$this->tblUserOther} ";
            $sql .= "where user_other_role_id = :role_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "role_aid" => "{$this->role_aid}",
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }
}
