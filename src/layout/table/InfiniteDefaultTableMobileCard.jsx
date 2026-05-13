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
                <p
                  className={`font-semibold text-lg ${
                    titleCell.column.columnDef.classTd || ""
                  }`}
                >
                  {flexRender(
                    titleCell.column.columnDef.cell,
                    titleCell.getContext(),
                  )}
                </p>

                {/* STATUS */}
                {cells.map((item, key) => {
                  if (item.column.columnDef.header === "status") {
                    return (
                      <div key={key}>
                        <TableStatus
                          item={item.column.columnDef}
                          dataArray={row.original}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* OTHER FIELDS */}
              <div className="space-y-2">
                {cells.map((cell) => {
                  const colDef = cell.column.columnDef;
                  const accessor = colDef.accessorKey;

                  // Skip title, status, action
                  if (
                    cell.id === titleCell.id ||
                    colDef.header === "status" ||
                    accessor === "action"
                  )
                    return null;

                  const header = colDef.header;

                  return (
                    <div
                      key={cell.id}
                      className={`grid grid-cols-[1fr_2fr] gap-3 items-center ${isEmptyItem(
                        colDef.classTd,
                        "",
                      )}`}
                    >
                      <p
                        className={`text-xs text-gray-500 ${isEmptyItem(
                          colDef.classTh,
                          "",
                        )}`}
                      >
                        {typeof header === "string" ? header : ""}
                      </p>

                      <p className="text-sm wrap-break-word min-w-[200px]">
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
                    <div key={item.id} className="flex gap-2 mt-3">
                      <ActionButtonTable
                        item={item.column.columnDef}
                        dataArray={row.original}
                        setData={setData}
                        setItemEdit={setItemEdit}
                        path={path}
                      />
                    </div>
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
