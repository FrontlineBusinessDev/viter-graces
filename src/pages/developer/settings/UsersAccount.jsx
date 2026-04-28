import {
  ActiveInActiveStatus,
  DefaultActionTableList,
  UserActionTableList,
} from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
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
      status_option: ActiveInActiveStatus(),
    },
    {
      accessorKey: "name",
      header: "name",
      classTh: "",
      classTd: "",
      isMobileTitle: true,
    },
    {
      accessorKey: "user_account_email",
      header: "Email",
      classTh: "",
      classTd: "break-words",
    },
    {
      accessorKey: "user_account_role",
      header: "Role",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: UserActionTableList(),
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];
  return (
    <>
      <HeaderNav menu={"settings"} activeTab="users">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="users"
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <ModalUser itemEdit={itemEdit} />}
    </>
  );
};

export default UsersAccount;
