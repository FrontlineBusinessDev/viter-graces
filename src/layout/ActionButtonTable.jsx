import ActionButton from "@/components/buttons/ActionButton";
import { setIsAction, setIsAdd, setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";

const ActionButtonTable = ({ item, dataArray, setData, setItemEdit, path }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  // when a column restricts edit/delete to specific statuses (e.g. Returns:
  // only pending/rejected are editable), hide those two actions otherwise
  const isEditDeleteAllowed = (name) =>
    !item?.editDeleteStatuses ||
    !["edit", "delete"].includes(name) ||
    item.editDeleteStatuses.includes(dataArray?.is_status);

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
      ...val,
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
        <div className=" right-5 flex gap-x-2 items-center h-full ">
          {item?.action_array?.map((a, akey) => {
            return (
              isEmptyItem(a?.name, "") === "view" &&
              Number(isEmptyItem(a?.isActive, 1)) ===
                Number(isEmptyItem(dataArray?.is_active, 1)) && (
                <div key={akey}>
                  <ActionButton
                    item={a}
                    onClick={() => handleView(a)}
                    data-testid={a.testId}
                  />
                </div>
              )
            );
          })}
          {item?.action_array?.map((a, akey) => {
            return (
              isEmptyItem(a?.name, "") === "edit" &&
              Number(isEmptyItem(a?.isActive, 1)) ===
                Number(isEmptyItem(dataArray?.is_active, 1)) &&
              isEditDeleteAllowed("edit") && (
                <div key={akey}>
                  <ActionButton
                    item={a}
                    onClick={() => handleUpdate(a)}
                    data-testid={a.testId}
                  />
                </div>
              )
            );
          })}
          {item?.action_array?.map((b, bkey) => {
            return (
              isEmptyItem(b?.name, "") !== "edit" &&
              isEmptyItem(b?.name, "") !== "view" &&
              Number(isEmptyItem(b?.isActive, 1)) ===
                Number(isEmptyItem(dataArray?.is_active, 1)) &&
              isEditDeleteAllowed(isEmptyItem(b?.name, "")) && (
                <div key={bkey}>
                  <ActionButton
                    item={b}
                    onClick={() => handleAction(b)}
                    data-testid={b.testId}
                  />
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ActionButtonTable;
