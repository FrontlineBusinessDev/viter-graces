import { MultiSelectCheckboxFilter } from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalPurchaseOrderMovement from "./modal/ModalPurchaseOrderMovement";
import { getAdminDeveloperRole } from "@/utilities/roleValidation";
import { MultiRangeDateFilter } from "@/components/inputs/InputRangeFilter";
import { MultiRangeAmountFilter } from "@/components/inputs/InputRangeFilter";

const PurchaseOrderMovement = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "is_status",
      header: "status",
      classTh: "min-w-[8rem]",
      classTd: "min-w-[8rem]",
      status_option: ActiveInActiveStatus("purchase-movement-status"),
      filterFn: "multiSelect",
      meta: {
        filterComponent: (column) => (
          <MultiSelectCheckboxFilter
            column={column}
            staticOptions={ActiveInActiveStatus("purchase-movement-status").map(
              (option) => option.value,
            )}
            testFilterId={"filter-status"}
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
            testFilterId={"filter-supplier"}
          />
        ),
      },
    },
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
    {
      accessorKey: "purchase_order_qty",
      header: "quantity",
      filterFn: "multiRange",
      classTh: "w-[10rem] min-w-[10rem] ",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter column={column} testFilterId={"filter-qty"} />
        ),
      },
    },
    {
      accessorKey: "purchase_order_before_qty",
      header: "before",
      filterFn: "multiRange",
      classTh: "w-[10rem] min-w-[10rem] ",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-before"}
          />
        ),
      },
    },
    {
      accessorKey: "purchase_order_after_qty",
      header: "after",
      filterFn: "multiRange",
      classTh: "w-[10rem] min-w-[10rem] ",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <MultiRangeAmountFilter
            column={column}
            testFilterId={"filter-after"}
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
      accessorKey: "purchase_order_transfer_note",
      header: "Note",
      orderNumber: "1",
      classTh: "min-w-[7rem] ",
      classTd: "",
      meta: "",
    },
  ];
  return (
    <>
      <HeaderNav menu={"suppliers"} activeTab="purchase-movement-history">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-200px)] h-[calc(97dvh-250px)]`}
          path="purchase-order-movement"
          addLabel={"Transfer supply"}
          haveFilterTable={true}
          ishaveAdd={getAdminDeveloperRole(store)}
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <ModalPurchaseOrderMovement itemEdit={itemEdit} />}
    </>
  );
};

export default PurchaseOrderMovement;
