import {
  SearchableSelectFilter,
  SearchableSelectFilterStatus,
} from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ReportsStats from "../ReportsStats";
import { ProductOwnerId } from "@/utilities/productOwnerToken";

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
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("return-status")}
          />
        ),
      },
      status_option: ActiveInActiveStatus("return-status"),
    },
    {
      accessorKey: "return_product_number",
      header: "return #",
      classTh: "min-w-20",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "return_product_date",
      header: "date",
      classTh: "min-w-[7rem]",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "return_product_order_number",
      header: "order #",
      classTh: "min-w-20",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "return_product_customer_name",
      header: "Customers",
      classTh: "min-w-40",
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
      accessorKey: "return_product_product_name",
      header: "Products",
      classTh: "min-w-40",
      classTd: "",
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
      accessorKey: "return_product_amount",
      header: "amount",
      amount: true,
      filterFn: "between",
      classTh: "min-w-40",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "return_product_reason",
      header: "reason",
      classTh: "min-w-40",
      classTd: "capitalize",
      meta: "",
    },
    {
      accessorKey: "return_product_resolution_type",
      header: "resolution type",
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
      accessorKey: "return_product_is_restocked",
      header: "restocked",
      classTh: "min-w-30",
      classTd: "uppercase",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("restocked-status")}
          />
        ),
      },
    },
    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
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
        ]),
  ];

  return (
    <>
      <HeaderNav menu={"reports"} activeTab="returns-reports">
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
