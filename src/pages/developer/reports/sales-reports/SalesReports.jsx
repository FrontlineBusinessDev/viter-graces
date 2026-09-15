import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus, PaymentMethodList } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import React from "react";
import ReportsStats from "../ReportsStats";
import {
  AmountRangeFilter,
  MultiRangeDateFilter,
} from "@/components/inputs/InputRangeFilter";
import { MultiRangeAmountFilter } from "@/components/inputs/InputRangeFilter";

const SalesReports = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [searchValue, setSearchValue] = React.useState("");
  const [filterColumns, setFilterColumns] = React.useState([]);

  // Columns
  const columns = [
    {
      accessorKey: "sales_order_status",
      header: "status",
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={ActiveInActiveStatus("payment-status").map(
              (option) => option.value,
            )}
            testFilterId={"filter-status"}
          />
        ),
      },
      status_option: ActiveInActiveStatus("payment-status"),
    },
    {
      accessorKey: "sales_order_number",
      header: "order #",
      classTh: "min-w-20 ",
      classTd: "",
      isMobileTitle: true,
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="sales-order/sales-orders-filter?type=order-numbers"
            testFilterId={"filter-order-number"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_date",
      header: "date",
      classTh: "min-w-[7rem]",
      classTd: "",
      filterFn: "multiDateRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter
            column={column}
            testFilterId={"filter-sales-date"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_product_name",
      header: "Products",
      classTh: "min-w-40 ",
      classTd: "",
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
      accessorKey: "sales_order_customer_name",
      header: "Customers",
      classTh: "min-w-40 ",
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
      accessorKey: "sales_order_qty",
      header: "Quantity",
      classTh: "min-w-40 ",
      classTd: "",
      meta: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-amount"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_price",
      header: "Unit Price",
      classTh: "min-w-40 ",
      classTd: "",
      meta: "",
      amount: true,
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-amount"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_discounted_with_vat_amount",
      header: "amount",
      amount: true,
      filterFn: "multiRange",
      classTh: "min-w-40 ",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-amount"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_payment_method",
      header: "method",
      classTh: "min-w-40 ",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={PaymentMethodList().map((option) => option.value)}
            testFilterId={"filter-method"}
          />
        ),
      },
      status_option: PaymentMethodList(),
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
    {
      accessorKey: "sales_order_received_by_name",
      header: "Created by",
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="product-owner/read-by-received-by"
            testFilterId={"filter-owner"}
          />
        ),
      },
    },
    {
      accessorKey: "sales_order_notes",
      header: "Notes",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="sales-reports">
        <ReportsStats searchValue={searchValue} filterColumns={filterColumns} />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="report-sales-order/page-all-sales-order"
          hasExport={true}
          setSearchValue={setSearchValue}
          setFilterColumns={setFilterColumns}
          haveFilterTable={true}
          ishaveAdd={false}
        />
      </HeaderNav>
    </>
  );
};

export default SalesReports;
