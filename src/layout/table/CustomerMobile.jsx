import { AmountWithPesoSign } from "@/components/PesoSign";
import { setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import React from "react";

const CustomerMobile = ({
  rows,
  lastRowRef,
  item,
  setItemEdit,
  isDefaultMobile,
}) => {
  const { store, dispatch } = React.useContext(StoreContext);

  // ACTIONS ADD
  const handleView = () => {
    dispatch(setIsView(true));
    setItemEdit(null);
  };
  return (
    <>
      {isDefaultMobile === "customer" &&
        rows?.map((row, index) => {
          const isLastRow = index === rows?.length - 1;
          const cells = row.getVisibleCells();

          const titleCell =
            cells.find((c) => c.column.columnDef.isMobileTitle) || cells[0];

          return (
            <div
              key={row.id}
              ref={isLastRow ? lastRowRef : null}
              className="lg:hidden"
            >
              <ul className="py-4 px-0 lg:py-4 lg:px-4 border-b lg:border-b-0">
                {/* mobile */}
                <li className="lg:hidden rounded-2xl border border-gray-200 bg-gray-50/80 dark:bg-[#101827] dark:border-gray-700 p-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-left! ">
                      <p className="font-medium text-gray-900 dark:text-light">
                        {"item.order_no"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {"item.date"}
                      </p>
                    </div>

                    <p className="font-semibold text-gray-900 dark:text-light">
                      <AmountWithPesoSign
                        classN={"size-3 "}
                        classAmnt={"text-green-600 "}
                        amount="0"
                      />
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                    <span>{"item.method"}</span>
                    <span>
                      <AmountWithPesoSign
                        classN={"size-3 "}
                        classAmnt={"text-green-600 "}
                        amount="0"
                      />
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700  text-left!">
                    <button
                      className="text-green-700 hover:text-green-800 hover:underline"
                      onClick={() => handleView(item)}
                    >
                      View Items
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          );
        })}
    </>
  );
};

export default CustomerMobile;
