import ActionButton from "@/components/buttons/ActionButton";
import { canDeleteUnlinked } from "@/pages/developer/reports/unlinked-data/UnlinkedData";
import { setIsAction } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { Trash } from "lucide-react";
import React from "react";

const UnlinkedDataMobileResponsive = ({ rows, setData, isDefaultMobile }) => {
  const { dispatch } = React.useContext(StoreContext);

  // same flow as the table: open the confirm modal for this record
  const handleDelete = (rowData) => {
    dispatch(setIsAction(true));
    setData({
      ...rowData,
      path: `${rowData?.id}`,
      menu: isDefaultMobile,
      action: "delete",
    });
  };

  return (
    <>
      {isDefaultMobile === "report-sales-order/page-all-unlinked-data" && (
        <div>
          {rows?.map((row) => {
            const rowData = row.original;

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex flex-wrap gap-2 justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="font-semibold text-black dark:text-light text-lg wrap-break-word">
                      {rowData?.reference}
                    </span>
                    <span className="text-xs">{rowData?.record_date}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold inline-block bg-primary/10 text-primary dark:bg-primary/20 dark:text-light">
                    {rowData?.module}
                  </span>
                </div>

                {/* OTHER FIELDS */}
                <ul className="text-xs [&>li]:flex [&>li]:justify-between [&>li]:py-1 [&>li]:border-b [&>li]:border-b-gray-200 dark:[&>li]:border-b-gray-700">
                  <li>
                    <span className="text-gray-500">Linked as</span>
                    <span className="font-semibold">{rowData?.linked_as}</span>
                  </li>
                  <li>
                    <span className="text-gray-500">Details</span>
                    <span className="font-semibold text-right wrap-break-word">
                      {rowData?.details}
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500">Deleted user</span>
                    <span className="font-semibold text-right capitalize">
                      {rowData?.missing_user_name}
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500">User ID</span>
                    <span className="font-semibold">
                      {rowData?.missing_user_id}
                    </span>
                  </li>
                </ul>

                {canDeleteUnlinked(rowData) && (
                  <div className="flex justify-end mt-3">
                    <ActionButton
                      item={{
                        name: "delete",
                        icon: <Trash className="size-5" />,
                      }}
                      onClick={() => handleDelete(rowData)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default UnlinkedDataMobileResponsive;
