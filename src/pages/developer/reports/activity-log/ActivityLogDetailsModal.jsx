import CloseButton from "@/components/buttons/CloseButton";
import { getConvertStringToJSONparseData } from "@/utilities/getConvertStringToJSONparseData";
import { handleEscape } from "@/utilities/handleEscape";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";
import { activityActionPillClass } from "./ActivityLog";

const formatLabel = (key = "") =>
  key.replaceAll("_", " ").replaceAll("-", " ");

const formatDetailValue = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

// activity_log_description is stored as JSON.stringify([{ values: {...} }])
const getDescriptionEntries = (description) => {
  const parsed = getConvertStringToJSONparseData(description);

  if (!Array.isArray(parsed) || parsed.length === 0) return [];

  const source = parsed[0]?.values ?? parsed[0] ?? {};

  return Object.entries(source)
    .map(([key, value]) => [key, formatDetailValue(value)])
    .filter(([, value]) => value !== null);
};

const ActivityLogDetailsModal = ({ itemEdit, handleClose = () => {} }) => {
  handleEscape(() => handleClose());

  const details = getDescriptionEntries(itemEdit?.activity_log_description);

  return (
    <div
      className="bg-dark/50 dark:bg-dark-mode/90 fixed inset-0 z-999 flex justify-center items-center overflow-y-auto animate-fadeIn"
      onClick={handleClose}
      data-testid="activity-log-details-backdrop"
    >
      <div
        className="p-1 min-w-[350px] animate-slideUp w-full max-w-lg my-10"
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

              {details.length > 0 ? (
                <ul className="[&>li]:border-b [&>li]:border-b-gray-200 dark:[&>li]:border-b-gray-700 [&>li]:py-1.5 [&>li]:grid [&>li]:grid-cols-2 [&>li]:gap-2">
                  {details.map(([key, value], index) => (
                    <li key={index}>
                      <span className="text-gray-500 capitalize">
                        {formatLabel(key)}
                      </span>
                      <span className="text-black dark:text-light text-right wrap-break-word">
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  {isEmptyItem(
                    itemEdit?.activity_log_description,
                    "No additional details recorded.",
                  )}
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
