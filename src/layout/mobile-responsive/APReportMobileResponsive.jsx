import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";

const APReportMobileResponsive = ({
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
      {isDefaultMobile === "report-sales-order/page-all-account-payable" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="xs:flex flex-wrap gap-2 justify-between items-center border-b border-gray-200 pb-2 ">
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
                  </ul>

                  {/* STATUS */}
                  <ul className="text-left ">
                    <li className="mb-0 capitalize">
                      {rowData?.purchase_order_date}
                    </li>
                  </ul>
                </div>
                <div className="flex flex-wrap justify-between items-end ">
                  <ul className=" py-2 gap-2 sm:gap-5  ">
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-12`}>
                        Balance:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        <AmountWithPesoSign
                          classN={"size-3 "}
                          classAmnt={"text-black justify-start "}
                          amount={
                            rowData?.purchase_order_total_balance_per_product
                          }
                        />
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-12`}>
                        Note:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.purchase_order_note}
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

export default APReportMobileResponsive;
