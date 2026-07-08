import { ActiveInActiveStatus, ActionTableList } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalPurchaseOrder from "./modal/ModalPurchaseOrder";
import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";

const PurchaseOrder = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "is_status",
      header: "status",
      classTh: "min-w-[8rem]",
      classTd: "min-w-[8rem]",
      status_option: ActiveInActiveStatus("purchase-order-status"),
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("purchase-order-status")}
          />
        ),
      },
    },
    {
      accessorKey: "payment_status",
      header: "payment status",
      classTh: "min-w-[9rem]",
      classTd: "min-w-[9rem]",
      status_option: ActiveInActiveStatus("purchase-order-payment-status"),
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("purchase-order-payment-status")}
          />
        ),
      },
    },
    {
      accessorKey: "purchase_order_number",
      header: "PO Number",
      orderNumber: "1",
      classTh: "min-w-[7rem] ",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "purchase_order_supplier_name",
      header: "Supplier",
      classTh: "min-w-[10rem] ",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "formated_date",
      header: "Order date",
      orderNumber: "2",
      classTh: "min-w-[7rem] ",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "formated_delivery_date",
      header: "expected",
      classTh: "min-w-[7rem] ",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "total_amount",
      header: "total amount",
      filterFn: "between",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
      amount: true,
      paid_amount: false,
    },
    {
      accessorKey: "purchase_order_payment",
      header: "paid amount",
      filterFn: "between",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
      amount: false,
      paid_amount: true,
    },
    {
      accessorKey: "purchase_order_balance",
      header: "Balance",
      filterFn: "between",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
      amount: false,
      paid_amount: true,
    },
    {
      accessorKey: "action",
      action_array: ActionTableList("purchase-order"),
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  return (
    <>
      <HeaderNav menu={"suppliers"} activeTab="purchase-orders">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-200px)] h-[calc(97dvh-250px)]`}
          path="purchase-order"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
        />
      </HeaderNav>
      {store.isAdd && <ModalPurchaseOrder itemEdit={itemEdit} />}
      {store.isView && <ModalPurchaseOrder itemEdit={itemEdit} />}
    </>
  );
};

export default PurchaseOrder;
