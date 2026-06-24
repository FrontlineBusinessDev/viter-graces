import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";

const StockLevels = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  // Columns
  const columns = [
    {
      accessorKey: "products_status",
      header: "status",
      classTh: "w-[10rem]! p-0!",
      classTd: "",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("default-status-words")}
          />
        ),
      },
      status_option: ActiveInActiveStatus("default-status-words"),
    },
    {
      accessorKey: "products_name",
      header: "products",
      filterFn: "",
      meta: "",
      classTh: "",
      classTd: "capitalize ",
      isMobileTitle: true,
    },
    {
      accessorKey: "products_sku",
      header: "sku",
      filterFn: "",
      meta: "",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "products_unit",
      header: "category",
      filterFn: "",
      meta: "",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "current_qty",
      header: "stock",
      filterFn: "between",
      meta: "",
      classTh: "",
      classTd: "uppercase ",
    },
    {
      accessorKey: "products_price",
      header: "price",
      filterFn: "between",
      meta: "",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "stock_movement_location",
      header: "location",
      filterFn: "",
      meta: "",
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
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="report-sales-order/page-stock-level"
          hasExport={true}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default StockLevels;
