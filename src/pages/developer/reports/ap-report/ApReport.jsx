import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";
import { SearchableSelectFilter } from "@/components/inputs/InputSelect";
import { ProductOwnerId } from "@/utilities/productOwnerToken";

const ApReport = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  //
  // Columns
  const columns = [
    {
      accessorKey: "purchase_order_number",
      header: "PO Number",
      orderNumber: "1",
      classTh: "min-w-[8rem] ",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "purchase_order_product_name",
      header: "Product",
      classTh: "min-w-[20rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "purchase_order_date",
      header: "Order Date",
      filterFn: "date",
      classTh: "w-[8rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "purchase_order_total_balance_per_product",
      header: "balance",
      amount: true,
      classTh: "min-w-[20rem]",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
          {
            accessorKey: "purchase_order_product_owner_name",
            header: "Product Owner",
            classTh: "min-w-[10rem]",
            classTd: "",
            meta: {
              filterComponent: (column) => (
                <SearchableSelectFilter
                  column={column}
                  path="product-owner/read-by-product-owner"
                  testFilterId={"filter-owner"}
                />
              ),
            },
          },
        ]),
    {
      accessorKey: "purchase_order_note",
      header: "Note",
      classTh: "w-[20rem]",
      classTd: "truncate block! w-[20rem]",
      meta: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="AP-report">
        <ReportsStats />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="report-sales-order/page-all-account-payable"
          hasExport={true}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default ApReport;
