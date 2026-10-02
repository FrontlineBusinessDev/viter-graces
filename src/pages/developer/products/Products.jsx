import {
  DropdownFilter,
  NumberOperatorFilter,
  TextOperatorFilter,
} from "@/components/inputs/InputOperatorFilter";
import { ActiveInActiveStatus, ActionTableList } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalProducts from "./ModalProducts";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { setIsAdd } from "@/store/StoreAction";
import { getAdminDeveloperRole } from "@/utilities/roleValidation";
import DemoLimitModal from "@/components/modals/DemoLimitModal";
const Products = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  
  const columns = [
    {
      accessorKey: "products_is_active",
      header: "status",
      classTh: "min-w-[8rem]",
      classTd: "",
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <DropdownFilter
            column={column}
            options={ActiveInActiveStatus().filter((o) =>
              o.name.includes("default-status"),
            )}
            testFilterId={"filter-status"}
          />
        ),
      },
      status_option: ActiveInActiveStatus(),
    },
    {
      accessorKey: "products_name",
      header: "Products",
      classTh: "min-w-[10rem] ",
      classTd: "",
      isMobileTitle: true,
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <TextOperatorFilter
            column={column}
            testFilterId={"filter-product-name"}
          />
        ),
      },
    },
    {
      accessorKey: "products_sku",
      header: "SKU",
      classTh: "min-w-[10rem] ",
      classTd: "",
      isTag: true,
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <TextOperatorFilter
            column={column}
            testFilterId={"filter-product-sku"}
          />
        ),
      },
    },
    {
      accessorKey: "products_category",
      header: "Category",
      classTh: " min-w-[10rem]",
      classTd: "",
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <TextOperatorFilter
            column={column}
            testFilterId={"filter-category"}
          />
        ),
      },
    },
    {
      accessorKey: "products_price",
      header: "Price",
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "operator",
      isPrice: true,
      amount: true,
      meta: {
        filterComponent: (column) => (
          <NumberOperatorFilter
            column={column}
            testFilterId={"filter-price"}
          />
        ),
      },
    },
    {
      accessorKey: "products_cost",
      header: "Estimated Cost Price",
      classTh: "min-w-[12rem]",
      classTd: "",
      filterFn: "operator",
      amount: true,
      meta: {
        filterComponent: (column) => (
          <NumberOperatorFilter
            column={column}
            testFilterId={"filter-cost"}
          />
        ),
      },
    },
    {
      accessorKey: "products_stocks",
      header: "Stocks",
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "operator",
      meta: {
        filterComponent: (column) => (
          <NumberOperatorFilter
            column={column}
            testFilterId={"filter-stocks"}
          />
        ),
      },
    },
    ...(Number(ProductOwnerId(store)) > 0
      ? []
      : [
          {
            accessorKey: "products_owner_name",
            header: "Product Owner",
            classTh: "min-w-[10rem]",
            classTd: "",
            filterFn: "operator",
            meta: {
              filterComponent: (column) => (
                <TextOperatorFilter
                  column={column}
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
            action_array: ActionTableList("products"),
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
      <HeaderNav menu={"products"} activeTab="products">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-200px)] h-[calc(97dvh-250px)]`}
          path="products"
          setItemEdit={setItemEdit}
          productMobile={true}
          haveFilterTable={true}
          ishaveAdd={getAdminDeveloperRole(store)}
          dataTestidAddButton="add-product-btn"
        />
      </HeaderNav>
      {/* {store.isAdd && (
        <DemoLimitModal onClose={() => dispatch(setIsAdd(false))} />
      )} */}
      {store.isAdd && <ModalProducts itemEdit={itemEdit} />}
    </>
  );
};

export default Products;
