import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import { Image } from "lucide-react";
import ActionButtonMobile from "../ActionButtonMobile";

const ProductsMobileResponsive = ({
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
      {isDefaultMobile === "products" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;
            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="flex gap-2 justify-between items-start border-b border-gray-200 pb-3 ">
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="text-left! ">
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
                      <span className={`font-semibold text-xs `}>
                        {rowData?.products_owner_name}
                      </span>
                    </div>
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
                      <span className={`text-gray-500 mr-2 min-w-15`}>
                        Supplier:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.products_suppliers_name}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-15`}>
                        Category:
                      </span>
                      <span className="wrap-break-word font-semibold ">
                        {rowData?.products_category}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-15`}>
                        Price:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        <AmountWithPesoSign
                          classN="size-3"
                          amount={rowData?.products_price}
                        />
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-15`}>
                        Threshold:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.products_low_stock_threshold}
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

export default ProductsMobileResponsive;
