import { Funnel } from "lucide-react";
import React from "react";
import { useFilterPopover } from "./InputRangeFilter";

// Operator filters. column.getFilterValue() is { op, value, value2 } (undefined
// when nothing is applied); the server (Products::buildFilterColumns) and the
// "operator" filterFn in InfiniteTable both key off that shape.
const TEXT_OPS = [
  ["contains", "Contains"],
  ["equals", "Equals"],
  ["not_equal", "Not equal"],
  ["starts_with", "Starts with"],
  ["ends_with", "Ends with"],
  ["is_empty", "Is Empty"],
  ["not_empty", "Not Empty"],
  ["in", "In"],
];
const NUMBER_OPS = [
  ["equals", "Equals"],
  ["not_equal", "Not equal"],
  ["lt", "Less than"],
  ["lte", "Less than or equals"],
  ["gt", "Greater than"],
  ["gte", "Greater than or equals"],
  ["range", "In range"],
];
const DATE_OPS = [
  ["equals", "Equals"],
  ["gt", "Greater than"],
  ["lt", "Less than"],
  ["not_equal", "Not equal"],
  ["range", "In range"],
];
const NO_VALUE_OPS = ["is_empty", "not_empty"];
const inputClass =
  "w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 dark:bg-[#0b111e] normal-case hover:border-primary focus:border-primary outline-none";

// Native date inputs ignore placeholder; show a text input until focused or filled.
const PlaceholderDate = ({ value, ...props }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <input
      {...props}
      value={value}
      type={focused || value ? "date" : "text"}
      onFocus={(e) => {
        setFocused(true);
        setTimeout(() => e.target.showPicker?.(), 0);
      }}
      onBlur={() => setFocused(false)}
    />
  );
};

const OperatorFilter = ({ column, testFilterId, type }) => {
  const isNumber = type === "number";
  const isDate = type === "date";
  const ops = isNumber ? NUMBER_OPS : isDate ? DATE_OPS : TEXT_OPS;
  const inputType = isDate ? "date" : "text";
  const Field = isDate ? PlaceholderDate : "input";
  const applied = column.getFilterValue() || {};
  const op = applied.op || ops[0][0];
  const { isOpen, wrapperRef, handleClose, open } = useFilterPopover(applied);

  const set = (next) => {
    const merged = { op, value: "", value2: "", ...applied, ...next };
    const hasValue = (v) => String(v ?? "").trim() !== "";
    const complete =
      NO_VALUE_OPS.includes(merged.op) ||
      (merged.op === "range"
        ? hasValue(merged.value) || hasValue(merged.value2)
        : hasValue(merged.value));
    column.setFilterValue(complete ? merged : undefined);
  };

  // "applied" can be undefined while the user only picked an operator, so keep
  // the picked operator locally until a value arrives.
  const [pickedOp, setPickedOp] = React.useState(op);
  const currentOp = applied.op || pickedOp;
  const changeOp = (next) => {
    setPickedOp(next);
    set({ op: next });
  };

  const [quick, setQuick] = React.useState(applied.value ?? "");
  React.useEffect(() => setQuick(applied.value ?? ""), [applied.value]);
  React.useEffect(() => {
    if (quick === (applied.value ?? "")) return;
    const t = setTimeout(() => set({ op: currentOp, value: quick }), 500);
    return () => clearTimeout(t);
  }, [quick]);

  const clean = (v) => (isNumber ? v.replace(/[^0-9.\-]/g, "") : v);
  const isRange = currentOp === "range";
  const needsValue = !NO_VALUE_OPS.includes(currentOp);

  return (
    <div className="relative flex items-center gap-1" ref={wrapperRef}>
      <input
        type={inputType}
        inputMode={isNumber ? "decimal" : "text"}
        className={inputClass}
        value={quick}
        disabled={!needsValue || isRange}
        onChange={(e) => setQuick(clean(e.target.value))}
        data-testid={testFilterId}
      />
      <button
        type="button"
        onClick={() => (isOpen ? handleClose() : open())}
        data-testid={`${testFilterId}-trigger`}
        aria-label="Filter options"
        className={`shrink-0 p-1 ${applied.op ? "text-primary" : "text-gray-500"}`}
      >
        <Funnel className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-56 max-w-[80vw] border border-gray-100 rounded-lg shadow-lg bg-white dark:bg-[#0b111e] p-3 space-y-2">
          <select
            className={inputClass}
            value={currentOp}
            onChange={(e) => changeOp(e.target.value)}
            data-testid={`${testFilterId}-op`}
          >
            {ops.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {needsValue && (
            <Field
              type={inputType}
              className={inputClass}
              placeholder={isRange ? "From" : "Filter..."}
              value={applied.value ?? ""}
              onChange={(e) =>
                set({ op: currentOp, value: clean(e.target.value) })
              }
              data-testid={`${testFilterId}-value`}
            />
          )}
          {isRange && (
            <Field
              type={inputType}
              className={inputClass}
              placeholder="To"
              value={applied.value2 ?? ""}
              onChange={(e) =>
                set({ op: currentOp, value2: clean(e.target.value) })
              }
              data-testid={`${testFilterId}-value2`}
            />
          )}
        </div>
      )}
    </div>
  );
};

export const TextOperatorFilter = (props) => (
  <OperatorFilter {...props} type="text" />
);
export const NumberOperatorFilter = (props) => (
  <OperatorFilter {...props} type="number" />
);

// Native dropdown for columns with <= 5 unique values; "All" clears the filter.
export const DropdownFilter = ({ column, options, testFilterId }) => (
  <select
    className={inputClass}
    value={column.getFilterValue()?.value ?? ""}
    onChange={(e) =>
      column.setFilterValue(
        e.target.value === ""
          ? undefined
          : { op: "equals", value: e.target.value },
      )
    }
    data-testid={testFilterId}
  >
    <option value="">All</option>
    {options.map(({ value, label }) => (
      <option key={value} value={value}>
        {label}
      </option>
    ))}
  </select>
);

export const DateOperatorFilter = (props) => (
  <OperatorFilter {...props} type="date" />
);
