import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { Eye } from "lucide-react";
import React from "react";
import ViewAccountsReceivableDetails from "./ViewAccountsReceivableDetails";
import { SearchableSelectFilter } from "@/components/inputs/InputSelect";

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
      accessorKey: "sales_order_number",
      header: "Order #",
      classTh: "",
      classTd: "",
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
      accessorKey: "sales_order_product_name",
      header: "Items",
      classTh: "",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "total_amount_per_product",
      header: "Amount",
      amount: true,
      classTh: "",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "sales_order_paid_per_product",
      header: "paid",
      amount: true,
      classTh: "",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "sales_order_balance_per_product",
      header: "balance",
      amount: true,
      classTh: "",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "sales_order_product_owner_name",
      header: "Product Owner",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilter
            column={column}
            path="product-owner/read-by-product-owner"
            testFilterId={"filter-owner"}
          />
        ),
      },
    },
    {
      accessorKey: "action",
      header: "action",
      classTh: "",
      classTd: "",
    },
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
        />
      </HeaderNav>
      {isView && (
        <ViewAccountsReceivableDetails itemEdit={itemEdit} setView={setView} />
      )}
    </>
  );
};

export default AccountsReceivable;
