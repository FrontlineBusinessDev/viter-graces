import { AmountsWithPesoSign, AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import ActionButtonMobile from "../ActionButtonMobile";

const SalesReportMobileResponsive = ({
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
      {isDefaultMobile === "report-sales-order/page-all-sales-order" && (
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
                  <ul className="flex flex-col">
                    <li className="flex sm:gap-2 flex-wrap items-center">
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
                    <li className={`font-semibold text-left text-xs `}>
                      <AmountWithPesoSign
                        classN={"size-3 "}
                        classAmnt={"text-green-700 justify-start "}
                        amount={rowData?.sales_order_total}
                      />
                    </li>
                  </ul>

                  {/* STATUS */}
                  <ul className="text-left ">
                    <Pills variant={rowData?.is_status}>
                      {rowData?.is_status}
                    </Pills>
                    <li className="mb-0 capitalize">
                      {rowData?.sales_order_date}
                    </li>
                    <li className="mb-0 capitalize">
                      {rowData?.sales_order_payment_method}
                    </li>
                  </ul>
                </div>
                <div className="flex flex-wrap justify-between items-end ">
                  <ul className=" py-2 gap-2 sm:gap-5  ">
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-12`}>
                        Received:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.sales_order_received_by_name}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-12`}>
                        Customer:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.sales_order_customer_name}
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

export default SalesReportMobileResponsive;
