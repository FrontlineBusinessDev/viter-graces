import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
const UsersAccount = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  // ✅ Columns
  const columns = [
    {
      accessorKey: "role_is_active",
      header: "status",
      classTh: "w-[5rem]",
      classTd: "",
    },
    {
      accessorKey: "role_name",
      header: "name",
      classTh: "",
      classTd: "",
    },
  ];
  return (
    <>
      <HeaderNav menu={"settings"} activeTab="users">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(97dvh-200px)] h-[calc(97dvh-250px)]`}
          path="roles"
        />
      </HeaderNav>
    </>
  );
};

export default UsersAccount;
