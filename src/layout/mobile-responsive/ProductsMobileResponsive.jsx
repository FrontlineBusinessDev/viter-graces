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
                <div className="flex gap-2 justify-between items-center mb-3">
                  <div className="flex gap-2 items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-sm">
                      <Image className="mx-auto p-1" size={45} />
                    </div>
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
                <div className="border-t border-gray-200 py-2 gap-5 flex flex-wrap justify-between">
                  <div className=" ">
                    <p className={`text-left! text-xs text-gray-500 `}>
                      Supplier
                    </p>
                    <p className="text-sm wrap-break-word font-semibold">
                      {rowData?.products_suppliers_name}
                    </p>
                  </div>
                  <div className="  ">
                    <p className={`text-left! text-xs text-gray-500 `}>
                      Category
                    </p>

                    <p className="text-left! text-sm wrap-break-word font-semibold capitalize ">
                      {rowData?.products_category}
                    </p>
                  </div>
                  <div className="">
                    <p className={`text-left! text-xs text-gray-500 `}>Price</p>

                    <p className="text-sm wrap-break-word font-semibold">
                      <AmountWithPesoSign
                        classN="size-3"
                        amount={rowData?.products_price}
                      />
                    </p>
                  </div>
                  <div className="">
                    <p className={`text-left! text-xs text-gray-500 `}>
                      Threshold
                    </p>

                    <p className="text-sm wrap-break-word font-semibold">
                      {rowData?.products_low_stock_threshold}
                    </p>
                  </div>
                </div>
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

export default ProductsMobileResponsive;
