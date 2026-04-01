import ActionButton from "@/components/buttons/ActionButton";
import { setIsAction } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import React from "react";

const ActionButtonTable = ({ item, dataArray, setData }) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const handleAction = (val) => {
    dispatch(setIsAction(true));

    console.log("a", val);

    setData({ ...val, ...dataArray, action: val?.name });
  };

  return (
    <>
      <div className="flex items-center justify-end gap-3">
        {item?.action_array?.map((a, key) => {
          return (
            <div key={key}>
              <ActionButton item={a} onClick={() => handleAction(a)} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ActionButtonTable;
