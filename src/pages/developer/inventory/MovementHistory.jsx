import {
  SearchableSelectFilter,
  SearchableSelectFilterStatus,
} from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import WarningBanner from "@/layout/WarningBanner";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalStockOverview from "./modal/ModalStockOverview";
const MovementHistory = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "stock_movement_type",
      header: "movement status",
      classTh: "w-[10rem]",
      classTd: " uppercase ",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("stock-type-status")}
          />
        ),
      },
    },
    {
      accessorKey: "stock_movement_date",
      header: "Date",
      classTh: "",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "stock_movement_product_name",
      header: "Products",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "stock_movement_qty",
      header: "QTY",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "stock_movement_before_qty",
      header: "Before",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "stock_movement_after_qty",
      header: "After",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "stock_movement_location",
      header: "Locations",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "stock_movement_product_owner_name",
      header: "Product Owner",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilter
            column={column}
            path="product-owner/read-by-product-owner"
            testFilterId={"filter-owner"}
          />
        ),
      },
    },
    {
      accessorKey: "stock_movement_notes",
      header: "Notes",
      classTh: "",
      classTd: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"inventory"} activeTab="movement-history">
        <WarningBanner
          path="stock-movement/read-all-low-stock"
          text="products"
          description="are below low stock threshold: "
          isLowStock={true}
        />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-200px)] h-[calc(97dvh-250px)]`}
          path="stock-movement"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
          dataTestidAddButton="add-stocks-btn"
        />
      </HeaderNav>
      {store.isAdd && <ModalStockOverview itemEdit={itemEdit} />}
    </>
  );
};

export default MovementHistory;
