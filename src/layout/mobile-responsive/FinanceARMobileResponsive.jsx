import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import ActionButtonMobile from "../ActionButtonMobile";
import { ActionTableList } from "../ArrayValue";

const FinanceARMobileResponsive = ({
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
      {isDefaultMobile === "finance-account-receivable" && (
        <div>
          {rows?.map((row, index) => {
            const rowData = row.original;

            return (
              <div
                key={row.id}
                className="lg:hidden border rounded-xl p-4 mb-4 shadow-sm"
              >
                {/* HEADER */}
                <div className="xs:flex flex-wrap gap-2 justify-between mb-3">
                  <ul className="flex flex-col">
                    <li className="flex gap-2 flex-wrap items-center">
                      <span
                        className={`font-semibold text-black dark:text-light text-lg capitalize`}
                      >
                        {rowData?.sales_order_number}
                      </span>
                      <span className={`font-semibold text-xs `}>
                        ({rowData?.sales_order_payment_method})
                      </span>
                    </li>
                    <li className={`font-semibold text-left text-xs `}>
                      {rowData?.sales_order_customer_name}
                    </li>
                    <li className={`font-semibold text-left text-xs `}>
                      {rowData?.sales_order_product_owner_name}
                    </li>
                  </ul>

                  {/* STATUS */}
                  <ul>
                    <li className="mb-2 capitalize">
                      <Pills variant={rowData?.is_status}>
                        {rowData?.is_status}
                      </Pills>
                    </li>
                    <li className="mb-0">{rowData?.sales_order_date}</li>
                  </ul>
                </div>
                {/* OTHER FIELDS */}
                <div className="flex flex-wrap justify-between items-end border-t border-gray-200">
                  <ul className=" py-2 gap-2 sm:gap-5  ">
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2`}>Total: </span>
                      <span className="wrap-break-word font-semibold ml-5">
                        <AmountWithPesoSign
                          classN="size-3"
                          amount={rowData?.total_amount}
                        />
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2`}>Paid: </span>
                      <span className="wrap-break-word font-semibold ml-5">
                        <AmountWithPesoSign
                          classN="size-3"
                          amount={rowData?.total_paid}
                        />
                      </span>
                    </li>
                    <li className="flex text-left! text-xs">
                      <span className={`text-gray-500 mr-2`}>Balance: </span>
                      <span className="wrap-break-word font-semibold">
                        <AmountWithPesoSign
                          classN="size-3"
                          amount={`${Number(rowData?.total_amount) - Number(rowData?.total_paid) < 0 ? 0.0 : Number(rowData?.total_amount) - Number(rowData?.total_paid)}`}
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
                      itemVal={ActionTableList(
                        "finance-account-receivable",
                        "finance-ar",
                      )}
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

export default FinanceARMobileResponsive;
