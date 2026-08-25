import Pills from "@/components/Pills";
import ActionButtonMobile from "../ActionButtonMobile";
import { ActionTableList } from "../ArrayValue";
import { AmountWithPesoSign } from "@/components/PesoSign";

const FinanceSalesJournalMobileResponsive = ({
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
      {isDefaultMobile === "finance-sales-journal" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="mb-2">
                  <ul className="flex flex-col">
                    <li className="flex gap-2 flex-wrap items-center">
                      <span
                        className={`font-semibold text-black dark:text-light text-lg capitalize`}
                      >
                        {rowData?.sales_journal_customer}
                      </span>
                      <span className={`font-semibold text-xs `}>
                        ({rowData?.sales_journal_order_number})
                      </span>
                    </li>
                    <li className={`font-semibold text-left text-xs `}>
                      {rowData?.sales_journal_date}
                    </li>
                    <li
                      className={`font-semibold text-left text-xs capitalize `}
                    >
                      {rowData?.sales_journal_method}
                    </li>
                  </ul>

                  {/* STATUS */}
                  {/* <ul>
                    <li className="mb-2 capitalize">
                      <Pills variant={rowData?.is_status}>
                        {rowData?.is_status}
                      </Pills>
                    </li>
                    <li className="mb-0">{rowData?.sales_order_date}</li>
                  </ul> */}
                </div>
                {/* OTHER FIELDS */}
                <div className="items-end border-t border-gray-200">
                  <ul className="grid py-2 gap-2 sm:gap-5  ">
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 capitalize`}>
                        Debit:{" "}
                      </span>
                      <span className="wrap-break-word font-semibold">
                        <AmountWithPesoSign
                          classN="size-3"
                          classAmnt="flex justify-start text-black"
                          amount={rowData?.sales_journal_debit}
                        />
                      </span>
                    </li>

                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2`}>Credit: </span>
                      <span className="wrap-break-word font-semibold">
                        <AmountWithPesoSign
                          classN="size-3"
                          classAmnt="flex justify-start text-black"
                          amount={rowData?.sales_journal_credit}
                        />
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2`}>Balance: </span>
                      <span className="wrap-break-word font-semibold">
                        <AmountWithPesoSign
                          classN="size-3"
                          classAmnt="flex justify-start text-primary"
                          amount={rowData?.sales_journal_balance}
                        />
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default FinanceSalesJournalMobileResponsive;
