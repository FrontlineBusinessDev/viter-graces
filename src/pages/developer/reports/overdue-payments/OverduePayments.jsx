import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";
import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";

const OverduePayments = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  // Columns
  const columns = [
    {
      accessorKey: "installmet_payment_is_paid",
      header: "status",
      classTh: "w-[8rem]",
      classTd: "",
      status_option: ActiveInActiveStatus("installment-status"),
    },
    {
      accessorKey: "installmet_payment_code_number",
      header: "Order #",
      classTh: "",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "installmet_payment_due_date",
      header: "Date",
      classTh: "",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "installmet_payment_customer_name",
      header: "Customer",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "installmet_payment_amount",
      amount: true,
      header: "Amount",
      classTh: "min-w-20",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="overdue-payments">
        <ReportsStats />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="report-sales-order/page-all-overdue-payment"
          hasExport={true}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default OverduePayments;
