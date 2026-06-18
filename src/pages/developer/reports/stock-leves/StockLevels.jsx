import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";

const StockLevels = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "products_status",
      header: "status",
      classTh: "w-[8rem]",
      classTd: "",
      status_option: ActiveInActiveStatus(),
    },
    {
      accessorKey: "products_name",
      header: "products",
      classTh: "",
      classTd: "capitalize ",
      isMobileTitle: true,
    },
    {
      accessorKey: "products_sku",
      header: "sku",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "products_unit",
      header: "category",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "current_qty",
      header: "stock",
      classTh: "",
      classTd: "uppercase ",
    },
    {
      accessorKey: "products_price",
      header: "price",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "stock_movement_location",
      header: "location",
      classTh: "",
      classTd: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="stock-levels">
        <ReportsStats />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="stock-overview"
          hasExport={true}
          setItemEdit={setItemEdit}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default StockLevels;
