import {
  SearchableSelectFilter,
  SearchableSelectFilterStatus,
} from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import React from "react";
import ReportsStats from "../ReportsStats";

const LowStock = () => {
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
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilter
            column={column}
            path="products/read-all-by-active"
            testFilterId={"filter-product-name"}
          />
        ),
      },
      classTh: "min-w-40",
      classTd: "capitalize ",
      isMobileTitle: true,
    },
    {
      accessorKey: "products_sku",
      header: "sku",
      filterFn: "",
      meta: "",
      classTh: "min-w-40",
      classTd: "",
    },
    {
      accessorKey: "current_qty",
      header: "current stock",
      filterFn: "between",
      meta: "",
      classTh: "min-w-40",
      classTd: "uppercase ",
    },
    {
      accessorKey: "products_unit",
      header: "unit",
      filterFn: "",
      meta: "",
      classTh: "min-w-40",
      classTd: "",
    },
    {
      accessorKey: "products_low_stock_threshold",
      header: "threshold",
      filterFn: "between",
      meta: "",
      classTh: "min-w-40",
      classTd: "",
    },
    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
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
        ]),
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="low-stock">
        <ReportsStats />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="report-sales-order/page-all-low-stock"
          hasExport={true}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default LowStock;
