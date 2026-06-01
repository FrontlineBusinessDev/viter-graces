import { SearchableSelectFilterStatus } from "@/components/inputs/InputSelect";
import { StockTypeArray } from "@/layout/ArrayValue";
import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { TriangleAlert } from "lucide-react";
import React from "react";
import ModalStockOverview from "./modal/ModalStockOverview";
import WarningBanner from "@/layout/WarningBanner";
const MovementHistory = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "stock_movement_type",
      header: "status",
      classTh: "w-[10rem]",
      classTd: "",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilterStatus
            column={column}
            options={StockTypeArray()}
          />
        ),
      },
    },
    {
      accessorKey: "stock_movement_date",
      header: "Date",
      classTh: "",
      classTd: "",
      filterFn: "date",
      meta: "",
    },
    {
      accessorKey: "stock_movement_product_name",
      header: "Products",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "stock_movement_qty",
      header: "QTY",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "stock_movement_before_qty",
      header: "Before",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "stock_movement_after_qty",
      header: "After",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "stock_movement_location",
      header: "Locations",
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
    {
      accessorKey: "stock_movement_notes",
      header: "Notes",
      classTh: "",
      classTd: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"inventory"} activeTab="movement-history">
        <WarningBanner
          path="stock-movement/read-count-low-stock"
          text="products"
          description="are below low stock threshold: Cassava chips (C), Kropek."
        />
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="stock-movement"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
        />
      </HeaderNav>
      {store.isAdd && <ModalStockOverview itemEdit={itemEdit} />}
    </>
  );
};

export default MovementHistory;
