import ExportCSVButton from "@/components/buttons/ExportCSVButton";
import { AmountWithPesoSign } from "@/components/PesoSign";
import ModalWrapper from "@/layout/modal/ModalWrapper";
import { setError, setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { handleEscape } from "@/utilities/handleEscape";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";

const ViewAccountsPayableDetails = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [items, setItems] = React.useState([{ paid_amount: 0 }]);

  const handleClose = () => {
    dispatch(setIsView(false));
    dispatch(setError(false));
  };

  handleEscape(() => handleClose());

  console.log("itemEdit", itemEdit);

  // let totalPaidAmount = isEmptyItem(itemEdit?.paid_amount, 0);
  // let totalAmount = isEmptyItem(itemEdit?.amount, 0);
  // let totalBalanceAmount = isEmptyItem(itemEdit?.balance_amount, 0);

  let totalPaidAmount = 0;
  let totalAmount = 0;
  let totalBalanceAmount = 0;
  return (
    <ModalWrapper
      val={`Order Details - ${itemEdit?.purchase_order_number}`}
      itemEdit={itemEdit}
      isOpen={true}
      mutation={{ isPending: false }}
      handleClose={handleClose}
      width="min-w-[550px]!"
    >
      <ul className="grid grid-cols-2 [&>li]:flex [&>li]:items-center [&>li]:gap-2 ">
        <li>
          <p>Supplier:</p>
          <p className="text-black dark:text-light">
            {itemEdit?.purchase_order_supplier_name}
          </p>
        </li>
        <li className="justify-end">
          <p>Deliver Date:</p>
          <p className="text-black dark:text-light">
            {itemEdit?.formated_delivery_date}
          </p>
        </li>
        <li className="">
          <p>Order Date:</p>
          <p className="text-black dark:text-light">
            {itemEdit?.formated_date}
          </p>
        </li>
        <li className="justify-end">
          <p>TAX:</p>
          <p className="text-black dark:text-light">
            {Number(itemEdit?.purchase_order_percent_tax) === 0.12
              ? "Inclusive"
              : Number(itemEdit?.purchase_order_percent_tax) === 1.12
                ? "Exclusive"
                : "--"}
          </p>
        </li>
      </ul>

      <div className="border shadow border-gray-300 rounded-lg dark:bg-gray-700 w-full  transition-all duration-300 ease-in-out ">
        <div className="relative overflow-auto w-full h-full min-h-80 dark:bg-gray-900! ">
          <table className="shadow-none! ">
            <thead className={`relative z-50 table-header-group`}>
              <tr className="sm:table-row sticky top-0 uppercase dark:bg-[#0b111e] border-0! ">
                <th className="w-px dark:bg-gray-900! bg-gray-100!">#</th>
                <th className={`min-w-24  dark:bg-gray-900! bg-gray-100!`}>
                  Due Date
                </th>
                <th className={` dark:bg-gray-900! bg-gray-100!`}>Amount</th>
                <th
                  className={`min-w-30! dark:bg-gray-900! bg-gray-100! text-center`}
                >
                  Paid Amount
                </th>
                <th
                  className={`min-w-35! dark:bg-gray-900! bg-gray-100! text-center`}
                >
                  Balance Amount
                </th>
              </tr>
            </thead>
            <tbody className="">
              {itemEdit?.items?.map((a, index) => {
                totalPaidAmount += Number(
                  isEmptyItem(
                    itemEdit?.purchase_order_total_amount_per_product,
                    0,
                  ),
                );
                totalAmount += Number(
                  isEmptyItem(
                    itemEdit?.purchase_order_total_paid_per_product,
                    0,
                  ),
                );
                totalBalanceAmount += Number(
                  isEmptyItem(
                    itemEdit?.purchase_order_total_balance_per_product,
                    0,
                  ),
                );
                return (
                  <tr key={index} className="border-0!">
                    <td className="text-center dark:bg-gray-900! last:opacity-100 last:group-hover:opacity-100 last:-right-3 last:z-10">
                      {index + 1}.
                    </td>
                    <td className=" dark:bg-gray-900! ">
                      {a?.purchase_order_date}
                    </td>
                    <td className=" dark:bg-gray-900! ">
                      <AmountWithPesoSign
                        classN="size-3"
                        amount={Number(
                          a.purchase_order_total_amount_per_product,
                        )}
                      />
                    </td>

                    <td className="">
                      <AmountWithPesoSign
                        classN="size-3"
                        classAmnt="text-primary "
                        amount={Number(a.purchase_order_total_paid_per_product)}
                      />
                    </td>
                    <td className="">
                      <AmountWithPesoSign
                        classN="size-3"
                        classAmnt="text-primary text-warning "
                        amount={Number(
                          a.purchase_order_total_balance_per_product,
                        )}
                      />
                    </td>
                  </tr>
                );
              })}
              <tr className="border-0!">
                <td
                  className="dark:bg-gray-900! text-right font-bold "
                  colSpan={2}
                >
                  TOTAL
                </td>
                <td className="dark:bg-gray-900! text-right font-bold ">
                  <AmountWithPesoSign
                    classN="size-3"
                    classAmnt="text-primary text-black! "
                    amount={totalAmount}
                  />
                </td>
                <td className="dark:bg-gray-900! text-right font-bold ">
                  <AmountWithPesoSign
                    classN="size-3"
                    classAmnt="text-primary"
                    amount={totalPaidAmount}
                  />
                </td>

                <td className=" dark:bg-gray-900! ">
                  <AmountWithPesoSign
                    classN="size-3"
                    classAmnt="text-primary text-warning"
                    amount={totalBalanceAmount}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ul className="grid grid-cols-2 my-3 [&>li]:border-b [&>li]:border-b-gray-200 gap-y-2 ">
        <li>Total Amount</li>
        <li className="text-right text-black font-bold">
          <AmountWithPesoSign classN="size-3" amount={Number(totalAmount)} />
        </li>
        <li>Total Paid</li>
        <li className="text-right text-green-600 font-bold">
          <AmountWithPesoSign
            classN="size-3"
            amount={Number(totalPaidAmount)}
          />
        </li>
      </ul>
      <div className="grid grid-cols-2 bg-[#F5F5EC] dark:bg-gray-600 p-2">
        <span className="font-bold text-lg text-red-600 dark:text-light">
          Balance
        </span>
        <span className="font-bold text-lg text-right text-red-600 dark:text-light">
          <AmountWithPesoSign amount={Number(totalBalanceAmount)} />
        </span>
      </div>

      <ExportCSVButton />
    </ModalWrapper>
  );
};

export default ViewAccountsPayableDetails;
