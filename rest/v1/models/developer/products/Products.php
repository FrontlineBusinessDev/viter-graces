<?php
class Products
{
    public $products_aid;
    public $products_status;
    public $products_is_active;
    public $products_image;
    public $products_name;
    public $products_sku;
    public $products_category;
    public $products_price;
    public $products_cost;
    public $products_stocks;
    public $products_owner_id;
    public $products_owner_name;
    public $products_suppliers_id;
    public $products_suppliers_name;
    public $products_sales;
    public $products_unit;
    public $products_barcode;
    public $products_low_stock_threshold;
    public $products_description;
    public $products_created;
    public $products_updated;

    public $stock_movement_type;
    public $stock_movement_before_qty;
    public $stock_movement_after_qty;
    public $stock_movement_qty;

    public $connection;
    public $lastInsertedId;
    public $tblProducts;
    public $tblStockMovements;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblProducts = "graces_products";
        $this->tblStockMovements = "graces_stock_movement";
    }

    // create
    public function create()
    {
        try {
            $sql = "insert into {$this->tblProducts} ";
            $sql .= "( products_status, ";
            $sql .= "products_is_active, ";
            $sql .= "products_name, ";
            $sql .= "products_image, ";
            $sql .= "products_sku, ";
            $sql .= "products_category, ";
            $sql .= "products_price, ";
            $sql .= "products_cost, ";
            $sql .= "products_stocks, ";
            $sql .= "products_owner_id, ";
            $sql .= "products_owner_name, ";
            $sql .= "products_suppliers_id, ";
            $sql .= "products_suppliers_name, ";
            $sql .= "products_sales, ";
            $sql .= "products_unit, ";
            $sql .= "products_barcode, ";
            $sql .= "products_low_stock_threshold, ";
            $sql .= "products_description, ";
            $sql .= "products_created, ";
            $sql .= "products_updated ) values ( ";
            $sql .= ":products_status, ";
            $sql .= ":products_is_active, ";
            $sql .= ":products_name, ";
            $sql .= ":products_image, ";
            $sql .= ":products_sku, ";
            $sql .= ":products_category, ";
            $sql .= ":products_price, ";
            $sql .= ":products_cost, ";
            $sql .= ":products_stocks, ";
            $sql .= ":products_owner_id, ";
            $sql .= ":products_owner_name, ";
            $sql .= ":products_suppliers_id, ";
            $sql .= ":products_suppliers_name, ";
            $sql .= ":products_sales, ";
            $sql .= ":products_unit, ";
            $sql .= ":products_barcode, ";
            $sql .= ":products_low_stock_threshold, ";
            $sql .= ":products_description, ";
            $sql .= ":products_created, ";
            $sql .= ":products_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "products_status" => $this->products_status,
                "products_is_active" => $this->products_is_active,
                "products_name" => $this->products_name,
                "products_image" => $this->products_image,
                "products_sku" => $this->products_sku,
                "products_category" => $this->products_category,
                "products_price" => $this->products_price,
                "products_cost" => $this->products_cost,
                "products_stocks" => $this->products_stocks,
                "products_owner_id" => $this->products_owner_id,
                "products_owner_name" => $this->products_owner_name,
                "products_suppliers_id" => $this->products_suppliers_id,
                "products_suppliers_name" => $this->products_suppliers_name,
                "products_sales" => $this->products_sales,
                "products_unit" => $this->products_unit,
                "products_barcode" => $this->products_barcode,
                "products_low_stock_threshold" => $this->products_low_stock_threshold,
                "products_description" => $this->products_description,
                "products_created" => $this->products_created,
                "products_updated" => $this->products_updated,
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
            $sql .= "products_aid as id, ";
            $sql .= "products_is_active as is_active, ";
            $sql .= "products_name as name ";
            $sql .= "from {$this->tblProducts} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( products_name like :products_name 
            or products_owner_name like :products_owner_name 
            or products_sku like :products_sku ) " : " ");
            }
            $sql .= " order by products_status desc, ";
            $sql .= "products_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->column_search != "" ? [
                    "products_name" => "%{$this->column_search}%",
                    "products_sku" => "%{$this->column_search}%",
                    "products_owner_name" => "%{$this->column_search}%",
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
            $sql .= "products_aid as id, ";
            $sql .= "products_is_active as is_active, ";
            $sql .= "products_name as name ";
            $sql .= "from {$this->tblProducts} ";
            $sql .= " where true ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( products_name like :products_name 
            or products_owner_name like :products_owner_name 
            or products_sku like :products_sku ) " : " ");
            }
            $sql .= " order by products_status desc, ";
            $sql .= "products_name asc ";
            $sql .= "limit :start, ";
            $sql .= ":total ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "start" => $this->column_start - 1,
                "total" => $this->column_total,
                ...$this->column_search != "" ? [
                    "products_name" => "%{$this->column_search}%",
                    "products_sku" => "%{$this->column_search}%",
                    "products_owner_name" => "%{$this->column_search}%",
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
            $sql .= "products_aid as id, ";
            $sql .= "products_is_active as is_active, ";
            $sql .= "products_name as name ";
            $sql .= "from ";
            $sql .= " {$this->tblProducts} ";
            $sql .= "where ( products_name like :products_name, ";
            $sql .= "or products_owner_name like :products_owner_name, ";
            $sql .= "or products_sku like :products_sku ) ";
            $sql .= "order by products_status desc, ";
            $sql .= "products_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "products_name" => "%{$this->column_search}%",
                "products_sku" => "%{$this->column_search}%",
                "products_owner_name" => "%{$this->column_search}%",
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
            $sql .= "products_aid as id, ";
            $sql .= "products_is_active as is_active, ";
            $sql .= "products_name as name ";
            $sql .= "from {$this->tblProducts} ";
            $sql .= "where products_aid = :products_aid ";
            $sql .= "order by products_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "products_aid" => $this->products_aid,
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
            $sql = "update {$this->tblProducts} set ";
            $sql .= "products_name = :products_name, ";
            $sql .= "products_image = :products_image, ";
            $sql .= "products_sku = :products_sku, ";
            $sql .= "products_category = :products_category, ";
            $sql .= "products_price = :products_price, ";
            $sql .= "products_cost = :products_cost, ";
            $sql .= "products_stocks = :products_stocks, ";
            $sql .= "products_owner_id = :products_owner_id, ";
            $sql .= "products_owner_name = :products_owner_name, ";
            $sql .= "products_suppliers_id = :products_suppliers_id, ";
            $sql .= "products_suppliers_name = :products_suppliers_name, ";
            $sql .= "products_sales = :products_sales, ";
            $sql .= "products_unit = :products_unit, ";
            $sql .= "products_barcode = :products_barcode, ";
            $sql .= "products_low_stock_threshold = :products_low_stock_threshold, ";
            $sql .= "products_description = :products_description, ";
            $sql .= "products_updated = :products_updated ";
            $sql .= "where products_aid  = :products_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "products_name" => $this->products_name,
                "products_image" => $this->products_image,
                "products_sku" => $this->products_sku,
                "products_category" => $this->products_category,
                "products_price" => $this->products_price,
                "products_cost" => $this->products_cost,
                "products_stocks" => $this->products_stocks,
                "products_owner_id" => $this->products_owner_id,
                "products_owner_name" => $this->products_owner_name,
                "products_suppliers_id" => $this->products_suppliers_id,
                "products_suppliers_name" => $this->products_suppliers_name,
                "products_sales" => $this->products_sales,
                "products_unit" => $this->products_unit,
                "products_barcode" => $this->products_barcode,
                "products_low_stock_threshold" => $this->products_low_stock_threshold,
                "products_description" => $this->products_description,
                "products_updated" => $this->products_updated,
                "products_aid" => $this->products_aid,
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
            $sql = "update {$this->tblProducts} set ";
            $sql .= "products_status = :products_status, ";
            $sql .= "products_is_active = :products_is_active, ";
            $sql .= "products_updated = :products_updated ";
            $sql .= "where products_aid = :products_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "products_status" => $this->products_status,
                "products_is_active" => $this->products_is_active,
                "products_updated" => $this->products_updated,
                "products_aid" => $this->products_aid,
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
            $sql = "delete from {$this->tblProducts} ";
            $sql .= "where products_aid = :products_aid ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "products_aid" => $this->products_aid,
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
            $sql = "select products_name from {$this->tblProducts} ";
            $sql .= "where products_name = :products_name ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "products_name" => "{$this->products_name}",
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }


    // Create Movement Stock
    public function createMovementStock()
    {
        try {
            $sql = "insert into {$this->tblStockMovements} ";
            $sql .= "( stock_movement_product_id, ";
            $sql .= "stock_movement_product_name, ";
            $sql .= "stock_movement_type, ";
            $sql .= "stock_movement_is_active, ";
            $sql .= "stock_movement_before_qty, ";
            $sql .= "stock_movement_after_qty, ";
            $sql .= "stock_movement_qty, ";
            $sql .= "stock_movement_product_owner_id, ";
            $sql .= "stock_movement_product_owner_name, ";
            $sql .= "stock_movement_created, ";
            $sql .= "stock_movement_updated ) values ( ";
            $sql .= ":stock_movement_product_id, ";
            $sql .= ":stock_movement_product_name, ";
            $sql .= ":stock_movement_type, ";
            $sql .= ":stock_movement_is_active, ";
            $sql .= ":stock_movement_before_qty, ";
            $sql .= ":stock_movement_after_qty, ";
            $sql .= ":stock_movement_qty, ";
            $sql .= ":stock_movement_product_owner_id, ";
            $sql .= ":stock_movement_product_owner_name, ";
            $sql .= ":stock_movement_created, ";
            $sql .= ":stock_movement_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "stock_movement_product_id" => $this->lastInsertedId,
                "stock_movement_product_name" => $this->products_name,
                "stock_movement_type" => $this->stock_movement_type,
                "stock_movement_is_active" => $this->products_is_active,
                "stock_movement_before_qty" => $this->stock_movement_before_qty,
                "stock_movement_after_qty" => $this->stock_movement_after_qty,
                "stock_movement_qty" => $this->stock_movement_qty,
                "stock_movement_product_owner_id" => $this->products_owner_id,
                "stock_movement_product_owner_name" => $this->products_owner_name,
                "stock_movement_created" => $this->products_created,
                "stock_movement_updated" => $this->products_updated,
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }


    // read all
    public function readAllActiveByName()
    {
        try {
            $sql = "select *, ";
            $sql .= "products_aid as id, ";
            $sql .= "products_is_active as is_active, ";
            $sql .= "products_name as name ";
            $sql .= "from {$this->tblProducts} ";
            $sql .= " where products_is_active='1' ";
            $sql .= ($this->column_search != "" ? "and ( products_name like :products_name 
            or products_owner_name like :products_owner_name 
            or products_sku like :products_sku ) " : " ");
            $sql .= " order by products_status desc, ";
            $sql .= "products_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                ...$this->column_search != "" ? [
                    "products_name" => "%{$this->column_search}%",
                    "products_sku" => "%{$this->column_search}%",
                    "products_owner_name" => "%{$this->column_search}%",
                ] : [],
            ]);
        } catch (PDOException $ex) {
            $query = false;
        }
        return $query;
    }
}
