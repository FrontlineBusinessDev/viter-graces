import ActionButton from "@/components/buttons/ActionButton";
import { setIsAction, setIsAdd, setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";

const ActionButtonTable = ({ item, dataArray, setData, setItemEdit, path }) => {
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
      menu: path,
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
  // ACTIONS UPDATE
  const handleView = (val) => {
    dispatch(setIsView(true));
    setItemEdit({
      ...dataArray,
    });
  };

  return (
    <>
      <div className="flex items-center justify-end gap-3 ">
        {item?.action_array?.map((a, akey) => {
          return (
            isEmptyItem(a?.name, "") === "view" &&
            Number(isEmptyItem(a?.isActive, 1)) ===
              Number(isEmptyItem(dataArray?.is_active, 1)) && (
              <div key={akey}>
                <ActionButton item={a} onClick={() => handleView(a)} />
              </div>
            )
          );
        })}
        {item?.action_array?.map((a, akey) => {
          return (
            isEmptyItem(a?.name, "") === "edit" &&
            Number(isEmptyItem(a?.isActive, 1)) ===
              Number(isEmptyItem(dataArray?.is_active, 1)) && (
              <div key={akey}>
                <ActionButton item={a} onClick={() => handleUpdate(a)} />
              </div>
            )
          );
        })}
        {item?.action_array?.map((b, bkey) => {
          return (
            isEmptyItem(b?.name, "") !== "edit" &&
            isEmptyItem(b?.name, "") !== "view" &&
            Number(isEmptyItem(b?.isActive, 1)) ===
              Number(isEmptyItem(dataArray?.is_active, 1)) && (
              <div key={bkey}>
                <ActionButton item={b} onClick={() => handleAction(b)} />
              </div>
            )
          );
        })}
      </div>
    </>
  );
};

export default ActionButtonTable;
