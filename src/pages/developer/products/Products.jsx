import {
  SearchableSelectFilter,
  SearchableSelectFilterStatus,
} from "@/components/inputs/InputSelect";
import {
  ActiveInActiveStatus,
  DefaultActionTableList,
} from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalProducts from "./ModalProducts";
const Products = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "products_is_active",
      header: "status",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={ActiveInActiveStatus()}
          />
        ),
      },
      status_option: ActiveInActiveStatus(),
    },
    {
      accessorKey: "products_image",
      header: "image",
      classTh: "text-center min-w-[5rem]",
      classTd: "",
      isImage: true,
    },
    {
      accessorKey: "products_name",
      header: "Products",
      classTh: "min-w-[10rem]",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "products_sku",
      header: "SKU",
      classTh: "min-w-[10rem]",
      classTd: "",
      isTag: true,
      meta: "",
    },
    {
      accessorKey: "products_category",
      header: "Category",
      classTh: "min-w-[10rem]",
      classTd: "",
      isSubTitle: true,
      meta: "",
    },
    {
      accessorKey: "products_price",
      header: "Price",
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "between",
      isPrice: true,
      amount: true,
      meta: "",
    },
    {
      accessorKey: "products_cost",
      header: "Cost",
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "between",
      amount: true,
      meta: "",
    },
    {
      accessorKey: "products_stocks",
      header: "Stocks",
      classTh: "min-w-[10rem]",
      classTd: "",
      filterFn: "between",
      meta: "",
    },
    {
      accessorKey: "products_owner_name",
      header: "Products Owner ",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilter
            column={column}
            path="product-owner/read-by-product-owner"
          />
        ),
      },
    },
    {
      accessorKey: "action",
      action_array: DefaultActionTableList("products"),
      header: "Action",
      classTh: "text-center w-[7rem]",
      classTd: "opacity-100 group-hover:opacity-100 -right-3 pr-5 z-10 ",
    },
  ];

  return (
    <>
      <HeaderNav menu={"products"} activeTab="products">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="products"
          setItemEdit={setItemEdit}
          productMobile={true}
          haveFilterTable={true}
          isDefaultMobile={"products"}
        />
      </HeaderNav>
      {store.isAdd && <ModalProducts itemEdit={itemEdit} />}
    </>
  );
};

export default Products;
