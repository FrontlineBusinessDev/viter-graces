<?php
class Customer
{
    public $customer_aid;
    public $customer_is_active;
    public $customer_name;
    public $customer_email;
    public $customer_phone;
    public $customer_address;
    public $customer_messenger;
    public $customer_whatsapp;
    public $customer_other;
    public $customer_notes;
    public $customer_created;
    public $customer_updated;

    public $connection;
    public $lastInsertedId;
    public $tblCustomer;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblCustomer = "graces_customer";
    }

    // create
    public function create()
    {
        try {
            $sql = "insert into {$this->tblCustomer} ";
            $sql .= "( customer_is_active, ";
            $sql .= "customer_name, ";
            $sql .= "customer_email, ";
            $sql .= "customer_phone, ";
            $sql .= "customer_address, ";
            $sql .= "customer_messenger, ";
            $sql .= "customer_whatsapp, ";
            $sql .= "customer_other, ";
            $sql .= "customer_notes, ";
            $sql .= "customer_created, ";
            $sql .= "customer_updated ) values ( ";
            $sql .= ":customer_is_active, ";
            $sql .= ":customer_name, ";
            $sql .= ":customer_email, ";
            $sql .= ":customer_phone, ";
            $sql .= ":customer_address, ";
            $sql .= ":customer_messenger, ";
            $sql .= ":customer_whatsapp, ";
            $sql .= ":customer_other, ";
            $sql .= ":customer_notes, ";
            $sql .= ":customer_created, ";
            $sql .= ":customer_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_is_active" => $this->customer_is_active,
                "customer_name" => $this->customer_name,
                "customer_email" => $this->customer_email,
                "customer_phone" => $this->customer_phone,
                "customer_address" => $this->customer_address,
                "customer_messenger" => $this->customer_messenger,
                "customer_whatsapp" => $this->customer_whatsapp,
                "customer_other" => $this->customer_other,
                "customer_notes" => $this->customer_notes,
                "customer_created" => $this->customer_created,
                "customer_updated" => $this->customer_updated,
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
            $sql .= "customer_aid as id, ";
            $sql .= "customer_messenger as messenger, ";
            $sql .= "customer_whatsapp as whatsapp, ";
            $sql .= "customer_other as other, ";
            $sql .= "customer_is_active as is_active, ";
            $sql .= "customer_name as name ";
            $sql .= "from {$this->tblCustomer} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? " and ( customer_name like :customer_name 
            or customer_email like :customer_email ) " : " ");
            }
            $sql .= " order by customer_is_active desc, ";
            $sql .= " customer_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->column_search != "" ? [
                    "customer_name" => "%{$this->column_search}%",
                    "customer_email" => "%{$this->column_search}%",
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
            $sql .= "customer_aid as id, ";
            $sql .= "customer_messenger as messenger, ";
            $sql .= "customer_whatsapp as whatsapp, ";
            $sql .= "customer_other as other, ";
            $sql .= "customer_is_active as is_active, ";
            $sql .= "customer_name as name ";
            $sql .= "from {$this->tblCustomer} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? " and ( customer_name like :customer_name 
            or customer_email like :customer_email ) " : " ");
            }
            $sql .= " order by customer_is_active desc, ";
            $sql .= " customer_name asc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "start" => $this->column_start - 1,
                "total" => $this->column_total,
                ...$this->column_search != "" ? [
                    "customer_name" => "%{$this->column_search}%",
                    "customer_email" => "%{$this->column_search}%",
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
            $sql .= "customer_aid as id, ";
            $sql .= "customer_messenger as messenger, ";
            $sql .= "customer_whatsapp as whatsapp, ";
            $sql .= "customer_other as other, ";
            $sql .= "customer_is_active as is_active, ";
            $sql .= "customer_name as name ";
            $sql .= "from ";
            $sql .= " {$this->tblCustomer} ";
            $sql .= "where ( customer_name like :customer_name ";
            $sql .= "or customer_email like :customer_email ";
            $sql .= ") ";
            $sql .= "order by customer_is_active desc, ";
            $sql .= "customer_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_name" => "%{$this->column_search}%",
                "customer_email" => "%{$this->column_search}%",
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
            $sql .= "customer_aid as id, ";
            $sql .= "customer_messenger as messenger, ";
            $sql .= "customer_whatsapp as whatsapp, ";
            $sql .= "customer_other as other, ";
            $sql .= "customer_is_active as is_active, ";
            $sql .= "customer_name as name ";
            $sql .= "from {$this->tblCustomer} ";
            $sql .= "where customer_aid = :customer_aid ";
            $sql .= "order by customer_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_aid" => $this->customer_aid,
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
            $sql = "update {$this->tblCustomer} set ";
            $sql .= "customer_name = :customer_name, ";
            $sql .= "customer_email = :customer_email, ";
            $sql .= "customer_phone = :customer_phone, ";
            $sql .= "customer_address = :customer_address, ";
            $sql .= "customer_messenger = :customer_messenger, ";
            $sql .= "customer_whatsapp = :customer_whatsapp, ";
            $sql .= "customer_other = :customer_other, ";
            $sql .= "customer_notes = :customer_notes, ";
            $sql .= "customer_updated = :customer_updated ";
            $sql .= "where customer_aid  = :customer_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_name" => $this->customer_name,
                "customer_email" => $this->customer_email,
                "customer_phone" => $this->customer_phone,
                "customer_address" => $this->customer_address,
                "customer_messenger" => $this->customer_messenger,
                "customer_whatsapp" => $this->customer_whatsapp,
                "customer_other" => $this->customer_other,
                "customer_notes" => $this->customer_notes,
                "customer_updated" => $this->customer_updated,
                "customer_aid" => $this->customer_aid,
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
            $sql = "update {$this->tblCustomer} set ";
            $sql .= "customer_is_active = :customer_is_active, ";
            $sql .= "customer_updated = :customer_updated ";
            $sql .= "where customer_aid = :customer_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_is_active" => $this->customer_is_active,
                "customer_updated" => $this->customer_updated,
                "customer_aid" => $this->customer_aid,
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
            $sql = "delete from {$this->tblCustomer} ";
            $sql .= "where customer_aid = :customer_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_aid" => $this->customer_aid,
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
            $sql = "select customer_name from {$this->tblCustomer} ";
            $sql .= "where customer_name = :customer_name ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "customer_name" => "{$this->customer_name}",
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }
}
