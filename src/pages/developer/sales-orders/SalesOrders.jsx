import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";
import { ActionTableList, ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalSalesOrders from "./ModalSalesOrders";
import ViewSalesDetails from "./ViewSalesDetails";

const SalesOrders = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [isView, setView] = React.useState(false);

  // Columns
  const columns = [
    {
      accessorKey: "user_account_is_active",
      header: "status",
      classTh: "w-[5rem]",
      classTd: "",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus()}
          />
        ),
      },
      status_option: ActiveInActiveStatus(),
    },
    {
      accessorKey: "order",
      header: "order #",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "date",
      header: "date",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "customer",
      header: "customer",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "total",
      header: "total",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "paid",
      header: "paid",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "method",
      header: "method",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "action",
      action_array: ActionTableList("sales-order"),
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  return (
    <>
      <HeaderNav menu={"sales orders"} activeTab="sales-orders">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="sales-order"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
        />
      </HeaderNav>
      {store.isAdd && <ModalSalesOrders itemEdit={itemEdit} />}
      {isView && <ViewSalesDetails itemEdit={itemEdit} setView={setView} />}
    </>
  );
};

export default SalesOrders;
