import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ArchiveRestore, Edit, RotateCcw, Trash } from "lucide-react";
import React from "react";
import ModalUser from "./modal/ModalUser";
const UsersAccount = () => {
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
      accessorKey: "user_account_role",
      header: "role",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: [
        {
          name: "edit",
          path: "roles",
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
          path: "roles",
          icon: <Trash className="h-3 w-3" />,
          isActive: 0,
        },
      ],
      header: "Action",
      classTh: "",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];
  return (
    <>
      <HeaderNav menu={"settings"} activeTab="users">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(97dvh-200px)] h-[calc(97dvh-250px)]`}
          path="users"
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <ModalUser itemEdit={itemEdit} />}
    </>
  );
};

export default UsersAccount;
