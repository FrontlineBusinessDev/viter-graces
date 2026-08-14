import ExportCSVButton from "@/components/buttons/ExportCSVButton";
import { AmountWithPesoSign } from "@/components/PesoSign";
import { apiVersion } from "@/config/config";
import { ActivityLogDetails } from "@/layout/ArrayValue";
import ModalWrapper from "@/layout/modal/ModalWrapper";
import { queryData } from "@/services/queryData";
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
import React from "react";

const UpdateAccountsReceivableDetails = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [items, setItems] = React.useState(itemEdit?.installmentItems);

  const queryClient = useQueryClient();

  const handleClose = () => {
    queryClient.invalidateQueries({
      queryKey: ["finance-account-receivable"],
    });
    dispatch(setIsAdd(false));
    dispatch(setError(false));
  };

  handleEscape(() => handleClose());

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        `${apiVersion}/finance-account-receivable/account-receivable/${values?.installment_payment_aid}`,
        "put",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["finance-account-receivable"],
      });

      if (data.success) {
        console.log("data.success", data.success);
        dispatch(setSuccess(true));
        dispatch(setMessage("Updated successfully."));
      }
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });

  let totalPaidAmount = isEmptyItem(itemEdit?.sales_order_paid_amount, 0);
  let totalAmount = isEmptyItem(
    itemEdit?.sales_order_total_receivable_amount,
    0,
  );
  let totalBalanceAmount = isEmptyItem(
    itemEdit?.sales_order_total_balance_amount,
    0,
  );

  const handleChangeSave = (e, index) => {
    const updated = [...items];
    updated[index]["installment_payment_paid_amount"] = e.target.value;
    updated[index]["installment_payment_received_id"] =
      store.credentials?.data?.user_account_aid;
    updated[index]["installment_payment_received_name"] =
      store.credentials?.data?.name;
    setItems(updated);
    return;
  };

  let filterPaidAmount = items?.filter(
    (item) => item.installment_payment_is_paid === 0,
  );

  let paidAmount = filterPaidAmount?.reduce(
    (sum, item) =>
      Number(sum) + Number(item.installment_payment_paid_amount || 0),
    0,
  );

  const handleSave = (a, index) => {
    const updated = [...items];
    updated[index]["installment_payment_is_paid"] = 1;
    setItems(updated);

    let data = {
      ...itemEdit,
      icon: "",
      ...ActivityLogDetails("finance account receivable", "update", store, {
        ...itemEdit,
        icon: "",
        ...a,
        totalPaidAmount: Number(totalPaidAmount) + Number(paidAmount),
        totalBalanceAmount: Number(totalBalanceAmount) - Number(paidAmount),
      }),
      ...a,
      totalPaidAmount: Number(totalPaidAmount) + Number(paidAmount),
      totalBalanceAmount: Number(totalBalanceAmount) - Number(paidAmount),
    };

    mutation.mutate(data);
  };

  return (
    <ModalWrapper
      label={`Order Details - ${itemEdit?.sales_order_number}`}
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
                <th></th>
              </tr>
            </thead>
            <tbody className="">
              {items?.map((a, index) => {
                console.log("a", a);
                return (
                  <tr key={index} className="border-0!">
                    <td className="text-center dark:bg-gray-900! last:opacity-100 last:group-hover:opacity-100 last:-right-3 last:z-10">
                      {index + 1}.
                    </td>
                    <td className=" dark:bg-gray-900! ">
                      {a?.installment_payment_due_date}
                    </td>
                    <td className=" dark:bg-gray-900! ">
                      <AmountWithPesoSign
                        classN="size-3"
                        amount={a["installment_payment_amount"]}
                      />
                    </td>
                    {Number(a?.installment_payment_is_paid) === 0 ? (
                      <>
                        <td className=" dark:bg-gray-900! ">
                          <input
                            type="number"
                            className="text-right!"
                            onChange={(e) => handleChangeSave(e, index)}
                          />
                        </td>
                        <td>
                          <button
                            className={`text-white bg-gray-500 hover:bg-green-800 rounded-sm p-1 text-[10px]`}
                            type="button"
                            onClick={() => handleSave(a, index)}
                          >
                            Save
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="">
                          <AmountWithPesoSign
                            classN="size-3"
                            classAmnt="text-primary "
                            amount={Number(a.installment_payment_paid_amount)}
                          />
                        </td>
                        <td></td>
                      </>
                    )}
                  </tr>
                );
              })}
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
            amount={Number(totalPaidAmount) + Number(paidAmount)}
          />
        </li>
      </ul>
      <div className="grid grid-cols-2 bg-[#F5F5EC] dark:bg-gray-600 p-2">
        <span className="font-bold text-lg text-red-600 dark:text-light">
          Balance
        </span>
        <span className="font-bold text-lg text-right text-red-600 dark:text-light">
          <AmountWithPesoSign
            amount={Number(totalBalanceAmount) - Number(paidAmount)}
          />
        </span>
      </div>

      <ExportCSVButton />
    </ModalWrapper>
  );
};

export default UpdateAccountsReceivableDetails;
