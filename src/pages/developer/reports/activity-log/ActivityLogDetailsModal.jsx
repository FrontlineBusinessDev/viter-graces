import CloseButton from "@/components/buttons/CloseButton";
import { handleEscape } from "@/utilities/handleEscape";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";
import { activityActionPillClass } from "./ActivityLog";

// Some records mix snake_case DB columns with camelCase convenience fields
// (react-table meta, computed totals like "totalPaidAmount"). Normalizing
// both to snake_case lets every other check (noisy keys, money detection,
// alias dedup) work regardless of which style a given field happens to use.
const canonicalizeKey = (key = "") =>
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();

// Strips a repeated module prefix (e.g. "purchase_order_") off a raw column
// name before turning it into a label, so "purchase_order_supplier_name"
// reads as "Supplier Name" instead of repeating the menu name every time.
const formatLabel = (key = "", prefix = "") => {
  let cleanKey = canonicalizeKey(key);

  if (prefix && cleanKey.startsWith(prefix) && cleanKey.length > prefix.length) {
    cleanKey = cleanKey.slice(prefix.length);
  }

  return cleanKey
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const NULL_LIKE = new Set(["null", "undefined", "n/a", "na"]);

// A value with nothing worth showing — filtered out entirely rather than
// rendered as a dash, so the details list only carries real information.
const isEmptyValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === "string" && NULL_LIKE.has(value.trim().toLowerCase()))
  ) {
    return true;
  }
  if (Array.isArray(value)) return value.length === 0;
  if (isPlainObject(value)) return Object.keys(value).length === 0;
  return false;
};

// Internal/technical columns that clutter a normal activity log and rarely
// mean anything to a reader (raw ids, audit timestamps, duplicate flags).
const NOISY_KEY_PATTERNS = [
  /(^|_)aid$/,
  /(^|_)id$/,
  /(^|_)is_active$/,
  /(^|_)is_status$/,
  /(^|_)delivery_is_status$/,
  /(^|_)movement_status$/,
  /(^|_)number_old$/,
  /(^|_)percent_tax$/,
  /(^|_)discount_percentage$/,
  /(^|_)vat$/,
  /(^|_)vat_amount$/,
  /(^|_)transfer_note$/,
  /(^|_)before_qty$/,
  /(^|_)after_qty$/,
  /(^|_)created$/,
  /(^|_)updated$/,
  /(^|_)formated_date$/,
  /(^|_)formated_delivery_date$/,
  // react-table column/option-config internals — logged whenever a status
  // dropdown or table column gets edited, regardless of which menu it's for.
  /^header$/,
  /^filter_fn$/,
  /^sorting_fn$/,
  /^sort_undefined$/,
  /^aggregation_fn$/,
  /^size$/,
  /^min_size$/,
  /^max_size$/,
  /^accessor_key$/,
  /^class_th$/,
  /^class_td$/,
  /^update_data_column$/,
  /^meta$/,
  // Generic routing/UI-plumbing fields logged alongside almost any record —
  // never meaningful to a reader, regardless of which menu logged them.
  /^path$/,
  /^icon$/,
  /^test_id$/,
  /^filter_status$/,
];

// canonicalizeKey normalizes camelCase to snake_case first, so a pattern
// only needs to account for one casing style.
const isNoisyKey = (key) => {
  const value = canonicalizeKey(key);
  return NOISY_KEY_PATTERNS.some((pattern) => pattern.test(value));
};

// Besides their prefixed, descriptive counterpart (e.g. "purchase_order_
// number"), records often carry a bare generic alias of the same value for
// other parts of the UI (e.g. table rendering) — "name", "amount", etc.
// Only drop these when they actually repeat a value already shown; if the
// value differs (e.g. a grand "total_amount" vs a per-item one) both stay.
const GENERIC_ALIAS_KEYS = new Set([
  "name",
  "amount",
  "total_amount",
  "payment_status",
  "status",
]);

const normalizeValue = (value) => String(value).trim().toLowerCase();

// A bare "*_tax" is sometimes the actual tax amount (e.g. purchase orders)
// and sometimes just the tax rate used to compute a separate "*_tax_amount"
// field (e.g. sales orders) — showing the raw rate as currency is wrong, and
// showing it at all is redundant once the computed amount is already there.
const isBareTaxKey = (key) => /(^|_)tax$/.test(canonicalizeKey(key));
const isTaxAmountKey = (key) => /(^|_)tax_amount$/.test(canonicalizeKey(key));

// Drops technical/empty fields, any generic alias field that just repeats a
// value already shown under a more descriptive label, and a bare tax rate
// when its computed "tax_amount" sibling is already present.
const cleanEntries = (entries) => {
  const hasTaxAmount = entries.some(([key]) => isTaxAmountKey(key));

  const filtered = entries.filter(
    ([key, value]) =>
      !isNoisyKey(key) &&
      !isEmptyValue(value) &&
      !(hasTaxAmount && isBareTaxKey(key)),
  );

  const seenValues = new Set();
  const result = [];

  for (const [key, value] of filtered) {
    const isPrimitive = !isPlainObject(value) && !Array.isArray(value);
    const normalized = isPrimitive ? normalizeValue(value) : null;
    const isAlias = GENERIC_ALIAS_KEYS.has(canonicalizeKey(key));

    if (isAlias && normalized !== null && seenValues.has(normalized)) {
      continue;
    }

    if (normalized !== null) seenValues.add(normalized);
    result.push([key, value]);
  }

  return result;
};

// A field whose value needs the full row width to breathe (nested object,
// or an array containing objects) rather than sitting in a small grid cell.
const isComplexValue = (value) =>
  isPlainObject(value) ||
  (Array.isArray(value) && value.some((item) => isPlainObject(item)));

// Card-grid rendering for a set of [key, value] entries — used for both the
// top-level activity details and any nested plain object value. Noisy and
// empty fields are dropped so only meaningful information is shown.
const FieldCardGrid = ({ entries, prefix = "" }) => {
  const cleaned = cleanEntries(entries);

  if (cleaned.length === 0) {
    return <span className="text-gray-400">&mdash;</span>;
  }

  const discountType = findDiscountType(cleaned);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cleaned.map(([key, value], index) => (
        <div
          key={index}
          className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 min-w-0 ${
            isComplexValue(value) ? "sm:col-span-2" : ""
          }`}
        >
          <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            {formatLabel(key, prefix)}
          </p>
          <div className="text-sm font-medium text-black dark:text-light break-words">
            {renderFieldValue(key, value, prefix, discountType)}
          </div>
        </div>
      ))}
    </div>
  );
};

// Looks up a value by field "meaning" rather than exact column name, so the
// same rendering works across menus regardless of their prefix (e.g. both
// "purchase_order_qty" and a bare "qty" resolve the same way). Tries an
// exact match first (most specific to the record itself), then falls back
// to any column ending with that suffix.
const findFieldValue = (item, suffixes) => {
  const keys = Object.keys(item);

  for (const suffix of suffixes) {
    const exact = keys.find((key) => key.toLowerCase() === suffix);
    if (exact) return item[exact];
  }

  for (const suffix of suffixes) {
    const match = keys.find((key) => key.toLowerCase().endsWith(`_${suffix}`));
    if (match) return item[match];
  }

  return undefined;
};

const hasFieldValue = (item, suffixes) => findFieldValue(item, suffixes) !== undefined;

// A "line item" — a product/entry with a name, quantity, and price — shows
// up under many menus (purchase orders, returns, sales). Detected by shape
// rather than a hardcoded prefix so the same receipt-style card works for
// any of them.
const isLineItem = (item) =>
  hasFieldValue(item, ["product_name"]) || hasFieldValue(item, ["qty"]);

const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const formatCurrency = (value) => {
  const num = toNumber(value);
  return num === null
    ? null
    : num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
};

// Any numeric field whose name reads as a monetary figure gets a peso sign
// and two decimal places (e.g. "Balance: 22.4" -> "Balance: ₱22.40"). Matched
// as whole underscore-delimited segments (not substrings) so e.g. "days_
// overdue" doesn't match on "due" the way it would with a plain substring
// test against "overdue".
const MONEY_WORDS = new Set([
  "amount",
  "balance",
  "payment",
  "price",
  "tax",
  "discount",
  "paid",
  "cost",
  "fee",
  "due",
]);

const isMoneyKey = (key) =>
  canonicalizeKey(key)
    .split("_")
    .some((segment) => MONEY_WORDS.has(segment));

// A bare "discount" field can hold either a peso amount or a percentage —
// its sibling "discount_type" field says which, so it needs its own check
// rather than always being treated as currency.
const isDiscountKey = (key) => /(^|_)discount$/.test(canonicalizeKey(key));
const isDiscountTypeKey = (key) =>
  /(^|_)discount_type$/.test(canonicalizeKey(key));

const findDiscountType = (entries) => {
  const match = entries.find(([key]) => isDiscountTypeKey(key));
  return match ? String(match[1]).trim().toLowerCase() : null;
};

// An "is_x" flag (is_paid, is_return, is_restocked, ...) is a yes/no status,
// never a currency amount — even though a word like "paid" would otherwise
// read as money. Rendered as a small pill instead of a raw 0/1/true/false.
const isBooleanFlagKey = (key) => /(^|_)is_[a-z0-9]+$/.test(canonicalizeKey(key));
const BOOLEAN_LIKE_VALUES = new Set(["0", "1", "true", "false", "yes", "no"]);
const isTruthyFlag = (value) =>
  ["1", "true", "yes"].includes(String(value).trim().toLowerCase());

const MoneyValue = ({ value }) => <>&#8369;{formatCurrency(value)}</>;

const PercentValue = ({ value }) => {
  const num = toNumber(value);
  return (
    <>
      {num.toLocaleString(undefined, { maximumFractionDigits: 2 })}%
    </>
  );
};

const BooleanPill = ({ value }) => {
  const truthy = isTruthyFlag(value);
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        truthy
          ? "bg-green-100 text-green-700 dark:bg-green-600 dark:text-green-100"
          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200"
      }`}
    >
      {truthy ? "Yes" : "No"}
    </span>
  );
};

// Renders a field's value as currency when its key reads as money and the
// value is actually numeric, otherwise falls back to the normal renderer.
// "discount" is special-cased since it can be an amount or a percentage,
// and "is_x" flags are special-cased since they're a status, not an amount.
const renderFieldValue = (key, value, prefix, discountType = null) => {
  if (
    isBooleanFlagKey(key) &&
    BOOLEAN_LIKE_VALUES.has(String(value).trim().toLowerCase())
  ) {
    return <BooleanPill value={value} />;
  }

  if (isDiscountKey(key) && toNumber(value) !== null) {
    return discountType === "percentage" ? (
      <PercentValue value={value} />
    ) : (
      <MoneyValue value={value} />
    );
  }

  return isMoneyKey(key) && toNumber(value) !== null ? (
    <MoneyValue value={value} />
  ) : (
    <DetailValue value={value} prefix={prefix} />
  );
};

// Renders any detected line item — a purchase order product, a returned
// product, a sales line, etc. — as a compact receipt row instead of a raw
// field dump: name, owner, qty x price = total.
const LineItemCard = ({ item, index }) => {
  const productName = findFieldValue(item, ["product_name"]);
  const ownerName = findFieldValue(item, ["product_owner_name"]);
  const qty = findFieldValue(item, ["qty"]);
  const price = formatCurrency(findFieldValue(item, ["price"]));
  const total = formatCurrency(findFieldValue(item, ["total", "total_amount"]));
  const delivery = item.suppliers_delivery;

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-[11px] font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-black dark:text-light capitalize truncate">
              {productName || "Unnamed product"}
            </p>
            {ownerName && (
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                Owner: {ownerName}
              </p>
            )}
          </div>
        </div>
        {delivery && (
          <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
            {delivery}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm border-t border-gray-100 dark:border-gray-800 mt-3 pt-3">
        <span className="text-gray-500 dark:text-gray-400">
          {qty ?? "—"} pc(s)
          {price !== null && <> &times; &#8369;{price}</>}
        </span>
        <span className="font-semibold text-black dark:text-light">
          {total !== null ? <>&#8369;{total}</> : "—"}
        </span>
      </div>
    </div>
  );
};

// A "payment item" — an installment/payment history entry (a reference
// number, method, due date, amount vs. paid amount) — shows up under any
// menu with an installment plan (accounts receivable, accounts payable,
// ...). Detected by shape, same as line items, so it gets the same
// receipt-style treatment instead of a raw field dump.
const isPaymentItem = (item) =>
  !isLineItem(item) &&
  hasFieldValue(item, ["paid_amount"]) &&
  hasFieldValue(item, ["amount"]);

const PaymentItemCard = ({ item, index }) => {
  const reference = findFieldValue(item, ["code_number", "number"]);
  const payerName = findFieldValue(item, ["customer_name", "received_name"]);
  const method = findFieldValue(item, ["method"]);
  const dueDate = findFieldValue(item, ["due_date"]);
  const isPaid = findFieldValue(item, ["is_paid"]);
  const amount = formatCurrency(findFieldValue(item, ["amount"]));
  const paidAmount = formatCurrency(findFieldValue(item, ["paid_amount"]));

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-[11px] font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-black dark:text-light capitalize truncate">
              {reference || "Payment"}
            </p>
            {payerName && (
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                {payerName}
              </p>
            )}
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5">
          {method && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
              {method}
            </span>
          )}
          {BOOLEAN_LIKE_VALUES.has(String(isPaid).trim().toLowerCase()) && (
            <BooleanPill value={isPaid} />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm border-t border-gray-100 dark:border-gray-800 mt-3 pt-3">
        <span className="text-gray-500 dark:text-gray-400">
          {dueDate ? <>Due {dueDate}</> : "—"}
        </span>
        <span className="font-semibold text-black dark:text-light">
          {paidAmount !== null ? <>&#8369;{paidAmount}</> : "—"}
          {amount !== null && <span className="text-gray-400 dark:text-gray-500"> / &#8369;{amount}</span>}
        </span>
      </div>
    </div>
  );
};

// A generic dropdown/status option — {label, value[, name]} — rendered as
// a simple pill list instead of a raw field dump.
const isOptionItem = (item) => "label" in item && "value" in item;

const OptionPillList = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((option, index) => (
      <span
        key={index}
        className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
      >
        {String(option.label ?? option.value)}
      </span>
    ))}
  </div>
);

const YES_LIKE = new Set(["yes", "true", "1"]);

// The "returns-products" menu carries a purpose-built summary rather than
// the generic field dump: just the fields a reader actually needs to know
// about the return, in a fixed, predictable order.
const buildReturnSummary = (values) => {
  const firstItem = Array.isArray(values.selectedItems)
    ? values.selectedItems[0]
    : null;
  const linkedOrder = firstItem
    ? findFieldValue(firstItem, ["number"])
    : undefined;

  const restockedRaw = values.return_product_is_restocked;
  const isRestocked = YES_LIKE.has(
    String(restockedRaw ?? "").trim().toLowerCase(),
  );

  return [
    { label: "Return Date", value: values.return_product_date },
    { label: "Resolution Type", value: values.return_product_resolution_type },
    { label: "Return Method", value: values.return_product_refund_method },
    { label: "Return Reason", value: values.return_product_reason },
    { label: "Other Reason", value: values.other_reason },
    { label: "Linked Order", value: linkedOrder },
    {
      label: "Other Amount",
      value: values.return_product_paid_amount,
      money: true,
    },
    { label: "Note", value: values.return_product_notes },
    isEmptyValue(restockedRaw)
      ? null
      : {
          label: "Restocked",
          value: isRestocked ? "Yes" : "No",
          pill: isRestocked ? "yes" : "no",
        },
  ].filter((field) => field && !isEmptyValue(field.value));
};

const ReturnSummaryGrid = ({ fields }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {fields.map((field, index) => (
      <div
        key={index}
        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 min-w-0"
      >
        <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {field.label}
        </p>
        <div className="text-sm font-medium text-black dark:text-light break-words">
          {field.pill ? (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                field.pill === "yes"
                  ? "bg-green-100 text-green-700 dark:bg-green-600 dark:text-green-100"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {field.value}
            </span>
          ) : field.money ? (
            <MoneyValue value={field.value} />
          ) : (
            <span className="capitalize break-words">{String(field.value)}</span>
          )}
        </div>
      </div>
    ))}
  </div>
);

// Stacked card + key/value grid for an array of objects (e.g. SelectedItems, items)
// instead of a wide, overflowing table.
const ArrayOfObjectsCards = ({ items, prefix = "" }) => (
  <div className="space-y-3">
    {items.map((item, index) => {
      const cleanedItem = cleanEntries(Object.entries(item || {}));
      const discountType = findDiscountType(cleanedItem);

      return (
        <div
          key={index}
          className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 shadow-sm"
        >
          {isLineItem(item || {}) ? (
            <LineItemCard item={item} index={index} />
          ) : isPaymentItem(item || {}) ? (
            <PaymentItemCard item={item} index={index} />
          ) : (
            <>
              <div className="text-xs font-bold text-primary dark:text-light uppercase tracking-wider mb-3 pb-1 border-b border-gray-200 dark:border-gray-700">
                Item #{index + 1}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {cleanedItem.map(([itemKey, itemVal]) => (
                  <div key={itemKey} className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {formatLabel(itemKey, prefix)}
                    </span>
                    <span className="text-sm font-medium text-black dark:text-light break-words">
                      {renderFieldValue(itemKey, itemVal, prefix, discountType)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
    })}
  </div>
);

// activity_log_description is usually JSON.stringify([{ values: {...} }]),
// but fall back gracefully for a plain object, a bare object array, or free text.
const parseActivityLogDescription = (description) => {
  if (isEmptyItem(description, "") === "") {
    return { type: "empty" };
  }

  let parsed = description;

  if (typeof description === "string") {
    try {
      parsed = JSON.parse(description);
    } catch {
      return { type: "text", value: description };
    }
  }

  if (Array.isArray(parsed) && parsed.length > 0) {
    parsed = isPlainObject(parsed[0]?.values) ? parsed[0].values : parsed[0];
  }

  if (!isPlainObject(parsed)) {
    return { type: "text", value: String(parsed) };
  }

  return { type: "entries", entries: Object.entries(parsed) };
};

// Renders any value cell: primitives, arrays of objects (as stacked cards),
// arrays of primitives (as badges), and plain objects (as a mini key/value table).
const DetailValue = ({ value, prefix = "" }) => {
  if (isEmptyValue(value)) {
    return <span className="text-gray-400">&mdash;</span>;
  }

  if (Array.isArray(value)) {
    const allObjects = value.every((item) => isPlainObject(item));

    if (allObjects) {
      if (value.every(isOptionItem)) {
        return <OptionPillList items={value} />;
      }
      return <ArrayOfObjectsCards items={value} prefix={prefix} />;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {value.map((item, index) => (
          <span
            key={index}
            className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 break-all"
          >
            {isPlainObject(item) ? JSON.stringify(item) : String(item)}
          </span>
        ))}
      </div>
    );
  }

  if (isPlainObject(value)) {
    return <FieldCardGrid entries={Object.entries(value)} prefix={prefix} />;
  }

  return <span className="break-all">{String(value)}</span>;
};

// Small label-over-value cell used in the summary header grid.
const SummaryField = ({ label, children, className = "" }) => (
  <div className={`flex flex-col gap-1 min-w-0 ${className}`}>
    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-sm font-medium text-black dark:text-light capitalize break-words">
      {children}
    </span>
  </div>
);

const userInitial = (name = "") => String(name).trim().charAt(0).toUpperCase();

const ActivityLogDetailsModal = ({ itemEdit, handleClose = () => {} }) => {
  handleEscape(() => handleClose());

  const description = parseActivityLogDescription(
    itemEdit?.activity_log_description,
  );

  // Columns are usually prefixed with the menu name (e.g. "purchase_order_
  // supplier_name") — strip that repeated prefix so labels read cleanly.
  const menuPrefix = `${String(itemEdit?.activity_log_menu || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")}_`;

  // A "restore" record's payload carries its own bare menu/action — pure
  // duplicates of the Menu/Action already shown above, so drop them.
  // ("path" is dropped for every action — see NOISY_KEY_PATTERNS.)
  const isRestoreAction =
    String(itemEdit?.activity_log_action || "").toLowerCase() === "restore";
  const RESTORE_DUPLICATE_KEYS = new Set(["menu", "action"]);

  const detailEntries =
    description.type === "entries"
      ? cleanEntries(description.entries).filter(
          ([key]) =>
            !isRestoreAction ||
            !RESTORE_DUPLICATE_KEYS.has(String(key).toLowerCase()),
        )
      : [];

  // Returns get a purpose-built summary (see buildReturnSummary) instead of
  // the generic field grid — a fixed, curated set of fields in place of a
  // raw dump of the merged return/product/order record.
  const isReturnsMenu =
    String(itemEdit?.activity_log_menu || "").trim().toLowerCase() ===
    "returns-products";
  const returnSummaryFields = isReturnsMenu
    ? buildReturnSummary(
        description.type === "entries" ? Object.fromEntries(description.entries) : {},
      )
    : [];

  const fieldCount = isReturnsMenu
    ? returnSummaryFields.length
    : detailEntries.length;

  return (
    <div
      className="bg-dark/50 dark:bg-dark-mode/90 fixed inset-0 z-999 flex justify-center items-center overflow-y-auto animate-fadeIn"
      onClick={handleClose}
      data-testid="activity-log-details-backdrop"
    >
      <div
        className="p-1 min-w-[350px] animate-slideUp w-full max-w-2xl my-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-light dark:bg-gray-900 rounded-lg dark:border dark:border-gray-800 flex flex-col max-h-[90vh] shadow-xl">
          <div className="modal-header relative px-5 py-4 border-b border-gray-200 dark:border-gray-800">
            <CloseButton handleClose={handleClose} />
            <h3 className="text-dark dark:text-light text-base font-semibold">
              Activity Log Details
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
              Metadata and recorded changes for this activity
            </p>
          </div>

          <div className="p-5 overflow-y-auto flex-1">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center text-sm font-bold uppercase">
                {userInitial(itemEdit?.activity_log_user_name) || "?"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-black dark:text-light capitalize truncate">
                  {itemEdit?.activity_log_user_name || "Unknown user"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                  {itemEdit?.activity_log_user_role}
                </p>
              </div>
              <span
                className={`ml-auto shrink-0 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${activityActionPillClass(
                  itemEdit?.activity_log_action,
                )}`}
              >
                {itemEdit?.activity_log_action}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-3 mb-5">
              <SummaryField label="Menu">
                {itemEdit?.activity_log_menu}
              </SummaryField>
              <SummaryField label="Action">
                {itemEdit?.activity_log_action}
              </SummaryField>
              <SummaryField label="Date & Time" className="col-span-2 sm:col-span-1">
                {itemEdit?.activity_log_created}
              </SummaryField>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wide">
                  Details
                </p>
                {description.type === "entries" && fieldCount > 0 && (
                  <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                    &middot; {fieldCount} field{fieldCount === 1 ? "" : "s"}
                  </span>
                )}
              </div>

              {description.type === "entries" && fieldCount > 0 && (
                <div className="max-h-[60vh] overflow-y-auto pr-0.5">
                  {isReturnsMenu ? (
                    <ReturnSummaryGrid fields={returnSummaryFields} />
                  ) : (
                    <FieldCardGrid entries={detailEntries} prefix={menuPrefix} />
                  )}
                </div>
              )}

              {description.type === "text" && (
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all bg-white dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                  {description.value}
                </pre>
              )}

              {(description.type === "empty" ||
                (description.type === "entries" && fieldCount === 0)) && (
                <div className="text-center text-gray-400 dark:text-gray-500 text-sm rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-8">
                  No additional details recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogDetailsModal;
