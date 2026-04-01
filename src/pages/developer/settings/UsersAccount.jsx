import HeaderNav from "@/layout/header/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { setTabValue } from "@/store/StoreAction";
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
      <HeaderNav menu={"settings"} activeTab="user">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(97dvh-200px)] h-[calc(97dvh-250px)]`}
        />
      </HeaderNav>
    </>
  );
};

export default UsersAccount;
