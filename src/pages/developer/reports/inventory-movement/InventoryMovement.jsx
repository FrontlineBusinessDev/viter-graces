import {
  SearchableSelectFilter,
  SearchableSelectFilterStatus,
} from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";

const InventoryMovement = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  // Columns
  const columns = [
    {
      accessorKey: "stock_movement_type",
      header: "status",
      classTh: "w-[10rem]",
      classTd: "",
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
      accessorKey: "stock_movement_product_name",
      header: "Products",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "products_sku",
      header: "SKU",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "products_category",
      header: "Category",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "stock_movement_after_qty",
      header: "Stock Quantity",
      classTh: "",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "products_low_stock_threshold",
      header: "Threshold",
      classTh: "",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "products_price",
      header: "Price",
      amount: true,
      classTh: "",
      classTd: "",
      filterFn: "between",
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
