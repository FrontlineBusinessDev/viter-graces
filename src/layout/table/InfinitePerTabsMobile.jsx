import TableDefaultStatusDot from "@/layout/TableDefaultStatusDot";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import { FaCaretDown } from "react-icons/fa";
import ActionButtonMobile from "../ActionButtonMobile";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { flexRender } from "@tanstack/react-table";
import { getAdminDeveloperRole } from "@/utilities/roleValidation";

const InfinitePerTabsMobile = ({
  item,
  rows,
  path,
  index,
  setItemEdit,
  setData,
  isOpen,
  setOpenRow,
  ishaveSubAdd = true,
}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  let counterMobile = 1;
  return (
    <div className="lg:hidden p-2  ">
      <div className="flex items-center  ">
        <span className="mr-3">{counterMobile++}.</span>
        <TableDefaultStatusDot dataArray={rows[index]?.original} />
        {item.getVisibleCells().map((aitem, akey) => {
          const rowData = rows[index]?.original;

          return (
            <React.Fragment key={akey}>
              {aitem?.column?.columnDef?.header === "name" ? (
                <>
                  <div className="min-w-0 ml-3 w-full flex items-center justify-between">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      data-testid="button-open-customer-tab"
                    >
                      <span className="text-sm font-medium text-gray-800 dark:text-light min-w-20">
                        {rows[index]?.original?.name}
                      </span>
                    </div>
                    <div className="flex gap-2 justify-end items-center">
                      <button
                        type="button"
                        className="tooltip-action-table capitalize z-0!"
                        data-tooltip={isOpen ? "Close" : "Open"}
                        onClick={() => setOpenRow(isOpen ? null : item.id)}
                        data-testid={`action-toggle`}
                      >
                        <FaCaretDown
                          className={` size-5 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {getAdminDeveloperRole(store) && (
                        <ActionButtonMobile
                          dataArray={rowData}
                          setData={setData}
                          setItemEdit={setItemEdit}
                          ishaveSubAdd={ishaveSubAdd}
                          path={path}
                        />
                      )}
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default InfinitePerTabsMobile;
