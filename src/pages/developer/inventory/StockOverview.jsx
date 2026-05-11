import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { TriangleAlert } from "lucide-react";
import React from "react";
import ModalStockOverview from "./modal/ModalStockOverview";
import { SearchableSelectFilter } from "@/components/inputs/InputSelect";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
const StockOverview = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "user_account_is_active",
      header: "status",
      classTh: "w-[5rem]",
      classTd: "",
      filterFn: "equals",
      meta: {
        filterComponent: (column) => (
          <SearchableSelectFilter
            column={column}
            options={ActiveInActiveStatus()}
          />
        ),
      },
      status_option: ActiveInActiveStatus(),
    },
    {
      accessorKey: "name",
      header: "Products",
      classTh: "",
      classTd: "",
      isMobileTitle: true,
      meta: "",
    },
    {
      accessorKey: "sku",
      header: "SKU",
      classTh: "",
      classTd: "",
      meta: "",
      isTag: true,
    },
    {
      accessorKey: "location",
      header: "Location",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "stock",
      header: "Current Stock",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "threshold",
      header: "Threshold",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "unit",
      header: "Unit",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "product_owner",
      header: "Product Owner",
      classTh: "",
      classTd: "",
      meta: "",
    },
  ];

  const mockData = [
    {
      id: 1,
      status: 1,
      name: "Banana Chips",
      sku: "MBP14-001",
      location: "San Pablo City, Laguna",
      stock: "20",
      threshold: "13",
      unit: "12",
      product_owner: "Louren Rubico",
    },
    {
      id: 2,
      status: 1,
      name: "Chips",
      sku: "MBP14-001",
      location: "Nagcarlan, Laguna",
      stock: "20",
      threshold: "13",
      unit: "12",
      product_owner: "Cyrene Lumabas",
    },
  ];

  return (
    <>
      <HeaderNav menu={"inventory"} activeTab="stock-overview">
        <div className="bg-orange-100 text-orange-600 dark:bg-orange-200 dark:text-orange-300 border border-orange-300 rounded-xl px-3 py-2 my-2  ">
          <div className="flex items-center gap-2">
            <TriangleAlert size={14} className="place-self-start mt-0.5" />
            <p className="dark:text-orange-600 mb-0 ">
              <span className="dark:text-orange-600 font-bold ">
                2 products
              </span>{" "}
              are below low stock threshold: Cassava chips (C), Kropek.
            </p>
          </div>
        </div>
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(93dvh-200px)] h-[calc(97dvh-250px)]`}
          path="stock movement"
          setItemEdit={setItemEdit}
          haveFilterTable={true}
          mockData={mockData}
          isStatic={true}
          isDefaultMobile={"stock movement"}
        />
      </HeaderNav>
      {store.isAdd && <ModalStockOverview itemEdit={itemEdit} />}
    </>
  );
};

export default StockOverview;
