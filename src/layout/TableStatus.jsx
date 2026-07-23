import Pills from "@/components/Pills";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";

const TableStatus = ({ item, dataArray }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const statusToMatch =
    (item.header === "status" && isEmptyItem(dataArray?.is_status, "")) ||
    isEmptyItem(dataArray?.products_status, "") ||
    (item.header === "payment status" &&
      isEmptyItem(dataArray?.payment_status, ""));

  const selectedItem =
    item?.status_option
      ?.find(
        (o) =>
          o.label.toLowerCase() === statusToMatch.toLowerCase() ||
          o.value === Number(dataArray?.is_active ?? 1),
      )
      ?.label.toLowerCase() ??
    item?.status_option
      ?.find((o) => o.label === dataArray?.inventory_status)
      ?.label.toLowerCase() ??
    dataArray?.status_text;

  return (
    <>
      <div className="">
        <Pills variant={selectedItem}>{selectedItem}</Pills>
      </div>
    </>
  );
};

export default TableStatus;
