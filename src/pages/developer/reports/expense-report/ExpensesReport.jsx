import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";

const ExpensesReport = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "date",
      header: "Date",
      classTh: "w-[8rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "decription",
      header: "Description",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "category",
      header: "Category",
      classTh: "",
      classTd: "",
      isMobileTitle: true,
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
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path=""
          hasExport={true}
          setItemEdit={setItemEdit}
          haveFilterTable={true}
        />
      </HeaderNav>
    </>
  );
};

export default ExpensesReport;
