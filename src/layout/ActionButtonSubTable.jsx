import ActionButton from "@/components/buttons/ActionButton";
import { setIsSubAction, setIsSubAdd } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";

const ActionButtonSubTable = ({ item, dataArray, setData, setItemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  // ACTIONS SUB ACHIEVE, RESTORE AND DELETE
  const handleSubAction = (val) => {
    dispatch(setIsSubAction(true));
    setData({
      ...dataArray,
      path:
        val?.name !== "delete"
          ? `${val?.path}/${dataArray?.id}`
          : `${dataArray?.id}`,
      action: val?.name,
    });
  };

  // ACTIONS SUB UPDATE
  const handleSubUpdate = (val) => {
    dispatch(setIsSubAdd(true));
    setItemEdit({
      ...dataArray,
    });
  };

  return (
    <>
      <div className="flex items-center lg:justify-end gap-3 ">
        {item?.action_array?.map((a, key) => {
          return (
            isEmptyItem(a?.name, "") === "edit" &&
            Number(isEmptyItem(a?.isActive, 1)) ===
              Number(isEmptyItem(dataArray?.is_active, 1)) && (
              <div key={key}>
                <ActionButton item={a} onClick={() => handleSubUpdate(a)} />
              </div>
            )
          );
        })}
        {item?.action_array?.map((a, key) => {
          return (
            isEmptyItem(a?.name, "") !== "edit" &&
            Number(isEmptyItem(a?.isActive, 1)) ===
              Number(isEmptyItem(dataArray?.is_active, 1)) && (
              <div key={key}>
                <ActionButton item={a} onClick={() => handleSubAction(a)} />
              </div>
            )
          );
        })}
      </div>
    </>
  );
};

export default ActionButtonSubTable;
