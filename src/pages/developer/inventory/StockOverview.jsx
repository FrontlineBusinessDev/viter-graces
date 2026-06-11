import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import WarningBanner from "@/layout/WarningBanner";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalStockOverview from "./modal/ModalStockOverview";
const StockOverview = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  let stockArray = [{ label: "low stock", value: "low stock" }];

  // Columns
  const columns = [
    {
      accessorKey: "stock_movement_is_active",
      header: "status",
      classTh: "w-[10rem]",
      classTd: "",
      filterFn: "equals",
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
      accessorKey: "stock_movement_product_name",
      header: "Products",
      classTh: "",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "products_sku",
      header: "SKU",
      classTh: "",
      classTd: "",
      meta: "",
      isTag: true,
    },
    {
      accessorKey: "stock_movement_location",
      header: "Location",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "current_qty",
      header: "Current Stock",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "products_low_stock_threshold",
      header: "Threshold",
      filterFn: "between",
      classTh: "min-w-[10rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "products_unit",
      header: "Unit",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "stock_movement_product_owner_name",
      header: "Product Owner",
      classTh: "",
      classTd: "",
      meta: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"inventory"} activeTab="stock-overview">
        <WarningBanner
          path="stock-movement/read-count-low-stock"
          text="products"
          description="are below low stock threshold: Cassava chips (C), Kropek."
        />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="stock-overview"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
          isDefaultMobile={"stock movement"}
          defaultSearch={true}
        />
      </HeaderNav>
      {store.isAdd && <ModalStockOverview itemEdit={itemEdit} />}
    </>
  );
};

export default StockOverview;
