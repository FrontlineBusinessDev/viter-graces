import CloseButton from "@/components/buttons/CloseButton";
import ExportCSVButton from "@/components/buttons/ExportCSVButton";
import { Download, Pencil, Plus, Trash2 } from "lucide-react";
import React from "react";

const ViewAccountsPayableDetails = ({ setView, itemEdit }) => {
  const handleClose = () => {
    setView(false);
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
            Order Details - {itemEdit.order_no}
          </h3>

          <ul className="grid grid-cols-2 [&>li]:flex [&>li]:items-center [&>li]:gap-2 my-3">
            <li>
              <p>Customer:</p>
              <p className="text-black dark:text-light">{itemEdit.name}</p>
            </li>
            <li className="justify-end">
              <p>Date:</p>
              <p className="text-black dark:text-light">{itemEdit.date}</p>
            </li>
            <li>
              <p>Payment:</p>
              <p className="text-black dark:text-light">{itemEdit.method}</p>
            </li>
            <li className="justify-end">
              <p>Status:</p>
              <p
                className={`inline-block px-2 py-1 text-xs rounded-full ${
                  itemEdit?.payment_status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {itemEdit?.payment_status}
              </p>
            </li>
          </ul>

          <button className="btn--green mb-2 place-self-end py-2!">
            <Plus size={15} /> <span className="leading-0">Add Payment</span>
          </button>

          <div className="overflow-y-auto flex-1">
            <div className="">
              <div className="rounded-2xl border border-gray-300 bg-white dark:bg-[#0b111e] overflow-x-hidden dark:border-gray-700 max-h-[200px]">
                {/* desktop header */}
                <div className="hidden sticky top-0 lg:grid lg:grid-cols-4 lg:items-center border-b bg-gray-50 px-4 py-3 text-xs font-medium text-gray-500 dark:bg-[#0b111e]">
                  <div>#</div>
                  <div>Date</div>
                  <div>Amount</div>
                  <div>Action</div>
                </div>

                {/* row */}
                <ul className="p-4 grid grid-cols-[.5fr_1fr_1fr_1fr] lg:grid-cols-4 gap-1 text-sm">
                  <li>
                    <p className="text-xs text-gray-400 lg:hidden">#</p>1
                  </li>

                  <li>
                    <p className="text-xs text-gray-400 lg:hidden">Date</p>
                    03/07/2026
                  </li>

                  <li>
                    <p className="text-xs text-gray-400 lg:hidden">Amount</p>
                    ₱100.00
                  </li>
                  <li>
                    <p className="text-xs text-gray-400 lg:hidden">Action</p>
                    <span className="flex gap-2">
                      <button
                        type="button"
                        className="tooltip-action-table capitalize z-0!"
                        data-tooltip={"Edit"}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="tooltip-action-table capitalize z-0!"
                        data-tooltip={"Delete"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <ul className="grid grid-cols-2 my-3 [&>li]:border-b [&>li]:border-b-gray-200 gap-y-2">
            <li>Total Paid</li>
            <li className="text-right text-green-600 font-bold">
              ₱ {itemEdit.total}
            </li>
            <li>Balance</li>
            <li className="text-right text-red-600 font-bold">₱ 0.00</li>
          </ul>

          <div className="grid grid-cols-2 bg-[#F5F5EC] dark:bg-gray-600 py-2">
            <span className="font-bold text-lg text-black dark:text-light">
              Total
            </span>
            <span className="font-bold text-lg text-right text-black dark:text-light">
              ₱ {itemEdit.total}
            </span>
          </div>

          <ExportCSVButton />
        </div>
      </div>
    </div>
  );
};

export default ViewAccountsPayableDetails;
