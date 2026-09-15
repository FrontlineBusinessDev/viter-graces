import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";
import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import {
  MultiRangeAmountFilter,
  MultiRangeDateFilter,
} from "@/components/inputs/InputRangeFilter";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";

const ApReport = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  //
  // Columns
  const columns = [
    {
      accessorKey: "payment_status",
      header: "payment status",
      classTh: "min-w-[9rem]",
      classTd: "min-w-[9rem]",
      status_option: ActiveInActiveStatus("purchase-order-payment-status"),
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={ActiveInActiveStatus(
              "purchase-order-payment-status",
            ).map((option) => option.value)}
            testFilterId={"filter-status"}
          />
        ),
      },
    },
    {
      accessorKey: "purchase_order_number",
      header: "PO Number",
      orderNumber: "1",
      classTh: "min-w-[8rem] ",
      classTd: "",
      meta: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="purchase-order/read-group-by-filter?type=poNumberSupplier"
            testFilterId={"filter-order-number"}
          />
        ),
      },
    },
    {
      accessorKey: "purchase_order_product_name",
      header: "Products",
      classTh: "min-w-[20rem]",
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
      accessorKey: "purchase_order_supplier_name",
      header: "Supplier",
      classTh: "min-w-[20rem]",
      classTd: "",
      meta: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="suppliers"
            // path="suppliers/read-group-by-filter"
            testFilterId={"filter-supplier"}
          />
        ),
      },
    },
    {
      accessorKey: "purchase_order_date",
      header: "Order Date",
      filterFn: "multiDateRange",
      classTh: "min-w-[8rem]",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter
            column={column}
            testFilterId={"filter-order-date"}
          />
        ),
      },
    },
    {
      accessorKey: "purchase_order_total_balance_per_product",
      header: "balance",
      amount: true,
      classTh: "min-w-[20rem]",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-balance"}
          />
        ),
      },
    },
    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
          {
            accessorKey: "purchase_order_product_owner_name",
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
    {
      accessorKey: "purchase_order_note",
      header: "Note",
      classTh: "w-[20rem]",
      classTd: "truncate block! w-[20rem]",
      meta: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="AP-report">
        <ReportsStats />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="report-sales-order/page-all-account-payable"
          hasExport={true}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default ApReport;
