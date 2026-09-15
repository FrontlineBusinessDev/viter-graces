import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import { Amount } from "@/components/PesoSign";
import {
  MultiRangeAmountFilter,
  MultiRangeDateFilter,
} from "@/components/inputs/InputRangeFilter";

const ExpensesReport = () => {
  const { store, dispatch } = React.useContext(StoreContext);

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
      accessorKey: "purchase_order_date",
      header: "Transaction Date",
      filterFn: "multiDateRange",
      classTh: "w-[8rem]",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter
            column={column}
            testFilterId={"filter-transaction-date"}
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
      accessorKey: "purchase_order_note",
      header: "Description",
      classTh: "w-[20rem]",
      classTd: "truncate block! w-[20rem]",
      meta: "",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      amount: true,
      classTh: "min-w-[20rem]",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-amount"}
          />
        ),
      },
    },
    {
      accessorKey: "purchase_order_total_paid_per_product",
      header: "Paid amount",
      amount: true,
      classTh: "min-w-[20rem]",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-paid"}
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
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="expenses-report">
        <ReportsStats />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="report-sales-order/page-all-expenses"
          hasExport={true}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default ExpensesReport;
