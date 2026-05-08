import { DefaultActionTableList } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalExpenses from "./ModalExpenses";

const Expenses = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [isView, setView] = React.useState(false);

  const handleView = (item) => {
    setView(true);
    setItemEdit(item);
  };

  // Columns
  const columns = [
    {
      accessorKey: "supplier",
      header: "Supplier",
      classTh: "w-[5rem]",
      classTd: "",
      isMobileTitle: true,
    },
    {
      accessorKey: "category",
      header: "Category",
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
      accessorKey: "vat",
      header: "VAT",
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
      accessorKey: "method",
      header: "Method",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "product_owner",
      header: "Product Owner",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: DefaultActionTableList(),
      header: "Action",
      classTh: " text-center ",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  return (
    <>
      <HeaderNav menu={"finance"} activeTab="expenses">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="Expenses"
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <ModalExpenses itemEdit={itemEdit} />}
    </>
  );
};

export default Expenses;
