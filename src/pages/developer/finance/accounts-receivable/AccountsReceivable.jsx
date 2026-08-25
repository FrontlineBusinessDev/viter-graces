import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ViewAccountsReceivableDetails from "./ViewAccountsReceivableDetails";
import { ActionTableList, ActiveInActiveStatus } from "@/layout/ArrayValue";
import UpdateAccountsReceivableDetails from "./UpdateAccountsReceivableDetails";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";

const AccountsReceivable = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [isView, setView] = React.useState(false);

  const handleView = (item) => {
    setView(true);
    setItemEdit(item);
  };

  // Columns Pending, Due Soon, Due tomorrow, Due today, Overdue, Partial
  const columns = [
    {
      accessorKey: "status_text",
      header: "status",
      classTh: "min-w-40!",
      classTd: "",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("ar-finance")}
          />
        ),
      },
      status_option: ActiveInActiveStatus("ar-finance"),
    },
    {
      accessorKey: "sales_order_number",
      header: "Order #",
      classTh: "min-w-20!",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_due_date",
      header: "Due date",
      classTh: "",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "sales_order_date",
      header: "Date",
      classTh: "",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "sales_order_customer_name",
      header: "Customers",
      classTh: "",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "sales_order_total_receivable_amount",
      header: "Amount",
      amount: true,
      classTh: "",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "sales_order_paid_amount",
      header: "paid",
      amount: true,
      classTh: "",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "sales_order_total_balance_amount",
      header: "balance",
      amount: true,
      classTh: "",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    ...(Number(ProductOwnerId(store)) > 0
      ? [
          {
            accessorKey: "action",
            action_array: ActionTableList(
              "expenses",
              "finance_ar_product_owner",
            ),
            header: "Action",
            classTh: " text-center ",
            classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
          },
        ]
      : [
          {
            accessorKey: "action",
            action_array: ActionTableList("expenses", "finance-ar"),
            header: "Action",
            classTh: " text-center ",
            classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
          },
        ]),
  ];

  return (
    <>
      <HeaderNav menu={"finance"} activeTab="accounts-receivable">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-203px)] h-[calc(97dvh-250px)]`}
          path="finance-account-receivable"
          haveFilterTable={true}
          ishaveAdd={false}
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <UpdateAccountsReceivableDetails itemEdit={itemEdit} />}
      {store.isView && <ViewAccountsReceivableDetails itemEdit={itemEdit} />}
    </>
  );
};

export default AccountsReceivable;
