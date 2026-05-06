import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import { TriangleAlert } from "lucide-react";
import React from "react";
import ModalStockOverview from "./modal/ModalStockOverview";
const MovementHistory = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "user_account_is_active",
      header: "Type",
      classTh: "w-[5rem]",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "name",
      header: "Date",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "contact person",
      header: "Products",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "email",
      header: "QTY",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "phone",
      header: "Before",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "address",
      header: "After",
      classTh: "",
      classTd: "",
      meta: "",
    },
    {
      accessorKey: "location",
      header: "Locations",
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
    {
      accessorKey: "notes",
      header: "Notes",
      classTh: "",
      classTd: "",
    },
  ];

  return (
    <>
      <HeaderNav menu={"inventory"} activeTab="movement-history">
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
        />
      </HeaderNav>
      {store.isAdd && <ModalStockOverview itemEdit={itemEdit} />}
    </>
  );
};

export default MovementHistory;
