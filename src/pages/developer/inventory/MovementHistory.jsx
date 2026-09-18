import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import WarningBanner from "@/layout/WarningBanner";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalStockOverview from "./modal/ModalStockOverview";
import { getAdminDeveloperRole } from "@/utilities/roleValidation";
import { MultiRangeDateFilter } from "@/components/inputs/InputRangeFilter";
import { MultiRangeAmountFilter } from "@/components/inputs/InputRangeFilter";
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
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={ActiveInActiveStatus("stock-type-status").map(
              (option) => option.value,
            )}
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
      filterFn: "multiDateRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter
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
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="products/read-all-by-active"
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
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter column={column} testFilterId={"filter-qty"} />
        ),
      },
    },
    {
      accessorKey: "stock_movement_before_qty",
      header: "Before",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
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
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
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
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="stock-movement/read-all-by-location?type=location"
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
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
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
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="stock-movement/read-all-by-location?type=notes"
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
