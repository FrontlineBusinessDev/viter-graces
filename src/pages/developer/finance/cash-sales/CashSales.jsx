import { SearchableSelectFilter } from "@/components/inputs/InputSelect";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import React from "react";

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
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "sales_order_customer_name",
      header: "Customers",
      classTh: "min-w-[10rem] ",
      classTd: "",
      isMobileTitle: true,
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
      accessorKey: "sales_order_product_name",
      header: "Products",
      classTh: "min-w-[10rem] ",
      classTd: "",
      isMobileTitle: true,
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilter
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
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "sales_order_paid_per_product",
      header: "Paid",
      amount: true,
      classTh: "min-w-40",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "total_paid_in_cash",
      header: "Paid in cash",
      amount: true,
      classTh: "min-w-40",
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
      <HeaderNav menu={"finance"} activeTab="cash-sales">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-203px)] h-[calc(97dvh-250px)]`}
          path="finance-cash-sales"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default CashSales;
