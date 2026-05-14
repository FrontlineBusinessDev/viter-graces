import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ArchiveRestore, Edit, RotateCcw, Trash } from "lucide-react";
import React from "react";
import ModalPurchaseOrder from "./modal/ModalPurchaseOrder";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";

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
      accessorKey: "action",
      action_array: [
        {
          name: "edit",
          path: "purchase-order",
          icon: <Edit className="h-3 w-3" />,
          isActive: 1,
        },
        {
          name: "archieve",
          path: "active",
          icon: <ArchiveRestore className="h-3 w-3" />,
          isActive: 1,
        },
        {
          name: "restore",
          path: "active",
          icon: <RotateCcw className="h-3 w-3" />,
          isActive: 0,
        },
        {
          name: "delete",
          path: "purchase-order",
          icon: <Trash className="h-3 w-3" />,
          isActive: 0,
        },
      ],
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
    </>
  );
};

export default PurchaseOrder;
