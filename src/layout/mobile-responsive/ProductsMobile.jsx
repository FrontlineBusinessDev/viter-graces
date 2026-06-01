import { isEmptyItem } from "@/utilities/isEmptyItem";
import { flexRender } from "@tanstack/react-table";
import { Image } from "lucide-react";
import ActionButtonSubTable from "../ActionButtonSubTable";
import TableStatus from "../TableStatus";

const ProductsMobile = ({
  rows,
  setData,
  setItemEdit,
  lastRowRef,
  isDefaultMobile,
  ishaveSubAdd = false,
  path = "",
}) => {
  return (
    <>
      {(isDefaultMobile === "products" ||
        isDefaultMobile === "suppliers" ||
        isDefaultMobile === "purchase-order") && (
        <div>
          {rows?.map((row, index) => {
            const isLastRow = index === rows?.length - 1;
            const cells = row.getVisibleCells();

            const titleCell =
              cells.find((c) => c.column.columnDef.isMobileTitle) || cells[0];

            const subTitleCell =
              cells.find((c) => c.column.columnDef.isSubTitle) || cells[0];

            const tagCell =
              cells.find((c) => c.column.columnDef.isTag) || cells[0];

            const priceCell =
              cells.find((c) => c.column.columnDef.isPrice) || cells[0];

            const imageCell =
              cells.find((c) => c.column.columnDef.isImage) || cells[0];

            return (
              <div
                key={row.id}
                ref={isLastRow ? lastRowRef : null}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex gap-2 justify-between items-center mb-3">
                  <div className="flex gap-2 items-center">
                    {imageCell && (
                      <div className="w-12 h-12 bg-gray-300 rounded-sm">
                        <Image className="mx-auto p-1" size={45} />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="flex gap-2 items-center">
                        <span
                          className={`font-semibold text-black dark:text-light text-lg  ${
                            titleCell.column.columnDef.classTd || ""
                          }`}
                        >
                          {flexRender(
                            titleCell.column.columnDef.cell,
                            titleCell.getContext(),
                          )}
                        </span>

                        <span
                          className={`font-semibold  text-xs ${
                            tagCell.column.columnDef.classTd || ""
                          }`}
                        >
                          (
                          {flexRender(
                            tagCell.column.columnDef.cell,
                            tagCell.getContext(),
                          )}
                          )
                        </span>
                      </div>
                      <span
                        className={`font-semibold text-xs ${
                          subTitleCell.column.columnDef.classTd || ""
                        }`}
                      >
                        {flexRender(
                          subTitleCell.column.columnDef.cell,
                          subTitleCell.getContext(),
                        )}
                      </span>
                    </div>
                  </div>

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
                <div className="space-y-2 border-t border-gray-200 py-2 flex justify-between">
                  {cells.map((cell) => {
                    const colDef = cell.column.columnDef;
                    const tagDef = cell.column.columnDef.isTag;
                    const accessor = colDef.accessorKey;

                    // Skip title, status, action
                    if (
                      cell.id === titleCell.id ||
                      colDef.header === "status" ||
                      colDef.isTag === true ||
                      colDef.isSubTitle === true ||
                      colDef.isImage === true ||
                      accessor === "action"
                    )
                      return null;

                    const header = colDef.header;

                    return (
                      <div
                        key={cell.id}
                        className={` ${isEmptyItem(colDef.classTd, "")}`}
                      >
                        <div className="flex flex-col items-center">
                          <p
                            className={`text-xs text-gray-500  ${isEmptyItem(
                              colDef.classTh,
                              "",
                            )}`}
                          >
                            {typeof header === "string" ? header : ""}
                          </p>

                          <p className="text-sm wrap-break-word font-semibold">
                            {flexRender(colDef.cell, cell.getContext())}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ACTIONS */}
                {cells.map((item) => {
                  if (item.column.columnDef.accessorKey === "action") {
                    return (
                      <div key={item.id} className="flex gap-2 justify-end">
                        <ActionButtonSubTable
                          item={item.column.columnDef}
                          dataArray={row.original}
                          setData={setData}
                          setItemEdit={setItemEdit}
                          ishaveSubAdd={ishaveSubAdd}
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
        </div>
      )}
    </>
  );
};

export default ProductsMobile;
