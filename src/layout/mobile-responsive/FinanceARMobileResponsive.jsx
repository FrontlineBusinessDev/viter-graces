import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import ActionButtonMobile from "../ActionButtonMobile";
import { ActionTableList } from "../ArrayValue";

const FinanceARMobileResponsive = ({
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
      {isDefaultMobile === "finance-account-receivable" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="xs:flex flex-wrap gap-2 justify-between mb-1">
                  <ul className="flex flex-col">
                    <li className="flex gap-2 flex-wrap items-center">
                      <span
                        className={`font-semibold text-black dark:text-light text-lg capitalize`}
                      >
                        {rowData?.sales_order_customer_name}
                      </span>
                      <span className={`font-semibold text-xs `}>
                        ({rowData?.sales_order_number})
                      </span>
                    </li>
                    <li className="text-left mb-0">
                      order date:{rowData?.sales_order_date}
                    </li>
                  </ul>
                  <ul className="flex flex-col">
                    <li className="flex gap-2 flex-wrap items-center">
                      <span
                        className={`font-semibold text-black dark:text-light text-lg capitalize`}
                      >
                        <Pills variant={rowData?.status_text}>
                          {rowData?.status_text}
                        </Pills>
                      </span>
                    </li>
                    <li className="text-left mb-0">
                      Due date: {rowData?.sales_order_due_date}
                    </li>
                  </ul>
                </div>
                {/* OTHER FIELDS */}
                <div className="flex flex-wrap justify-between items-end border-t border-gray-200">
                  <ul className=" py-2 gap-2 sm:gap-5  ">
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2`}>Amount: </span>
                      <span className="wrap-break-word font-semibold ">
                        <AmountWithPesoSign
                          classN="size-3"
                          amount={rowData?.sales_order_total_receivable_amount}
                        />
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 `}>Paid : </span>
                      <span className="wrap-break-word font-semibold ml-5">
                        <AmountWithPesoSign
                          classN="size-3"
                          amount={rowData?.sales_order_paid_amount}
                        />
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-1`}>Balance: </span>
                      <span className="wrap-break-word font-semibold">
                        <AmountWithPesoSign
                          classN="size-3"
                          amount={`${Number(rowData?.sales_order_total_balance_amount)}`}
                        />
                      </span>
                    </li>
                  </ul>
                </div>
                <div className=" pt-3 border-t border-gray-200 dark:border-gray-700">
                  <ActionButtonMobile
                    dataArray={rowData}
                    setData={setData}
                    setItemEdit={setItemEdit}
                    ishaveSubAdd={ishaveSubAdd}
                    path={path}
                    itemVal={ActionTableList(
                      "finance-account-receivable",
                      "finance-ar",
                    )}
                    updateOnly={true}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default FinanceARMobileResponsive;
