import Pills from "@/components/Pills";
import { AmountWithPesoSign } from "@/components/PesoSign";

const FinanceReturnsMobileResponsive = ({
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
      {isDefaultMobile === "finance-returns" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;
            // is_status is derived server-side from status + resolution type
            // (pending/refunded/open/completed/rejected).
            const displayStatus = rowData?.is_status;
            const isRefund =
              rowData?.return_product_resolution_type === "refund";
            const isCreditMemo =
              rowData?.return_product_resolution_type === "credit memo";

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
                        {rowData?.return_product_product_name}
                      </span>
                      <span className={`font-semibold text-xs `}>
                        ({rowData?.return_product_order_number})
                      </span>
                    </li>
                    <li className={`font-semibold text-left text-xs `}>
                      {rowData?.return_product_date}
                    </li>
                  </ul>

                  {/* STATUS */}
                  <ul>
                    <li className="mb-0 capitalize">
                      <Pills variant={displayStatus}>{displayStatus}</Pills>
                    </li>
                  </ul>
                </div>
                {/* OTHER FIELDS */}
                <div className="items-end border-t border-gray-200">
                  <ul className="grid py-2 gap-2 sm:gap-5  ">
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 capitalize`}>
                        Customer:{" "}
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.return_product_customer_name}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-3 capitalize`}>
                        Quantity:{" "}
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.return_product_qty}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2`}>
                        Return Amount:{" "}
                      </span>
                      <span className="wrap-break-word font-semibold">
                        <AmountWithPesoSign
                          classN="size-3"
                          classAmnt="flex justify-start text-black"
                          amount={rowData?.return_product_amount}
                        />
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 capitalize`}>
                        Resolution:{" "}
                      </span>
                      <span className="wrap-break-word font-semibold capitalize">
                        {rowData?.return_product_resolution_type || "-"}
                      </span>
                    </li>
                    {isRefund && (
                      <li className="flex text-left! text-xs">
                        <span className={`text-gray-500 mr-2 capitalize`}>
                          Refund Method:{" "}
                        </span>
                        <span className="wrap-break-word font-semibold capitalize">
                          {rowData?.return_product_refund_method || "-"}
                        </span>
                      </li>
                    )}
                    {isCreditMemo && (
                      <li className="flex text-left! text-xs">
                        <span className={`text-gray-500 mr-2 capitalize`}>
                          Credit Memo Amount:{" "}
                        </span>
                        <span className="wrap-break-word font-semibold">
                          <AmountWithPesoSign
                            classN="size-3"
                            classAmnt="flex justify-start text-black"
                            amount={rowData?.return_product_amount}
                          />
                        </span>
                      </li>
                    )}
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2`}>
                        Product Owner:{" "}
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.return_product_owner_name}
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

export default FinanceReturnsMobileResponsive;
