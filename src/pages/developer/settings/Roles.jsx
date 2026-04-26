import { SearchableSelectFilter } from "@/components/inputs/InputSelect";
import {
  ActiveInActiveStatus,
  DefaultActionTableList,
} from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
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
      classTh: "w-[10rem]! p-0!",
      classTd: "",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilter
            column={column}
            options={ActiveInActiveStatus()}
          />
        ),
      },
      status_option: ActiveInActiveStatus(),
      // filterFn: "between",
      // meta: {
      //   filterComponent: (column) => <InputMaxMinValue column={column} />,
      // },
    },
    {
      accessorKey: "role_name",
      header: "name",
      classTh: "w-[15rem]! p-0!",
      classTd: "",
      meta: "",
      // filterFn: "equals",
      // meta: {
      //   filterComponent: (column) => (
      //     <SearchableSelectFilter column={column} options={statusOptions} />
      //   ),
      // },
    },
    {
      accessorKey: "role_code",
      header: "code",
      classTh: "w-[15rem]! p-0!",
      classTd: "",
      meta: "",
      // filterFn: "equals",
      // meta: {
      //   filterComponent: (column) => (
      //     <SearchableSelectFilter column={column} options={statusOptions} />
      //   ),
      // },
    },
    {
      accessorKey: "role_description",
      header: "description",
      classTh: " p-0!",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "action",
      action_array: DefaultActionTableList(),
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
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(100dvh-200px)]`}
          path="roles"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
        />
      </HeaderNav>
      {store.isAdd && <ModalRoles itemEdit={itemEdit} />}
    </>
  );
};

export default Roles;
