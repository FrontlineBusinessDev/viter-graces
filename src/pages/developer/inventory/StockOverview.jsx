import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import WarningBanner from "@/layout/WarningBanner";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalStockOverview from "./modal/ModalStockOverview";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { MultiRangeAmountFilter } from "@/components/inputs/InputRangeFilter";
const StockOverview = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  let stockArray = [{ label: "low stock", value: "low stock" }];

  // Columns
  const columns = [
    {
      accessorKey: "inventory_status",
      header: "status",
      classTh: "min-w-[8rem]",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={ActiveInActiveStatus("stock-overview").map(
              (option) => option.value,
            )}
            testFilterId={"filter-status"}
          />
        ),
      },
      status_option: ActiveInActiveStatus("stock-overview"),
    },
    {
      accessorKey: "products_name",
      header: "Products",
      classTh: "min-w-40",
      classTd: "",
      isMobileTitle: true,
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
      isTag: true,
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
      accessorKey: "stock_movement_location",
      header: "Location",
      classTh: "min-w-40",
      classTd: "line-clamp-2 max-w-40",
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
      accessorKey: "current_qty",
      header: "Current Stock",
      filterFn: "multiRange",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-current-stock"}
          />
        ),
      },
    },
    {
      accessorKey: "products_low_stock_threshold",
      header: "Threshold",
      filterFn: "multiRange",
      classTh: "min-w-[10rem]",
      classTd: "",
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
      accessorKey: "products_unit",
      header: "Unit",
      classTh: "min-w-[5rem]",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="products/read-all-by-filters?type=unit"
            testFilterId={"filter-product-sku"}
          />
        ),
      },
    },
    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
          {
            accessorKey: "products_owner_name",
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
      <HeaderNav menu={"inventory"} activeTab="stock-overview">
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
          path="stock-overview"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
          ishaveAdd={false}
          isDefaultMobile={"stock movement"}
          defaultSearch={true}
          refetchOnWindowFocus={true}
        />
      </HeaderNav>
      {store.isAdd && <ModalStockOverview itemEdit={itemEdit} />}
    </>
  );
};

export default StockOverview;
