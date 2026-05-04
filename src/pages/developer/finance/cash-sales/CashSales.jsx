import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";

const CashSales = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "status",
      header: "Status",
      classTh: "w-[5rem]",
      classTd: "",
      
    },
    {
      accessorKey: "order_no",
      header: "Order #",
      classTh: "",
      classTd: "",
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
      isMobileTitle: true,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "paid",
      header: "Paid",
      classTh: "",
      classTd: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"finance"} activeTab="cash-sales">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path=""
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
    </>
  );
};

export default CashSales;
