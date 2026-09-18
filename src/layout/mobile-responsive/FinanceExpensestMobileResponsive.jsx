import { AmountWithPesoSign } from "@/components/PesoSign";
import ActionButtonTable from "../ActionButtonTable";
import TableStatus from "../TableStatus";

const FinanceExpensestMobileResponsive = ({
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
      {isDefaultMobile === "finance-expenses" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;
            // Reuse the desktop table's own action column def (action_array,
            // viewOnlyStatuses, deleteOnlyCondition, hiddenActionStatuses)
            // instead of redefining it here, so mobile always matches desktop.
            const actionColumnDef = row
              .getVisibleCells()
              .find((c) => c.column.columnDef.accessorKey === "action")
              ?.column?.columnDef;
            const statusColumnDef = row
              .getVisibleCells()
              .find((c) => c.column.columnDef.header === "payment status")
              ?.column?.columnDef;

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex flex-wrap justify-between items-start gap-2 border-b border-gray-200 pb-2 ">
                  <ul className="flex flex-col">
                    <li className="flex sm:gap-2 flex-wrap items-center">
                      <span
                        className={`font-semibold text-black dark:text-light text-lg capitalize`}
                      >
                        {rowData?.purchase_order_product_name}
                      </span>
                      <span className={`font-semibold text-xs ml-1  `}>
                        ({rowData?.purchase_order_number})
                      </span>
                    </li>
                    <li className={`font-semibold text-left text-xs `}>
                      {rowData?.purchase_order_product_owner_name}
                    </li>
                    <li className={`font-semibold text-left text-xs `}>
                      {rowData?.formated_date}
                    </li>
                  </ul>
                  {statusColumnDef && (
                    <TableStatus item={statusColumnDef} dataArray={rowData} />
                  )}
                </div>
                <div className="flex flex-wrap justify-between items-end ">
                  <ul className=" py-2 gap-2 sm:gap-5  ">
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-12`}>
                        Supplier:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.purchase_order_supplier_name}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-12`}>
                        Paid Amount:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        <AmountWithPesoSign
                          classN={"size-3 "}
                          classAmnt={"text-green-700 justify-start "}
                          amount={
                            rowData?.purchase_order_total_paid_per_product
                          }
                        />
                      </span>
                    </li>
                  </ul>
                </div>
                {actionColumnDef &&
                  (actionColumnDef.haveAction
                    ? rowData?.is_view === 1
                    : true) && (
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <ActionButtonTable
                        item={actionColumnDef}
                        dataArray={rowData}
                        setData={setData}
                        setItemEdit={setItemEdit}
                        ishaveSubAdd={ishaveSubAdd}
                        path={path || isDefaultMobile}
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

export default FinanceExpensestMobileResponsive;
