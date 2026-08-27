import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import ActionButtonMobile from "../ActionButtonMobile";

const PurchaseMovementMobileReponsive = ({
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
      {isDefaultMobile === "purchase-order-movement" && (
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
                        Product owner:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.purchase_order_product_owner_name}
                      </span>
                    </li>
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
                        Quantity:
                      </span>{" "}
                      <span className="wrap-break-word font-semibold">
                        {rowData?.purchase_order_qty}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2  w-22`}>
                        Before quantity:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.purchase_order_before_qty}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 w-22`}>
                        After quantity:
                      </span>
                      <span className="wrap-break-word font-semibold uppercase">
                        {rowData?.purchase_order_after_qty}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 w-22`}>Note:</span>
                      <span className="wrap-break-word  ">
                        {rowData?.purchase_order_transfer_note}
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

export default PurchaseMovementMobileReponsive;
