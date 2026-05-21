import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";
import { ActionTableList, ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalSalesOrders from "./ModalSalesOrders";
import ViewSalesDetails from "./ViewSalesDetails";

const SalesOrders = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [isView, setView] = React.useState(false);

  // Columns
  const columns = [
    {
      accessorKey: "sales_order_is_active",
      header: "status",
      classTh: "min-w-[8rem]",
      classTd: "",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus()}
          />
        ),
      },
      status_option: ActiveInActiveStatus(),
    },
    {
      accessorKey: "sales_order_number",
      header: "order #",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_date",
      header: "date",
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "sales_order_customer_name",
      header: "customer",
      classTh: "min-w-[15rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_overall_amount",
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
      accessorKey: "sales_order_payment_method",
      header: "method",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "action",
      action_array: ActionTableList("sales-order"),
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  return (
    <>
      <HeaderNav menu={"sales orders"} activeTab="sales-orders">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="sales-order"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
        />
      </HeaderNav>
      {store.isAdd && <ModalSalesOrders itemEdit={itemEdit} />}
      {store.isView && <ViewSalesDetails itemEdit={itemEdit} />}
    </>
  );
};

export default SalesOrders;
