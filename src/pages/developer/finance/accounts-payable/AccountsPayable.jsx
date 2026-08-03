import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { Eye } from "lucide-react";
import React from "react";
import ViewAccountsPayableDetails from "./ViewAccountsPayableDetails";
import { ActionTableList } from "@/layout/ArrayValue";

const AccountsPayable = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [isView, setView] = React.useState(false);

  const handleView = (item) => {
    setView(true);
    setItemEdit(item);
  };

  // Columns
  const columns = [
    {
      accessorKey: "purchase_order_number",
      header: "PO Number",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "purchase_order_date",
      header: "Date",
      classTh: "",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "purchase_order_supplier_name",
      header: "Supplier",
      classTh: "min-w-[10rem]",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      amount: true,
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "paid_amount",
      header: "Paid",
      amount: true,
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "balance_amount",
      header: "Balance",
      amount: true,
      classTh: "",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "action",
      action_array: ActionTableList("finance", "finance-ap"),
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  return (
    <>
      <HeaderNav menu={"finance"} activeTab="accounts-payable">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-203px)] h-[calc(97dvh-250px)]`}
          path="finance-account-payable"
          haveFilterTable={true}
          ishaveAdd={false}
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <ViewAccountsPayableDetails itemEdit={itemEdit} />}
    </>
  );
};

export default AccountsPayable;
