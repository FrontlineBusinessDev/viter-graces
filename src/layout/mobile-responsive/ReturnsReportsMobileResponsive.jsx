import Pills from "@/components/Pills";
import { AmountWithPesoSign } from "@/components/PesoSign";
import { isYesOrNo } from "@/utilities/isEmptyItem";

const ReturnsReportsMobileResponsive = ({ rows, isDefaultMobile }) => {
  return (
    <>
      {isDefaultMobile === "report-sales-order/page-all-returns" && (
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
                    <span className="font-semibold text-black dark:text-light text-lg">
                      {rowData?.return_product_number}
                      <span className="font-semibold text-xs ml-1">
                        ({rowData?.return_product_order_number})
                      </span>
                    </span>
                    <span className="text-xs">{rowData?.return_product_date}</span>
                  </div>
                  <Pills variant={rowData?.return_product_status}>
                    {rowData?.return_product_status}
                  </Pills>
                </div>

                {/* OTHER FIELDS */}
                <ul className="text-xs [&>li]:flex [&>li]:justify-between [&>li]:py-1 [&>li]:border-b [&>li]:border-b-gray-200 dark:[&>li]:border-b-gray-700">
                  <li>
                    <span className="text-gray-500">Customer</span>
                    <span className="font-semibold text-right wrap-break-word">
                      {rowData?.return_product_customer_name}
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500">Product</span>
                    <span className="font-semibold text-right wrap-break-word">
                      {rowData?.return_product_product_name}
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500">Amount</span>
                    <span className="font-semibold">
                      <AmountWithPesoSign
                        classN="size-3"
                        classAmnt="text-black dark:text-light"
                        amount={rowData?.return_product_amount}
                      />
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500">Reason</span>
                    <span className="font-semibold capitalize">
                      {rowData?.return_product_reason || "-"}
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500">Resolution Type</span>
                    <span className="font-semibold capitalize">
                      {rowData?.return_product_resolution_type || "-"}
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500">Restocked</span>
                    <span className="font-semibold uppercase">
                      {isYesOrNo(rowData?.return_product_is_restocked)}
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500">Product Owner</span>
                    <span className="font-semibold text-right wrap-break-word">
                      {rowData?.return_product_owner_name || "-"}
                    </span>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ReturnsReportsMobileResponsive;
