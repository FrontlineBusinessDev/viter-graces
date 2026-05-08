import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { Eye } from "lucide-react";
import React from "react";

const SalesJournal = () => {
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
      accessorKey: "reference_no",
      header: "Reference #",
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
      accessorKey: "account",
      header: "Account",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "type",
      header: "Type",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "debit",
      header: "Debit",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "credit",
      header: "Credit",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "balance",
      header: "Balance",
      classTh: "",
      classTd: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"finance"} activeTab="sales-journal">
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

export default SalesJournal;
