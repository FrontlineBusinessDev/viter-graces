import Pills from "@/components/Pills";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";

const TableStatus = ({ item, dataArray }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  return (
    <>
      {item?.status_option?.map((i, key) => {
        return (
          i?.value === Number(isEmptyItem(dataArray?.is_active, 1)) && (
            <div key={key} className="capitalize">
              <Pills
                variant={
                  item?.status_text
                    ? dataArray[`${item?.status_text}`].toLowerCase()
                    : i?.label.toLowerCase()
                }
              >
                {item?.status_text
                  ? dataArray[`${item?.status_text}`]
                  : i?.label}
              </Pills>
            </div>
          )
        );
      })}
    </>
  );
};

export default TableStatus;
