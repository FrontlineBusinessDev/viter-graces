import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ArchiveRestore, Edit, RotateCcw, Trash } from "lucide-react";
import React from "react";
import ModalUser from "./modal/ModalUser";
import ModalProductOwner from "./modal/ModalProductOwner";
import { DefaultActionTableList } from "@/layout/ArrayValue";
const ProductOwner = () => {
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
      header: "name",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "user_account_email",
      header: "email",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "products",
      header: "products",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: DefaultActionTableList(),
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];
  return (
    <>
      <HeaderNav menu={"settings"} activeTab="product-owner">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="owner"
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <ModalProductOwner itemEdit={itemEdit} />}
    </>
  );
};

export default ProductOwner;
