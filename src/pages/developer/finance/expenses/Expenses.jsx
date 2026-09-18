import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import {
  ActionTableList,
  ActiveInActiveStatus,
  PaymentMethodList,
} from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { getAdminDeveloperRole } from "@/utilities/roleValidation";
import React from "react";
import ModalExpenses from "./ModalExpenses";
import { MultiRangeAmountFilter } from "@/components/inputs/InputRangeFilter";
import { MultiRangeDateFilter } from "@/components/inputs/InputRangeFilter";

const Expenses = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [isView, setView] = React.useState(false);

  const handleView = (item) => {
    setView(true);
    setItemEdit(item);
  };

  // Columns
  const columns = [
    {
      accessorKey: "payment_status",
      header: "payment status",
      classTh: "min-w-[9rem]",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={ActiveInActiveStatus(
              "purchase-order-payment-status",
            ).map((option) => option.value)}
            testFilterId={"filter-payment-status"}
          />
        ),
      },
      status_option: ActiveInActiveStatus("purchase-order-payment-status"),
    },
    {
      accessorKey: "formated_date",
      header: "Transaction Date",
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "multiDateRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter column={column} testFilterId={"filter-date"} />
        ),
      },
    },
    {
      accessorKey: "purchase_order_note",
      header: "Note",
      orderNumber: "1",
      classTh: "min-w-[7rem] ",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "purchase_order_number",
      header: "PO Number",
      orderNumber: "1",
      classTh: "min-w-[7rem] ",
      classTd: "",
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="purchase-order/read-group-by-filter?type=poNumberSupplier"
            testFilterId={"filter-order-number"}
          />
        ),
      },
    },
    {
      accessorKey: "purchase_order_supplier_name",
      header: "Supplier",
      classTh: "min-w-[10rem]",
      classTd: "",
      isMobileTitle: true,
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            path="suppliers"
            // path="suppliers/read-group-by-filter"
            testFilterId={"filter-supplier"}
          />
        ),
      },
    },
    {
      accessorKey: "purchase_order_product_name",
      header: "Products",
      classTh: "min-w-[10rem]",
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
      accessorKey: "purchase_order_total_paid_per_product",
      header: "Paid Amount",
      amount: true,
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "multiRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-paid-amount"}
          />
        ),
      },
    },
    {
      accessorKey: "purchase_order_payment_method",
      header: "Method",
      classTh: "min-w-[10rem]",
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
            accessorKey: "purchase_order_product_owner_name",
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

    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
          {
            accessorKey: "action",
            haveAction: "action",
            action_array: ActionTableList("expenses", "finance-expenses"),
            // A paid expense is settled - hide its actions entirely (payment
            // status, not is_status, is what carries "paid" for this row).
            viewOnlyStatuses: ["paid"],
            viewOnlyStatusField: "payment_status",
            // An unpaid expense against the "Other operating expenses"
            // pseudo-supplier isn't a real purchase order - it can only be
            // removed, not archived/edited (see expenses create/update.php,
            // which hardcode this exact supplier name for such rows).
            deleteOnlyCondition: (row) =>
              row?.payment_status === "unpaid" &&
              row?.purchase_order_supplier_name ===
                "Other operating expenses",
            // A partially paid expense already has money applied to it -
            // don't allow it to be archived or deleted outright.
            hiddenActionStatuses: {
              field: "payment_status",
              statuses: ["partially paid"],
              actions: ["archive", "delete"],
            },
            header: "Action",
            classTh: " text-center ",
            classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
          },
        ]),
  ];

  return (
    <>
      <HeaderNav menu={"finance"} activeTab="expenses">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-203px)] h-[calc(97dvh-250px)]`}
          path="finance-expenses"
          setItemEdit={setItemEdit}
          ishaveAdd={getAdminDeveloperRole(store)}
          haveFilterTable={true}
          hasExport={true}
        />
      </HeaderNav>
      {store.isAdd && <ModalExpenses itemEdit={itemEdit} />}
    </>
  );
};

export default Expenses;
