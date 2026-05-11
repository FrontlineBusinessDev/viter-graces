import CloseButton from "@/components/buttons/CloseButton";
import ExportCSVButton from "@/components/buttons/ExportCSVButton";
import { AmountWithPesoSign } from "@/components/PesoSign";
import { setIsView } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import React from "react";

const ViewDetails = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const handleClose = () => {
    dispatch(setIsView(false));
  };
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
            Order Details - {isEmptyItem(itemEdit?.order_no, "")}
          </h3>

          <ul className="grid grid-cols-2 [&>li]:flex [&>li]:items-center [&>li]:gap-2 my-3">
            <li>
              <p>Customer:</p>
              <p className="text-black dark:text-light">
                {isEmptyItem(itemEdit?.name, "")}
              </p>
            </li>
            <li className="justify-end">
              <p>Date:</p>
              <p className="text-black dark:text-light">
                {isEmptyItem(itemEdit?.date, "--")}
              </p>
            </li>
            <li>
              <p>Payment:</p>
              <p className="text-black dark:text-light">
                {isEmptyItem(itemEdit?.method, "")}
              </p>
            </li>
            <li className="justify-end">
              <p>Status:</p>
              <p
                className={`inline-block px-2 py-1 text-xs rounded-full ${isEmptyItem(
                  itemEdit?.payment_status,
                  "",
                )} === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isEmptyItem(itemEdit?.payment_status, "--")}
              </p>
            </li>
          </ul>

          <div className="overflow-y-auto flex-1">
            <div className="">
              <div className="rounded-2xl border border-gray-300 bg-white dark:bg-[#0b111e] overflow-x-hidden dark:border-gray-700 max-h-[200px]">
                {/* desktop header */}
                <ul className="hidden sticky top-0 lg:grid lg:grid-cols-3 lg:items-center border-b bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 dark:bg-[#0b111e]">
                  <li>#</li>
                  <li>Product</li>
                  <li className="text-right!">Amount</li>
                </ul>

                {/* row */}
                <ul className="p-4 grid grid-cols-[.5fr_1fr_1fr] lg:grid-cols-3 gap-1 text-sm">
                  <li>
                    <p className="text-xs text-gray-400 lg:hidden">#</p>1.
                  </li>

                  <li>
                    <p className="text-xs text-gray-400 lg:hidden">Product</p>
                    Banana Chips
                  </li>

                  <li>
                    <p className="text-xs text-right! text-gray-400 lg:hidden">
                      Amount
                    </p>
                    <AmountWithPesoSign classN={"size-3"} amount="0" />
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <ul className="grid grid-cols-2 my-3 [&>li]:border-b [&>li]:border-b-gray-200 gap-y-2">
            <li>Total Paid</li>
            <li className="text-right text-green-600 font-bold">
              <AmountWithPesoSign
                classN={"size-3 "}
                classAmnt={"text-green-600 "}
                amount="0"
              />
              {isEmptyItem(itemEdit?.total, "")}
            </li>
            <li>Balance</li>
            <li className="text-right text-red-600 font-bold">
              <AmountWithPesoSign
                classN={"size-3 "}
                classAmnt={"text-red-600 "}
                amount="0"
              />
            </li>
          </ul>

          <div className="grid grid-cols-2 bg-[#F5F5EC] dark:bg-gray-600 py-2">
            <span className="font-bold text-lg text-black dark:text-light">
              Total
            </span>
            <AmountWithPesoSign
              classPS={"size-3"}
              amount="0"
              classAmnt="font-bold text-lg text-black dark:text-light"
            />
          </div>

          <ExportCSVButton />
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
