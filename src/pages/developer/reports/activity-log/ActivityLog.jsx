import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ActivityLogDetailsModal from "./ActivityLogDetailsModal";

// pill color per activity action word
export const activityActionPillClass = (action = "") => {
  const value = String(action).toLowerCase();

  if (value.includes("delete")) {
    return "bg-red-100 text-red-600 dark:bg-red-500 dark:text-red-100";
  }
  if (value.includes("update") || value.includes("edit")) {
    return "bg-blue-100 text-blue-600 dark:bg-blue-500 dark:text-blue-100";
  }
  if (value.includes("create") || value.includes("add")) {
    return "bg-green-100 text-green-700 dark:bg-green-600 dark:text-green-100";
  }
  return "bg-gray-100 text-gray-600 dark:bg-gray-500 dark:text-gray-100";
};

const ActivityLog = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  const handleView = (rowData) => {
    setItemEdit(rowData);
    dispatch(setIsView(true));
  };

  const columns = [
    {
      accessorKey: "activity_log_menu",
      header: "menu",
      filterFn: "",
      meta: "",
      classTh: "min-w-[8rem]",
      classTd: "",
      isMobileTitle: true,
      // cell: (info) => (
      //   <span
      //     className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize inline-block bg-primary/10 text-primary dark:bg-primary/20 dark:text-light`}
      //   >
      //     {info.getValue()}
      //   </span>
      // ),
    },
    {
      accessorKey: "activity_log_action",
      header: "action",
      filterFn: "",
      meta: "",
      classTh: "min-w-[8rem]",
      classTd: "",
      // cell: (info) => (
      //   <span
      //     className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize inline-block ${activityActionPillClass(
      //       info.getValue(),
      //     )}`}
      //   >
      //     {info.getValue()}
      //   </span>
      // ),
    },
    {
      accessorKey: "activity_log_user_name",
      header: "user",
      filterFn: "",
      meta: "",
      classTh: "min-w-[10rem]",
      classTd: "capitalize",
    },
    {
      accessorKey: "activity_log_user_role",
      header: "role",
      filterFn: "",
      meta: "",
      classTh: "min-w-[8rem]",
      classTd: "",
      // cell: (info) => (
      //   <span className="px-2 py-0.5 rounded-full text-xs font-bold capitalize inline-block bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-light">
      //     {info.getValue()}
      //   </span>
      // ),
    },
    {
      accessorKey: "activity_log_created",
      header: "date & time",
      filterFn: "date",
      meta: "",
      classTh: "min-w-[10rem]",
      classTd: "",
    },
    {
      accessorKey: "view_details",
      header: "view details",
      classTh: "text-center w-[8rem]!",
      classTd: "text-center",
      cell: (info) => (
        <button
          type="button"
          onClick={() => handleView(info.row.original)}
          className="text-primary hover:underline font-semibold text-xs cursor-pointer"
          data-testid="action-view-details"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="activity-log">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="activity-log/page-all-activity-log"
          haveFilterTable={true}
          ishaveAdd={false}
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isView && (
        <ActivityLogDetailsModal
          itemEdit={itemEdit}
          handleClose={() => dispatch(setIsView(false))}
        />
      )}
    </>
  );
};

export default ActivityLog;
