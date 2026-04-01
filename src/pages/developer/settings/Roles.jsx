import HeaderNav from "@/layout/header/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ArchiveRestore, Edit, Trash } from "lucide-react";
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
    {
      accessorKey: "action",
      action_array: [
        { name: "edit", icon: <Edit className="h-3 w-3" /> },
        { name: "archieve", icon: <ArchiveRestore className="h-3 w-3" /> },
        { name: "restore", icon: <ArchiveRestore className="h-3 w-3" /> },
        { name: "delete", icon: <Trash className="h-3 w-3" /> },
      ],
      header: "Action",
      classTh: "",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  return (
    <>
      <HeaderNav menu={"settings"} activeTab="roles">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(95dvh-200px)] h-[calc(100dvh-250px)]`}
          path="roles"
        />
      </HeaderNav>
    </>
  );
};

export default Roles;
