import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalReturns from "./ModalReturns";

const Returns = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "status",
      header: "status",
      classTh: "w-[5rem]",
      classTd: "",
    },
    {
      accessorKey: "return_no",
      header: "return #",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "date",
      header: "date",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "order_no",
      header: "order #",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer",
      header: "customer",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "amount",
      header: "amount",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "reason",
      header: "reason",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "restocked",
      header: "restocked",
      classTh: "",
      classTd: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"returns"} activeTab="returns">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="Process Returns"
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <ModalReturns itemEdit={itemEdit} />}
    </>
  );
};

export default Returns;
