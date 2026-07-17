import CloseButton from "@/components/buttons/CloseButton";
import { AmountWithPesoSign } from "@/components/PesoSign";
import Pills from "@/components/Pills";
import { setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { Download } from "lucide-react";
import React from "react";

const ViewSalesDetails = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  let counter = 1;
  const handleClose = () => {
    dispatch(setIsView(false));
  };

  let total_balance =
    Number(itemEdit?.total_amount) - Number(itemEdit?.total_paid);

  return (
    <div
      className="bg-dark/50 dark:bg-dark-mode/90 fixed inset-0 z-999 flex justify-center items-center overflow-y-auto animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className={`p-1 min-w-[350px] animate-slideUp w-full max-w-140 my-10`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-light dark:bg-gray-900 rounded-lg dark:border dark:border-gray-800 flex flex-col max-h-[90vh] p-4">
          <div className="modal-header relative p-4">
            <CloseButton handleClose={handleClose} />
          </div>
          <h3 className="text-black dark:text-light text-lg mb-2">
            Order Details - {itemEdit?.sales_order_number}
          </h3>

          <ul className="grid xs:grid-cols-2 [&>li]:flex [&>li]:items-start [&>li]:gap-1 mb-3 ">
            <li>
              <p className="m-0">Customer:</p>
              <p className="m-0 text-black dark:text-light">
                {itemEdit?.sales_order_customer_name}
              </p>
            </li>
            <li>
              <p className="m-0">Date:</p>
              <p className="m-0 text-black dark:text-light">
                {itemEdit?.sales_order_date}
              </p>
            </li>
            <li>
              <p className="m-0">Received by:</p>
              <p className="m-0 text-black dark:text-light">
                {itemEdit?.sales_order_received_by_name}
              </p>
            </li>
            <li>
              <p className="m-0">Payment method:</p>
              <p className="m-0 text-black dark:text-light capitalize">
                {itemEdit?.sales_order_payment_method}
              </p>
            </li>
            <li>
              <p className="m-0">Status:</p>
              <Pills variant={itemEdit?.sales_order_status}>
                {itemEdit?.sales_order_status}
              </Pills>
            </li>
            <li>
              <p className="m-0 min-w-23">Payment terms:</p>
              <p className="m-0 text-black dark:text-light capitalize">
                {itemEdit?.sales_order_payment_terms}
              </p>
            </li>
          </ul>

          <div className="border shadow  border-gray-300 rounded-lg dark:bg-gray-700 w-full  transition-all duration-300 ease-in-out ">
            <div className="relative overflow-auto w-full h-full min-h-50 max-h-50 dark:bg-gray-900! ">
              <table className="shadow-none! ">
                <thead className={`relative z-20 table-header-group`}>
                  <tr className="sm:table-row sticky top-0 uppercase dark:bg-[#0b111e] border-0!">
                    <th className="w-px bg-gray-100! dark:bg-gray-900!">#</th>
                    <th className={`min-w-40  dark:bg-gray-900! bg-gray-100!`}>
                      Products
                    </th>
                    <th className={` dark:bg-gray-900! bg-gray-100!`}>QTY</th>
                    <th
                      className={`min-w-30! dark:bg-gray-900! bg-gray-100! text-right`}
                    >
                      Price per unit
                    </th>
                    <th
                      className={` dark:bg-gray-900! bg-gray-100! text-right`}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {itemEdit?.items?.map((aitem, akey) => {
                    console.log("itemEdit", itemEdit);
                    return (
                      <tr key={akey} className="border-0!">
                        <td className="text-center dark:bg-gray-900! last:opacity-100 last:group-hover:opacity-100 last:-right-3 last:z-10">
                          {akey + 1}.
                        </td>

                        <td className=" dark:bg-gray-900! ">
                          {aitem?.sales_order_product_name}
                        </td>

                        <td className=" dark:bg-gray-900! text-right">
                          {aitem?.sales_order_qty}
                        </td>
                        <td className=" dark:bg-gray-900! ">
                          <AmountWithPesoSign
                            classN="size-3"
                            amount={`${aitem?.sales_order_price}`}
                          />
                        </td>
                        <td className=" dark:bg-gray-900! ">
                          <AmountWithPesoSign
                            classN="size-3"
                            amount={`${aitem?.sales_order_total}`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <ul className="grid grid-cols-2 my-3 [&>li]:border-b [&>li]:border-b-gray-200 ">
            <li className="">
              <small>Subtotal</small>
            </li>
            <li className="text-right">
              <small>
                <AmountWithPesoSign
                  classN="size-3"
                  amount={`${itemEdit?.total_sub_amount}`}
                />
              </small>
            </li>
            <li className="">
              <small>Tax</small>
            </li>
            <li className="text-right">
              <small>
                <AmountWithPesoSign
                  classN="size-3"
                  amount={`${itemEdit?.sales_order_tax_amount}`}
                />
              </small>
            </li>
            <li className="">
              <small>Discount</small>
            </li>
            <li className="text-right">
              <small>
                <AmountWithPesoSign
                  classN="size-3"
                  amount={`${itemEdit?.sales_order_discount}`}
                />
              </small>
            </li>
          </ul>

          <ul className="grid grid-cols-2 mb-3 [&>li]:border-b [&>li]:border-b-gray-200 gap-y-1">
            <li className=" font-bold">Total</li>
            <li className="text-right font-bold">
              <AmountWithPesoSign
                classN="size-3"
                amount={`${itemEdit?.total_amount}`}
              />
            </li>
            <li className="text-green-500 font-bold">Paid</li>
            <li className="text-right font-bold">
              <AmountWithPesoSign
                classN="size-3"
                amount={`${itemEdit?.total_paid}`}
              />
            </li>
            <li className="text-red-500 font-bold">Balance</li>
            <li className="text-right font-bold">
              <AmountWithPesoSign
                classN="size-3"
                amount={`${Number(total_balance) < 0 ? "0.00" : total_balance}`}
              />
            </li>
          </ul>

          <div className="my-4 place-self-center">
            <button className="btn--outline--gray flex items-center gap-2">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSalesDetails;
