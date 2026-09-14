import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import React from "react";
import { MultiRangeDateFilter } from "@/components/inputs/InputRangeFilter";
import { MultiRangeAmountFilter } from "@/components/inputs/InputRangeFilter";

const CashSales = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "sales_order_number",
      header: "Order #",
      classTh: "min-w-40",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_date",
      header: "Date",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiDateRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter column={column} testFilterId={"filter-sales-date"} />
        ),
      },
    },
    {
      accessorKey: "sales_order_customer_name",
      header: "Customers",
      classTh: "min-w-[10rem] ",
      classTd: "",
      isMobileTitle: true,
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
      accessorKey: "sales_order_product_name",
      header: "Products",
      classTh: "min-w-[10rem] ",
      classTd: "",
      isMobileTitle: true,
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="products/read-all-by-active"
            testFilterId={"filter-product-name"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_qty",
      header: "Quantity",
      classTh: "min-w-40",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "total_amount_per_product",
      header: "Amount To Pay",
      amount: true,
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter column={column} testFilterId={"filter-amount"} />
        ),
      },
    },
    {
      accessorKey: "sales_order_paid_per_product",
      header: "Paid",
      amount: true,
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter column={column} testFilterId={"filter-paid"} />
        ),
      },
    },
    {
      accessorKey: "total_paid_in_cash",
      header: "Paid in cash",
      amount: true,
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-paid-cash"}
          />
        ),
      },
    },
    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
          {
            accessorKey: "sales_order_product_owner_name",
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
        ]),
  ];

  return (
    <>
      <HeaderNav menu={"finance"} activeTab="cash-sales">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-203px)] h-[calc(97dvh-250px)]`}
          path="finance-cash-sales"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
          ishaveAdd={false}
          hasExport={true}
        />
      </HeaderNav>
    </>
  );
};

export default CashSales;
