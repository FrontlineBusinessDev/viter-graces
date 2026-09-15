import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ActivityLogDetailsModal from "./ActivityLogDetailsModal";
import { MultiRangeDateFilter } from "@/components/inputs/InputRangeFilter";
import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import { isEmptyItem } from "@/utilities/isEmptyItem";

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

// Turns "field_name" / "fieldName" into "Field Name".
const formatDescriptionLabel = (key = "") =>
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatDescriptionEntries = (obj) =>
  Object.entries(obj)
    .map(([key, value]) => {
      const formatted = formatDescriptionValue(value);
      return formatted === null
        ? null
        : `${formatDescriptionLabel(key)}: ${formatted}`;
    })
    .filter(Boolean)
    .join(", ");

function formatDescriptionValue(value) {
  if (isEmptyItem(value, "") === "") return null;
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        item !== null && typeof item === "object"
          ? formatDescriptionEntries(item)
          : String(item),
      )
      .join(" | ");
  }
  if (typeof value === "object") return formatDescriptionEntries(value);
  return String(value);
}

// activity_log_description is raw JSON (usually [{ values: {...} }]) - turn
// it into a readable "Label: value, Label: value" line for the CSV export,
// same shape the "View Details" modal parses.
const formatDescriptionForExport = (description) => {
  if (isEmptyItem(description, "") === "") return "";

  let parsed = description;
  if (typeof description === "string") {
    try {
      parsed = JSON.parse(description);
    } catch {
      return description;
    }
  }

  if (Array.isArray(parsed) && parsed.length > 0) {
    const first = parsed[0];
    parsed = first && typeof first.values === "object" ? first.values : first;
  }

  if (parsed === null || typeof parsed !== "object") return String(parsed);

  return formatDescriptionEntries(parsed);
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
      classTh: "min-w-[8rem]",
      classTd: "",
      isMobileTitle: true,
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="activity/activity-log-filter?type=log-menu"
            testFilterId={"filter-activity-log-menu"}
          />
        ),
      },
    },
    {
      accessorKey: "activity_log_action",
      header: "action",
      classTh: "min-w-[8rem]",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="activity/activity-log-filter?type=log-action"
            testFilterId={"filter-activity-log-action"}
          />
        ),
      },
    },
    {
      accessorKey: "activity_log_user_name",
      header: "user",
      classTh: "min-w-[10rem]",
      classTd: "capitalize",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="activity/activity-log-filter?type=log-user"
            testFilterId={"filter-activity-log-user"}
          />
        ),
      },
    },
    {
      accessorKey: "activity_log_user_role",
      header: "role",
      classTh: "min-w-[8rem]",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="activity/activity-log-filter?type=log-role"
            testFilterId={"filter-activity-log-role"}
          />
        ),
      },
    },
    {
      accessorKey: "activity_log_created",
      header: "date & time",
      filterFn: "multiDateRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter
            column={column}
            testFilterId={"filter-activity-date"}
          />
        ),
      },
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

  // "Details" (the raw activity_log_description) isn't shown as a table
  // column - it only ever makes sense once formatted, so it's export-only.
  const exportColumns = [
    ...columns.filter((col) => col.accessorKey !== "view_details"),
    {
      accessorKey: "activity_log_description",
      header: "details",
      formatExport: formatDescriptionForExport,
    },
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="activity-log">
        <InfiniteTable
          columns={columns}
          exportColumns={exportColumns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="activity-log/page-all-activity-log"
          hasExport={true}
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
