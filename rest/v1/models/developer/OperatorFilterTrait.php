<?php
// Shared by models whose page endpoints receive {op, value, value2} column filters.
// A using class may define $numericColumns / $dateColumns (arrays of column names).
trait OperatorFilterTrait
{
    // {op, value, value2} filter -> one WHERE clause (null = nothing to apply).
    // Operators are whitelisted, so only bound params carry user input.
    private function buildOperatorClause($col, $f, $i, &$params)
    {
        $op = $f['op'] ?? '';
        $v = trim((string) ($f['value'] ?? ''));
        $v2 = trim((string) ($f['value2'] ?? ''));

        if ($op === 'is_empty') {
            return "($col IS NULL OR $col = '')";
        }
        if ($op === 'not_empty') {
            return "($col IS NOT NULL AND $col <> '')";
        }
        if ($v === '' && !($op === 'range' && $v2 !== '')) {
            return null;
        }

        $isNum = in_array($col, $this->numericColumns ?? [], true);
        $isDate = in_array($col, $this->dateColumns ?? [], true);
        if ($isNum || $isDate) {
            $expr = $isNum ? "CAST($col AS DECIMAL(20,4))" : "DATE($col)";
            $cast = fn($x) => $isNum ? (float) $x : $x;
            if ($op === 'range') {
                $parts = [];
                if ($v !== '') {
                    $params["op{$i}a"] = $cast($v);
                    $parts[] = "$expr >= :op{$i}a";
                }
                if ($v2 !== '') {
                    $params["op{$i}b"] = $cast($v2);
                    $parts[] = "$expr <= :op{$i}b";
                }
                return "(" . implode(" AND ", $parts) . ")";
            }
            $sym = ['equals' => '=', 'not_equal' => '<>', 'lt' => '<', 'lte' => '<=', 'gt' => '>', 'gte' => '>='];
            if (!isset($sym[$op])) {
                return null;
            }
            $params["op$i"] = $cast($v);
            return "$expr {$sym[$op]} :op$i";
        }

        if ($op === 'in') {
            $items = array_values(array_filter(array_map('trim', explode(',', $v)), 'strlen'));
            if (empty($items)) {
                return null;
            }
            $ph = [];
            foreach ($items as $j => $item) {
                $params["op{$i}_$j"] = $item;
                $ph[] = ":op{$i}_$j";
            }
            return "$col IN (" . implode(", ", $ph) . ")";
        }

        $esc = addcslashes($v, '%_\\');
        $text = [
            'contains' => ["LIKE", "%$esc%"],
            'starts_with' => ["LIKE", "$esc%"],
            'ends_with' => ["LIKE", "%$esc"],
            'equals' => ["=", $v],
            'not_equal' => ["<>", $v],
        ];
        if (!isset($text[$op])) {
            return null;
        }
        $params["op$i"] = $text[$op][1];
        return "$col {$text[$op][0]} :op$i";
    }
}
