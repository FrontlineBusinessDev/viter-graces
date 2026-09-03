import { ActiveInActiveStatus, ActionTableList } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalProductOwner from "./modal/ModalProductOwner";
import ViewProducts from "./modal/ViewProducts";
import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";
import WarningBanner from "@/layout/WarningBanner";
const ProductOwner = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  // Columns
  const columns = [
    {
      accessorKey: "user_account_is_active",
      header: "status",
      classTh: "min-w-[5rem]!",
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
      meta: "",
    },
    {
      accessorKey: "user_account_email",
      header: "email",
      classTh: "min-w-40",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "action",
      action_array: ActionTableList("product-owner", "status-with-view"),
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];
  return (
    <>
      <HeaderNav menu={"settings"} activeTab="product-owner" warningNotes="">
        <WarningBanner
          path=""
          text="After creating an account or resetting your password, if you cannot find the confirmation message in your inbox, please check your spam folder."
          description=""
        />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-200px)] h-[calc(97dvh-250px)]`}
          path="product-owner"
          haveFilterTable={true}
          setItemEdit={setItemEdit}
          dataTestidAddButton="add-product-owner-btn"
        />
      </HeaderNav>
      {store.isAdd && <ModalProductOwner itemEdit={itemEdit} />}
      {store.isView && <ViewProducts itemEdit={itemEdit} />}
    </>
  );
};

export default ProductOwner;
