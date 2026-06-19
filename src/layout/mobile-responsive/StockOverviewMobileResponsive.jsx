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
            console.log("rowData", rowData);

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex gap-2 justify-between items-center mb-3">
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
                  </div>

                  {/* STATUS */}
                  <Pills variant={rowData?.products_status}>
                    {rowData?.products_status}
                  </Pills>
                </div>

                {/* OTHER FIELDS */}
                <ul className="border-t border-gray-200 py-2 gap-5 flex ">
                  <li className="">
                    <small className={`text-left! text-xs text-gray-500 `}>
                      Current Stock
                    </small>
                    <br />
                    <span className="text-[40px] wrap-break-word font-bold">
                      {rowData?.current_qty}
                    </span>
                  </li>
                  <li className="  ">
                    <p className={`text-left! text-xs text-gray-500 `}>
                      Category
                    </p>

                    <p className="text-left! text-sm wrap-break-word font-semibold capitalize ">
                      {rowData?.products_category}
                    </p>
                  </li>
                </ul>
                <div className="flex gap-2 justify-end">
                  <ActionButtonMobile
                    dataArray={rowData}
                    setData={setData}
                    setItemEdit={setItemEdit}
                    ishaveSubAdd={ishaveSubAdd}
                    path={path}
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

export default StockOverviewMobileResponsive;
