import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import {
  ActionTableList,
  ActiveInActiveStatus,
  RefundMethodList,
} from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { setIsAdd } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { getAdminDeveloperRole } from "@/utilities/roleValidation";
import React from "react";
import ModalReturns from "./ModalReturns";
import { devNavUrl } from "@/config/config";
import { MultiRangeAmountFilter } from "@/components/inputs/InputRangeFilter";
import { MultiRangeDateFilter } from "@/components/inputs/InputRangeFilter";

const Returns = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [dataCount, setDataCount] = React.useState("...Loading");
  const userRole = store.credentials?.data?.role;

  // Columns
  const columns = [
    {
      accessorKey: "is_status",
      header: "status",
      classTh: "min-w-[10rem]",
      classTd: "min-w-[10rem]",
      updateDataColumn: getAdminDeveloperRole(store),
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
      classTh: "min-w-[6rem] ",
      classTd: "",
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
      classTh: "min-w-40",
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
      classTh: "min-w-[6rem] ",
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
      link: `${devNavUrl}/${userRole}/sales-orders`,
      filterOnClickId: "sales_order_customer_name",
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
      accessorKey: "return_product_product_name",
      header: "Products",
      classTh: "min-w-[10rem] ",
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
      accessorKey: "return_product_owner_name",
      header: "Product Owner",
      classTh: "min-w-40 ",
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
    {
      accessorKey: "resolution_type",
      header: "resolution type",
      classTh: "min-w-40 ",
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
      accessorKey: "return_product_amount",
      header: "amount",
      amount: true,
      classTh: "min-w-40",
      classTd: "",
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
      accessorKey: "return_product_paid_amount",
      header: "return amount",
      amount: true,
      classTh: "min-w-40",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-return-amount"}
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
    {
      accessorKey: "return_product_refund_method",
      header: "payment method",
      classTh: "min-w-[10rem]",
      classTd: "uppercase",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={RefundMethodList().map((option) => option.value)}
            testFilterId={"filter-resolution-type"}
          />
        ),
      },
    },
    {
      accessorKey: "action",
      action_array: ActionTableList("returns-products", "edit-delete-status"),
      editDeleteStatuses: ["pending", "rejected"],
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  React.useEffect(() => {
    if (window.sessionStorage.getItem("quickAdd")) {
      dispatch(setIsAdd(true));
    }
  }, [window.sessionStorage.getItem("quickAdd")]);

  return (
    <>
      <HeaderNav
        menu={"returns"}
        description={`${dataCount} total returns`}
        activeTab="returns"
      >
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-200px)] h-[calc(97dvh-250px)]`}
          path="returns-products"
          haveFilterTable={true}
          ishaveAdd={getAdminDeveloperRole(store)}
          setItemEdit={setItemEdit}
          setDataCount={setDataCount}
        />
      </HeaderNav>
      {store.isAdd && <ModalReturns itemEdit={itemEdit} />}
    </>
  );
};

export default Returns;
