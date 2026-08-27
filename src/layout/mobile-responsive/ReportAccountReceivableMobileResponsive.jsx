import { AmountWithPesoSign } from "@/components/PesoSign";
import ActionButtonMobile from "../ActionButtonMobile";
import { ActionTableList } from "../ArrayValue";
import Pills from "@/components/Pills";

const ReportAccountReceivableMobileResponsive = ({
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
      {isDefaultMobile === "report-sales-order/page-all-account-receivable" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex flex-wrap justify-between mb-2">
                  <ul className="flex flex-col">
                    <li className="flex gap-2 flex-wrap items-center">
                      <span
                        className={`font-semibold text-black dark:text-light text-lg capitalize`}
                      >
                        {rowData?.sales_order_product_name}
                      </span>
                      <span className={`font-semibold text-xs `}>
                        ({rowData?.sales_order_number})
                      </span>
                    </li>
                    <li className={`font-semibold text-left text-xs `}>
                      {rowData?.sales_order_product_owner_name}
                    </li>
                  </ul>

                  {/* STATUS */}
                  <ul>
                    <li className="mb-2 capitalize">
                      <Pills variant={rowData?.is_status}>
                        {rowData?.is_status}
                      </Pills>
                    </li>
                    <li className="mb-0">{rowData?.sales_order_date}</li>
                  </ul>
                </div>
                {/* OTHER FIELDS */}
                <div className="flex flex-wrap justify-between items-end border-t border-gray-200">
                  <ul className=" py-2 gap-2 sm:gap-5  ">
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 capitalize`}>
                        customer:{" "}
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.sales_order_customer_name}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2`}>Amount: </span>
                      <span className="wrap-break-word font-semibold ml-2">
                        <AmountWithPesoSign
                          classN="size-3"
                          classAmnt="flex justify-start text-black"
                          amount={rowData?.total_amount_per_product}
                        />
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2`}>Paid: </span>
                      <span className="wrap-break-word font-semibold ml-6.5">
                        <AmountWithPesoSign
                          classN="size-3"
                          classAmnt="flex justify-start text-primary"
                          amount={rowData?.sales_order_paid_per_product}
                        />
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2`}>Balance: </span>
                      <span className="wrap-break-word font-semibold ml-1">
                        <AmountWithPesoSign
                          classN="size-3"
                          classAmnt="flex justify-start text-red-800"
                          amount={rowData?.sales_order_balance_per_product}
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

export default ReportAccountReceivableMobileResponsive;
