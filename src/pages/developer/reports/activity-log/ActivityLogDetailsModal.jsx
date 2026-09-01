import CloseButton from "@/components/buttons/CloseButton";
import { handleEscape } from "@/utilities/handleEscape";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";
import { activityActionPillClass } from "./ActivityLog";

const formatLabel = (key = "") =>
  key
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// Stacked card + key/value grid for an array of objects (e.g. SelectedItems, items)
// instead of a wide, overflowing table.
const ArrayOfObjectsCards = ({ items }) => (
  <div className="space-y-3">
    {items.map((item, index) => (
      <div
        key={index}
        className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
      >
        <div className="text-xs font-bold text-primary dark:text-light uppercase tracking-wider mb-3 pb-1 border-b border-gray-200 dark:border-gray-700">
          Item #{index + 1}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(item || {}).map(([itemKey, itemVal]) => (
            <div key={itemKey} className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {formatLabel(itemKey)}
              </span>
              <span className="text-sm font-medium text-black dark:text-light break-words">
                <DetailValue value={itemVal} />
              </span>
            </div>
          ))}
        </div>
      </div>
    ))}
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

const NULL_LIKE = new Set(["null", "undefined", "n/a", "na"]);

// Renders any value cell: primitives, arrays of objects (as stacked cards),
// arrays of primitives (as badges), and plain objects (as a mini key/value table).
const DetailValue = ({ value }) => {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === "string" && NULL_LIKE.has(value.trim().toLowerCase()))
  ) {
    return <span className="text-gray-400">&mdash;</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-400">&mdash;</span>;

    const allObjects = value.every((item) => isPlainObject(item));

    if (allObjects) {
      return <ArrayOfObjectsCards items={value} />;
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
    return (
      <table className="w-full text-left text-xs rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {Object.entries(value).map(([key, val]) => (
            <tr key={key}>
              <td className="px-2 py-1 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap align-top capitalize">
                {formatLabel(key)}
              </td>
              <td className="px-2 py-1 break-all text-gray-600 dark:text-gray-300">
                <DetailValue value={val} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return <span className="break-all">{String(value)}</span>;
};

const ActivityLogDetailsModal = ({ itemEdit, handleClose = () => {} }) => {
  handleEscape(() => handleClose());

  const description = parseActivityLogDescription(
    itemEdit?.activity_log_description,
  );

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
        <div className="bg-light dark:bg-gray-900 rounded-lg dark:border dark:border-gray-800 flex flex-col max-h-[90vh]">
          <div className="modal-header relative p-4">
            <CloseButton handleClose={handleClose} />
            <h3 className="text-dark dark:text-light text-sm">
              Activity Log Details
            </h3>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <ul className="grid grid-cols-2 [&>li]:flex [&>li]:flex-col [&>li]:gap-1 gap-y-3 mb-4">
              <li>
                <p className="text-gray-500 text-xs">Menu</p>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize inline-block w-fit bg-primary/10 text-primary dark:bg-primary/20 dark:text-light`}
                >
                  {itemEdit?.activity_log_menu}
                </span>
              </li>
              <li>
                <p className="text-gray-500 text-xs">Action</p>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize inline-block w-fit ${activityActionPillClass(
                    itemEdit?.activity_log_action,
                  )}`}
                >
                  {itemEdit?.activity_log_action}
                </span>
              </li>
              <li>
                <p className="text-gray-500 text-xs">User</p>
                <p className="text-black dark:text-light capitalize">
                  {itemEdit?.activity_log_user_name}
                </p>
              </li>
              <li>
                <p className="text-gray-500 text-xs">Role</p>
                <p className="text-black dark:text-light capitalize">
                  {itemEdit?.activity_log_user_role}
                </p>
              </li>
              <li className="col-span-2">
                <p className="text-gray-500 text-xs">Date &amp; Time</p>
                <p className="text-black dark:text-light">
                  {itemEdit?.activity_log_created}
                </p>
              </li>
            </ul>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <p className="text-gray-500 text-xs mb-2">Details</p>

              {description.type === "entries" && (
                <div className="max-h-[70vh] overflow-y-auto overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-[#0b111e] uppercase text-xs text-gray-500 dark:text-gray-400">
                      <tr>
                        <th className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 w-2/5">
                          Field
                        </th>
                        <th className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-700">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {description.entries.map(([key, value], index) => (
                        <tr
                          key={index}
                          className="odd:bg-transparent even:bg-gray-50 dark:even:bg-gray-800/40 hover:bg-primary/5 dark:hover:bg-primary/10"
                        >
                          <td className="px-4 py-2.5 font-medium text-black dark:text-light capitalize align-top whitespace-nowrap">
                            {formatLabel(key)}
                          </td>
                          <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300 break-all align-top">
                            <DetailValue value={value} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {description.type === "text" && (
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all bg-gray-50 dark:bg-[#0b111e] rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  {description.value}
                </pre>
              )}

              {description.type === "empty" && (
                <p className="text-gray-500 text-sm">
                  No additional details recorded.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogDetailsModal;
