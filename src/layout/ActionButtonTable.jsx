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

  // when a column names statuses that should be read-only (e.g. Sales
  // Orders: "paid"), hide every action except view for those rows - reads
  // dataArray.is_status by default, or item.viewOnlyStatusField when a
  // column needs to key off a different row field (e.g. Expenses: "paid"
  // lives on payment_status, since is_status there is the PO status)
  const isViewOnly = item?.viewOnlyStatuses?.includes(
    dataArray?.[item?.viewOnlyStatusField ?? "is_status"],
  );

  // when a column names a row field to watch (e.g. Sales Orders:
  // sales_order_has_return), disable delete instead of hiding it, with a
  // tooltip explaining why - the row is still associated with something
  // that must be cleared first
  const isDeleteBlocked =
    item?.blockDeleteField &&
    Number(isEmptyItem(dataArray?.[item.blockDeleteField], 0)) > 0;

  // when a column names a predicate (e.g. Expenses: unpaid + supplier
  // "Other"), restrict the row to delete only - hides view/edit/archive
  // and shows just the delete action, regardless of is_active
  const isDeleteOnly = item?.deleteOnlyCondition?.(dataArray);
  const deleteAction = item?.action_array?.find(
    (a) => isEmptyItem(a?.name, "") === "delete",
  );

  // when a column names specific actions that should be hidden for certain
  // statuses (e.g. Expenses: no archive/delete once "partially paid" - money
  // is already applied to it) - reads dataArray.is_status by default, or
  // hiddenActionStatuses.field when a column needs to key off a different
  // row field
  const isActionHiddenForStatus = (name) =>
    !!item?.hiddenActionStatuses?.actions?.includes(name) &&
    item.hiddenActionStatuses.statuses.includes(
      dataArray?.[item.hiddenActionStatuses.field ?? "is_status"],
    );

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
          {isDeleteOnly ? (
            deleteAction &&
            !isActionHiddenForStatus("delete") && (
              <div>
                <ActionButton
                  item={deleteAction}
                  onClick={() => handleAction(deleteAction)}
                  disabled={isDeleteBlocked}
                  tooltip={isDeleteBlocked ? "Linked to a return" : undefined}
                  data-testid={deleteAction.testId}
                />
              </div>
            )
          ) : (
            <>
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
                  !isViewOnly &&
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
                  !isViewOnly &&
                  isEditDeleteAllowed(isEmptyItem(b?.name, "")) &&
                  !isActionHiddenForStatus(isEmptyItem(b?.name, "")) && (
                    <div key={bkey}>
                      <ActionButton
                        item={b}
                        onClick={() => handleAction(b)}
                        disabled={b?.name === "delete" && isDeleteBlocked}
                        tooltip={
                          b?.name === "delete" && isDeleteBlocked
                            ? "Linked to a return"
                            : undefined
                        }
                        data-testid={b.testId}
                      />
                    </div>
                  )
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ActionButtonTable;
