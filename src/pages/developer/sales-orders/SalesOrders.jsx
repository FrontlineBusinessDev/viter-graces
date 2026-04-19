import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ArchiveRestore, Edit, Eye, RotateCcw, Trash } from "lucide-react";
import React from "react";
import ModalSalesOrders from "./ModalSalesOrders";

const SalesOrders = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "user_account_is_active",
      header: "status",
      classTh: "w-[5rem]",
      classTd: "",
    },
    {
      accessorKey: "name",
      header: "order #",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "email",
      header: "date",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "phone",
      header: "customer",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "address",
      header: "total",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "address",
      header: "paid",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "address",
      header: "method",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: [
        {
          name: "view",
          path: "suppliers",
          icon: <Eye className="h-3 w-3" />,
          isActive: 1,
        },
        {
          name: "edit",
          path: "suppliers",
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
          path: "suppliers",
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
      <HeaderNav menu={"sales orders"} activeTab="sales-orders">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="Sales order"
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <ModalSalesOrders itemEdit={itemEdit} />}
    </>
  );
};

export default SalesOrders;
