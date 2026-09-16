import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import { MultiRangeDateFilter } from "@/components/inputs/InputRangeFilter";
import { MultiRangeAmountFilter } from "@/components/inputs/InputRangeFilter";
import {
  PaymentMethodList,
  PaymentMethodListWithCredit,
} from "@/layout/ArrayValue";

const SalesJournal = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "sales_journal_order_number",
      header: "Sales Order #",
      classTh: "min-w-40",
      classTd: "",
      isMobileTitle: true,
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="sales-order/sales-orders-filter?type=order-numbers"
            testFilterId={"filter-order-number"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_journal_date",
      header: "Date",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiDateRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter
            column={column}
            testFilterId={"filter-journal-date"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_journal_customer",
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
      accessorKey: "sales_journal_method",
      header: "Method",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={PaymentMethodListWithCredit().map(
              (option) => option.value,
            )}
            testFilterId={"filter-method"}
          />
        ),
      },
      status_option: PaymentMethodListWithCredit(),
    },
    {
      accessorKey: "sales_journal_debit",
      amount: true,
      header: "Debit",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-debit"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_journal_credit",
      amount: true,
      header: "Credit",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-credit"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_journal_balance",
      amount: true,
      header: "Balance",
      classTh: "min-w-40",
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
  ];

  return (
    <>
      <HeaderNav menu={"finance"} activeTab="sales-journal">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-203px)] h-[calc(97dvh-250px)]`}
          path="finance-sales-journal"
          haveFilterTable={true}
          ishaveAdd={false}
          setItemEdit={setItemEdit}
          hasExport={true}
        />
      </HeaderNav>
    </>
  );
};

export default SalesJournal;
