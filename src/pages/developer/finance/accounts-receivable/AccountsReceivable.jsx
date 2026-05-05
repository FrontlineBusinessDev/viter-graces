import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { Eye } from "lucide-react";
import React from "react";
import ViewAccountsReceivableDetails from "./ViewAccountsReceivableDetails";

const AccountsReceivable = () => {
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
      accessorKey: "status",
      header: "Status",
      classTh: "w-[5rem]",
      classTd: "",
    },
    {
      accessorKey: "order_no",
      header: "Order #",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "date",
      header: "Date",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "customer",
      header: "Customers",
      classTh: "",
      classTd: "",
      isMobileTitle: true,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "paid",
      header: "Paid",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "action",
      action_array: [
        {
          name: "view",
          path: "suppliers",
          icon: <Eye className="h-3 w-3" />,
          isActive: 1,
        },
      ],
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  return (
    <>
      <HeaderNav menu={"finance"} activeTab="accounts-receivable">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path=""
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {isView && (
        <ViewAccountsReceivableDetails itemEdit={itemEdit} setView={setView} />
      )}
    </>
  );
};

export default AccountsReceivable;
