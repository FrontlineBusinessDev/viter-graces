import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import { Image } from "lucide-react";
import ActionButtonMobile from "../ActionButtonMobile";

const StockOverviewMobileResponsive = ({
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
      {(isDefaultMobile === "stock-overview" ||
        isDefaultMobile === "report-sales-order/page-stock-level" ||
        isDefaultMobile === "report-sales-order/page-all-low-stock") && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex flex-wrap gap-2 justify-between border-b border-gray-200 pb-2 ">
                  <div className="flex flex-col">
                    <div className="flex sm:gap-2 flex-wrap items-center">
                      <span
                        className={`font-semibold text-black dark:text-light text-lg capitalize`}
                      >
                        {rowData?.products_name}
                      </span>

                      <span className={`font-semibold text-xs ml-1 `}>
                        ({rowData?.products_sku})
                      </span>
                    </div>
                    <span className={`font-semibold text-left text-xs `}>
                      {rowData?.stock_movement_product_owner_name}
                    </span>
                  </div>

                  {/* STATUS */}
                  <ul className="text-left">
                    <li>
                      <Pills variant={rowData?.products_status}>
                        {rowData?.products_status}
                      </Pills>
                    </li>
                    <li>
                      <span className={`font-semibold text-left text-xs`}>
                        {rowData?.stock_movement_location}
                      </span>
                    </li>
                  </ul>
                </div>
                {/* OTHER FIELDS */}
                <div className="flex flex-wrap justify-between items-end">
                  <ul className="py-2 gap-2 sm:gap-5  ">
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2`}>
                        Current stock:
                      </span>
                      <span className="wrap-break-word font-semibold ">
                        {rowData?.current_qty}
                        <span className="ml-2">{rowData?.products_unit}</span>
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-19`}>
                        Threshold:{" "}
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.products_low_stock_threshold}
                        <span className="ml-2">{rowData?.products_unit}</span>
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

export default StockOverviewMobileResponsive;
