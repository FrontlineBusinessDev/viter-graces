import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import React from "react";
import ReportsStats from "../ReportsStats";
import { MultiRangeAmountFilter } from "@/components/inputs/InputRangeFilter";

const InventoryMovement = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  // Columns
  const columns = [
    {
      accessorKey: "stock_movement_type",
      header: "status",
      classTh: "w-[10rem]",
      classTd: "",
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
      accessorKey: "products_sku",
      header: "SKU",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="products/read-all-by-filters?type=sku"
            testFilterId={"filter-product-sku"}
          />
        ),
      },
    },
    {
      accessorKey: "products_category",
      header: "Category",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="products/read-all-by-filters?type=category"
            testFilterId={"filter-category"}
          />
        ),
      },
    },
    {
      accessorKey: "stock_movement_after_qty",
      header: "Stock Quantity",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-stock-qty"}
          />
        ),
      },
    },
    {
      accessorKey: "products_low_stock_threshold",
      header: "Threshold",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-threshold"}
          />
        ),
      },
    },
    {
      accessorKey: "products_price",
      header: "Price",
      amount: true,
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-price"}
          />
        ),
      },
    },
    {
      accessorKey: "stock_movement_location",
      header: "Location",
      classTh: "min-w-40",
      classTd: "",
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
    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
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
        ]),
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="inventory-movement">
        <ReportsStats />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="report-sales-order/page-all-inventory-movement"
          hasExport={true}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default InventoryMovement;
