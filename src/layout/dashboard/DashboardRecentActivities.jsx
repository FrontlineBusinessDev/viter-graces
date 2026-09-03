import NoData from "@/components/NoData";
import ServerError from "@/components/ServerError";
import TableLoading from "@/components/spinners/TableLoading";
import { apiVersion, devNavUrl } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import React, { useMemo } from "react";
const DashboardRecentActivities = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const userRole = store.credentials?.data?.role;

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

  const valData = useMemo(() => {
    return result?.data;
  }, [result]);

  return (
    <>
      <div
        className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow relative"
        data-testid="recent-activities"
      >
        <h2 className="font-semibold text-sm mb-4 text-black dark:text-light">
          Recent Activities
        </h2>
        <ul className="space-y-3">
          {isLoading ? (
            <li>
              <TableLoading count={15} cols={1} />
            </li>
          ) : error ? (
            <li>
              <ServerError />
            </li>
          ) : valData?.length > 0 ? (
            valData?.map((item, key) => {
              return (
                <li key={key} className="flex flex-col">
                  <div className="flex items-center gap-1 capitalize">
                    <p className="mb-1!">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block mr-1"></span>
                      {item?.activity_log_user_name}
                      <span className="mx-2 lowercase ">
                        ({item?.activity_log_user_role} role)
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-1 items-center ml-3">
                    <span
                      className={`px-2 rounded-full text-[11px]! font-bold capitalize  ${
                        item?.type === "sales"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-500 dark:text-blue-200"
                          : "bg-orange-100 text-orange-600 dark:bg-orange-500 dark:text-orange-200"
                      }`}
                    >
                      {item?.activity_log_menu}
                    </span>
                    <span className="lowercase text-[11px]! font-semibold">
                      {item?.activity_log_action}
                    </span>
                    <span className="text-gray-400 text-[11px]!">
                      {Number(item?.days_ago) > 0
                        ? `${item?.days_ago} day(s) ago`
                        : "now"}
                    </span>
                  </div>
                </li>
              );
            })
          ) : (
            <li>
              <NoData />
            </li>
          )}
        </ul>
        {store.credentials?.data?.role === "developer" ? (
          <>
            {valData?.length > 0 ? (
              <a
                data-testid="recent-activities-btn-to-view"
                href={`${devNavUrl}/${userRole}/activity-log`}
                className="absolute bottom-3 text-orange-500 pt-3 inline-block"
              >
                Click to view →
              </a>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default DashboardRecentActivities;
