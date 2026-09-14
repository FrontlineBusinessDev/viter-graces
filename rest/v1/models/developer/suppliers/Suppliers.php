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
    public $suppliers_is_default;
    public $suppliers_description_id;
    public $suppliers_description_value;
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

    public $suppliers_description_value_other;
    public $lastInsertedSupplierDescriptionId;

    public $connection;
    public $lastInsertedId;
    public $tblSuppliers;
    public $tblSuppliersProduct;
    public $tblSuppliersPurchaseOrder;
    public $tblProducts;
    public $tblSuppliersDiscription;

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
        $this->tblSuppliersPurchaseOrder = "graces_suppliers_purchase_order";
        $this->tblProducts = "graces_products";
        $this->tblSuppliersDiscription = "graces_supplier_description";
    }

    private function buildFilterColumns($allowedColumns, &$params)
    {
        $filterColumn = [];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            $value = $item['value'];

            if (is_array($value) && array_key_exists('min', $value)) {
                $params["min$i"] = (float) $value['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $value['max'] === ""
                    ? (float) $this->max
                    : (float) $value['max'];
            } elseif (is_array($value) && isset($value[0]) && is_array($value[0])) {
                $rangeClauses = [];

                foreach ($value as $j => $range) {
                    $hasMin = isset($range['min']) && $range['min'] !== '';
                    $hasMax = isset($range['max']) && $range['max'] !== '';

                    if (!$hasMin && !$hasMax) {
                        continue;
                    }

                    $minKey = "range{$i}_{$j}_min";
                    $maxKey = "range{$i}_{$j}_max";
                    $params[$minKey] = $hasMin ? (float) $range['min'] : 0.0;
                    $params[$maxKey] = $hasMax ? (float) $range['max'] : (float) $this->max;
                    $rangeClauses[] = "$col BETWEEN :$minKey AND :$maxKey";
                }

                if (empty($rangeClauses)) {
                    continue;
                }

                $filterColumn[] = "(" . implode(" OR ", $rangeClauses) . ")";
            } elseif (is_array($value)) {
                $selectedValues = array_values(array_filter(
                    $value,
                    fn($v) => trim((string) $v) !== ""
                ));

                if (empty($selectedValues)) {
                    continue;
                }

                $placeholders = [];
                foreach ($selectedValues as $j => $selectedValue) {
                    $paramKey = "filter{$i}_{$j}";
                    $placeholders[] = ":$paramKey";
                    $params[$paramKey] = trim($selectedValue);
                }

                $filterColumn[] = "$col IN (" . implode(", ", $placeholders) . ")";
            } else {
                $filterColumn[] = "$col LIKE :search$i";
                $params["search$i"] = "%" . trim($value) . "%";
            }
        }

        return $filterColumn;
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
            $sql .= "suppliers_is_default, ";
            $sql .= "suppliers_description_id, ";
            $sql .= "suppliers_description_value, ";
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
            $sql .= ":suppliers_is_default, ";
            $sql .= ":suppliers_description_id, ";
            $sql .= ":suppliers_description_value, ";
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
                "suppliers_is_default" => $this->suppliers_is_default,
                "suppliers_description_id" => $this->suppliers_description_id,
                "suppliers_description_value" => $this->suppliers_description_value,
                "suppliers_created" => $this->suppliers_created,
                "suppliers_updated" => $this->suppliers_updated,
            ]);
            $this->lastInsertedId = $this->connection->lastInsertId();
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }


    // create
    public function createOtherSupplier()
    {
        try {
            $sql = "insert into {$this->tblSuppliers} ";
            $sql .= "( suppliers_is_active, ";
            $sql .= "suppliers_name, ";
            $sql .= "suppliers_is_default, ";
            $sql .= "suppliers_created, ";
            $sql .= "suppliers_updated ) values ( ";
            $sql .= ":suppliers_is_active, ";
            $sql .= ":suppliers_name, ";
            $sql .= ":suppliers_is_default, ";
            $sql .= ":suppliers_created, ";
            $sql .= ":suppliers_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_is_active" => $this->suppliers_is_active,
                "suppliers_name" => $this->suppliers_name,
                "suppliers_is_default" => $this->suppliers_is_default,
                "suppliers_created" => $this->suppliers_created,
                "suppliers_updated" => $this->suppliers_updated,
            ]);
            $this->lastInsertedId = $this->connection->lastInsertId();
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
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
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
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
                "suppliers_name" => "%{$this->column_search}%",
                "suppliers_email" => "%{$this->column_search}%",
                "suppliers_address" => "%{$this->column_search}%",
                "suppliers_contact_person" => "%{$this->column_search}%",
            ] : [],
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "suppliers_aid as id, ";
            $sql .= "suppliers_notes as notes, ";
            $sql .= "suppliers_is_active as is_active, ";
            $sql .= "suppliers_messenger as messenger, ";
            $sql .= "suppliers_whatsapp as whatsapp, ";
            $sql .= "suppliers_other as other, ";
            $sql .= "suppliers_name as name ";
            $sql .= "from {$this->tblSuppliers} ";
            $sql .= " where suppliers_is_default != 1 ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( suppliers_name like :suppliers_name
            or suppliers_address like :suppliers_address
            or suppliers_contact_person like :suppliers_contact_person
            or suppliers_email like :suppliers_email ) " : " ");
            }
            $sql .= " order by suppliers_is_active desc, ";
            $sql .= "suppliers_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }


    // read all
    public function readLimit($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->column_search != "" ? [
                "suppliers_name" => "%{$this->column_search}%",
                "suppliers_email" => "%{$this->column_search}%",
                "suppliers_address" => "%{$this->column_search}%",
                "suppliers_contact_person" => "%{$this->column_search}%",
            ] : [],
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "suppliers_aid as id, ";
            $sql .= "suppliers_notes as notes, ";
            $sql .= "suppliers_is_active as is_active, ";
            $sql .= "suppliers_messenger as messenger, ";
            $sql .= "suppliers_whatsapp as whatsapp, ";
            $sql .= "suppliers_other as other, ";
            $sql .= "suppliers_name as name ";
            $sql .= "from {$this->tblSuppliers} ";
            $sql .= " where suppliers_is_default != 1 ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( suppliers_name like :suppliers_name 
            or suppliers_address like :suppliers_address
            or suppliers_contact_person like :suppliers_contact_person
            or suppliers_email like :suppliers_email ) " : " ");
            }
            $sql .= " order by suppliers_is_active desc, ";
            $sql .= "suppliers_name asc ";
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

    public function search()
    {
        try {
            $sql = "select *, ";
            $sql .= "suppliers_aid as id, ";
            $sql .= "suppliers_notes as notes, ";
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
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
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
            $sql .= "suppliers_notes as notes, ";
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
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
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
            $sql .= "suppliers_description_id = :suppliers_description_id, ";
            $sql .= "suppliers_description_value = :suppliers_description_value, ";
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
                "suppliers_description_id" => $this->suppliers_description_id,
                "suppliers_description_value" => $this->suppliers_description_value,
                "suppliers_updated" => $this->suppliers_updated,
                "suppliers_aid" => $this->suppliers_aid,
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
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
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
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // delete
    public function deleteSupplierProduct()
    {
        try {
            $sql = "delete from {$this->tblSuppliersProduct} ";
            $sql .= "where suppliers_product_supplier_id = :suppliers_product_supplier_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_product_supplier_id" => $this->suppliers_aid,
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
            $sql = "select suppliers_name from {$this->tblSuppliers} ";
            $sql .= "where suppliers_name = :suppliers_name ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_name" => "{$this->suppliers_name}",
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
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
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // name
    public function associatedInPurchaseOrderById()
    {
        try {
            $sql = "select purchase_order_supplier_id from {$this->tblSuppliersPurchaseOrder} ";
            $sql .= "where purchase_order_supplier_id = :purchase_order_supplier_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "purchase_order_supplier_id" => "{$this->suppliers_aid}",
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // name
    public function readOtherSupplier()
    {
        try {
            $sql = "select * from {$this->tblSuppliers} ";
            $sql .= "where suppliers_is_default = 1 ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // update
    public function updateProductSupplier()
    {
        try {
            $sql = "update {$this->tblProducts} set ";
            $sql .= "products_suppliers_name = :products_suppliers_name, ";
            $sql .= "products_updated = :products_updated ";
            $sql .= "where products_suppliers_id  = :products_suppliers_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "products_suppliers_name" => $this->suppliers_name,
                "products_updated" => $this->suppliers_updated,
                "products_suppliers_id" => $this->suppliers_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
    // update
    public function updateSupplierProduct()
    {
        try {
            $sql = "update {$this->tblSuppliersProduct} set ";
            $sql .= "suppliers_product_supplier_name = :suppliers_product_supplier_name, ";
            $sql .= "suppliers_product_updated = :suppliers_product_updated ";
            $sql .= "where suppliers_product_supplier_id = :suppliers_product_supplier_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "suppliers_product_supplier_name" => $this->suppliers_name,
                "suppliers_product_updated" => $this->suppliers_updated,
                "suppliers_product_supplier_id" => $this->suppliers_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
    // update
    public function updatePurchaseSupplier()
    {
        try {
            $sql = "update {$this->tblSuppliersPurchaseOrder} set ";
            $sql .= "purchase_order_supplier_name = :purchase_order_supplier_name, ";
            $sql .= "purchase_order_updated = :purchase_order_updated ";
            $sql .= "where purchase_order_supplier_id = :purchase_order_supplier_id ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "purchase_order_supplier_name" => $this->suppliers_name,
                "purchase_order_updated" => $this->suppliers_updated,
                "purchase_order_supplier_id" => $this->suppliers_aid,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }


    // read all
    public function readSupplierInModal($allowedColumns)
    {
        $filterColumn = [];
        $params = [
            ...$this->column_search != "" ? [
                "suppliers_name" => "%{$this->column_search}%",
                "suppliers_email" => "%{$this->column_search}%",
            ] : [],
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
        try {
            $sql = "select *, ";
            $sql .= "suppliers_aid as id, ";
            $sql .= "suppliers_notes as notes, ";
            $sql .= "suppliers_is_active as is_active, ";
            $sql .= "suppliers_messenger as messenger, ";
            $sql .= "suppliers_whatsapp as whatsapp, ";
            $sql .= "suppliers_other as other, ";
            $sql .= "suppliers_name as name ";
            $sql .= "from {$this->tblSuppliers} ";
            $sql .= " where suppliers_is_default = 0 ";
            if (!empty($filterColumn)) {
                $sql .= " and " . implode(" and ", $filterColumn);
            } else {
                $sql .= ($this->column_search != "" ? "and ( suppliers_name like :suppliers_name 
            or suppliers_email like :suppliers_email ) " : " ");
            }
            $sql .= " order by suppliers_is_active desc, ";
            $sql .= "suppliers_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute($params);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // name
    public function readBySupplierDescriptionName()
    {
        try {
            $sql = "select *, ";
            $sql .= "supplier_description_aid as id, ";
            $sql .= "supplier_description_name as name ";
            $sql .= "from {$this->tblSuppliersDiscription} ";
            $sql .= "order by CASE WHEN LOWER(supplier_description_name) = 'other' THEN 1 ELSE 0 END asc, ";
            $sql .= "supplier_description_name asc ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // name
    public function readSupplierDescriptionExist()
    {
        try {
            $sql = "select *, ";
            $sql .= "supplier_description_aid as id, ";
            $sql .= "supplier_description_name as name ";
            $sql .= "from {$this->tblSuppliersDiscription} ";
            $sql .= "where supplier_description_name = :supplier_description_name ";
            $sql .= "order by supplier_description_name asc ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "supplier_description_name" => $this->suppliers_description_value_other,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // name
    public function readGoupBySupplierDescriptionName()
    {
        try {
            $sql = "select *, ";
            $sql .= "suppliers_description_id as id, ";
            $sql .= "suppliers_description_value as name ";
            $sql .= "from {$this->tblSuppliers} ";
            $sql .= "where suppliers_description_value != '' ";
            $sql .= "group by suppliers_description_value ";
            $sql .= "order by suppliers_description_value asc ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // name
    public function readGoupBySupplierName()
    {
        try {
            $sql = "select *, ";
            $sql .= "suppliers_aid as id, ";
            $sql .= "suppliers_name as name ";
            $sql .= "from {$this->tblSuppliers} ";
            $sql .= "where suppliers_is_default = 0 ";
            $sql .= "group by suppliers_name ";
            $sql .= "order by suppliers_name asc ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // name
    public function readGoupBySupplierEmail()
    {
        try {
            $sql = "select *, ";
            $sql .= "suppliers_aid as id, ";
            $sql .= "suppliers_email as name ";
            $sql .= "from {$this->tblSuppliers} ";
            $sql .= "where suppliers_is_default = 0 ";
            $sql .= "group by suppliers_email ";
            $sql .= "order by suppliers_email asc ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // createSupplierDescription
    public function createSupplierDescription()
    {
        try {
            // Timestamped here (not read from $this->suppliers_created/updated)
            // since this lookup-table row can be created from the update flow
            // too, which never sets those supplier-record fields.
            $now = date("Y-m-d H:i:s");
            $sql = "insert into {$this->tblSuppliersDiscription} ";
            $sql .= "( supplier_description_name, ";
            $sql .= "supplier_description_created, ";
            $sql .= "supplier_description_updated ) values ( ";
            $sql .= ":supplier_description_name, ";
            $sql .= ":supplier_description_created, ";
            $sql .= ":supplier_description_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "supplier_description_name" => $this->suppliers_description_value_other,
                "supplier_description_created" => $now,
                "supplier_description_updated" => $now,
            ]);
            $this->lastInsertedSupplierDescriptionId = $this->connection->lastInsertId();
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
}
