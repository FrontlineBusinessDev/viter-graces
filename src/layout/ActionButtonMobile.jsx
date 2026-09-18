import ActionButton from "@/components/buttons/ActionButton";
import { setIsAction, setIsAdd, setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import {
  ArchiveRestore,
  Edit,
  KeySquare,
  RotateCcw,
  Trash,
} from "lucide-react";
import React from "react";

const ActionButtonMobile = ({
  dataArray,
  setData,
  setItemEdit,
  path,
  itemVal = [],
  updateOnly = false,
  blockDeleteField,
  viewOnlyStatuses,
}) => {
  const { store, dispatch } = React.useContext(StoreContext);

  // when a row field is named (e.g. Sales Orders: sales_order_has_return),
  // disable delete instead of hiding it, with a tooltip explaining why -
  // mirrors ActionButtonTable's desktop behavior
  const isDeleteBlocked =
    blockDeleteField &&
    Number(isEmptyItem(dataArray?.[blockDeleteField], 0)) > 0;

  // when statuses are named (e.g. Sales Orders: "paid"), hide every action
  // except view for those rows - mirrors ActionButtonTable's desktop behavior
  const isViewOnly = viewOnlyStatuses?.includes(dataArray?.is_status);

  // ACTIONS ACHIEVE, RESTORE AND DELETE
  const handleAction = (val) => {
    if (val?.name === "delete" && isDeleteBlocked) {
      return;
    }
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
        {updateOnly ? (
          <ActionButton
            item={{
              ...dataArray,
              name: "edit",
              path: path,
              isActive: 1,
              testId: "action-edit",
              icon: <Edit className="size-5 lg:size-4" />,
            }}
            onClick={() =>
              handleUpdate({
                ...dataArray,
                name: "edit",
                path: path,
                isActive: 1,
              })
            }
            data-testid={"action-edit"}
          />
        ) : (
          <>
            {itemVal?.map((a, akey) => {
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
            {dataArray?.is_active > 0 ? (
              !isViewOnly && (
                <>
                  <ActionButton
                    item={{
                      ...dataArray,
                      name: "edit",
                      path: path,
                      isActive: 1,
                      testId: "action-edit",
                      icon: <Edit className="size-5 lg:size-4" />,
                    }}
                    onClick={() =>
                      handleUpdate({
                        ...dataArray,
                        name: "edit",
                        path: path,
                        isActive: 1,
                      })
                    }
                    data-testid={"action-edit"}
                  />
                  <ActionButton
                    item={{
                      ...dataArray,
                      name: "archive",
                      path: "active",
                      isActive: 1,
                      testId: "action-archive",
                      icon: <ArchiveRestore className="size-5 lg:size-4" />,
                    }}
                    onClick={() =>
                      handleAction({
                        ...dataArray,
                        name: "archive",
                        path: "active",
                        isActive: 1,
                        testId: "action-archive",
                      })
                    }
                    data-testid={"action-archive"}
                  />
                  {path === "users" && (
                    <div>
                      <ActionButton
                        item={{
                          ...dataArray,
                          name: "reset",
                          path: "reset-password",
                          icon: <KeySquare className="size-5 lg:size-4" />,
                          isActive: 1,
                          testId: "action-reset",
                        }}
                        onClick={() =>
                          handleAction({
                            ...dataArray,
                            name: "reset",
                            path: "reset-password",
                            isActive: 1,
                            testId: "action-reset",
                          })
                        }
                        data-testid={"action-reset"}
                      />
                    </div>
                  )}
                </>
              )
            ) : (
              <>
                <ActionButton
                  item={{
                    ...dataArray,
                    name: "restore",
                    path: "active",
                    isActive: 1,
                    testId: "action-restore",
                    icon: <RotateCcw className="size-5 lg:size-4" />,
                  }}
                  onClick={() =>
                    handleAction({
                      ...dataArray,
                      name: "restore",
                      path: "active",
                      isActive: 1,
                      testId: "action-restore",
                    })
                  }
                  data-testid={"action-restore"}
                />
                <ActionButton
                  item={{
                    ...dataArray,
                    name: "delete",
                    path: path,
                    isActive: 1,
                    testId: "action-delete",
                    icon: <Trash className="size-5 lg:size-4" />,
                  }}
                  onClick={() => handleAction({ ...dataArray, name: "delete" })}
                  disabled={isDeleteBlocked}
                  tooltip={isDeleteBlocked ? "Linked to a return" : undefined}
                  data-testid={"action-delete"}
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ActionButtonMobile;
