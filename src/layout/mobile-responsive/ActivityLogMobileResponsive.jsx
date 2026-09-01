import { setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import { activityActionPillClass } from "@/pages/developer/reports/activity-log/ActivityLog";

const ActivityLogMobileResponsive = ({
  rows,
  setItemEdit,
  isDefaultMobile,
}) => {
  const { dispatch } = React.useContext(StoreContext);

  const handleView = (rowData) => {
    setItemEdit(rowData);
    dispatch(setIsView(true));
  };

  return (
    <>
      {isDefaultMobile === "activity-log/page-all-activity-log" && (
        <div>
          {rows?.map((row) => {
            const rowData = row.original;

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                <div className="flex flex-wrap gap-2 items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold capitalize inline-block bg-primary/10 text-primary dark:bg-primary/20 dark:text-light">
                    {rowData?.activity_log_menu}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize inline-block ${activityActionPillClass(
                      rowData?.activity_log_action,
                    )}`}
                  >
                    {rowData?.activity_log_action}
                  </span>
                </div>

                <ul className="text-xs [&>li]:flex [&>li]:justify-between [&>li]:py-1 [&>li]:border-b [&>li]:border-b-gray-200 dark:[&>li]:border-b-gray-700">
                  <li>
                    <span className="text-gray-500">User</span>
                    <span className="capitalize text-black dark:text-light">
                      {rowData?.activity_log_user_name}
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500">Role</span>
                    <span className="capitalize text-black dark:text-light">
                      {rowData?.activity_log_user_role}
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500">Date &amp; Time</span>
                    <span className="text-black dark:text-light">
                      {rowData?.activity_log_created}
                    </span>
                  </li>
                </ul>

                <div className="pt-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleView(rowData)}
                    className="text-primary hover:underline font-semibold text-xs cursor-pointer"
                    data-testid="action-view-details"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ActivityLogMobileResponsive;
