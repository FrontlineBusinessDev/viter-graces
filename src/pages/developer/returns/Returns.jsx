import HeaderNav from "@/layout/headers/HeaderNav";
import InfiniteTable from "@/layout/table/InfiniteTable";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import ModalReturns from "./ModalReturns";
import { ActiveInActiveStatus } from "@/layout/ArrayValue";
import { setIsAdd } from "@/store/StoreAction";

const Returns = () => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [itemEdit, setItemEdit] = React.useState(null);

  // Columns
  const columns = [
    {
      accessorKey: "is_status",
      header: "status",
      classTh: "w-[5rem]",
      classTd: "",
      status_option: ActiveInActiveStatus("return-status"),
    },
    {
      accessorKey: "return_product_number",
      header: "return #",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "return_product_date",
      header: "date",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "return_product_order_number",
      header: "order #",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "return_product_customer_name",
      header: "customer",
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "return_product_amount",
      header: "amount",
      amount: true,
      classTh: "",
      classTd: "",
    },
    {
      accessorKey: "return_product_reason",
      header: "reason",
      classTh: "",
      classTd: "capitalize",
    },
    {
      accessorKey: "return_product_is_restocked",
      header: "restocked",
      classTh: "",
      classTd: "",
      status_option: ActiveInActiveStatus("restocked-status"),
    },
  ];

  React.useEffect(() => {
    if (window.sessionStorage.getItem("quickAdd")) {
      dispatch(setIsAdd(true));
    }
  }, [window.sessionStorage.getItem("quickAdd")]);

  return (
    <>
      <HeaderNav menu={"returns"} activeTab="returns">
        <InfiniteTable
          columns={columns}
          className={`sm:overflow-auto sm:h-[calc(100dvh-200px)] h-[calc(97dvh-250px)]`}
          path="returns-products"
          setItemEdit={setItemEdit}
        />
      </HeaderNav>
      {store.isAdd && <ModalReturns itemEdit={itemEdit} />}
    </>
  );
};

export default Returns;
