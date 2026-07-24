import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import {
  SearchableSelectFilter,
  SearchableSelectFilterStatus,
} from "@/components/inputs/InputSelect";
import { Amount } from "@/components/PesoSign";

const ExpensesReport = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  // Columns
  const columns = [
    {
      accessorKey: "payment_status",
      header: "payment status",
      classTh: "min-w-[9rem]",
      classTd: "min-w-[9rem]",
      status_option: ActiveInActiveStatus("purchase-order-payment-status"),
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("purchase-order-payment-status")}
          />
        ),
      },
    },
    {
      accessorKey: "purchase_order_number",
      header: "PO Number",
      orderNumber: "1",
      classTh: "min-w-[5rem] ",
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
      accessorKey: "purchase_order_product_name",
      header: "Product",
      classTh: "w-[10rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "purchase_order_note",
      header: "Description",
      classTh: "w-[20rem]",
      classTd: "truncate block! w-[20rem]",
      meta: "",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      amount: true,
      classTh: "",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
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
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="expenses-report">
        <ReportsStats />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="report-sales-order/page-all-expenses"
          hasExport={true}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default ExpensesReport;
