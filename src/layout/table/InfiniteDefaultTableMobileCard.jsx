import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { flexRender } from "@tanstack/react-table";
import React from "react";
import ActionButtonTable from "../ActionButtonTable";
import TableStatus from "../TableStatus";

const InfiniteDefaultTableMobileCard = ({
  rows,
  lastRowRef,
  setData,
  setItemEdit,
  isDefaultMobile,
  path = "",
}) => {
  const { store, dispatch } = React.useContext(StoreContext);

  return (
    <>
      {isDefaultMobile === "default" &&
        rows?.map((row, index) => {
          const rowData = row.original;
          const isLastRow = index === rows?.length - 1;
          const cells = row.getVisibleCells();

          const titleCell =
            cells.find((c) => c.column.columnDef.isMobileTitle) || cells[0];

          return (
            <div
              key={row.id}
              ref={isLastRow ? lastRowRef : null}
              className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-2">
                {cells.map((item, key) => {
                  return (
                    (item.column.columnDef.orderNumber === "1" ||
                      item.column.columnDef.orderNumber === "2") && (
                      <p
                        className={`font-semibold text-lg ${
                          titleCell.column.columnDef.classTd || ""
                        }`}
                        key={key}
                      >
                        {item.column.columnDef.orderNumber === "1" &&
                          flexRender(
                            item?.column?.columnDef?.cell,
                            item?.getContext(),
                          )}
                        (
                        {item.column.columnDef.orderNumber === "2" &&
                          flexRender(
                            item?.column?.columnDef?.cell,
                            item?.getContext(),
                          )}{" "}
                        )
                      </p>
                    )
                  );
                })}

                {/* STATUS */}
                {cells.map((item, key) => {
                  return (
                    item.column.columnDef.header === "status" && (
                      <div key={key}>
                        <TableStatus
                          item={item?.column?.columnDef}
                          dataArray={rowData}
                        />
                      </div>
                    )
                  );
                })}
              </div>

              {/* OTHER FIELDS */}
              <div className="grid grid-cols-2 text-left">
                {cells.map((cell) => {
                  const colDef = cell.column.columnDef;
                  const accessor = colDef.accessorKey;

                  // Skip title, status, action
                  if (
                    cell.id === titleCell.id ||
                    colDef.orderNumber === "1" ||
                    colDef.orderNumber === "2" ||
                    colDef.header === "status" ||
                    accessor === "action"
                  )
                    return null;

                  const header = colDef.header;

                  return (
                    <div
                      key={cell.id}
                      className={` ${isEmptyItem(colDef.classTd, "")}`}
                    >
                      <p className="text-sm wrap-break-word ">
                        {flexRender(colDef.cell, cell.getContext())}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* ACTIONS */}
              {cells.map((item) => {
                if (item.column.columnDef.accessorKey === "action") {
                  return (
                    <ActionButtonTable
                      item={item.column.columnDef}
                      dataArray={row.original}
                      setData={setData}
                      setItemEdit={setItemEdit}
                      path={path}
                    />
                  );
                }
                return null;
              })}
            </div>
          );
        })}
    </>
  );
};

export default InfiniteDefaultTableMobileCard;
