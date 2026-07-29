import {
  SearchableSelectFilter,
  SearchableSelectFilterStatus,
} from "@/components/inputs/InputSelect";
import { apiVersion } from "@/config/config";
import {
  ActionTableList,
  ActiveInActiveStatus,
  PaymentMethodList,
  PaymentTermsList,
} from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import useQueryData from "@/services/useQueryData";
import { setIsAdd } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalSalesOrders from "./ModalSalesOrders";
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
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("payment-status")}
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
      meta: "",
    },
    {
      accessorKey: "sales_order_date",
      header: "date",
      classTh: "min-w-[7rem]",
      classTd: "",
      filterFn: "date",
      meta: "",
      defaultValue: store.credentials?.data?.server_date,
    },
    {
      accessorKey: "sales_order_due_date",
      header: "Due Date",
      classTh: "min-w-[7rem]",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "sales_order_customer_name",
      header: "customer",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilter
            column={column}
            path="customer/read-all-by-active"
            testFilterId={"filter-owner"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_total_receivable_amount",
      header: "total",
      amount: true,
      filterFn: "between",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_paid_amount",
      header: "paid",
      paid_amount: true,
      filterFn: "between",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_total_balance_amount",
      header: "balance",
      amount: true,
      filterFn: "between",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_payment_method",
      header: "method",
      classTh: "min-w-[10rem]",
      classTd: "capitalize ",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={PaymentMethodList()}
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
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={PaymentTermsList()}
          />
        ),
      },
      status_option: PaymentTermsList(),
    },
    {
      accessorKey: "sales_order_received_by_name",
      header: "Received by",
      classTh: "min-w-[10rem]",
      classTd: "capitalize ",
      filterFn: "",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilter
            column={column}
            path="product-owner/read-by-received-by"
            testFilterId={"filter-owner"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_notes",
      header: "notes",
      classTh: "min-w-[10rem]",
      classTd: "capitalize ",
      filterFn: "",
      meta: "",
    },
    {
      accessorKey: "action",
      action_array: ActionTableList("sales-order", "status-with-view"),
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
