import ActionButton from "@/components/buttons/ActionButton";
import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import { setIsSubAction, setIsSubAdd, setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { Edit, Trash } from "lucide-react";
import React from "react";

const CustomerMobileReponsive = ({
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
    dispatch(setIsSubAction(true));
    setData({
      ...dataArray,
      path:
        val?.name !== "delete"
          ? `${val?.path}/${dataArray?.id}`
          : `${dataArray?.id}`,
      menu: "sales-order",
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
      {isDefaultMobile === "customer" &&
        rows?.map((row, index) => {
          const rowData = row.original;

          return (
            <div key={row.id} className="lg:hidden">
              <ul className="py-4 px-0 lg:py-4 lg:px-4 border-b lg:border-b-0">
                {/* mobile */}
                <li className="lg:hidden rounded-2xl border border-gray-200 bg-gray-50/80 dark:bg-[#101827] dark:border-gray-700 p-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between mb-0! gap-3">
                    <p className="text-left! mb-0! font-medium text-gray-900 dark:text-light">
                      {rowData?.sales_order_number}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-light">
                      <AmountWithPesoSign
                        classN={"size-3 "}
                        classAmnt={"text-green-600 "}
                        amount={rowData?.total_amount}
                      />
                    </p>
                  </div>
                  <div className="flex items-start justify-between mb-1! ">
                    <p className="text-left! text-xs text-gray-500 dark:text-gray-400">
                      {rowData?.sales_order_date}
                    </p>

                    <Pills variant={rowData?.sales_order_status}>
                      {rowData?.sales_order_status}
                    </Pills>
                  </div>

                  <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700  text-left!">
                    <button
                      className="text-green-700 hover:text-green-800 hover:underline"
                      onClick={() => handleView(rowData)}
                    >
                      View Items
                    </button>{" "}
                    <div className="flex items-center justify-end gap-3 ">
                      <ActionButton
                        item={{
                          ...rowData,
                          name: "edit",
                          path: "sales-order",
                          isActive: 1,
                          testId: "action-edit",
                          icon: <Edit className="size-5 lg:size-4" />,
                        }}
                        onClick={() =>
                          handleUpdate({
                            ...rowData,
                            name: "edit",
                            path: "sales-order",
                            isActive: 1,
                          })
                        }
                        data-testid={"action-edit"}
                      />
                      <ActionButton
                        item={{
                          ...rowData,
                          name: "delete",
                          path: "sales-order",
                          isActive: 1,
                          testId: "action-delete",
                          icon: <Trash className="size-5 lg:size-4" />,
                        }}
                        onClick={() =>
                          handleAction(
                            {
                              ...rowData,
                              name: "delete",
                              path: "sales-order",
                              isActive: 0,
                            },
                            rowData,
                          )
                        }
                        data-testid={"action-delete"}
                      />
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

export default CustomerMobileReponsive;
