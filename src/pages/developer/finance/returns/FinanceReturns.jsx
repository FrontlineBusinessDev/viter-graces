import {
  SearchableSelectFilter,
  SearchableSelectFilterStatus,
} from "@/components/inputs/InputSelect";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import { StoreContext } from "@/store/StoreContext";
import React from "react";

const FinanceReturns = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      // is_status is a composite the backend derives from return_product_status +
      // return_product_resolution_type (Pending/Refunded/Open/Completed/Rejected) -
      // rendered by the shared TableStatus component like every other status column.
      accessorKey: "is_status",
      header: "status",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("return-display-status")}
          />
        ),
      },
      status_option: ActiveInActiveStatus("return-display-status"),
    },
    {
      accessorKey: "return_product_product_name",
      header: "Item",
      classTh: "min-w-[10rem] ",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "return_product_order_number",
      header: "Order #",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "return_product_date",
      header: "Date",
      classTh: "",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "return_product_customer_name",
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
      accessorKey: "return_product_qty",
      header: "Quantity",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "return_product_amount",
      header: "Return Amount",
      amount: true,
      classTh: "",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "return_product_resolution_type",
      header: "Resolution",
      classTh: "min-w-40",
      classTd: "capitalize",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("resolution-type")}
            uppercase="capitalize! "
          />
        ),
      },
    },
    {
      accessorKey: "return_product_refund_method",
      header: "Refund Method",
      classTh: "min-w-40",
      classTd: "capitalize",
      meta: "",
      cell: (info) => info.getValue() || "—",
    },
    {
      accessorKey: "return_product_owner_name",
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
  ];

  return (
    <>
      <HeaderNav menu={"finance"} activeTab="finance-returns">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-203px)] h-[calc(97dvh-250px)]`}
          path="finance-returns"
          haveFilterTable={true}
          ishaveAdd={false}
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
    </>
  );
};

export default FinanceReturns;
