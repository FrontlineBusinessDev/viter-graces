import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";

const OverduePayments = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  // Columns
  const columns = [
    {
      accessorKey: "status",
      header: "Status",
      classTh: "w-[8rem]",
      classTd: "",
    },
    {
      accessorKey: "order_no",
      header: "Order #",
      classTh: "",
      classTd: "",
      isMobileTitle: true,
    },
    {
      accessorKey: "date",
      header: "Date",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer",
      header: "Customer",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "method",
      header: "Method",
      classTh: "",
      classTd: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="overdue-payments">
        <ReportsStats />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="report-sales-order/page-all-low-stock"
          hasExport={true}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default OverduePayments;
