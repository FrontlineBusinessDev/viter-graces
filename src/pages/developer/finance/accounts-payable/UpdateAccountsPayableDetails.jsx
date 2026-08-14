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

const UpdateAccountsPayableDetails = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [items, setItems] = React.useState([{ paid_amount: 0 }]);

  const queryClient = useQueryClient();

  const handleClose = () => {
    queryClient.invalidateQueries({
      queryKey: ["finance-account-payable"],
    });
    dispatch(setIsAdd(false));
    dispatch(setError(false));
  };

  handleEscape(() => handleClose());

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        `${apiVersion}/finance-account-payable/account-payable/1`,
        "put",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["finance-account-payable"],
      });

      if (data.success) {
        dispatch(setSuccess(true));
        dispatch(setMessage("Updated successfully."));
      }
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });

  let totalPaidAmount = isEmptyItem(itemEdit?.paid_amount, 0);
  let totalAmount = isEmptyItem(itemEdit?.amount, 0);
  let totalBalanceAmount = isEmptyItem(itemEdit?.balance_amount, 0);

  const handleChangeSave = (e, index) => {
    const updated = [...items];
    updated[index]["paid_amount"] = e.target.value;
    setItems(updated);
    return;
  };

  let paidAmount = items?.reduce(
    (sum, item) => Number(sum) + Number(item.paid_amount || 0),
    0,
  );

  const handleSave = (a) => {
    let data = {
      ...itemEdit,
      icon: "",
      ...ActivityLogDetails("finance account payable", "update", store, {
        ...itemEdit,
        icon: "",
        ...a,
        totalPaidAmount: Number(totalPaidAmount) + Number(paidAmount),
        totalBalanceAmount: Number(totalBalanceAmount) - Number(paidAmount),
      }),
      ...a,
      totalAmount: Number(totalAmount),
      totalPaidAmount: Number(totalPaidAmount) + Number(paidAmount),
      totalBalanceAmount: Number(totalBalanceAmount) - Number(paidAmount),
    };

    // console.log("data", data);
    mutation.mutate(data);
  };
  return (
    <ModalWrapper
      label={`Order Details - ${itemEdit?.purchase_order_number}`}
      itemEdit={itemEdit}
      mutation={mutation}
      isOpen={true}
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
          <p>Delivery Date:</p>
          <p className="text-black dark:text-light">
            {itemEdit?.purchase_order_expected_delivery}
          </p>
        </li>
        <li className="">
          <p>Order Date:</p>
          <p className="text-black dark:text-light">
            {itemEdit?.purchase_order_date}
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
                    amount={itemEdit.amount}
                  />
                </td>
                <td className="dark:bg-gray-900! text-right font-bold ">
                  <AmountWithPesoSign
                    classN="size-3"
                    classAmnt="text-primary"
                    amount={itemEdit.paid_amount}
                  />
                </td>

                <td className=" dark:bg-gray-900! ">
                  <AmountWithPesoSign
                    classN="size-3"
                    classAmnt="text-primary text-warning"
                    amount={itemEdit.balance_amount}
                  />
                </td>
              </tr>
              {items?.map((i, aIndex) => {
                return (
                  <tr key={aIndex} className="border-0!">
                    <td className="text-center dark:bg-gray-900! last:opacity-100 last:group-hover:opacity-100 last:-right-3 last:z-10"></td>
                    <td className=" dark:bg-gray-900! "></td>
                    <td className=" dark:bg-gray-900! "></td>
                    <td className="dark:bg-gray-900! text-right">
                      <button
                        className={`text-white bg-gray-500 hover:bg-green-800 rounded-sm p-1 text-[10px]`}
                        type="button"
                        onClick={() => handleSave(i)}
                      >
                        Save
                      </button>
                    </td>

                    <td className=" dark:bg-gray-900! ">
                      <input
                        type="number"
                        className="text-right! mt-0!"
                        onChange={(e) => handleChangeSave(e, aIndex)}
                      />
                    </td>
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

export default UpdateAccountsPayableDetails;
