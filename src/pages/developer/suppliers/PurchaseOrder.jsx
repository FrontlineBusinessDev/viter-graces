import { ActiveInActiveStatus, ActionTableList } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalPurchaseOrder from "./modal/ModalPurchaseOrder";
import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import { setIsAdd } from "@/store/StoreAction";
import { getAdminDeveloperRole } from "@/utilities/roleValidation";
import ViewAccountsPayableDetails from "./modal/ViewAccountsPayableDetails";
import {
  MultiRangeAmountFilter,
  MultiRangeDateFilter,
} from "@/components/inputs/InputRangeFilter";

const PurchaseOrder = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "is_status",
      header: "status",
      classTh: "min-w-[8rem]",
      classTd: "min-w-[8rem]",
      status_option: ActiveInActiveStatus("purchase-order-status"),
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={ActiveInActiveStatus("purchase-order-status").map(
              (option) => option.value,
            )}
            testFilterId={"filter-status"}
          />
        ),
      },
    },
    {
      accessorKey: "payment_status",
      header: "payment status",
      classTh: "min-w-[9rem]",
      classTd: "min-w-[9rem]",
      status_option: ActiveInActiveStatus("purchase-order-payment-status"),
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
      classTh: "min-w-[10rem] ",
      classTd: "",
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
      accessorKey: "formated_date",
      header: "Order date",
      orderNumber: "2",
      classTh: "min-w-[7rem] ",
      classTd: "",
      filterFn: "multiDateRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter
            column={column}
            testFilterId={"filter-order-date"}
          />
        ),
      },
    },
    {
      accessorKey: "formated_delivery_date",
      header: "expected delivery",
      classTh: "min-w-[10rem] ",
      classTd: "",
      filterFn: "multiDateRange",
      meta: {
        filterComponent: (column) => (
          <MultiRangeDateFilter
            column={column}
            testFilterId={"filter-delivery-date"}
          />
        ),
      },
    },
    {
      accessorKey: "total_amount",
      header: "total amount",
      filterFn: "multiRange",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-total-amount"}
          />
        ),
      },
      amount: true,
      paid_amount: false,
    },
    {
      accessorKey: "purchase_order_payment",
      header: "paid amount",
      filterFn: "multiRange",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-paid-amount"}
          />
        ),
      },
      amount: false,
      paid_amount: true,
    },
    {
      accessorKey: "purchase_order_balance",
      header: "Balance",
      filterFn: "multiRange",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-balance"}
          />
        ),
      },
      amount: false,
      paid_amount: true,
    },
    ...(getAdminDeveloperRole(store)
      ? [
          {
            accessorKey: "action",
            action_array: ActionTableList("purchase-order"),
            header: "Action",
            classTh: "text-center w-[7rem]",
            classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
          },
        ]
      : [
          {
            accessorKey: "action",
            action_array: ActionTableList("purchase-order", "po_product_owner"),
            header: "Action",
            classTh: "text-center w-[7rem]",
            classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
          },
        ]),
  ];

  React.useEffect(() => {
    if (window.sessionStorage.getItem("quickAdd")) {
      dispatch(setIsAdd(true));
    }
  }, [window.sessionStorage.getItem("quickAdd")]);

  return (
    <>
      <HeaderNav menu={"suppliers"} activeTab="purchase-orders">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-200px)] h-[calc(97dvh-250px)]`}
          path="purchase-order"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
          ishaveAdd={getAdminDeveloperRole(store)}
        />
      </HeaderNav>
      {store.isAdd && <ModalPurchaseOrder itemEdit={itemEdit} />}
      {store.isView && <ViewAccountsPayableDetails itemEdit={itemEdit} />}
    </>
  );
};

export default PurchaseOrder;
