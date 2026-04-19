import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ArchiveRestore, Edit, RotateCcw, Trash } from "lucide-react";
import React from "react";
import ModalProducts from "./ModalProducts";
const Products = () => {
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
      header: "Products",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "contact person",
      header: "SKU",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "email",
      header: "Category",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "phone",
      header: "Price",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "address",
      header: "Cost",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "address",
      header: "Stocks",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: [
        {
          name: "edit",
          path: "purchase orders",
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
          path: "purchase orders",
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
      <HeaderNav menu={"products"} activeTab="products">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="product"
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <ModalProducts itemEdit={itemEdit} />}
    </>
  );
};

export default Products;
