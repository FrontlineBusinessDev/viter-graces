import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";

const ExpensesReport = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  // Columns
  const columns = [
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
      classTh: "w-[8rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "purchase_order_note",
      header: "Description",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "method",
      header: "Method",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "product_owner",
      header: "Product Owner",
      classTh: "",
      classTd: "",
      meta: "",
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
