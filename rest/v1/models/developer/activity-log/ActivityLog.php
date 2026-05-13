<?php
class ActivityLog
{
    public $activity_log_aid;
    public $activity_log_menu;
    public $activity_log_action;
    public $activity_log_user_id;
    public $activity_log_user_name;
    public $activity_log_user_role;
    public $activity_log_description;
    public $activity_log_created;

    public $connection;
    public $lastInsertedId;
    public $tblActivityLog;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblActivityLog = "graces_activity_log";
    }

    // create
    public function create()
    {
        try {
            $sql = "insert into {$this->tblActivityLog} ";
            $sql .= "( activity_log_menu, ";
            $sql .= "activity_log_action, ";
            $sql .= "activity_log_user_id, ";
            $sql .= "activity_log_user_name, ";
            $sql .= "activity_log_user_role, ";
            $sql .= "activity_log_description, ";
            $sql .= "activity_log_created ) values ( ";
            $sql .= ":activity_log_menu, ";
            $sql .= ":activity_log_action, ";
            $sql .= ":activity_log_user_id, ";
            $sql .= ":activity_log_user_name, ";
            $sql .= ":activity_log_user_role, ";
            $sql .= ":activity_log_description, ";
            $sql .= ":activity_log_created ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "activity_log_menu" => $this->activity_log_menu,
                "activity_log_action" => $this->activity_log_action,
                "activity_log_user_id" => $this->activity_log_user_id,
                "activity_log_user_name" => $this->activity_log_user_name,
                "activity_log_user_role" => $this->activity_log_user_role,
                "activity_log_description" => $this->activity_log_description,
                "activity_log_created" => $this->activity_log_created,
            ]);
            $this->lastInsertedId = $this->connection->lastInsertId();
        } catch (PDOException $ex) {
            returnError($ex);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readAll()
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
            $sql .= "activity_log_aid as id, ";
            $sql .= "activity_log_description as name ";
            $sql .= "from {$this->tblActivityLog} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( activity_log_user_name like :activity_log_user_name 
            or activity_log_menu like :activity_log_menu 
            or activity_log_action like :activity_log_action ) " : " ");
            }
            $sql .= " order by activity_log_aid desc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->column_search != "" ? [
                    "activity_log_menu" => "%{$this->column_search}%",
                    "activity_log_action" => "%{$this->column_search}%",
                    "activity_log_user_name" => "%{$this->column_search}%",
                ] : [],
            ]);
        } catch (PDOException $ex) {


            $query = false;
        }
        return $query;
    }

    // read all
    public function readLimit()
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
            $sql .= "activity_log_aid as id, ";
            $sql .= "activity_log_description as name ";
            $sql .= "from {$this->tblActivityLog} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( activity_log_user_name like :activity_log_user_name 
            or activity_log_menu like :activity_log_menu 
            or activity_log_action like :activity_log_action ) " : " ");
            }
            $sql .= " order by activity_log_aid desc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->column_search != "" ? [
                    "activity_log_menu" => "%{$this->column_search}%",
                    "activity_log_action" => "%{$this->column_search}%",
                    "activity_log_user_name" => "%{$this->column_search}%",
                ] : [],
            ]);
        } catch (PDOException $ex) {


            $query = false;
        }
        return $query;
    }

    public function search()
    {
        try {
            $sql = "select *, ";
            $sql .= "activity_log_aid as id, ";
            $sql .= "activity_log_description as name ";
            $sql .= "from ";
            $sql .= " {$this->tblActivityLog} ";
            $sql .= "where ( activity_log_menu like :activity_log_menu, ";
            $sql .= "or activity_log_action like :activity_log_action, ";
            $sql .= "or activity_log_user_name like :activity_log_user_name ) ";
            $sql .= " order by activity_log_aid desc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "activity_log_menu" => "%{$this->column_search}%",
                "activity_log_action" => "%{$this->column_search}%",
                "activity_log_user_name" => "%{$this->column_search}%",
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
            $sql .= "activity_log_aid as id, ";
            $sql .= "activity_log_description as name ";
            $sql .= "from {$this->tblActivityLog} ";
            $sql .= "where activity_log_aid = :activity_log_aid ";
            $sql .= "order by activity_log_menu asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "activity_log_aid" => $this->activity_log_aid,
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
            $sql = "delete from {$this->tblActivityLog} ";
            $sql .= "where activity_log_aid = :activity_log_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "activity_log_aid" => $this->activity_log_aid,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }
}
