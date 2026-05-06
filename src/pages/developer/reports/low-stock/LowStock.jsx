import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";

const LowStock = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "status",
      header: "Status",
      classTh: "w-[8rem]",
      classTd: "",
    },
    {
      accessorKey: "products",
      header: "Products",
      classTh: "",
      classTd: "",
      isMobileTitle: true,
    },
    {
      accessorKey: "sku",
      header: "SKU",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "category",
      header: "Category",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "stock",
      header: "Stock",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "price",
      header: "Price",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "location",
      header: "Location",
      classTh: "",
      classTd: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="low-stock">
        <ReportsStats />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path=""
          hasExport={true}
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
    </>
  );
};

export default LowStock;
