<?php
class Suppliers
{
    public $suppliers_aid;
    public $suppliers_is_active;
    public $suppliers_name;
    public $suppliers_email;
    public $suppliers_phone;
    public $suppliers_address;
    public $suppliers_messenger;
    public $suppliers_whatsapp;
    public $suppliers_other;
    public $suppliers_notes;
    public $suppliers_delivery;
    public $suppliers_contact_person;
    public $suppliers_created;
    public $suppliers_updated;

    public $suppliers_product_name;
    public $suppliers_product_price;
    public $suppliers_product_unit;
    public $suppliers_product_is_active;
    public $suppliers_product_supplier_id;
    public $suppliers_product_supplier_name;
    public $suppliers_product_created;
    public $suppliers_product_updated;

    public $connection;
    public $lastInsertedId;
    public $tblSuppliers;
    public $tblSuppliersProduct;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblSuppliers = "graces_suppliers";
        $this->tblSuppliersProduct = "graces_suppliers_product";
    }

    // create
    public function create()
    {
        try {
            $sql = "insert into {$this->tblSuppliers} ";
            $sql .= "( suppliers_is_active, ";
            $sql .= "suppliers_name, ";
            $sql .= "suppliers_email, ";
            $sql .= "suppliers_phone, ";
            $sql .= "suppliers_address, ";
            $sql .= "suppliers_messenger, ";
            $sql .= "suppliers_whatsapp, ";
            $sql .= "suppliers_other, ";
            $sql .= "suppliers_notes, ";
            $sql .= "suppliers_delivery, ";
            $sql .= "suppliers_contact_person, ";
            $sql .= "suppliers_created, ";
            $sql .= "suppliers_updated ) values ( ";
            $sql .= ":suppliers_is_active, ";
            $sql .= ":suppliers_name, ";
            $sql .= ":suppliers_email, ";
            $sql .= ":suppliers_phone, ";
            $sql .= ":suppliers_address, ";
            $sql .= ":suppliers_messenger, ";
            $sql .= ":suppliers_whatsapp, ";
            $sql .= ":suppliers_other, ";
            $sql .= ":suppliers_notes, ";
            $sql .= ":suppliers_delivery, ";
            $sql .= ":suppliers_contact_person, ";
            $sql .= ":suppliers_created, ";
            $sql .= ":suppliers_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_is_active" => $this->suppliers_is_active,
                "suppliers_name" => $this->suppliers_name,
                "suppliers_email" => $this->suppliers_email,
                "suppliers_phone" => $this->suppliers_phone,
                "suppliers_address" => $this->suppliers_address,
                "suppliers_messenger" => $this->suppliers_messenger,
                "suppliers_whatsapp" => $this->suppliers_whatsapp,
                "suppliers_other" => $this->suppliers_other,
                "suppliers_notes" => $this->suppliers_notes,
                "suppliers_delivery" => $this->suppliers_delivery,
                "suppliers_contact_person" => $this->suppliers_contact_person,
                "suppliers_created" => $this->suppliers_created,
                "suppliers_updated" => $this->suppliers_updated,
            ]);
            $this->lastInsertedId = $this->connection->lastInsertId();
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // create product
    public function createProduct()
    {
        try {
            $sql = "insert into {$this->tblSuppliersProduct} ";
            $sql .= "( suppliers_product_name, ";
            $sql .= "suppliers_product_price, ";
            $sql .= "suppliers_product_unit, ";
            $sql .= "suppliers_product_is_active, ";
            $sql .= "suppliers_product_supplier_id, ";
            $sql .= "suppliers_product_supplier_name, ";
            $sql .= "suppliers_product_created, ";
            $sql .= "suppliers_product_updated ) values ( ";
            $sql .= ":suppliers_product_name, ";
            $sql .= ":suppliers_product_price, ";
            $sql .= ":suppliers_product_unit, ";
            $sql .= ":suppliers_product_is_active, ";
            $sql .= ":suppliers_product_supplier_id, ";
            $sql .= ":suppliers_product_supplier_name, ";
            $sql .= ":suppliers_product_created, ";
            $sql .= ":suppliers_product_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_product_name" => $this->suppliers_product_name,
                "suppliers_product_price" => $this->suppliers_product_price,
                "suppliers_product_unit" => $this->suppliers_product_unit,
                "suppliers_product_is_active" => $this->suppliers_product_is_active,
                "suppliers_product_supplier_id" => $this->lastInsertedId,
                "suppliers_product_supplier_name" => $this->suppliers_product_supplier_name,
                "suppliers_product_created" => $this->suppliers_product_created,
                "suppliers_product_updated" => $this->suppliers_product_updated,
            ]);
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
            $sql .= "suppliers_aid as id, ";
            $sql .= "suppliers_is_active as is_active, ";
            $sql .= "suppliers_messenger as messenger, ";
            $sql .= "suppliers_whatsapp as whatsapp, ";
            $sql .= "suppliers_other as other, ";
            $sql .= "suppliers_name as name ";
            $sql .= "from {$this->tblSuppliers} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( suppliers_name like :suppliers_name 
            or suppliers_email like :suppliers_email ) " : " ");
            }
            $sql .= " order by suppliers_is_active desc, ";
            $sql .= "suppliers_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->column_search != "" ? [
                    "suppliers_name" => "%{$this->column_search}%",
                    "suppliers_email" => "%{$this->column_search}%",
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
            $sql .= "suppliers_aid as id, ";
            $sql .= "suppliers_is_active as is_active, ";
            $sql .= "suppliers_messenger as messenger, ";
            $sql .= "suppliers_whatsapp as whatsapp, ";
            $sql .= "suppliers_other as other, ";
            $sql .= "suppliers_name as name ";
            $sql .= "from {$this->tblSuppliers} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( suppliers_name like :suppliers_name 
            or suppliers_email like :suppliers_email ) " : " ");
            }
            $sql .= " order by suppliers_is_active desc, ";
            $sql .= "suppliers_name asc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "start" => $this->column_start - 1,
                "total" => $this->column_total,
                ...$this->column_search != "" ? [
                    "suppliers_name" => "%{$this->column_search}%",
                    "suppliers_email" => "%{$this->column_search}%",
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
            $sql .= "suppliers_aid as id, ";
            $sql .= "suppliers_is_active as is_active, ";
            $sql .= "suppliers_messenger as messenger, ";
            $sql .= "suppliers_whatsapp as whatsapp, ";
            $sql .= "suppliers_other as other, ";
            $sql .= "suppliers_name as name ";
            $sql .= "from ";
            $sql .= " {$this->tblSuppliers} ";
            $sql .= "where ( suppliers_name like :suppliers_name ";
            $sql .= "or suppliers_email like :suppliers_email ";
            $sql .= ") ";
            $sql .= "order by suppliers_is_active desc, ";
            $sql .= "suppliers_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_name" => "%{$this->column_search}%",
                "suppliers_email" => "%{$this->column_search}%",
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
            $sql .= "suppliers_aid as id, ";
            $sql .= "suppliers_is_active as is_active, ";
            $sql .= "suppliers_messenger as messenger, ";
            $sql .= "suppliers_whatsapp as whatsapp, ";
            $sql .= "suppliers_other as other, ";
            $sql .= "suppliers_name as name ";
            $sql .= "from {$this->tblSuppliers} ";
            $sql .= "where suppliers_aid = :suppliers_aid ";
            $sql .= "order by suppliers_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_aid" => $this->suppliers_aid,
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
            $sql = "update {$this->tblSuppliers} set ";
            $sql .= "suppliers_name = :suppliers_name, ";
            $sql .= "suppliers_email = :suppliers_email, ";
            $sql .= "suppliers_phone = :suppliers_phone, ";
            $sql .= "suppliers_address = :suppliers_address, ";
            $sql .= "suppliers_messenger = :suppliers_messenger, ";
            $sql .= "suppliers_whatsapp = :suppliers_whatsapp, ";
            $sql .= "suppliers_other = :suppliers_other, ";
            $sql .= "suppliers_notes = :suppliers_notes, ";
            $sql .= "suppliers_delivery = :suppliers_delivery, ";
            $sql .= "suppliers_contact_person = :suppliers_contact_person, ";
            $sql .= "suppliers_updated = :suppliers_updated ";
            $sql .= "where suppliers_aid  = :suppliers_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_name" => $this->suppliers_name,
                "suppliers_email" => $this->suppliers_email,
                "suppliers_phone" => $this->suppliers_phone,
                "suppliers_address" => $this->suppliers_address,
                "suppliers_messenger" => $this->suppliers_messenger,
                "suppliers_whatsapp" => $this->suppliers_whatsapp,
                "suppliers_other" => $this->suppliers_other,
                "suppliers_notes" => $this->suppliers_notes,
                "suppliers_delivery" => $this->suppliers_delivery,
                "suppliers_contact_person" => $this->suppliers_contact_person,
                "suppliers_updated" => $this->suppliers_updated,
                "suppliers_aid" => $this->suppliers_aid,
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
            $sql = "update {$this->tblSuppliers} set ";
            $sql .= "suppliers_is_active = :suppliers_is_active, ";
            $sql .= "suppliers_updated = :suppliers_updated ";
            $sql .= "where suppliers_aid = :suppliers_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_is_active" => $this->suppliers_is_active,
                "suppliers_updated" => $this->suppliers_updated,
                "suppliers_aid" => $this->suppliers_aid,
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
            $sql = "delete from {$this->tblSuppliers} ";
            $sql .= "where suppliers_aid = :suppliers_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_aid" => $this->suppliers_aid,
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
            $sql = "select suppliers_name from {$this->tblSuppliers} ";
            $sql .= "where suppliers_name = :suppliers_name ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_name" => "{$this->suppliers_name}",
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }

    // name
    public function associatedById()
    {
        try {
            $sql = "select suppliers_product_supplier_id from {$this->tblSuppliersProduct} ";
            $sql .= "where suppliers_product_supplier_id = :suppliers_product_supplier_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_product_supplier_id" => "{$this->suppliers_aid}",
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }
}
