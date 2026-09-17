import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import { apiVersion } from "@/config/config";
import {
  ActionTableList,
  ActiveInActiveStatus,
  PaymentMethodList,
  PaymentTermsList,
} from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import Pills from "@/components/Pills";
import InfiniteTable from "@/layout/table/InfiniteTable";
import useQueryData from "@/services/useQueryData";
import { setIsAdd } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import React from "react";
import ModalSalesOrders from "./ModalSalesOrders";
import {
  MultiRangeAmountFilter,
  MultiRangeDateFilter,
} from "@/components/inputs/InputRangeFilter";
import ViewSalesDetails from "./ViewSalesDetails";

const SalesOrders = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [dataCount, setDataCount] = React.useState("...Loading");

  // Columns
  const columns = [
    {
      accessorKey: "sales_order_status",
      header: "status",
      classTh: "min-w-[7rem]",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={ActiveInActiveStatus("payment-status").map(
              (option) => option.value,
            )}
            testFilterId={"filter-status"}
          />
        ),
      },
      status_option: ActiveInActiveStatus("payment-status"),
    },
    {
      accessorKey: "sales_order_number",
      header: "order #",
      classTh: "min-w-[5rem]",
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
      accessorKey: "sales_order_date",
      header: "date",
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "multiDateRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter
            column={column}
            testFilterId={"filter-order-date"}
            singleSidedExact
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_due_date",
      header: "Due Date",
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "multiDateRange",
      cell: (info) => {
        const row = info.row.original;
        const paymentTerms = row?.sales_order_payment_terms?.toLowerCase();
        const installmentType =
          row?.sales_order_installment_type?.toLowerCase();
        const dueDate = info.getValue();

        // Flexible plans have no fixed schedule - due dates for individual
        // payments live on the Accounts Receivable rows instead.
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
            singleSidedExact
            allowFlexible
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_customer_name",
      header: "Customers",
      classTh: "min-w-[10rem]",
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
      accessorKey: "sales_order_total_receivable_amount",
      header: "total",
      amount: true,
      filterFn: "multiRange",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-total"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_paid_amount",
      header: "paid",
      paid_amount: true,
      filterFn: "multiRange",
      classTh: "min-w-[10rem]",
      classTd: "",
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
      filterFn: "multiRange",
      classTh: "min-w-[10rem]",
      classTd: "",
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
      accessorKey: "sales_order_notes",
      header: "notes",
      // Notes is intentionally called out with its own light red background
      // (only this column, not the whole row) so it stands out next to Balance.
      // group-hover (the <tr> in InfiniteTable carries "group") darkens this
      // cell's red tint on row hover instead of the usual gray/blue, so the
      // row hover feedback still shows through here rather than being fully
      // painted over by the opaque background.
      classTh: "min-w-[10rem] bg-red-200 dark:bg-red-950/40!",
      classTd: "capitalize bg-red-200 dark:bg-red-950/40!",
      filterFn: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_payment_method",
      header: "method",
      classTh: "min-w-[10rem]",
      classTd: "capitalize ",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={PaymentMethodList().map((option) => option.value)}
            testFilterId={"filter-method"}
          />
        ),
      },
      status_option: PaymentMethodList(),
    },
    {
      accessorKey: "sales_order_payment_terms",
      header: "payment terms",
      classTh: "min-w-[10rem]",
      classTd: "capitalize ",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={PaymentTermsList().map((option) => option.value)}
            testFilterId={"filter-payment-terms"}
          />
        ),
      },
      status_option: PaymentTermsList(),
    },
    {
      accessorKey: "sales_order_received_by_name",
      header: "Created by",
      classTh: "min-w-[10rem]",
      classTd: "capitalize ",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="product-owner/read-by-received-by"
            testFilterId={"filter-owner"}
          />
        ),
      },
    },
    {
      accessorKey: "action",
      action_array: ActionTableList(
        "sales-order",
        Number(ProductOwnerId(store)) > 0
          ? "product_owner_sales_order"
          : "status-with-view",
      ),
      // sales_order_has_return (from SalesOrder::readLimit()) flags orders
      // with at least one item still claimed by a pending/processed return -
      // block deleting the whole order from the table until that clears.
      blockDeleteField: "sales_order_has_return",
      // A paid order is settled - only "view" should remain available.
      viewOnlyStatuses: ["paid"],
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  const { data: result } = useQueryData(
    `${apiVersion}/customer/read-walk-in-cutomer`, // endpoint
    "get", // method
    `customer`, // key
  );

  React.useEffect(() => {
    if (window.sessionStorage.getItem("quickAdd")) {
      dispatch(setIsAdd(true));
    }
  }, [window.sessionStorage.getItem("quickAdd")]);

  return (
    <>
      <HeaderNav
        menu={"sales orders"}
        description={`${dataCount} total order`}
        activeTab="sales-orders"
      >
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-203px)] h-[calc(97dvh-250px)]`}
          path="sales-order"
          setItemEdit={setItemEdit}
          setDataCount={setDataCount}
          haveFilterTable={true}
        />
      </HeaderNav>
      {store.isAdd && (
        <ModalSalesOrders itemEdit={itemEdit} cutomer={result?.data[0]} />
      )}
      {store.isView && <ViewSalesDetails itemEdit={itemEdit} />}
    </>
  );
};

export default SalesOrders;
