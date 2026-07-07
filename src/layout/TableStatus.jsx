import Pills from "@/components/Pills";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";

const TableStatus = ({ item, dataArray }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const selectedItem =
    isEmptyItem(item?.status_option, "") !== ""
      ? isEmptyItem(
          item?.status_option.find(
            (option) =>
              option.label === isEmptyItem(dataArray?.is_status, "") ||
              option.label === isEmptyItem(dataArray?.products_status, "") ||
              option.label === isEmptyItem(dataArray?.payment_status, "") ||
              option.value === Number(isEmptyItem(dataArray?.is_active, 1)),
          )?.label,
          "",
        ) === ""
        ? item?.status_option.find(
            (option) =>
              option.label === isEmptyItem(dataArray?.inventory_status, ""),
          )?.label
        : item?.status_option.find(
            (option) =>
              option.label === isEmptyItem(dataArray?.is_status, "") ||
              option.label === isEmptyItem(dataArray?.products_status, "") ||
              option.label === isEmptyItem(dataArray?.payment_status, "") ||
              option.value === Number(isEmptyItem(dataArray?.is_active, 1)),
          )?.label
      : dataArray?.status_text;

  return (
    <>
      <div className="">
        <Pills variant={selectedItem}>{selectedItem}</Pills>
      </div>
    </>
  );
};

export default TableStatus;
