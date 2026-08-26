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
      header: "order #",
      classTh: "min-w-20 ",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "sales_order_product_name",
      header: "item",
      classTh: "min-w-40 ",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_date",
      header: "date",
      classTh: "min-w-[7rem]",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "sales_order_customer_name",
      header: "customer",
      classTh: "min-w-40 ",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_discounted_with_vat_amount",
      header: "amount",
      amount: true,
      filterFn: "between",
      classTh: "min-w-40 ",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "sales_order_payment_method",
      header: "method",
      classTh: "min-w-40 ",
      classTd: "",
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
    {
      accessorKey: "sales_order_received_by_name",
      header: "Created by",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilter
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
