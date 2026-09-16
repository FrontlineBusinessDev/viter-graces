import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import Pills from "@/components/Pills";
import { ActionTableList, ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ProductOwnerIdOnly } from "@/utilities/productOwnerToken";
import React from "react";
import UpdateAccountsReceivableDetails from "./UpdateAccountsReceivableDetails";
import ViewAccountsReceivableDetails from "./ViewAccountsReceivableDetails";
import { MultiRangeAmountFilter } from "@/components/inputs/InputRangeFilter";
import { MultiRangeDateFilter } from "@/components/inputs/InputRangeFilter";

// Status priority for the Accounts Receivable list - matches the
// `status_text` labels computed by AccountReceivable::readLimit()
// (rest/v1/models/developer/finance/AccountReceivable.php), which already
// sorts the SQL result set the same way; this is a page-specific,
// client-side re-assertion of that same order so it holds even across
// InfiniteTable's own accumulated/flattened pages, not a replacement for it.
const ACCOUNTS_RECEIVABLE_STATUS_PRIORITY = {
  "due soon": 1,
  "due tomorrow": 2,
  "due today": 3,
  pending: 4,
  overdue: 5,
  partial: 6,
};

const getAccountsReceivableStatusRank = (row) =>
  ACCOUNTS_RECEIVABLE_STATUS_PRIORITY[row?.status_text?.toLowerCase()] ?? 7;

// sales_order_due_date arrives already formatted for display (e.g.
// "Sep 26, 2026"), or empty/null for a flexible installment plan with no
// fixed schedule - unparseable/blank values sort last, never first.
const getAccountsReceivableDueDateSortValue = (row) => {
  const raw = row?.sales_order_due_date;
  if (!raw) return Infinity;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? Infinity : parsed.getTime();
};

const compareAccountsReceivableRows = (a, b) => {
  const statusDiff =
    getAccountsReceivableStatusRank(a) - getAccountsReceivableStatusRank(b);
  if (statusDiff !== 0) return statusDiff;

  const dueDateDiff =
    getAccountsReceivableDueDateSortValue(a) -
    getAccountsReceivableDueDateSortValue(b);
  if (dueDateDiff !== 0) return dueDateDiff;

  return String(a?.sales_order_number ?? "").localeCompare(
    String(b?.sales_order_number ?? ""),
    undefined,
    { numeric: true },
  );
};

const AccountsReceivable = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [isView, setView] = React.useState(false);

  const handleView = (item) => {
    setView(true);
    setItemEdit(item);
  };

  // Columns Pending, Due Soon, Due tomorrow, Due today, Overdue, Partial
  const columns = [
    {
      accessorKey: "status_text",
      header: "status",
      classTh: "min-w-40!",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={ActiveInActiveStatus("ar-finance").map(
              (option) => option.value,
            )}
            testFilterId={"filter-status"}
          />
        ),
      },
      status_option: ActiveInActiveStatus("ar-finance"),
    },
    {
      accessorKey: "sales_order_number",
      header: "Order #",
      classTh: "min-w-20!",
      classTd: "",
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
      accessorKey: "sales_order_due_date",
      header: "Due date",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiDateRange",
      // Flexible installment plans have no fixed schedule - individual
      // payments' own due dates live on the Accounts Receivable modal's
      // payment rows instead, so the order-level column shows a badge
      // rather than a (nulled) date. Matches SalesOrders.jsx's identical check.
      cell: (info) => {
        const row = info.row.original;
        const paymentTerms = row?.sales_order_payment_terms?.toLowerCase();
        const installmentType =
          row?.sales_order_installment_type?.toLowerCase();
        const dueDate = info.getValue();

        const isFlexible =
          paymentTerms === "installment" &&
          (["flexible", "customize"].includes(installmentType) || !dueDate);

        if (isFlexible) {
          return <Pills variant="flexible">Flexible</Pills>;
        }

        return dueDate;
      },
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
      accessorKey: "days_overdue",
      header: "Days Overdue",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-days-overdue"}
          />
        ),
      },
      // Flexible orders have no single due date to count days against -
      // same "-" placeholder as a non-overdue row, rather than a stale/0 count.
      cell: (info) => {
        const row = info.row.original;
        const paymentTerms = row?.sales_order_payment_terms?.toLowerCase();
        const installmentType =
          row?.sales_order_installment_type?.toLowerCase();
        const isFlexible =
          paymentTerms === "installment" &&
          ["flexible", "customize"].includes(installmentType);

        if (isFlexible) return "-";
        return Number(info.getValue()) > 0 ? info.getValue() : "-";
      },
    },
    {
      accessorKey: "sales_order_date",
      header: "Date",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiDateRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter
            column={column}
            testFilterId={"filter-sales-date"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_customer_name",
      header: "Customers",
      classTh: "min-w-[10rem] ",
      classTd: "",
      isMobileTitle: true,
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
      accessorKey: "sales_order_product_name",
      header: "Products",
      classTh: "min-w-[10rem] ",
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
      accessorKey: "sales_order_qty",
      header: "Quantity",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-stocks"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_total_receivable_amount",
      header: "Amount",
      amount: true,
      classTh: "min-w-40",
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
      accessorKey: "sales_order_paid_amount",
      header: "paid",
      amount: true,
      classTh: "min-w-40",
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
      accessorKey: "sales_order_total_balance_amount",
      header: "balance",
      amount: true,
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
    ...(Number(ProductOwnerIdOnly(store)) > 0
      ? [
          {
            accessorKey: "action",
            action_array: ActionTableList(
              "expenses",
              "finance_ar_product_owner",
            ),
            header: "Action",
            classTh: " text-center ",
            classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
          },
        ]
      : [
          {
            accessorKey: "action",
            action_array: ActionTableList("expenses", "finance-ar"),
            header: "Action",
            classTh: " text-center ",
            classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
          },
        ]),
  ];

  return (
    <>
      <HeaderNav menu={"finance"} activeTab="accounts-receivable">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-203px)] h-[calc(97dvh-250px)]`}
          path="finance-account-receivable"
          haveFilterTable={true}
          ishaveAdd={false}
          setItemEdit={setItemEdit}
          sortComparator={compareAccountsReceivableRows}
          hasExport={true}
        />
      </HeaderNav>
      {store.isAdd && <UpdateAccountsReceivableDetails itemEdit={itemEdit} />}
      {store.isView && <ViewAccountsReceivableDetails itemEdit={itemEdit} />}
    </>
  );
};

export default AccountsReceivable;
