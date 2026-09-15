import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { MultiRangeDateFilter } from "@/components/inputs/InputRangeFilter";
import { MultiRangeAmountFilter } from "@/components/inputs/InputRangeFilter";

const ReturnsReports = () => {
  const { store } = React.useContext(StoreContext);
  const [searchValue, setSearchValue] = React.useState("");
  const [filterColumns, setFilterColumns] = React.useState([]);

  // Columns - no accessorKey: "action" column, so ActionButtonTable never
  // renders for this report (read-only, per requirement #2 - no add/edit/delete).
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
      accessorKey: "return_product_number",
      header: "return #",
      classTh: "min-w-22",
      classTd: "",
      isMobileTitle: true,
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="returns-products/returns-filters?type=return-product-numbers"
            testFilterId={"filter-return-product-number"}
          />
        ),
      },
    },
    {
      accessorKey: "return_product_date",
      header: "date",
      classTh: "min-w-[7rem]",
      classTd: "",
      filterFn: "multiDateRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter
            column={column}
            testFilterId={"filter-return-date"}
          />
        ),
      },
    },
    {
      accessorKey: "return_product_order_number",
      header: "order #",
      classTh: "min-w-22",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="returns-products/returns-filters?type=return-order-numbers"
            testFilterId={"filter-return-order-number"}
          />
        ),
      },
    },
    {
      accessorKey: "return_product_customer_name",
      header: "Customers",
      classTh: "min-w-40",
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
      accessorKey: "return_product_product_name",
      header: "Products",
      classTh: "min-w-40",
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
      accessorKey: "return_product_amount",
      header: "amount",
      amount: true,
      filterFn: "multiRange",
      classTh: "min-w-40",
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
      accessorKey: "return_product_reason",
      header: "reason",
      classTh: "min-w-40",
      classTd: "capitalize",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="returns-products/returns-filters?type=return-product-reasons"
            testFilterId={"filter-return-product-reason"}
          />
        ),
      },
    },
    {
      accessorKey: "return_product_resolution_type",
      header: "resolution type",
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
      accessorKey: "return_product_is_restocked",
      header: "restocked",
      classTh: "min-w-30",
      classTd: "uppercase",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={ActiveInActiveStatus("restocked-status")}
            testFilterId={"filter-restocked"}
          />
        ),
      },
      status_option: ActiveInActiveStatus("restocked-status"),
    },
    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
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
        ]),
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="returns-report">
        <ReportsStats searchValue={searchValue} filterColumns={filterColumns} />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(82dvh-230px)] h-[calc(97dvh-250px)]`}
          path="report-sales-order/page-all-returns"
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

export default ReturnsReports;
