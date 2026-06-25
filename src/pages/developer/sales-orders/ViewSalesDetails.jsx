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
        className={`p-1 min-w-[350px] animate-slideUp w-full max-w-lg my-10`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-light dark:bg-gray-900 rounded-lg dark:border dark:border-gray-800 flex flex-col max-h-[90vh] p-4">
          <div className="modal-header relative p-4">
            <CloseButton handleClose={handleClose} />
          </div>
          <h3 className="text-black dark:text-light text-lg mb-2">
            Order Details - {itemEdit?.sales_order_number}
          </h3>

          {/* <ul className="grid grid-cols-2 [&>li]:flex [&>li]:items-center [&>li]:gap-2 my-3">
            <li>
              <p>Customer:</p>
              <p className="text-black dark:text-light">
                {itemEdit?.sales_order_customer_name}
              </p>
            </li>
            <li>
              <p>Date:</p>
              <p className="text-black dark:text-light">
                {itemEdit?.sales_order_date}
              </p>
            </li>
            <li>
              <p>Received by:</p>
              <p className="text-black dark:text-light">
                {itemEdit?.sales_order_received_by_name}
              </p>
            </li>
            <li>
              <p>Payment:</p>
              <p className="text-black dark:text-light capitalize">
                {itemEdit?.sales_order_payment_method}
              </p>
            </li>
            <li>
              <p>Status:</p>
              <Pills variant={itemEdit?.sales_order_status}>
                {itemEdit?.sales_order_status}
              </Pills>
            </li>
          </ul> */}

          <div className="overflow-y-auto flex-1">
            <div className="">
              <div className="rounded-2xl border border-gray-300 bg-white dark:bg-[#0b111e] overflow-x-hidden dark:border-gray-700 max-h-[200px]">
                {/* desktop header */}
                <ul className="sticky top-0 grid grid-cols-[2rem_1fr_4rem_1fr_1fr] items-center border-b bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 dark:bg-[#0b111e]">
                  <li>#</li>
                  <li>Product</li>
                  <li>QTY</li>
                  <li className="text-center">Price</li>
                  <li className="text-center">Total</li>
                </ul>
                {itemEdit?.items?.map((aitem, akey) => {
                  return (
                    <ul
                      className={`${akey === 0 ? " pt-3 " : " pt-1 "} px-4 grid grid-cols-[2rem_1fr_4rem_1fr_1fr] gap-1 text-sm last:pb-3`}
                      key={akey}
                    >
                      <li>{counter++}.</li>
                      <li>{aitem?.sales_order_product_name}</li>
                      <li>{aitem?.sales_order_qty}</li>
                      <li>
                        <AmountWithPesoSign
                          classN="size-3"
                          amount={`${aitem?.sales_order_price}`}
                        />
                      </li>
                      <li>
                        <AmountWithPesoSign
                          classN="size-3"
                          amount={`${aitem?.sales_order_total}`}
                        />
                      </li>
                    </ul>
                  );
                })}
              </div>
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
