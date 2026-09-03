import ExportCSVButton from "@/components/buttons/ExportCSVButton";
import { AmountWithPesoSign } from "@/components/PesoSign";
import { apiVersion } from "@/config/config";
import { ActivityLogDetails, PaymentMethodInArList } from "@/layout/ArrayValue";
import ModalWrapper from "@/layout/modal/ModalWrapper";
import { queryData } from "@/services/queryData";
import {
  setError,
  setIsAdd,
  setMessage,
  setSuccess,
} from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import useQueryData from "@/services/useQueryData";
import { handleEscape } from "@/utilities/handleEscape";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

const UpdateAccountsReceivableDetails = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [items, setItems] = React.useState(itemEdit?.installmentItems);
  const [totalPaidAmount, setTotalPaidAmount] = React.useState(
    isEmptyItem(itemEdit?.sales_order_paid_amount, 0),
  );
  const [totalBalanceAmount, setTotalBalanceAmount] = React.useState(
    isEmptyItem(itemEdit?.sales_order_total_balance_amount, 0),
  );

  // Credit memo balance for this order's customer (processed returns only,
  // excluding whatever this same order has already applied for itself)
  const { data: creditMemoResult } = useQueryData(
    `${apiVersion}/customer/read-open-credit-memo`, // endpoint
    "post", // method
    `customer/read-open-credit-memo`, // key
    {
      id: itemEdit?.sales_order_customer_id,
      excludeSalesOrderNumber: isEmptyItem(itemEdit?.sales_order_number, ""),
    },
    { id: itemEdit?.sales_order_customer_id },
  );

  const creditMemoBalance = Number(
    isEmptyItem(creditMemoResult?.data?.[0]?.open_credit_memo, 0),
  );

  // decremented locally as rows get paid via "credit memo" within this same
  // modal session, so a second row can't draw on the same balance twice
  // before the customer's balance is refetched from the server
  const [creditMemoUsed, setCreditMemoUsed] = React.useState(0);
  const availableCreditMemo = Math.max(0, creditMemoBalance - creditMemoUsed);

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
        dispatch(setSuccess(true));
        dispatch(setMessage("Updated successfully."));
      }
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });

  let totalAmount = isEmptyItem(
    itemEdit?.sales_order_total_receivable_amount,
    0,
  );

  // Paid Amount is only freely editable for non-installment terms. For a true
  // installment plan, each due-date row must be paid in full for its scheduled
  // amount - no partial/custom amounts.
  const isInstallment =
    itemEdit?.sales_order_payment_terms?.toLowerCase() === "installment";

  // "mutiple payment" is no longer selectable (its split-breakdown UI was
  // removed as redundant) - normalize any pre-existing row still carrying
  // that value down to plain "cash", same as an empty method would default.
  const normalizePaymentMethod = (method) => {
    const value = isEmptyItem(method, "cash");
    return value === "mutiple payment" ? "cash" : value;
  };

  // Credit memo is only offered when the customer actually has a balance to
  // spend, matching the same conditional visibility used in the Sales Order
  // modal's payment method dropdown.
  const paymentMethodOptions = PaymentMethodInArList().filter(
    (option) => option.value !== "credit memo" || availableCreditMemo > 0,
  );

  // how much of this row's scheduled amount is still owed
  const getRowRemainingBalance = (a) =>
    Math.max(
      0,
      Number(a?.installment_payment_amount || 0) -
        Number(a?.installment_payment_paid_amount || 0),
    );

  // "entered_amount" is what the user is typing THIS time - kept separate from
  // installment_payment_paid_amount (the already-recorded, server-confirmed
  // cumulative total for the row) so a partial payment can't clobber a prior one.
  const handleChangeSave = (e, index) => {
    const updated = [...items];
    const a = updated[index];
    let value = e.target.value;

    // Credit memo can never pay out more than the customer's available
    // balance, nor more than this row still owes.
    if (a?.installment_payment_method === "credit memo") {
      const maxAllowed = Math.min(availableCreditMemo, getRowRemainingBalance(a));
      if (value !== "" && Number(value) > maxAllowed) {
        value = maxAllowed;
      }
    }

    updated[index]["entered_amount"] = value;
    setItems(updated);
  };

  const handleChangeMethod = (e, index) => {
    const updated = [...items];
    const method = e.target.value;
    updated[index]["installment_payment_method"] = method;

    // pre-fill the paid amount with the smaller of the available credit
    // memo balance and what this row still owes
    if (method === "credit memo") {
      updated[index]["entered_amount"] = Math.min(
        availableCreditMemo,
        getRowRemainingBalance(updated[index]),
      );
    }

    setItems(updated);
  };

  // Installment rows (single method) are locked to the row's own scheduled
  // amount - not user-entered.
  const getEnteredAmount = (a) => {
    if (isInstallment) {
      return (
        Number(a?.installment_payment_paid_amount || 0) +
        Number(a?.entered_amount || 0)
      );
    }
    return Number(a?.entered_amount || 0);
  };

  const getEnteredAmountForBalance = (a) => {
    if (isInstallment) {
      return (
        Number(a?.installment_payment_amount || 0) +
        Number(a?.entered_amount || 0)
      );
    }
    return Number(a?.entered_amount || 0);
  };

  let filterUnpaidAmount = items?.filter(
    (item) => Number(item.installment_payment_is_paid) === 0,
  );

  let paidAmount = filterUnpaidAmount?.reduce(
    (sum, item) => Number(sum) + getEnteredAmount(item),
    0,
  );

  const handleSave = (a, index) => {
    getEnteredAmount(a);
    const enteredNow = getEnteredAmountForBalance(a);
    if (enteredNow <= 0) return;

    const previouslyPaid = Number(a["installment_payment_paid_amount"] || 0);
    const finalPaidAmount = previouslyPaid + enteredNow;
    const isFullyPaid =
      finalPaidAmount >= Number(a["installment_payment_amount"]);
    const paymentMethod = normalizePaymentMethod(a?.installment_payment_method);

    // belt-and-suspenders: the input is already clamped as the user types,
    // but never let a credit-memo payment reach the server over the
    // customer's available balance
    if (paymentMethod === "credit memo" && enteredNow > availableCreditMemo) {
      return;
    }

    const updated = [...items];
    updated[index]["installment_payment_is_paid"] = isFullyPaid ? 1 : 0;
    updated[index]["installment_payment_paid_amount"] = finalPaidAmount;
    updated[index]["installment_payment_method"] = paymentMethod;
    updated[index]["entered_amount"] = "";
    setItems(updated);

    const newTotalPaidAmount = Number(totalPaidAmount) + enteredNow;
    const newTotalBalanceAmount = Number(totalBalanceAmount) - enteredNow;

    const paymentFields = {
      ...a,
      installment_payment_paid_amount: finalPaidAmount,
      // The amount being paid in THIS transaction, distinct from the row's
      // cumulative total above - needed so the cash/check/online increments and
      // the sales journal entry don't double-count a prior partial payment.
      installment_payment_new_amount: enteredNow,
      installment_payment_received_id:
        store.credentials?.data?.user_account_aid,
      installment_payment_received_name: store.credentials?.data?.name,
      installment_payment_method: paymentMethod,
      sales_order_payment_method: paymentMethod,
      payment_cash_amount: a?.payment_cash_amount || 0,
      payment_check_amount: a?.payment_check_amount || 0,
      payment_online_amount: a?.payment_online_amount || 0,
    };

    let data = {
      ...itemEdit,
      icon: "",
      ...ActivityLogDetails("finance account receivable", "update", store, {
        ...itemEdit,
        icon: "",
        ...paymentFields,
        totalPaidAmount: newTotalPaidAmount,
        totalBalanceAmount: newTotalBalanceAmount,
      }),
      ...paymentFields,
      totalPaidAmount: newTotalPaidAmount,
      totalBalanceAmount: newTotalBalanceAmount,
    };

    mutation.mutate(data, {
      onSuccess: (res) => {
        if (res?.success) {
          setTotalPaidAmount(newTotalPaidAmount);
          setTotalBalanceAmount(newTotalBalanceAmount);

          if (paymentMethod === "credit memo") {
            setCreditMemoUsed((prev) => prev + enteredNow);
          }

          if (Number(newTotalBalanceAmount) <= 0) {
            queryClient.invalidateQueries({
              queryKey: ["finance-account-receivable"],
            });
            dispatch(setIsAdd(false));
          }
        }
      },
    });
  };

  return (
    <ModalWrapper
      label={`Order Details - ${itemEdit?.sales_order_number}`}
      itemEdit={itemEdit}
      mutation={mutation}
      isOpen={true}
      handleClose={handleClose}
      width="max-w-[45rem]!"
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
      <div className="flex">
        <p className="mr-1">Payment terms:</p>
        <p className="text-black dark:text-light capitalize">
          {itemEdit?.sales_order_payment_terms}
        </p>
      </div>
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
                <th
                  className={`min-w-32! dark:bg-gray-900! bg-gray-100! text-center`}
                >
                  Method
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="">
              {items?.map((a, index) => {
                const isUnpaid = Number(a?.installment_payment_is_paid) === 0;

                return (
                  <React.Fragment key={index}>
                    <tr className="border-0!">
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
                      {isUnpaid ? (
                        <>
                          <td className=" dark:bg-gray-900! ">
                            {isInstallment ? (
                              // Installment terms: Paid Amount is fixed to the
                              // scheduled amount for this due date - no free input.
                              <AmountWithPesoSign
                                classN="size-3"
                                amount={a["installment_payment_amount"]}
                              />
                            ) : (
                              <input
                                type="number"
                                className="text-right!"
                                placeholder="0"
                                value={isEmptyItem(a["entered_amount"], "")}
                                onChange={(e) => handleChangeSave(e, index)}
                              />
                            )}
                          </td>
                          <td className=" dark:bg-gray-900! ">
                            <select
                              value={normalizePaymentMethod(
                                a["installment_payment_method"],
                              )}
                              onChange={(e) => handleChangeMethod(e, index)}
                              className="capitalize"
                            >
                              {paymentMethodOptions.map((m) => (
                                <option key={m.value} value={m.value}>
                                  {m.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <button
                              className={`text-white bg-gray-500 hover:bg-green-800 rounded-sm p-1 text-[10px]`}
                              type="button"
                              onClick={() => handleSave(a, index)}
                            >
                              Paid
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
                          <td className="capitalize">
                            {a?.installment_payment_method || "-"}
                          </td>
                          <td></td>
                        </>
                      )}
                    </tr>
                  </React.Fragment>
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
