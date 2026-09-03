import { ActionTableList, ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalUser from "./modal/ModalUser";
import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";
import WarningBanner from "@/layout/WarningBanner";
const UsersAccount = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  // Columns
  const columns = [
    {
      accessorKey: "user_account_is_active",
      header: "status",
      classTh: "min-w-[5rem]",
      classTd: "",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus()}
            testFilterStatusId={"filter-status"}
          />
        ),
      },
      status_option: ActiveInActiveStatus(),
    },
    {
      accessorKey: "name",
      header: "name",
      classTh: "min-w-40",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "user_account_email",
      header: "Email",
      classTh: "min-w-40",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "user_account_role",
      header: "Role",
      classTh: "min-w-40",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "action",
      action_array: ActionTableList("users", "user-status"),
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];
  return (
    <>
      <HeaderNav menu={"settings"} activeTab="users">
        <WarningBanner
          path=""
          text="After creating an account or resetting your password, if you cannot find the confirmation message in your inbox, please check your spam folder."
          description=""
        />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)] `}
          path="users"
          haveFilterTable={true}
          setItemEdit={setItemEdit}
          dataTestidAddButton="add-users-btn"
        />
      </HeaderNav>
      {store.isAdd && <ModalUser itemEdit={itemEdit} />}
    </>
  );
};

export default UsersAccount;
