import {
  SearchableSelectFilter,
  SearchableSelectFilterStatus,
} from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalPurchaseOrderMovement from "./modal/ModalPurchaseOrderMovement";

const PurchaseOrderMovement = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "is_status",
      header: "status",
      classTh: "w-[5rem]",
      classTd: "w-[10rem]",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus("return-status")}
            testFilterStatusId={"return-status"}
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
      meta: "",
    },
    {
      accessorKey: "return_product_date",
      header: "date",
      classTh: "",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "return_product_order_number",
      header: "order #",
      classTh: "min-w-[6rem] ",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "return_product_customer_name",
      header: "customer",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "return_product_product_name",
      header: "Product",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "return_product_owner_name",
      header: "Product Owner",
      classTh: "min-w-40 ",
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
    {
      accessorKey: "return_product_amount",
      header: "amount",
      amount: true,
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "return_product_reason",
      header: "reason",
      classTh: "",
      classTd: "capitalize",
      meta: "",
    },
    {
      accessorKey: "return_product_is_restocked",
      header: "restocked",
      classTh: "",
      classTd: "uppercase ",
      meta: "",
    },
  ];
  return (
    <>
      <HeaderNav menu={"suppliers"} activeTab="purchase-movement-history">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-200px)] h-[calc(97dvh-250px)]`}
          path="purchase-movement-history"
          haveFilterTable={true}
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <ModalPurchaseOrderMovement itemEdit={itemEdit} />}
    </>
  );
};

export default PurchaseOrderMovement;
