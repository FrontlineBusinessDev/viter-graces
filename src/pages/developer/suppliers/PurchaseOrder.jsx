import {
  ActiveInActiveStatus,
  DefaultActionTableList,
} from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalPurchaseOrder from "./modal/ModalPurchaseOrder";

const PurchaseOrder = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "purchase_order_is_active",
      header: "status",
      classTh: "w-[5rem]",
      classTd: "",
      status_option: ActiveInActiveStatus(),
      status_text: "purchase_order_status",
    },
    {
      accessorKey: "purchase_order_number",
      header: "PO Number",
      orderNumber: "1",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "purchase_order_supplier_name",
      header: "Supplier",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "formated_date",
      header: "Order date",
      orderNumber: "2",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "formated_delivery_date",
      header: "expected",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "total_amount",
      header: "total",
      classTh: "",
      classTd: "",
      amount: true,
      paid_amount: false,
    },
    {
      accessorKey: "purchase_order_payment",
      header: "payment",
      classTh: "",
      classTd: "",
      amount: false,
      paid_amount: true,
    },
    {
      accessorKey: "purchase_order_payment_status",
      header: "payment status",
      classTh: "w-[9rem]",
      classTd: "",
      status_option: ActiveInActiveStatus(),
      status_text: "purchase_order_payment_status",
    },
    {
      accessorKey: "action",
      action_array: DefaultActionTableList("purchase-order"),
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
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="purchase-order"
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <ModalPurchaseOrder itemEdit={itemEdit} />}
      {store.isView && <ModalPurchaseOrder itemEdit={itemEdit} />}
    </>
  );
};

export default PurchaseOrder;
