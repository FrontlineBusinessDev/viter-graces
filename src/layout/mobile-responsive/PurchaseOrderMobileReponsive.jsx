import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import { Image } from "lucide-react";
import ActionButtonMobile from "../ActionButtonMobile";

const PurchaseOrderMobileReponsive = ({
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
      {isDefaultMobile === "purchase-order" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="xs:flex flex-wrap gap-2 justify-between items-center border-b border-gray-200 pb-3 ">
                  <div className="flex flex-col">
                    <div className="flex sm:gap-2 flex-wrap items-center">
                      <span
                        className={`font-semibold text-black dark:text-light text-lg capitalize`}
                      >
                        {rowData?.purchase_order_number}
                      </span>
                    </div>
                    <span className={`font-semibold text-left text-xs `}>
                      {rowData?.purchase_order_supplier_name}
                    </span>
                  </div>

                  {/* STATUS */}
                  <div>
                    <Pills variant={rowData?.is_status}>
                      {rowData?.is_status}
                    </Pills>
                    <p className="mb-0 mt-1">{rowData?.formated_date}</p>
                  </div>
                </div>

                {/* OTHER FIELDS */}

                <div className="flex flex-wrap justify-between items-end">
                  <ul className="py-2 gap-2 sm:gap-5  ">
                    <li className="flex text-left! text-xs ">
                      <span className={`text-gray-500 mr-2 w-22`}>
                        Expected Date:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.formated_delivery_date}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 w-22`}>
                        Total amount:
                      </span>{" "}
                      <span className="wrap-break-word font-semibold">
                        <AmountWithPesoSign
                          classN="size-3"
                          amount={rowData?.total_amount}
                        />
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2  w-22`}>
                        Paid Amount:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        <AmountWithPesoSign
                          classN="size-3 "
                          amount={rowData?.purchase_order_payment}
                        />
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-15`}>
                        Payment Status:
                      </span>
                      <span className="wrap-break-word font-semibold uppercase">
                        {rowData?.purchase_order_payment_status}
                      </span>
                    </li>
                  </ul>
                </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 ">
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

export default PurchaseOrderMobileReponsive;
