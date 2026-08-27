import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalReturns from "./ModalReturns";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import { setIsAdd } from "@/store/StoreAction";
import {
  SearchableSelectFilter,
  SearchableSelectFilterStatus,
} from "@/components/inputs/InputSelect";
import { getAdminDeveloperRole } from "@/utilities/roleValidation";

const Returns = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);
  const [dataCount, setDataCount] = React.useState("...Loading");

  // Columns
  const columns = [
    {
      accessorKey: "is_status",
      header: "status",
      classTh: "min-w-[10rem]",
      classTd: "min-w-[10rem]",
      updateDataColumn: getAdminDeveloperRole(store),
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
      accessorKey: "return_product_resolution_type",
      header: "resolution type",
      classTh: "",
      classTd: "capitalize",
      meta: "",
    },
    {
      accessorKey: "return_product_amount",
      header: "amount",
      amount: true,
      classTh: "",
      classTd: "",
      filterFn: "between",
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

  React.useEffect(() => {
    if (window.sessionStorage.getItem("quickAdd")) {
      dispatch(setIsAdd(true));
    }
  }, [window.sessionStorage.getItem("quickAdd")]);

  return (
    <>
      <HeaderNav
        menu={"returns"}
        description={`${dataCount} total returns`}
        activeTab="returns"
      >
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-200px)] h-[calc(97dvh-250px)]`}
          path="returns-products"
          haveFilterTable={true}
          ishaveAdd={getAdminDeveloperRole(store)}
          setItemEdit={setItemEdit}
          setDataCount={setDataCount}
        />
      </HeaderNav>
      {store.isAdd && <ModalReturns itemEdit={itemEdit} />}
    </>
  );
};

export default Returns;
