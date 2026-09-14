import { DateFormat } from "@/components/DateFormat";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { X } from "lucide-react";
import React from "react";

// A filter value's array can hold plain scalars (multi-select checkboxes:
// strings), amount-range objects (MultiRangeAmountFilter: { id, min, max }),
// or date-range objects (MultiRangeDateFilter: { id, start, end }). These two
// helpers let the rest of the component treat all three uniformly -
// keyed/removed by `id` for ranges, by the value itself for plain scalars.
const chipKey = (item) => (item && typeof item === "object" ? item.id : item);

const wordDate = (isoDate) => (isoDate ? DateFormat(isoDate) : "…");

const chipLabel = (item, statusOptions) => {
  if (!item || typeof item !== "object") {
    // Scalar filter values (e.g. the Active/Inactive status filter's 1/0)
    // are stored as the raw bit so they can be sent straight back to the
    // API - resolve them to their human-readable label here, the same
    // status_option list the filter dropdown and status badges use.
    const match = statusOptions?.find((option) => option.value === item);
    return match ? match.label : item;
  }

  if (item.flexible) {
    return "Flexible";
  }

  if ("start" in item || "end" in item) {
    // Same-date condensing: a "range" that's really just one day (From and
    // To both set to the same date) reads better as a single date than as
    // "Sep 9, 2026 - Sep 9, 2026".
    if (item.start && item.start === item.end) {
      return wordDate(item.start);
    }
    return `${wordDate(item.start)} - ${wordDate(item.end)}`;
  }

  return `${item.min === "" || item.min === undefined ? 0 : item.min} - ${
    item.max === "" || item.max === undefined ? "max" : item.max
  }`;
};

// Reusable active-filters summary bar for multi-select and multi-range
// column filters. Renders one group per filtered column (e.g. "Products:",
// "Price:") with a chip per selected value/range; removing a chip unchecks
// that value (or drops that range) in the column's filter and re-triggers
// the table's data fetch through setColumnFilters.
const ActiveFilterTagBar = ({ table, columnFilters, setColumnFilters }) => {
  const groups = (columnFilters || [])
    .filter((filter) => Array.isArray(filter.value) && filter.value.length > 0)
    .map((filter) => ({
      id: filter.id,
      label: table?.getColumn(filter.id)?.columnDef?.header || filter.id,
      values: filter.value,
      statusOptions: table?.getColumn(filter.id)?.columnDef?.status_option,
    }));

  if (groups.length === 0) return null;

  const removeValue = (filterId, key) => {
    setColumnFilters((prev) =>
      prev
        .map((filter) => {
          if (filter.id !== filterId || !Array.isArray(filter.value)) {
            return filter;
          }
          const nextValues = filter.value.filter(
            (item) => chipKey(item) !== key,
          );
          return nextValues.length ? { ...filter, value: nextValues } : null;
        })
        .filter(Boolean),
    );
  };

  return (
    <div
      className=" flex flex-wrap items-start gap-x-6 gap-y-2 mb-3"
      data-testid="active-filter-tag-bar"
    >
      {groups.map((group) => (
        <div key={group.id} className="flex flex-wrap items-center gap-1 p-2">
          <span className="text-sm font-semibold capitalize">
            {group.label}:
          </span>
          {group.values.map((value) => {
            const key = chipKey(value);
            const label = chipLabel(value, group.statusOptions);
            return (
              <span
                key={key}
                data-testid={`active-filter-chip-${group.id}`}
                className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-[#0b111e] border border-gray-200 dark:border-gray-700 rounded-full pl-3 pr-1.5 py-1 text-sm normal-case"
              >
                {isEmptyItem(label, "Emply value")}
                <button
                  type="button"
                  onClick={() => removeValue(group.id, key)}
                  aria-label={`Remove ${label}`}
                  className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-400 hover:bg-primary text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ActiveFilterTagBar;
