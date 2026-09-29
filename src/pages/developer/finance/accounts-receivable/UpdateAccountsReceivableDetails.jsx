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
import { exportRowsToXlsx } from "@/utilities/exportWorkbook";
import { formatDate } from "@/utilities/formatDate";
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

  // Flexible-type orders have no auto-generated schedule - individual
  // installment payments (date + paid amount + method) are added here one
  // row at a time instead.
  const isFlexibleInstallment =
    itemEdit?.sales_order_installment_type?.toLowerCase() === "flexible";

  // Installment Type is only meaningful (and only shown) when Payment terms
  // is "Installment" - a static attribute of the order, set from the Sales
  // Order modal, so it's shown here read-only rather than editable.
  const installmentType = isEmptyItem(
    itemEdit?.sales_order_installment_type,
    "",
  );

  const [newInstallments, setNewInstallments] = React.useState([]);

  const handleAddNewInstallment = () => {
    setNewInstallments([
      ...newInstallments,
      {
        installment_payment_due_date: "",
        installment_payment_paid_amount: "",
        installment_payment_method: "cash",
      },
    ]);
  };

  const handleChangeNewInstallment = (index, field, value) => {
    const updated = [...newInstallments];
    updated[index] = { ...updated[index], [field]: value };
    setNewInstallments(updated);
  };

  const handleRemoveNewInstallment = (index) => {
    setNewInstallments((prev) => prev.filter((_, i) => i !== index));
  };

  const createMutation = useMutation({
    mutationFn: (values) =>
      queryData(
        `${apiVersion}/finance-account-receivable/account-receivable`,
        "post",
        values,
      ),
    onSuccess: (res, variables) => {
      if (res?.success) {
        dispatch(setSuccess(true));
        dispatch(setMessage("Installment payment added."));

        // Patch in the real database id now that it exists - the row is
        // already locked/rendered (see handleSaveNewInstallment's optimistic
        // update below), this just keeps its record accurate.
        setItems((prev) =>
          (prev || []).map((item) =>
            item === variables.__item
              ? {
                  ...item,
                  installment_payment_aid: res?.["Account Receivable ID"],
                }
              : item,
          ),
        );

        if (Number(variables.totalBalanceAmount) <= 0) {
          queryClient.invalidateQueries({
            queryKey: ["finance-account-receivable"],
          });
          dispatch(setIsAdd(false));
        }
      } else {
        dispatch(setError(true));
        dispatch(setMessage(res?.error));
        rollbackNewInstallment(variables);
      }
    },
    onError: (error, variables) => {
      dispatch(setError(true));
      dispatch(
        setMessage(error?.message || "Failed to save installment payment."),
      );
      rollbackNewInstallment(variables);
    },
  });

  // Undoes the optimistic update from handleSaveNewInstallment when the
  // server call fails - puts the row back into the editable draft list and
  // reverts the totals it had already been folded into.
  const rollbackNewInstallment = (variables) => {
    setItems((prev) =>
      (prev || []).filter((item) => item !== variables.__item),
    );
    setNewInstallments((prev) => [...prev, variables.__row]);
    setTotalPaidAmount(
      (prev) =>
        Number(prev) - Number(variables.installment_payment_paid_amount),
    );
    setTotalBalanceAmount(
      (prev) =>
        Number(prev) + Number(variables.installment_payment_paid_amount),
    );
  };

  const handleSaveNewInstallment = (row) => {
    const enteredAmount = Number(row.installment_payment_paid_amount || 0);
    if (enteredAmount <= 0 || !row.installment_payment_due_date) return;

    // an additional payment on a settled fixed plan only covers what's owed
    if (canAddExtraPayment && enteredAmount > Number(totalBalanceAmount)) {
      dispatch(setError(true));
      dispatch(
        setMessage(
          `Payment cannot exceed the remaining balance of ${Number(totalBalanceAmount).toFixed(2)}.`,
        ),
      );
      return;
    }

    const newTotalPaidAmount = Number(totalPaidAmount) + enteredAmount;
    const newTotalBalanceAmount = Math.max(
      0,
      Number(totalBalanceAmount) - enteredAmount,
    );

    // Optimistic: lock the row to plain text the instant "Paid" is clicked,
    // same as handleSave does for a monthly installment row - the request
    // below persists it, rollbackNewInstallment undoes this if it fails.
    const paidItem = {
      installment_payment_aid: 0,
      installment_payment_is_paid: 1,
      installment_payment_due_date: row.installment_payment_due_date,
      installment_payment_amount: enteredAmount,
      installment_payment_paid_amount: enteredAmount,
      installment_payment_method: row.installment_payment_method,
    };

    setItems((prev) => [...(prev || []), paidItem]);
    setNewInstallments((prev) => prev.filter((r) => r !== row));
    setTotalPaidAmount(newTotalPaidAmount);
    setTotalBalanceAmount(newTotalBalanceAmount);

    const paymentFields = {
      sales_order_number: itemEdit?.sales_order_number,
      sales_order_customer_id: itemEdit?.sales_order_customer_id,
      sales_order_customer_name: itemEdit?.sales_order_customer_name,
      sales_order_payment_method: row.installment_payment_method,
      sales_order_total_amount: itemEdit?.sales_order_total_amount,
      sales_order_discount: itemEdit?.sales_order_discount,
      sales_order_tax: itemEdit?.sales_order_tax,
      installment_payment_due_date: row.installment_payment_due_date,
      installment_payment_paid_amount: enteredAmount,
      installment_payment_method: row.installment_payment_method,
      installment_payment_new_amount: enteredAmount,
      installment_payment_received_id:
        store.credentials?.data?.user_account_aid,
      installment_payment_received_name: store.credentials?.data?.name,
      installmentItems: items,
      totalPaidAmount: newTotalPaidAmount,
      totalBalanceAmount: newTotalBalanceAmount,
    };

    let data = {
      ...ActivityLogDetails(
        "finance account receivable",
        "create",
        store,
        paymentFields,
      ),
      ...paymentFields,
      __row: row,
      __item: paidItem,
    };

    createMutation.mutate(data);
  };

  let totalAmount = isEmptyItem(
    itemEdit?.sales_order_total_receivable_amount,
    0,
  );

  const isInstallment =
    itemEdit?.sales_order_payment_terms?.toLowerCase() === "installment";

  // Paid Amount is only locked to a fixed scheduled amount for a true FIXED
  // installment plan (Weekly/Monthly - a real generated schedule). Everything
  // else - non-installment terms and Flexible installment alike - shares the
  // same open/flexible payment logging: free-entry amounts, add-payment-as-you-go.
  const isFixedInstallment = isInstallment && !isFlexibleInstallment;
  const useUnifiedPaymentFlow = !isFixedInstallment;

  // A fixed plan whose schedule is fully paid can still carry a balance
  // (e.g. a product qty was added to the order afterwards) - with no unpaid
  // row left to settle, allow logging that balance as an additional payment.
  const hasUnpaidScheduleRow = (items || []).some(
    (a) => Number(a?.installment_payment_is_paid) === 0,
  );
  const canAddExtraPayment =
    isFixedInstallment &&
    !hasUnpaidScheduleRow &&
    Number(totalBalanceAmount) > 0;
  const showAddPayment = useUnifiedPaymentFlow || canAddExtraPayment;

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
      const maxAllowed = Math.min(
        availableCreditMemo,
        getRowRemainingBalance(a),
      );
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
    if (isFixedInstallment) {
      return (
        Number(a?.installment_payment_paid_amount || 0) +
        Number(a?.entered_amount || 0)
      );
    }
    return Number(a?.entered_amount || 0);
  };

  const getEnteredAmountForBalance = (a) => {
    if (isFixedInstallment) {
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

  // Unified flow (non-installment + Flexible installment) has no pre-generated
  // schedule to show - the backend still auto-creates one open placeholder row
  // per order, but until a payment is actually logged via "+ Add Payment" the
  // table should read empty, same as a fresh Flexible order. Only committed
  // (fully paid) entries are shown; a not-yet-paid placeholder stays hidden.
  const visibleItems = useUnifiedPaymentFlow
    ? items?.filter((a) => Number(a?.installment_payment_is_paid) === 1)
    : items;

  // Live total of whatever's currently typed into the new flexible-installment
  // rows (not yet saved), so Total Paid/Balance react on every keystroke -
  // same idea as `paidAmount` above for the existing rows' entered amounts.
  const newInstallmentsPaidTotal = newInstallments.reduce(
    (sum, row) => sum + Number(row.installment_payment_paid_amount || 0),
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
      // Live row state (this row's just-updated paid amount included) - not
      // itemEdit.installmentItems, which is frozen at modal-open and would
      // make the server recompute sales_order_due_date off stale data, same
      // as handleSaveNewInstallment already does for the Flexible path.
      installmentItems: updated,
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

  // CSV reflects exactly what's on screen: the header summary above the
  // table plus one row per already-recorded payment (unpaid/draft rows
  // aren't "recorded" yet, so they're excluded).
  const handleExportCSV = async () => {
    const currentTotalPaid =
      Number(totalPaidAmount) +
      Number(paidAmount) +
      Number(newInstallmentsPaidTotal);
    const currentBalance = Math.max(
      0,
      Number(totalBalanceAmount) -
        Number(paidAmount) -
        Number(newInstallmentsPaidTotal),
    );

    const metaRows = [
      ["Order #", itemEdit?.sales_order_number],
      ["Customer Name", itemEdit?.sales_order_customer_name],
      ["Order Date", itemEdit?.sales_order_date],
      ["Payment Terms", itemEdit?.sales_order_payment_terms],
      ...(isInstallment ? [["Installment Type", installmentType]] : []),
      ["Total Amount", Number(totalAmount).toFixed(2)],
      ["Total Paid", currentTotalPaid.toFixed(2)],
      ["Remaining Balance", currentBalance.toFixed(2)],
    ];
    const tableHeaderRow = [
      "Payment #",
      "Payment Date",
      "Paid Amount",
      "Payment Method",
    ];

    const rows = [
      ...metaRows,
      [],
      tableHeaderRow,
      ...(items || [])
        .filter((item) => Number(item?.installment_payment_is_paid) === 1)
        .map((item, index) => [
          index + 1,
          formatDate(item?.installment_payment_due_date),
          Number(item?.installment_payment_paid_amount || 0).toFixed(2),
          item?.installment_payment_method || "",
        ]),
    ];

    await exportRowsToXlsx({
      rows,
      fileName: `Order_Details_${itemEdit?.sales_order_number}`,
      title: `Accounts Receivable - ${itemEdit?.sales_order_number ?? ""}`,
      headerRowIndexes: [...metaRows.keys(), metaRows.length + 1],
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
      {isInstallment ? (
        <div className="flex">
          <p className="mr-1">Installment Type:</p>
          <p className="text-black dark:text-light capitalize">
            {installmentType}
          </p>
        </div>
      ) : (
        ""
      )}

      <div className="flex justify-between items-center mt-3 mb-1">
        <label></label>
        {showAddPayment ? (
          <button
            type="button"
            className="cursor-pointer flex items-center justify-center text-dark gap-2 px-3 py-3 bg-transparent rounded-md border-gray-300 border min-w-20 hover:bg-primary transition-all duration-300 ease-in-out hover:text-light dark:text-light"
            onClick={handleAddNewInstallment}
          >
            <span className="capitalize leading-0">+ Add Payment</span>
          </button>
        ) : (
          ""
        )}
      </div>

      <div className="border shadow border-gray-300 rounded-lg dark:bg-gray-700 w-full  transition-all duration-300 ease-in-out ">
        <div className="relative overflow-auto w-full h-full min-h-80 dark:bg-gray-900! ">
          <table className="shadow-none! ">
            <thead className={`relative z-50 table-header-group`}>
              <tr className="sm:table-row sticky top-0 uppercase dark:bg-[#0b111e] border-0! ">
                <th className="w-px dark:bg-gray-900! bg-gray-100!">#</th>
                <th className={`min-w-40  dark:bg-gray-900! bg-gray-100!`}>
                  {useUnifiedPaymentFlow ? "Date" : "Due Date"}
                </th>
                {!useUnifiedPaymentFlow ? (
                  <th className={` dark:bg-gray-900! bg-gray-100!`}>Amount</th>
                ) : (
                  ""
                )}
                <th
                  className={`min-w-30! dark:bg-gray-900! bg-gray-100! text-right`}
                >
                  Paid Amount
                </th>
                <th className={`min-w-32! dark:bg-gray-900! bg-gray-100!`}>
                  Method
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="">
              {visibleItems?.map((a, visibleIndex) => {
                // `visibleItems` is a filtered view - row handlers below
                // mutate `items` by index, so resolve back to that array's
                // real index rather than the filtered list's position.
                const index = items.indexOf(a);
                const isUnpaid = Number(a?.installment_payment_is_paid) === 0;

                return (
                  <React.Fragment key={index}>
                    <tr className="border-0!">
                      <td className="text-center dark:bg-gray-900! last:opacity-100 last:group-hover:opacity-100 last:-right-3 last:z-10">
                        {visibleIndex + 1}.
                      </td>
                      <td className=" dark:bg-gray-900! ">
                        {formatDate(a?.installment_payment_due_date)}
                      </td>
                      {!useUnifiedPaymentFlow ? (
                        <td className=" dark:bg-gray-900! ">
                          <AmountWithPesoSign
                            classN="size-3"
                            amount={a["installment_payment_amount"]}
                          />
                        </td>
                      ) : (
                        ""
                      )}
                      {isUnpaid ? (
                        <>
                          <td className=" dark:bg-gray-900! ">
                            {isFixedInstallment ? (
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
                          <td className="capitalize ">
                            {a?.installment_payment_method || "-"}
                          </td>
                          <td></td>
                        </>
                      )}
                    </tr>
                  </React.Fragment>
                );
              })}

              {newInstallments.map((row, index) => (
                <tr key={`new-${index}`} className="border-0!">
                  <td className="text-center dark:bg-gray-900!">
                    {visibleItems?.length + index + 1}.
                  </td>
                  <td className="dark:bg-gray-900!">
                    <input
                      type="date"
                      value={row.installment_payment_due_date}
                      onChange={(e) =>
                        handleChangeNewInstallment(
                          index,
                          "installment_payment_due_date",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  {!useUnifiedPaymentFlow ? (
                    // keeps the row aligned under the fixed plan's Amount column
                    <td className="dark:bg-gray-900!">
                      <AmountWithPesoSign
                        classN="size-3"
                        amount={Number(row.installment_payment_paid_amount || 0)}
                      />
                    </td>
                  ) : (
                    ""
                  )}
                  <td className="dark:bg-gray-900!">
                    <input
                      type="number"
                      className="text-right!"
                      placeholder="0"
                      value={row.installment_payment_paid_amount}
                      onChange={(e) =>
                        handleChangeNewInstallment(
                          index,
                          "installment_payment_paid_amount",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="dark:bg-gray-900!">
                    <select
                      value={row.installment_payment_method}
                      onChange={(e) =>
                        handleChangeNewInstallment(
                          index,
                          "installment_payment_method",
                          e.target.value,
                        )
                      }
                      className="capitalize"
                    >
                      {paymentMethodOptions
                        .filter((m) => m.value !== "credit memo")
                        .map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        className={`text-white bg-gray-500 hover:bg-green-800 rounded-sm p-1 text-[10px]`}
                        type="button"
                        onClick={() => handleSaveNewInstallment(row)}
                      >
                        Paid
                      </button>

                      <button
                        type="button"
                        className="text-red-500 text-xl"
                        onClick={() => handleRemoveNewInstallment(index)}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
            amount={
              Number(totalPaidAmount) +
              Number(paidAmount) +
              Number(newInstallmentsPaidTotal)
            }
          />
        </li>
      </ul>
      <div className="grid grid-cols-2 bg-[#F5F5EC] dark:bg-gray-600 p-2">
        <span className="font-bold text-lg text-red-600 dark:text-light">
          Balance
        </span>
        <span className="font-bold text-lg text-right text-red-600 dark:text-light">
          <AmountWithPesoSign
            amount={
              Number(totalBalanceAmount) -
              Number(paidAmount) -
              Number(newInstallmentsPaidTotal)
            }
          />
        </span>
      </div>
      <ExportCSVButton onClick={handleExportCSV} />
    </ModalWrapper>
  );
};

export default UpdateAccountsReceivableDetails;
