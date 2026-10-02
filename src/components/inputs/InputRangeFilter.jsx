import { handleEscape } from "@/utilities/handleEscape";
import { ChevronDown, Plus, X } from "lucide-react";
import React from "react";

// One row inside a MultiRangeAmountFilter's draft list.
// type AmountRange = { id: string; min: number | ""; max: number | "" };
let rangeIdCounter = 0;
const nextRangeId = () => `range-${++rangeIdCounter}`;

// Shared open/close wiring for the range-filter popovers below: outside-click
// and Escape both close the panel, and re-opening always resets the draft to
// whatever is currently applied on the column (so a cancelled edit never
// leaks into the next open).
export const useFilterPopover = (appliedValue) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(appliedValue);
  const wrapperRef = React.useRef(null);

  const handleClose = () => setIsOpen(false);
  handleEscape(handleClose);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const open = () => {
    setDraft(appliedValue);
    setIsOpen(true);
  };

  return { isOpen, setIsOpen, draft, setDraft, wrapperRef, handleClose, open };
};

const TriggerButton = ({
  isOpen,
  onClick,
  label,
  placeholder,
  testFilterId,
}) => (
  <button
    type="button"
    onClick={onClick}
    data-testid={`${testFilterId}-trigger`}
    className={`flex items-center justify-between gap-1 w-full min-h-full text-sm border rounded-lg px-2 py-1.5 cursor-pointer shadow-none dark:bg-[#0b111e] normal-case
    ${isOpen ? "border-primary" : "border-gray-300"}
    hover:border-primary`}
  >
    <span
      className={`truncate ${label ? "text-gray-700 dark:text-white" : "text-gray-400"}`}
    >
      {label || placeholder}
    </span>
    <ChevronDown className="w-3.5 h-3.5 shrink-0 text-gray-500" />
  </button>
);

const PopoverActions = ({ onFilter, onClear }) => (
  <div className="flex items-center gap-2 mt-3">
    <button
      type="button"
      onClick={onFilter}
      className="btn-modal-submit flex-1 py-1! text-sm"
    >
      Filter
    </button>
    <button
      type="button"
      onClick={onClear}
      className="btn-modal-cancel flex-1 py-1! text-sm"
    >
      Clear
    </button>
  </div>
);

// Reusable "Min - Max" numeric range filter with Filter/Clear actions.
// column.getFilterValue() is the source of truth: { min, max } (or undefined
// when nothing is applied) - the same shape the "between" filterFn already
// expects, so this is a drop-in for any amount/price/quantity column.
export const AmountRangeFilter = ({
  column,
  testFilterId,
  placeholder = "--",
}) => {
  const appliedValue = column.getFilterValue() || {};
  const { isOpen, setIsOpen, draft, setDraft, wrapperRef, handleClose, open } =
    useFilterPopover(appliedValue);

  const updateDraft = (key) => (e) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, "");
    setDraft((prev) => ({
      ...prev,
      [key]: cleaned === "" ? "" : Number(cleaned),
    }));
  };

  const applyFilter = () => {
    const hasMin = draft.min !== undefined && draft.min !== "";
    const hasMax = draft.max !== undefined && draft.max !== "";

    column.setFilterValue(
      hasMin || hasMax
        ? { min: hasMin ? draft.min : "", max: hasMax ? draft.max : "" }
        : undefined,
    );
    setIsOpen(false);
  };

  const clearFilter = () => {
    setDraft({});
    column.setFilterValue(undefined);
    setIsOpen(false);
  };

  const label =
    appliedValue.min || appliedValue.max
      ? `${appliedValue.min || 0} - ${appliedValue.max || "max"}`
      : null;

  return (
    <div className="relative" ref={wrapperRef} data-testid={testFilterId}>
      <TriggerButton
        isOpen={isOpen}
        onClick={() => (isOpen ? handleClose() : open())}
        label={label}
        placeholder={placeholder}
        testFilterId={testFilterId}
      />

      {isOpen && (
        <div className="absolute z-50 mt-1 w-56 max-w-[80vw] border border-gray-100 rounded-lg shadow-lg bg-white dark:bg-[#0b111e] p-3">
          <div className="flex items-center gap-1">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={draft.min ?? ""}
              placeholder="min"
              onChange={updateDraft("min")}
              className="w-full! m-0! text-sm border-gray-300 rounded-md"
              data-testid={`${testFilterId}_min`}
            />
            <span className="font-bold">-</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={draft.max ?? ""}
              placeholder="max"
              onChange={updateDraft("max")}
              className="w-full! m-0! text-sm border-gray-300 rounded-md"
              data-testid={`${testFilterId}_max`}
            />
          </div>

          <PopoverActions onFilter={applyFilter} onClear={clearFilter} />
        </div>
      )}
    </div>
  );
};

const rangeLabel = (range) =>
  `${range.min === "" || range.min === undefined ? 0 : range.min} - ${
    range.max === "" || range.max === undefined ? "max" : range.max
  }`;

// Reusable multi-range numeric filter: lets a user stack several independent
// [min, max] ranges (e.g. 0-10 AND 50-100) that are OR'd together server-side
// (a row matches if it falls in ANY of the selected ranges). Drop-in
// alternative to AmountRangeFilter for columns that need multiple ranges at
// once instead of a single one. column.getFilterValue() is the source of
// truth: an array of { id, min, max } (or undefined when nothing is
// applied) - pair with filterFn: "multiRange" on the column.
export const MultiRangeAmountFilter = ({
  column,
  testFilterId,
  placeholder = "--",
}) => {
  const appliedValue = column.getFilterValue() || [];
  const { isOpen, setIsOpen, draft, setDraft, wrapperRef, handleClose, open } =
    useFilterPopover(appliedValue);

  const addRange = () => {
    setDraft((prev) => [...prev, { id: nextRangeId(), min: "", max: "" }]);
  };

  const removeRange = (id) => {
    setDraft((prev) => prev.filter((range) => range.id !== id));
  };

  const updateRange = (id, key) => (e) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, "");
    const value = cleaned === "" ? "" : Number(cleaned);

    setDraft((prev) =>
      prev.map((range) =>
        range.id === id ? { ...range, [key]: value } : range,
      ),
    );
  };

  const applyFilter = () => {
    const validRanges = draft.filter(
      (range) => range.min !== "" || range.max !== "",
    );
    column.setFilterValue(validRanges.length ? validRanges : undefined);
    setIsOpen(false);
  };

  const clearFilter = () => {
    setDraft([]);
    column.setFilterValue(undefined);
    setIsOpen(false);
  };

  const label =
    appliedValue.length === 0
      ? null
      : appliedValue.length === 1
        ? rangeLabel(appliedValue[0])
        : `${appliedValue.length} ranges`;

  return (
    <div className="relative" ref={wrapperRef} data-testid={testFilterId}>
      <TriggerButton
        isOpen={isOpen}
        onClick={() => (isOpen ? handleClose() : open())}
        label={label}
        placeholder={placeholder}
        testFilterId={testFilterId}
      />

      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 max-w-[80vw] border border-gray-100 rounded-lg shadow-lg bg-white dark:bg-[#0b111e] p-3">
          <div className="flex flex-col gap-2 max-h-52 overflow-auto">
            {draft.length === 0 && (
              <p className="text-sm text-gray-400">No ranges added yet</p>
            )}
            {draft.map((range) => (
              <div key={range.id} className="flex items-center gap-1">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={range.min ?? ""}
                  placeholder="Min"
                  onChange={updateRange(range.id, "min")}
                  className="w-full! m-0! text-sm border-gray-300 rounded-md"
                  data-testid={`${testFilterId}_${range.id}_min`}
                />
                <span className="font-bold">-</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={range.max ?? ""}
                  placeholder="Max"
                  onChange={updateRange(range.id, "max")}
                  className="w-full! m-0! text-sm border-gray-300 rounded-md"
                  data-testid={`${testFilterId}_${range.id}_max`}
                />
                <button
                  type="button"
                  onClick={() => removeRange(range.id)}
                  aria-label="Remove range"
                  className="flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-gray-400 hover:bg-primary text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRange}
            className="flex items-center gap-1 mt-2 text-sm text-primary hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            Add range
          </button>

          <PopoverActions onFilter={applyFilter} onClear={clearFilter} />
        </div>
      )}
    </div>
  );
};

// Reusable start/end date range filter with Filter/Clear actions.
// column.getFilterValue() is the source of truth: { start, end } (or
// undefined when nothing is applied). Pair with filterFn: "dateRange" on the
// column (see InfiniteTable.jsx) so the client-side row model matches it.
export const DateRangeFilter = ({
  column,
  testFilterId,
  placeholder = "--",
}) => {
  const appliedValue = column.getFilterValue() || {};
  const { isOpen, setIsOpen, draft, setDraft, wrapperRef, handleClose, open } =
    useFilterPopover(appliedValue);

  const updateDraft = (key) => (e) => {
    const value = e.target.value;
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilter = () => {
    const { start, end } = draft;
    column.setFilterValue(
      start || end ? { start: start || "", end: end || "" } : undefined,
    );
    setIsOpen(false);
  };

  const clearFilter = () => {
    setDraft({});
    column.setFilterValue(undefined);
    setIsOpen(false);
  };

  const label =
    appliedValue.start || appliedValue.end
      ? `${appliedValue.start || "…"} - ${appliedValue.end || "…"}`
      : null;

  return (
    <div className="relative" ref={wrapperRef} data-testid={testFilterId}>
      <TriggerButton
        isOpen={isOpen}
        onClick={() => (isOpen ? handleClose() : open())}
        label={label}
        placeholder={placeholder}
        testFilterId={testFilterId}
      />

      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 max-w-[80vw] border border-gray-100 rounded-lg shadow-lg bg-white dark:bg-[#0b111e] p-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500 dark:text-white">
              Start date
              <input
                type="date"
                value={draft.start ?? ""}
                onChange={updateDraft("start")}
                className="w-full! m-0! text-sm"
                data-testid={`${testFilterId}_start`}
              />
            </label>
            <label className="text-xs text-gray-500 dark:text-white">
              End date
              <input
                type="date"
                value={draft.end ?? ""}
                onChange={updateDraft("end")}
                className="w-full! m-0! text-sm"
                data-testid={`${testFilterId}_end`}
              />
            </label>
          </div>

          <PopoverActions onFilter={applyFilter} onClear={clearFilter} />
        </div>
      )}
    </div>
  );
};

const dateRangeLabel = (range) => `${range.start || "…"} - ${range.end || "…"}`;

// Reusable multi-range date filter: lets a user stack several independent
// start/end date spans (e.g. Jan 1-15 OR Mar 1-31) that are OR'd together
// server-side (a row matches if it falls in ANY of the selected spans).
// Drop-in alternative to DateRangeFilter for columns that need multiple date
// spans at once instead of a single one. column.getFilterValue() is the
// source of truth: an array of { id, start, end } (or undefined when nothing
// is applied) - pair with filterFn: "multiDateRange" on the column (see
// InfiniteTable.jsx).
export const MultiRangeDateFilter = ({
  column,
  testFilterId,
  placeholder = "--",
  // When true, a range with only one side filled in (From only, or To
  // only) is treated as an exact single-day match on that date instead of
  // an open-ended "on or after"/"on or before" range - done by mirroring
  // the filled side into the empty one before applying, so the existing
  // start/end BETWEEN logic (frontend filterFn and backend SQL) just sees
  // a same-day range and needs no changes of its own.
  singleSidedExact = false,
  // When true, adds a standalone "Flexible Due Date" checkbox to the
  // popover for columns that can hold flexible-installment orders (no fixed
  // due date - see the Due Date column in SalesOrders.jsx). Checking it adds
  // an { id: "flexible", flexible: true } marker alongside whatever date
  // ranges are also selected - a row matches if it's flexible OR falls in
  // any of the ranges (all OR'd together), so the two work at the same time
  // rather than one disabling the other. Unrelated columns never pass this
  // prop, so their behavior is unchanged.
  allowFlexible = false,
}) => {
  const appliedValue = column.getFilterValue() || [];
  const { isOpen, setIsOpen, draft, setDraft, wrapperRef, handleClose, open } =
    useFilterPopover(appliedValue);

  const hasFlexibleDraft =
    allowFlexible && draft.some((range) => range.flexible);
  const draftRanges = draft.filter((range) => !range.flexible);

  const addRange = () => {
    setDraft((prev) => [...prev, { id: nextRangeId(), start: "", end: "" }]);
  };

  const removeRange = (id) => {
    setDraft((prev) => prev.filter((range) => range.id !== id));
  };

  const updateRange = (id, key) => (e) => {
    const value = e.target.value;
    setDraft((prev) =>
      prev.map((range) =>
        range.id === id ? { ...range, [key]: value } : range,
      ),
    );
  };

  const toggleFlexible = (e) => {
    setDraft((prev) =>
      e.target.checked
        ? [{ id: "flexible", flexible: true }, ...prev]
        : prev.filter((range) => !range.flexible),
    );
  };

  const applyFilter = () => {
    const validRanges = draftRanges
      .filter((range) => range.start !== "" || range.end !== "")
      .map((range) =>
        singleSidedExact && (range.start === "" || range.end === "")
          ? {
              ...range,
              start: range.start || range.end,
              end: range.end || range.start,
            }
          : range,
      );

    const nextValue = [
      ...(hasFlexibleDraft ? [{ id: "flexible", flexible: true }] : []),
      ...validRanges,
    ];

    column.setFilterValue(nextValue.length ? nextValue : undefined);
    setIsOpen(false);
  };

  const clearFilter = () => {
    setDraft([]);
    column.setFilterValue(undefined);
    setIsOpen(false);
  };

  const appliedRanges = appliedValue.filter((range) => !range.flexible);
  const appliedHasFlexible = appliedValue.some((range) => range.flexible);

  const label = appliedValue.length
    ? [
        appliedHasFlexible ? "Flexible" : null,
        appliedRanges.length === 1
          ? dateRangeLabel(appliedRanges[0])
          : appliedRanges.length > 1
            ? `${appliedRanges.length} date ranges`
            : null,
      ]
        .filter(Boolean)
        .join(" + ")
    : null;

  return (
    <div className="relative" ref={wrapperRef} data-testid={testFilterId}>
      <TriggerButton
        isOpen={isOpen}
        onClick={() => (isOpen ? handleClose() : open())}
        label={label}
        placeholder={placeholder}
        testFilterId={testFilterId}
      />

      {isOpen && (
        <div className="absolute z-50 mt-1 w-90 max-w-[85vw] border border-gray-100 rounded-lg shadow-lg bg-white dark:bg-[#0b111e] p-3">
          {allowFlexible && (
            <label className="flex items-center gap-2 text-sm mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
              <input
                type="checkbox"
                checked={hasFlexibleDraft}
                onChange={toggleFlexible}
                data-testid={`${testFilterId}_flexible`}
                className="w-5! mt-0!"
              />
              Flexible Due Date
            </label>
          )}

          <div className="flex flex-col gap-2 max-h-60 overflow-auto">
            {draftRanges.length === 0 && (
              <p className="text-sm text-gray-400">No date ranges added yet</p>
            )}
            {draftRanges.map((range) => (
              <div key={range.id} className="flex items-center gap-1">
                <label className="flex items-center gap-1 w-full text-xs text-gray-500 dark:text-white">
                  <input
                    type="date"
                    value={range.start ?? ""}
                    onChange={updateRange(range.id, "start")}
                    className="w-full! m-0! text-sm"
                    data-testid={`${testFilterId}_${range.id}_start`}
                  />
                </label>
                <label className="flex items-center gap-1 w-full text-xs text-gray-500 dark:text-white">
                  -
                  <input
                    type="date"
                    value={range.end ?? ""}
                    onChange={updateRange(range.id, "end")}
                    className="w-full! m-0! text-sm"
                    data-testid={`${testFilterId}_${range.id}_end`}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeRange(range.id)}
                  aria-label="Remove date range"
                  className="flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-gray-400 hover:bg-primary text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRange}
            className="flex items-center gap-1 mt-2 text-sm text-primary hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            Add date range
          </button>

          <PopoverActions onFilter={applyFilter} onClear={clearFilter} />
        </div>
      )}
    </div>
  );
};
