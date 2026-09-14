import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { ActiveInActiveStatus, RefundMethodList } from "@/layout/ArrayValue";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import { MultiRangeAmountFilter } from "@/components/inputs/InputRangeFilter";

const FinanceReturns = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  // Columns
  const columns = [
    {
      accessorKey: "return_product_status",
      header: "status",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={ActiveInActiveStatus("return-status").map(
              (option) => option.value,
            )}
            testFilterId={"filter-status"}
          />
        ),
      },
      status_option: ActiveInActiveStatus("return-status"),
    },
    {
      accessorKey: "return_product_customer_name",
      header: "Customers",
      classTh: "min-w-[10rem] ",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="customer/read-all-by-active"
            testFilterId={"filter-customer"}
          />
        ),
      },
    },
    {
      accessorKey: "return_product_resolution_type",
      header: "Resolution",
      classTh: "min-w-40",
      classTd: "capitalize",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={ActiveInActiveStatus("resolution-type").map(
              (option) => option.value,
            )}
            testFilterId={"filter-resolution-type"}
          />
        ),
      },
    },
    {
      accessorKey: "return_product_refund_method",
      header: "Refund Method",
      classTh: "min-w-40",
      classTd: "capitalize ",
      // meta: "",
      // cell: (info) => info.getValue() || "—",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={RefundMethodList().map((option) => option.value)}
            testFilterId={"filter-refund-method"}
          />
        ),
      },
    },
    {
      accessorKey: "return_product_amount",
      header: "Total Amount",
      amount: true,
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-total-amount"}
          />
        ),
      },
    },
    {
      accessorKey: "return_product_paid_amount",
      header: "Returned Amount",
      amount: true,
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-returned-amount"}
          />
        ),
      },
    },
    {
      accessorKey: "return_product_owner_name",
      header: "Product Owner",
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
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
          hasExport={true}
        />
      </HeaderNav>
    </>
  );
};

export default FinanceReturns;
