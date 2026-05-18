import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
const DashboardRecentActivities = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  const {
    isLoading,
    isFetching,
    error,
    data: result,
  } = useQueryData(
    `${apiVersion}/activity/read-with-limit`, // endpoint
    "post", // method
    `activity/read-with-limit`, // key
    { limit: 6 },
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
        <h2 className="font-semibold text-sm mb-4 text-black dark:text-light">
          Recent Activities
        </h2>
        <ul className="space-y-3">
          {result?.data?.map((item, key) => {
            return (
              <li key={key} className="flex flex-col">
                <div className="flex items-center gap-3 capitalize">
                  <p>
                    <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block mr-1"></span>
                    {item?.activity_log_user_name}
                    <span className="mx-2 uppercase ">
                      {item?.activity_log_action}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 items-center ml-3">
                  <span
                    className={`px-2 rounded-full text-xs font-bold capitalize  ${
                      item?.type === "sales"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-500 dark:text-blue-200"
                        : "bg-orange-100 text-orange-600 dark:bg-orange-500 dark:text-orange-200"
                    }`}
                  >
                    {item?.activity_log_menu}
                  </span>
                  <span className="lowercase">
                    ({item?.activity_log_user_role} role)
                  </span>
                  <span className="text-gray-400 text-xs">
                    {Number(item?.days_ago) > 0
                      ? `${item?.days_ago} days ago`
                      : "now"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default DashboardRecentActivities;
