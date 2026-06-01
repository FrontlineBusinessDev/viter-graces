import Pills from "@/components/Pills";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";

const TableStatus = ({ item, dataArray }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  console.log("item", dataArray);
  return (
    <>
      {isEmptyItem(item?.status_option, "") !== "" ? (
        item?.status_option?.map((i, key) => {
          return (
            i?.value === Number(isEmptyItem(dataArray?.is_active, 1)) && (
              <div key={key} className="">
                <Pills
                  variant={
                    item?.status_text
                      ? dataArray[`${item?.status_text}`].toLowerCase()
                      : i?.label.toLowerCase().replaceAll(" ", "_")
                  }
                >
                  {item?.status_text
                    ? dataArray[`${item?.status_text}`]
                    : i?.label}
                </Pills>
              </div>
            )
          );
        })
      ) : (
        <div className="">
          <Pills
            variant={dataArray?.status_text
              ?.toLowerCase()
              ?.replaceAll(" ", "_")}
          >
            {dataArray?.status_text}
          </Pills>
        </div>
      )}
    </>
  );
};

export default TableStatus;
