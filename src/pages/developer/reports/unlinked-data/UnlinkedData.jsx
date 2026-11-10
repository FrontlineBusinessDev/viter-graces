import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import HeaderNav from "@/layout/headers/HeaderNav";
import PageNotFound from "@/layout/PageNotFound";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { Trash } from "lucide-react";
import React from "react";

// Which module the record lives in, and how it is linked to the missing user.
export const unlinkedModules = [
  "Activity Log",
  "Products",
  "Sales Order",
  "Purchase Order",
  "Stock Movement",
  "Returns",
  "Installment Payment",
];
export const unlinkedLinkTypes = [
  "User",
  "Product Owner",
  "Received By",
  "Transacted By",
];

// Only records whose OWNER link is gone can be deleted. "Received By" / "Transacted By"
// rows belong to another, existing owner, so they have no delete action
// (the API refuses them too).
export const canDeleteUnlinked = (row) =>
  ["User", "Product Owner"].includes(row?.linked_as);

// Developer only: every record that still points to a user account that no
// longer exists, with a delete action for the ones that can be removed.
const UnlinkedData = () => {
  const { store } = React.useContext(StoreContext);

  const columns = [
    {
      accessorKey: "module",
      header: "module",
      classTh: "min-w-[10rem]",
      classTd: "",
      isMobileTitle: true,
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={unlinkedModules}
            testFilterId={"filter-unlinked-module"}
          />
        ),
      },
    },
    {
      accessorKey: "linked_as",
      header: "linked as",
      classTh: "min-w-[9rem]",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={unlinkedLinkTypes}
            testFilterId={"filter-unlinked-linked-as"}
          />
        ),
      },
    },
    {
      accessorKey: "reference",
      header: "reference",
      classTh: "min-w-[12rem]",
      classTd: "",
    },
    {
      accessorKey: "details",
      header: "details",
      classTh: "min-w-[14rem]",
      classTd: "",
    },
    {
      accessorKey: "missing_user_name",
      header: "deleted user",
      classTh: "min-w-[10rem]",
      classTd: "capitalize",
    },
    {
      accessorKey: "missing_user_id",
      header: "user id",
      classTh: "min-w-[6rem]",
      classTd: "",
    },
    {
      accessorKey: "record_date",
      header: "date & time",
      classTh: "min-w-[10rem]",
      classTd: "",
    },
    {
      accessorKey: "action",
      header: "action",
      classTh: "text-center w-[6rem]!",
      classTd: "text-center",
      action_array: [
        {
          name: "delete",
          path: "",
          icon: <Trash className="size-5 lg:size-4" />,
          isActive: 1,
          testId: "action-delete",
        },
      ],
      // hides the delete action on rows that cannot be deleted
      readOnlyCondition: (row) => !canDeleteUnlinked(row),
    },
  ];

  // Developer only (the API also checks this). Anyone else who types the URL gets a 404.
  if (store.credentials?.data?.role !== "developer") {
    return <PageNotFound />;
  }

  return (
    <HeaderNav menu={"reports"} activeTab="unlinked-data">
      <InfiniteTable
        columns={columns}
        className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
        path="report-sales-order/page-all-unlinked-data"
        hasExport={true}
        haveFilterTable={true}
        ishaveAdd={false}
        exportColumns={columns.filter((col) => col.accessorKey !== "action")}
      />
    </HeaderNav>
  );
};

export default UnlinkedData;
