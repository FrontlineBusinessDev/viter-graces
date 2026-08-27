import { ActionTableList } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalExpenses from "./ModalExpenses";
import { SearchableSelectFilter } from "@/components/inputs/InputSelect";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { getAdminDeveloperRole } from "@/utilities/roleValidation";

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
      accessorKey: "purchase_order_supplier_name",
      header: "Supplier",
      classTh: "min-w-[10rem]",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "purchase_order_number",
      header: "PO Number",
      orderNumber: "1",
      classTh: "min-w-[7rem] ",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "purchase_order_product_name",
      header: "Products",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "purchase_order_total_paid_per_product",
      header: "Paid Amount",
      amount: true,
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "formated_date",
      header: "Date",
      classTh: "w-[10rem]",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
          {
            accessorKey: "purchase_order_product_owner_name",
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

    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
          {
            accessorKey: "action",
            haveAction: "action",
            action_array: ActionTableList("expenses", "finance-expenses"),
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
        />
      </HeaderNav>
      {store.isAdd && <ModalExpenses itemEdit={itemEdit} />}
    </>
  );
};

export default Expenses;
