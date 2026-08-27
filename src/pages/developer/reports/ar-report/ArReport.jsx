import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";
import {
  SearchableSelectFilter,
  SearchableSelectFilterStatus,
} from "@/components/inputs/InputSelect";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";

const ArReport = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  // Columns
  const columns = [
    {
      accessorKey: "sales_order_status",
      header: "status",
      classTh: "min-w-40!",
      classTd: "",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("payment-status")}
          />
        ),
      },
      status_option: ActiveInActiveStatus("payment-status"),
    },
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
      header: "Products",
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
      accessorKey: "sales_order_payment_method",
      header: "Payment Method",
      classTh: "",
      classTd: "",
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
    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
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
        ]),
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="AR-report">
        <ReportsStats />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="report-sales-order/page-all-account-receivable"
          hasExport={true}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default ArReport;
