import Pills from "@/components/Pills";
import ActionButtonMobile from "../ActionButtonMobile";
import { AmountWithPesoSign } from "@/components/PesoSign";
import TableUpdateStatus from "../TableUpdateStatus";

const ReturnsMobileReponsive = ({
  rows,
  setData,
  setItemEdit,
  isDefaultMobile,
  ishaveSubAdd = false,
}) => {
  return (
    <>
      {isDefaultMobile === "returns-products" && (
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
                        {rowData?.name}
                      </span>
                      <span className={`font-semibold text-xs ml-1  `}>
                        ({rowData?.return_product_customer_name})
                      </span>
                    </div>
                    <span className={`font-semibold text-left text-xs `}>
                      {rowData?.return_product_owner_name}
                    </span>
                  </div>

                  {/* STATUS */}
                  <div>
                    <p className="mb-0 mt-1">
                      {rowData?.return_product_order_number}
                    </p>
                    <p className="mb-0 mt-1">{rowData?.return_product_date}</p>
                  </div>
                </div>

                {/* OTHER FIELDS */}

                <div className="flex flex-wrap justify-between items-end">
                  <ul className="py-2 gap-2 sm:gap-5  ">
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-15`}>
                        Product:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.return_product_product_name}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-15`}>
                        Amount:
                      </span>

                      <span className="wrap-break-word font-semibold">
                        <AmountWithPesoSign
                          classN="size-3"
                          amount={rowData?.return_product_amount}
                        />
                      </span>
                    </li>

                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-15`}>
                        Restocked:
                      </span>
                      <span className="wrap-break-word uppercase font-semibold">
                        {rowData?.return_product_is_restocked}
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2 min-w-15`}>
                        Reason:
                      </span>
                      <span className="wrap-break-word font-semibold">
                        {rowData?.return_product_reason}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end ">
                  <TableUpdateStatus
                    path={isDefaultMobile}
                    item={rowData}
                    dataArray={rowData}
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

export default ReturnsMobileReponsive;
