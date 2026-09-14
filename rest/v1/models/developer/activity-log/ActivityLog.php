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

    public $supplier_description_name;
    public $supplier_description_created;
    public $supplier_description_updated;

    public $connection;
    public $lastInsertedId;
    public $tblActivityLog;
    public $tblCustomer;
    public $tblSupplierDescription;

    public $filters;
    public $column_start;
    public $column_total;
    public $column_search;
    public $max;

    public function __construct($db)
    {
        $this->connection = $db;
        $this->tblActivityLog = "graces_activity_log";
        $this->tblCustomer = "graces_customer";
        $this->tblSupplierDescription = "graces_supplier_description";
    }

    // Builds the "columnFilters" WHERE fragments shared by every read*()
    // method below, and writes the matching bound params into &$params.
    // - {min, max} value  -> numeric BETWEEN (range filter)
    // - array value       -> multi-select OR match via IN (...)
    // - plain value       -> single LIKE match (legacy single-select filter)
    private function buildFilterColumns($allowedColumns, &$params)
    {
        $filterColumn = [];

        foreach ($this->filters as $i => $item) {
            if (!in_array($item['id'], $allowedColumns, true)) {
                continue;
            }
            $col = $item['id'];
            $value = $item['value'];

            if (is_array($value) && array_key_exists('start', $value)) {
                $hasStart = trim((string) $value['start']) !== '';
                $hasEnd = trim((string) $value['end']) !== '';
                if (!$hasStart && !$hasEnd) {
                    continue;
                }
                if ($hasStart && $hasEnd) {
                    $params["start$i"] = trim($value['start']);
                    $params["end$i"] = trim($value['end']);
                    $filterColumn[] = "DATE($col) BETWEEN :start$i AND :end$i";
                } elseif ($hasStart) {
                    $params["start$i"] = trim($value['start']);
                    $filterColumn[] = "DATE($col) >= :start$i";
                } else {
                    $params["end$i"] = trim($value['end']);
                    $filterColumn[] = "DATE($col) <= :end$i";
                }
            } elseif (is_array($value) && array_key_exists('min', $value)) {
                $params["min$i"] = (float) $value['min'];
                $filterColumn[] = "$col BETWEEN :min$i AND :max$i";

                $params["max$i"] = $value['max'] === ""
                    ? (float) $this->max
                    : (float) $value['max'];
            } elseif (
                is_array($value)
                && isset($value[0])
                && is_array($value[0])
                && array_key_exists('start', $value[0])
            ) {
                $rangeClauses = [];

                foreach ($value as $j => $range) {
                    $hasStart = isset($range['start']) && trim((string) $range['start']) !== '';
                    $hasEnd = isset($range['end']) && trim((string) $range['end']) !== '';

                    if (!$hasStart && !$hasEnd) {
                        continue;
                    }

                    $startKey = "daterange{$i}_{$j}_start";
                    $endKey = "daterange{$i}_{$j}_end";

                    if ($hasStart && $hasEnd) {
                        $params[$startKey] = trim($range['start']);
                        $params[$endKey] = trim($range['end']);
                        $rangeClauses[] = "DATE($col) BETWEEN :$startKey AND :$endKey";
                    } elseif ($hasStart) {
                        $params[$startKey] = trim($range['start']);
                        $rangeClauses[] = "DATE($col) >= :$startKey";
                    } else {
                        $params[$endKey] = trim($range['end']);
                        $rangeClauses[] = "DATE($col) <= :$endKey";
                    }
                }

                if (empty($rangeClauses)) {
                    continue;
                }

                $filterColumn[] = "(" . implode(" OR ", $rangeClauses) . ")";
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
                "activity_log_menu" => "%{$this->column_search}%",
                "activity_log_action" => "%{$this->column_search}%",
                "activity_log_user_name" => "%{$this->column_search}%",
            ] : [],
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
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
            "start" => $this->column_start - 1,
            "total" => $this->column_total,
            ...$this->column_search != "" ? [
                "activity_log_menu" => "%{$this->column_search}%",
                "activity_log_action" => "%{$this->column_search}%",
                "activity_log_user_name" => "%{$this->column_search}%",
            ] : [],
        ];

        $filterColumn = $this->buildFilterColumns($allowedColumns, $params);
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
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
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
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readByLimit()
    {
        try {
            $sql = "select *, ";
            $sql .= "DATEDIFF(NOW(), activity_log_created) as days_ago, ";
            $sql .= "activity_log_aid as id, ";
            $sql .= "activity_log_menu as name ";
            $sql .= "from {$this->tblActivityLog} ";
            $sql .= "order by activity_log_aid desc ";
            $sql .= "limit :total ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "total" => $this->column_total,
            ]);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // read all
    public function readSupplierDescription()
    {
        try {
            $sql = "select * ";
            $sql .= "from {$this->tblSupplierDescription} ";
            $sql .= " order by supplier_description_name asc ";
            $query = $this->connection->query($sql);
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }

    // create
    public function createSupplierDescription()
    {
        try {
            $sql = "insert into {$this->tblSupplierDescription} ";
            $sql .= "( supplier_description_name, ";
            $sql .= "supplier_description_created, ";
            $sql .= "supplier_description_updated ) values ( ";
            $sql .= ":supplier_description_name, ";
            $sql .= ":supplier_description_created, ";
            $sql .= ":supplier_description_updated ) ";
            $query = $this->connection->prepare($sql);
            $query->execute([
                "supplier_description_name" => $this->supplier_description_name,
                "supplier_description_created" => $this->supplier_description_created,
                "supplier_description_updated" => $this->supplier_description_updated,
            ]);
            $this->lastInsertedId = $this->connection->lastInsertId();
        } catch (PDOException $ex) {
            logError($ex->getMessage(), $ex->getFile(), ['line' => $ex->getLine(), 'code' => $ex->getCode()]);
            $query = false;
        }
        return $query;
    }
}
