import ActionButton from "@/components/buttons/ActionButton";
import { setIsAction, setIsAdd } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";

const ActionButtonTable = ({ item, dataArray, setData, setItemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  // ACTIONS ACHIEVE, RESTORE AND DELETE
  const handleAction = (val) => {
    dispatch(setIsAction(true));
    setData({
      ...dataArray,
      path:
        val?.name !== "delete"
          ? `${val?.path}/${dataArray?.id}`
          : `${dataArray?.id}`,
      action: val?.name,
    });
  };
  // ACTIONS UPDATE
  const handleUpdate = (val) => {
    dispatch(setIsAdd(true));
    setItemEdit({
      ...dataArray,
    });
  };

  return (
    <>
      <div className="flex items-center justify-end gap-3 ">
        {item?.action_array?.map((a, key) => {
          return (
            isEmptyItem(a?.name, "") === "edit" &&
            Number(isEmptyItem(a?.isActive, 1)) ===
              Number(isEmptyItem(dataArray?.is_active, 1)) && (
              <div key={key}>
                <ActionButton item={a} onClick={() => handleUpdate(a)} />
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
                <ActionButton item={a} onClick={() => handleAction(a)} />
              </div>
            )
          );
        })}
      </div>
    </>
  );
};

export default ActionButtonTable;
