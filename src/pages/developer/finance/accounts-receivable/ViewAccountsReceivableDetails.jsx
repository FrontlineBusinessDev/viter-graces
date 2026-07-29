import CloseButton from "@/components/buttons/CloseButton";
import ExportCSVButton from "@/components/buttons/ExportCSVButton";
import { AmountWithPesoSign } from "@/components/PesoSign";
import { apiVersion } from "@/config/config";
import ModalWrapper from "@/layout/modal/ModalWrapper";
import {
  setError,
  setIsAdd,
  setMessage,
  setSuccess,
} from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { handleEscape } from "@/utilities/handleEscape";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React from "react";

const ViewAccountsReceivableDetails = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const handleClose = () => {
    dispatch(setIsAdd(false));
    dispatch(setError(false));
  };

  handleEscape(() => handleClose());

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(`${apiVersion}/finance-expenses`, "put", values),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["finance-expenses"],
      });

      if (data.success) {
        dispatch(setIsAdd(false));
        dispatch(setSuccess(true));
        dispatch(setMessage("Created successfully."));
      }
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });

  const handleChangeSave = (e, a) => {
    setTimeout(() => {
      mutation.mutate({ ...a, paid_amount: e.target.value });
    }, 500);
  };

  let totalPaidAmount = itemEdit?.sales_order_number;
  return (
    <ModalWrapper
      val={`Order Details - ${itemEdit?.sales_order_number}`}
      itemEdit={itemEdit}
      mutation={mutation}
      isOpen={true}
      handleClose={handleClose}
    >
      <ul className="grid grid-cols-2 [&>li]:flex [&>li]:items-center [&>li]:gap-2 ">
        <li>
          <p>Customer:</p>
          <p className="text-black dark:text-light">
            {itemEdit?.sales_order_customer_name}
          </p>
        </li>
        <li className="justify-end">
          <p>Order Date:</p>
          <p className="text-black dark:text-light">
            {itemEdit?.sales_order_date}
          </p>
        </li>
      </ul>

      <div className="border shadow border-gray-300 rounded-lg dark:bg-gray-700 w-full  transition-all duration-300 ease-in-out ">
        <div className="relative overflow-auto w-full h-full min-h-80 dark:bg-gray-900! ">
          <table className="shadow-none! ">
            <thead className={`relative z-50 table-header-group`}>
              <tr className="sm:table-row sticky top-0 uppercase dark:bg-[#0b111e] border-0! ">
                <th className="w-px dark:bg-gray-900! bg-gray-100!">#</th>
                <th className={`min-w-40  dark:bg-gray-900! bg-gray-100!`}>
                  Due Date
                </th>
                <th className={` dark:bg-gray-900! bg-gray-100!`}>Amount</th>
                <th
                  className={`min-w-30! dark:bg-gray-900! bg-gray-100! text-center`}
                >
                  Paid Amount
                </th>
              </tr>
            </thead>
            <tbody className="">
              {itemEdit?.installmentItems.map((a, index) => {
                return (
                  <tr key={a?.id} className="border-0!">
                    <td className="text-center dark:bg-gray-900! last:opacity-100 last:group-hover:opacity-100 last:-right-3 last:z-10">
                      {index + 1}.
                    </td>

                    <td className=" dark:bg-gray-900! ">
                      {a?.installment_payment_due_date}
                    </td>
                    <td className=" dark:bg-gray-900! ">
                      <AmountWithPesoSign
                        classN="size-3"
                        amount={a["sales_order_price"]}
                      />
                    </td>
                    <td className=" dark:bg-gray-900! ">
                      <input
                        type="number"
                        className="text-right!"
                        onChange={(e) => handleChangeSave(e, a)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="grid grid-cols-2 my-3 [&>li]:border-b [&>li]:border-b-gray-200 gap-y-2">
        <li>Total Amount</li>
        <li className="text-right text-black font-bold">₱ {itemEdit?.total}</li>
        <li>Total Paid</li>
        <li className="text-right text-green-600 font-bold">
          ₱ {itemEdit?.total}
        </li>
      </ul>

      <div className="grid grid-cols-2 bg-[#F5F5EC] dark:bg-gray-600 py-2">
        <span className="font-bold text-lg text-red-600 dark:text-light">
          Balance
        </span>
        <span className="font-bold text-lg text-right text-red-600 dark:text-light">
          ₱ {itemEdit?.total}
        </span>
      </div>

      <ExportCSVButton />
    </ModalWrapper>
  );
};

export default ViewAccountsReceivableDetails;
