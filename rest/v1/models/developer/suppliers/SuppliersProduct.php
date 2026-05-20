<?php
class SuppliersProduct
{
    public $suppliers_product_aid;
    public $suppliers_product_name;
    public $suppliers_product_price;
    public $suppliers_product_unit;
    public $suppliers_product_supplier_id;
    public $suppliers_product_supplier_name;
    public $suppliers_product_is_active;
    public $suppliers_product_created;
    public $suppliers_product_updated;

    public $connection;
    public $lastInsertedId;
    public $tblSuppliersProduct;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblSuppliersProduct = "graces_suppliers_product";
    }

    // create
    public function create()
    {
        try {
            $sql = "insert into {$this->tblSuppliersProduct} ";
            $sql .= "( suppliers_product_name, ";
            $sql .= "suppliers_product_price, ";
            $sql .= "suppliers_product_unit, ";
            $sql .= "suppliers_product_supplier_id, ";
            $sql .= "suppliers_product_supplier_name, ";
            $sql .= "suppliers_product_is_active, ";
            $sql .= "suppliers_product_created, ";
            $sql .= "suppliers_product_updated ) values ( ";
            $sql .= ":suppliers_product_name, ";
            $sql .= ":suppliers_product_price, ";
            $sql .= ":suppliers_product_unit, ";
            $sql .= ":suppliers_product_supplier_id, ";
            $sql .= ":suppliers_product_supplier_name, ";
            $sql .= ":suppliers_product_is_active, ";
            $sql .= ":suppliers_product_created, ";
            $sql .= ":suppliers_product_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_product_name" => $this->suppliers_product_name,
                "suppliers_product_price" => $this->suppliers_product_price,
                "suppliers_product_unit" => $this->suppliers_product_unit,
                "suppliers_product_supplier_id" => $this->suppliers_product_supplier_id,
                "suppliers_product_supplier_name" => $this->suppliers_product_supplier_name,
                "suppliers_product_is_active" => $this->suppliers_product_is_active,
                "suppliers_product_created" => $this->suppliers_product_created,
                "suppliers_product_updated" => $this->suppliers_product_updated,
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
            "suppliers_product_supplier_id" => $this->suppliers_product_supplier_id,
            ...$this->column_search != "" ? [
                "suppliers_product_name" => "%{$this->column_search}%",
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
            $sql .= "suppliers_product_aid as id, ";
            $sql .= "suppliers_product_is_active as is_active, ";
            $sql .= "suppliers_product_name as name ";
            $sql .= "from {$this->tblSuppliersProduct} ";
            $sql .= " where suppliers_product_supplier_id = :suppliers_product_supplier_id ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and suppliers_product_name like :suppliers_product_name " : " ");
            }
            $sql .= " order by suppliers_product_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {

            $query = false;
        }
        return $query;
    }

    // read all

    // read all
    public function readLimit($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "suppliers_product_supplier_id" => $this->suppliers_product_supplier_id,
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->column_search != "" ? [
                "suppliers_product_name" => "%{$this->column_search}%",
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
            $sql .= "suppliers_product_aid as id, ";
            $sql .= "suppliers_product_is_active as is_active, ";
            $sql .= "suppliers_product_name as name ";
            $sql .= "from {$this->tblSuppliersProduct} ";
            $sql .= " where suppliers_product_supplier_id = :suppliers_product_supplier_id ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and suppliers_product_name like :suppliers_product_name " : " ");
            }
            $sql .= " order by suppliers_product_name asc ";
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
            $sql .= "suppliers_product_aid as id, ";
            $sql .= "suppliers_product_is_active as is_active, ";
            $sql .= "suppliers_product_name as name ";
            $sql .= "from ";
            $sql .= " {$this->tblSuppliersProduct} ";
            $sql .= "where suppliers_product_name like :suppliers_product_name ";
            $sql .= "order by suppliers_product_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_product_name" => "%{$this->column_search}%",
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
            $sql .= "suppliers_product_aid as id, ";
            $sql .= "suppliers_product_is_active as is_active, ";
            $sql .= "suppliers_product_name as name ";
            $sql .= "from {$this->tblSuppliersProduct} ";
            $sql .= "where suppliers_product_aid = :suppliers_product_aid ";
            $sql .= "order by suppliers_product_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_product_aid" => $this->suppliers_product_aid,
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
            $sql = "update {$this->tblSuppliersProduct} set ";
            $sql .= "suppliers_product_name = :suppliers_product_name, ";
            $sql .= "suppliers_product_price = :suppliers_product_price, ";
            $sql .= "suppliers_product_unit = :suppliers_product_unit, ";
            $sql .= "suppliers_product_updated = :suppliers_product_updated ";
            $sql .= "where suppliers_product_aid = :suppliers_product_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_product_name" => $this->suppliers_product_name,
                "suppliers_product_price" => $this->suppliers_product_price,
                "suppliers_product_unit" => $this->suppliers_product_unit,
                "suppliers_product_updated" => $this->suppliers_product_updated,
                "suppliers_product_aid" => $this->suppliers_product_aid,
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
            $sql = "delete from {$this->tblSuppliersProduct} ";
            $sql .= "where suppliers_product_aid = :suppliers_product_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_product_aid" => $this->suppliers_product_aid,
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
            $sql = "update {$this->tblSuppliersProduct} set ";
            $sql .= "suppliers_product_is_active = :suppliers_product_is_active, ";
            $sql .= "suppliers_product_updated = :suppliers_product_updated ";
            $sql .= "where suppliers_product_aid = :suppliers_product_aid  ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_product_is_active" => $this->suppliers_product_is_active,
                "suppliers_product_updated" => $this->suppliers_product_updated,
                "suppliers_product_aid" => $this->suppliers_product_aid,
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
            $sql = "select suppliers_product_name from {$this->tblSuppliersProduct} ";
            $sql .= "where suppliers_product_name = :suppliers_product_name ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_product_name" => "{$this->suppliers_product_name}",
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }
}
