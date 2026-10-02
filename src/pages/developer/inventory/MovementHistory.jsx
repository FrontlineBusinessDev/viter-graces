import {
  DateOperatorFilter,
  NumberOperatorFilter,
  TextOperatorFilter,
} from "@/components/inputs/InputOperatorFilter";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import WarningBanner from "@/layout/WarningBanner";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalStockOverview from "./modal/ModalStockOverview";
import { getAdminDeveloperRole } from "@/utilities/roleValidation";
const MovementHistory = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "stock_movement_type",
      header: "status",
      classTh: "w-[10rem]",
      classTd: " uppercase ",
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <TextOperatorFilter
            column={column}
            testFilterId={"filter-status"}
          />
        ),
      },
    },
    {
      accessorKey: "stock_movement_date",
      header: "Date",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <DateOperatorFilter
            column={column}
            testFilterId={"filter-movement-date"}
          />
        ),
      },
    },
    {
      accessorKey: "stock_movement_product_name",
      header: "Products",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <TextOperatorFilter
            column={column}
            testFilterId={"filter-product-name"}
          />
        ),
      },
    },
    {
      accessorKey: "stock_movement_qty",
      header: "QTY",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <NumberOperatorFilter column={column} testFilterId={"filter-qty"} />
        ),
      },
    },
    {
      accessorKey: "stock_movement_before_qty",
      header: "Before",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <NumberOperatorFilter
            column={column}
            testFilterId={"filter-before"}
          />
        ),
      },
    },
    {
      accessorKey: "stock_movement_after_qty",
      header: "After",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <NumberOperatorFilter
            column={column}
            testFilterId={"filter-after"}
          />
        ),
      },
    },
    {
      accessorKey: "stock_movement_location",
      header: "Location",
      classTh: "min-w-40",
      classTd: " line-clamp-2 max-w-40",
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <TextOperatorFilter
            column={column}
            testFilterId={"filter-product-location"}
          />
        ),
      },
    },
    {
      accessorKey: "stock_movement_product_owner_name",
      header: "Product Owner",
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <TextOperatorFilter
            column={column}
            testFilterId={"filter-owner"}
          />
        ),
      },
    },
    {
      accessorKey: "stock_movement_notes",
      header: "Notes",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <TextOperatorFilter
            column={column}
            testFilterId={"filter-product-notes"}
          />
        ),
      },
    },
  ];

  return (
    <>
      <HeaderNav menu={"inventory"} activeTab="movement-history">
        <WarningBanner
          path="stock-movement/read-all-low-stock"
          text="products"
          description="are below low stock threshold"
          isLowStock={true}
          color="orange"
        />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-295px)] h-[calc(97dvh-250px)]`}
          path="stock-movement"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
          ishaveAdd={getAdminDeveloperRole(store)}
          dataTestidAddButton="add-stocks-btn"
        />
      </HeaderNav>
      {store.isAdd && <ModalStockOverview itemEdit={itemEdit} />}
    </>
  );
};

export default MovementHistory;
