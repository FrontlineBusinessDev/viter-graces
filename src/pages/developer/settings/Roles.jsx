import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ArchiveRestore, Edit, RotateCcw, Trash } from "lucide-react";
import React from "react";
import ModalRoles from "./modal/ModalRoles";
const Roles = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  // Columns
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
      <HeaderNav menu={"settings"} activeTab="roles">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(95dvh-200px)] h-[calc(100dvh-200px)]`}
          path="roles"
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <ModalRoles itemEdit={itemEdit} />}
    </>
  );
};

export default Roles;
