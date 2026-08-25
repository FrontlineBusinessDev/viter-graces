import ActionButton from "@/components/buttons/ActionButton";
import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import { setIsSubAction, setIsSubAdd, setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { Edit, Trash, Archive, ArchiveRestore, RotateCcw } from "lucide-react";
import React from "react";

const SupplierMobileReponsive = ({
  rows,
  setItemEdit,
  setItemVal,
  isDefaultMobile,
  setData,
}) => {
  const { store, dispatch } = React.useContext(StoreContext);

  // ACTIONS ADD
  const handleView = (itemView) => {
    dispatch(setIsView(true));
    setItemEdit(itemView);
    setItemVal(itemView);
  };

  // ACTIONS ACHIEVE, RESTORE AND DELETE
  const handleAction = (val, dataArray) => {
    console.log("ACTION:", val?.name);
    console.log("ROW DATA:", dataArray);
    console.log("ROW ID:", dataArray?.id);

    dispatch(setIsSubAction(true));

    setData({
      ...dataArray,
      path:
        val?.name !== "delete"
          ? `${val?.path}/${dataArray?.id}`
          : `${dataArray?.id}`,
      menu: "suppliers-product",
      action: val?.name,
    });
  };

  // ACTIONS UPDATE
  const handleUpdate = (val) => {
    dispatch(setIsSubAdd(true));
    setItemEdit({
      ...val,
    });
  };

  return (
    <>
      {isDefaultMobile === "suppliers" &&
        rows?.map((row, index) => {
          const rowData = row.original;

          const is_status =
            Number(rowData?.is_active) > 0 ? "active" : "inactive";
          return (
            <div key={row.id} className="lg:hidden">
              <ul className="py-4 px-0 lg:py-4 lg:px-4 border-b lg:border-b-0">
                {/* mobile */}
                <li className="lg:hidden rounded-2xl border border-gray-200 bg-gray-50/80 dark:bg-[#101827] dark:border-gray-700 p-4 space-y-3 text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className=" font-medium text-gray-900 dark:text-light">
                      {rowData?.suppliers_product_name}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-light">
                      <AmountWithPesoSign
                        classN={"size-3 "}
                        classAmnt={"text-green-600 "}
                        amount={rowData?.suppliers_product_price}
                      />
                    </p>
                  </div>
                  <div className="flex flex-wrap items-start justify-between mb-1! ">
                    <p className="text-left! text-xs text-gray-500 dark:text-gray-400">
                      {rowData?.suppliers_product_unit}
                    </p>
                    <Pills variant={is_status}>{is_status}</Pills>
                  </div>

                  <div className="flex flex-wrap justify-end pt-3 border-t border-gray-200 dark:border-gray-700  text-left!">
                    <div className="flex items-center justify-end gap-3 ">
                      {rowData?.suppliers_product_is_active === 1 ? (
                        <>
                          <ActionButton
                            item={{
                              ...rowData,
                              name: "edit",
                              path: "suppliers-product",
                              isActive: 1,
                              testId: "action-edit",
                              icon: <Edit className="size-5 lg:size-4" />,
                            }}
                            onClick={() =>
                              handleUpdate({
                                ...rowData,
                                name: "edit",
                                path: "suppliers-product",
                                isActive: 1,
                              })
                            }
                            data-testid={"action-edit"}
                          />
                          <ActionButton
                            item={{
                              ...rowData,
                              name: "archive",
                              path: "active",
                              isActive: 1,
                              testId: "action-archive",
                              icon: (
                                <ArchiveRestore className="size-5 lg:size-4" />
                              ),
                            }}
                            onClick={() =>
                              handleAction(
                                {
                                  name: "archive",
                                  path: "active",
                                  isActive: 1,
                                  testId: "action-archive",
                                },
                                rowData,
                              )
                            }
                            data-testid="action-archive"
                          />
                        </>
                      ) : (
                        <>
                          <ActionButton
                            item={{
                              ...rowData,
                              name: "restore",
                              path: "active",
                              isActive: 1,
                              testId: "action-restore",
                              icon: <RotateCcw className="size-5 lg:size-4" />,
                            }}
                            onClick={() =>
                              handleAction(
                                {
                                  ...rowData,
                                  name: "restore",
                                  path: "active",
                                  isActive: 1,
                                },
                                rowData,
                              )
                            }
                            data-testid={"action-restore"}
                          />
                          <ActionButton
                            item={{
                              ...rowData,
                              name: "delete",
                              path: "suppliers-product",
                              isActive: 1,
                              testId: "action-delete",
                              icon: <Trash className="size-5 lg:size-4" />,
                            }}
                            onClick={() =>
                              handleAction(
                                {
                                  ...rowData,
                                  name: "delete",
                                  path: "suppliers-product",
                                  isActive: 0,
                                },
                                rowData,
                              )
                            }
                            data-testid={"action-delete"}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          );
        })}
    </>
  );
};

export default SupplierMobileReponsive;
