import HeaderNav from "@/layout/header/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
const Roles = () => {
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
    {
      accessorKey: "role_code",
      header: "code",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "role_description",
      header: "description",
      classTh: "",
      classTd: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"settings"} activeTab="roles">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(95dvh-200px)] h-[calc(100dvh-250px)]`}
        />
      </HeaderNav>
    </>
  );
};

export default Roles;
