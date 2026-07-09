import Pills from "@/components/Pills";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import ActionButtonMobile from "../ActionButtonMobile";
import { ActiveInActiveStatus } from "../ArrayValue";
import { AmountWithPesoSign } from "@/components/PesoSign";

const ReportOverdueMobileResponsive = ({
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
      {isDefaultMobile === "report-sales-order/page-all-overdue-payment" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex gap-2 justify-between items-center border-b border-gray-200 pb-2 ">
                  <div className="flex flex-col">
                    <div className="flex sm:gap-2 flex-wrap items-center">
                      <span
                        className={`font-semibold text-black dark:text-light text-lg capitalize`}
                      >
                        {rowData?.installmet_payment_customer_name}
                      </span>

                      <span className={`font-semibold text-xs `}>
                        ({rowData?.installmet_payment_code_number})
                      </span>
                    </div>
                    <span className={`font-semibold text-left! text-xs `}>
                      <AmountWithPesoSign
                        classN={"size-3"}
                        classAmnt={" justify-start "}
                        amount={rowData?.installmet_payment_amount}
                      />
                    </span>
                  </div>

                  {/* STATUS */}
                  <ul className="text-left">
                    <li>
                      <Pills variant={"overdue"}>{"overdue"}</Pills>
                    </li>
                    <li>
                      <span className={`font-semibold text-left! text-xs `}>
                        {rowData?.installmet_payment_due_date}
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

export default ReportOverdueMobileResponsive;
