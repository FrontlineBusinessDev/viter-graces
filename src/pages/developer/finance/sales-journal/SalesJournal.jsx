import { SearchableSelectFilter } from "@/components/inputs/InputSelect";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";

const SalesJournal = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "sales_journal_order_number",
      header: "Sales Order #",
      classTh: "min-w-40",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "sales_journal_date",
      header: "Date",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "sales_journal_customer",
      header: "Customers",
      classTh: "min-w-[10rem] ",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilter
            column={column}
            path="customer/read-all-by-active"
            testFilterId={"filter-customer"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_journal_method",
      header: "Method",
      classTh: "min-w-40",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_journal_debit",
      amount: true,
      header: "Debit",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "sales_journal_credit",
      amount: true,
      header: "Credit",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "sales_journal_balance",
      amount: true,
      header: "Balance",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"finance"} activeTab="sales-journal">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-203px)] h-[calc(97dvh-250px)]`}
          path="finance-sales-journal"
          haveFilterTable={true}
          ishaveAdd={false}
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
    </>
  );
};

export default SalesJournal;
