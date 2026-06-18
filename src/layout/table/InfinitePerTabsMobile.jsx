import TableDefaultStatusDot from "@/layout/TableDefaultStatusDot";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import { FaCaretDown } from "react-icons/fa";
import ActionButtonMobile from "../ActionButtonMobile";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { flexRender } from "@tanstack/react-table";

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

                      <ActionButtonMobile
                        dataArray={rowData}
                        setData={setData}
                        setItemEdit={setItemEdit}
                        ishaveSubAdd={ishaveSubAdd}
                        path={path}
                      />
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
      {/* <div className="ml-5 sm:grid grid-cols-4 items-center mt-2">
        {item.getVisibleCells().map((ditem, dkey) => {
          return (
            <React.Fragment key={dkey}>
              {ditem?.column?.columnDef?.header === "second_column" ? (
                <p className="text-xs text-gray-500 lg:hidden dark:text-light mb-0">
                  {flexRender(
                    ditem?.column?.columnDef?.cell,
                    ditem?.getContext(),
                  )}
                </p>
              ) : (
                ""
              )}
            </React.Fragment>
          );
        })}
        {item.getVisibleCells().map((eitem, ekey) => {
          return (
            <React.Fragment key={ekey}>
              {eitem?.column?.columnDef?.header === "contact" ||
              eitem?.column?.columnDef?.header === "address" ? (
                <div className="text-sm text-gray-700 dark:text-light gap-1">
                  <span className="text-xs">
                    {flexRender(
                      eitem?.column?.columnDef?.cell,
                      eitem?.getContext(),
                    )}
                  </span>
                </div>
              ) : (
                ""
              )}
            </React.Fragment>
          );
        })}
        <div className="flex items-center gap-3 justify-end w-full">
          {item.getVisibleCells().map((bitem, bkey) => {
            return bitem?.column?.columnDef?.header === "social" ? (
              <React.Fragment key={bkey}>
                {isEmptyItem(rows[index]?.original?.messenger, "") !== "" &&
                bitem?.column?.columnDef?.accessorKey === "messenger" ? (
                  <a href={`${bitem?.column?.columnDef?.link}`} target="_black">
                    {bitem?.column?.columnDef?.icon}
                  </a>
                ) : (
                  ""
                )}
                {isEmptyItem(rows[index]?.original?.whatsapp, "") !== "" &&
                bitem?.column?.columnDef?.accessorKey === "whatsapp" ? (
                  <a href={`${bitem?.column?.columnDef?.link}`} target="_black">
                    {bitem?.column?.columnDef?.icon}
                  </a>
                ) : (
                  ""
                )}
                {isEmptyItem(rows[index]?.original?.other, "") !== "" &&
                bitem?.column?.columnDef?.accessorKey === "other" ? (
                  <a href={`${bitem?.column?.columnDef?.link}`}>
                    {bitem?.column?.columnDef?.icon}
                  </a>
                ) : (
                  ""
                )}
              </React.Fragment>
            ) : (
              ""
            );
          })}
        </div> 
      </div>*/}
    </div>
  );
};

export default InfinitePerTabsMobile;
