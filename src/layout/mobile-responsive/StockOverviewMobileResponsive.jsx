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
      {isDefaultMobile === "stock-overview" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex gap-2 justify-between items-center border-b border-gray-200 pb-3 ">
                  <div className="flex flex-col">
                    <div className="flex sm:gap-2 flex-wrap items-center">
                      <span
                        className={`font-semibold text-black dark:text-light text-lg capitalize`}
                      >
                        {rowData?.products_name}
                      </span>

                      <span className={`font-semibold text-xs `}>
                        ({rowData?.products_sku})
                      </span>
                    </div>
                    <span className={`font-semibold text-left text-xs `}>
                      {rowData?.stock_movement_product_owner_name}
                    </span>
                    <span className={`font-semibold text-left text-xs `}>
                      {rowData?.stock_movement_location}
                    </span>
                  </div>

                  {/* STATUS */}
                  <Pills variant={rowData?.products_status}>
                    {rowData?.products_status}
                  </Pills>
                </div>
                {/* OTHER FIELDS */}
                <div className="flex flex-wrap justify-between items-end">
                  <ul className="py-2 gap-2 sm:gap-5  ">
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-19`}>
                        Unit:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.products_unit}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2`}>
                        Current stock:
                      </span>
                      <span className="wrap-break-word font-semibold ">
                        <AmountWithPesoSign
                          classN="size-3"
                          amount={rowData?.current_qty}
                        />
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-19`}>
                        Threshold:{" "}
                      </span>
                      <span className="wrap-break-word font-semibold">
                        <AmountWithPesoSign
                          classN="size-3"
                          amount={`${Number(rowData?.products_low_stock_threshold)}`}
                        />
                      </span>
                    </li>
                  </ul>
                  <div className=" ">
                    <ActionButtonMobile
                      dataArray={rowData}
                      setData={setData}
                      setItemEdit={setItemEdit}
                      ishaveSubAdd={ishaveSubAdd}
                      path={path}
                    />
                  </div>
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
