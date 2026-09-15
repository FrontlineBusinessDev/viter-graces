import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";
import {
  MultiRangeAmountFilter,
  MultiRangeDateFilter,
} from "@/components/inputs/InputRangeFilter";
import { isEmptyItem } from "@/utilities/isEmptyItem";

const OverduePayments = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  // Columns
  const columns = [
    // {
    //   accessorKey: "installment_payment_is_paid",
    //   header: "status",
    //   classTh: "w-[8rem]",
    //   classTd: "",
    //   status_option: ActiveInActiveStatus("installment-status"),
    // },
    {
      accessorKey: "installment_payment_code_number",
      header: "Order #",
      classTh: "min-w-40",
      classTd: "",
      isMobileTitle: true,
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="sales-order/sales-orders-filter?type=installment-numbers"
            testFilterId={"filter-customer"}
          />
        ),
      },
    },
    {
      accessorKey: "installment_payment_due_date",
      header: "Date",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiDateRange",
      // Flexible-type installments have no fixed schedule, so this can be
      // null/empty - show "--" instead of a blank cell.
      cell: (info) => isEmptyItem(info.getValue(), "--"),
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter
            column={column}
            testFilterId={"filter-due-date"}
          />
        ),
      },
    },
    {
      accessorKey: "installment_payment_customer_name",
      header: "Customers",
      classTh: "min-w-[10rem] ",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="customer/read-all-by-active"
            testFilterId={"filter-customer"}
          />
        ),
      },
    },
    {
      accessorKey: "installment_payment_amount",
      amount: true,
      header: "Amount",
      classTh: "min-w-20",
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
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="overdue-payments">
        <ReportsStats />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="report-sales-order/page-all-overdue-payment"
          hasExport={true}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default OverduePayments;
