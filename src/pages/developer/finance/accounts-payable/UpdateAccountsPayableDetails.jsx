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
import * as XLSX from "xlsx";

const UpdateAccountsPayableDetails = ({ itemEdit }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [items, setItems] = React.useState([{ paid_amount: "" }]);

  // Running totals for this modal session. itemEdit is a snapshot captured
  // when the row was clicked and never refreshed while the modal stays
  // open, so each successful partial payment is folded into this local
  // baseline instead - that's what lets the totals below stay correct
  // across multiple saves without double-counting, and what handleSave
  // compares against to decide whether the balance just reached zero.
  const [savedPaidAmount, setSavedPaidAmount] = React.useState(() =>
    Number(isEmptyItem(itemEdit?.paid_amount, 0)),
  );
  const [savedBalanceAmount, setSavedBalanceAmount] = React.useState(() =>
    Number(isEmptyItem(itemEdit?.balance_amount, 0)),
  );

  // Per-product-row running Paid/Balance, seeded from the same itemEdit
  // snapshot - itemEdit.items never refreshes while the modal stays open, so
  // without this the rows below would stay frozen at their pre-save values
  // even though the order-level totals above already update correctly.
  const [itemPayments, setItemPayments] = React.useState(() => {
    const map = {};
    (itemEdit?.items || []).forEach((item) => {
      map[item.purchase_order_aid] = {
        paid: Number(item.purchase_order_total_paid_per_product || 0),
        balance: Number(item.purchase_order_total_balance_per_product || 0),
      };
    });
    return map;
  });

  const queryClient = useQueryClient();

  const handleClose = () => {
    queryClient.invalidateQueries({
      queryKey: ["finance-account-payable"],
    });
    dispatch(setIsAdd(false));
    dispatch(setError(false));
  };

  handleEscape(() => handleClose());

  let totalPaidAmount = savedPaidAmount;
  let totalAmount = isEmptyItem(itemEdit?.amount, 0);
  let totalBalanceAmount = savedBalanceAmount;

  const mutation = useMutation({
    mutationFn: (values) =>
      queryData(
        `${apiVersion}/finance-account-payable/account-payable/${isEmptyItem(itemEdit?.items?.[0]?.purchase_order_aid, 1)}`,
        "put",
        values,
      ),
    onSuccess: (data) => {
      // Invalidate and refetch so the table row picks up the new status/amounts
      queryClient.invalidateQueries({
        queryKey: ["finance-account-payable"],
      });

      if (data.success) {
        dispatch(setSuccess(true));
        dispatch(setMessage("Updated successfully."));

        const newBalance = Number(totalBalanceAmount) - Number(paidAmount);

        if (newBalance <= 0) {
          // Fully settled - close the modal, the invalidated query above
          // refreshes the table so its badge flips to PAID immediately.
          handleClose();
        } else {
          // Still owing - fold the payment just made into the running
          // totals and clear the input so the user can enter another one.
          const newTotalPaid = Number(totalPaidAmount) + Number(paidAmount);
          setSavedPaidAmount(newTotalPaid);
          setSavedBalanceAmount(newBalance);
          setItems([{ paid_amount: "" }]);

          // Fold the same payment into each product row: New Paid Amount =
          // Previous Paid Amount + Input Amount, New Balance Amount = Total
          // Line Item Amount - New Paid Amount. Multi-item orders split the
          // payment by each line's share of the order total, matching how
          // the backend allocates it (see update.php).
          setItemPayments(() => {
            const updated = {};
            (itemEdit?.items || []).forEach((item) => {
              const aid = item.purchase_order_aid;
              const itemTotalAmount = Number(
                item.purchase_order_total_amount_per_product || 0,
              );
              const share =
                Number(totalAmount) > 0
                  ? itemTotalAmount / Number(totalAmount)
                  : 0;
              const newPaid = newTotalPaid * share;
              updated[aid] = {
                paid: newPaid,
                balance: Math.max(0, itemTotalAmount - newPaid),
              };
            });
            return updated;
          });
        }
      }
      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
    },
  });

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

  // Exports this order's own line items - not a paginated server list like
  // the table-level Export CSV, so it builds the sheet from what's already
  // loaded in itemEdit rather than going through ExportContext/ExportModal.
  const handleExportCsv = () => {
    const rows = (itemEdit?.items || []).map((item, index) => ({
      "#": index + 1,
      "Due Date": isEmptyItem(item?.purchase_order_date, ""),
      Amount: Number(
        item?.purchase_order_total_amount_per_product || 0,
      ).toFixed(2),
      "Paid Amount": Number(
        item?.purchase_order_total_paid_per_product || 0,
      ).toFixed(2),
      "Balance Amount": Number(
        item?.purchase_order_total_balance_per_product || 0,
      ).toFixed(2),
    }));

    rows.push({
      "#": "",
      "Due Date": "TOTAL",
      Amount: Number(totalAmount).toFixed(2),
      "Paid Amount": Number(totalPaidAmount).toFixed(2),
      "Balance Amount": Number(totalBalanceAmount).toFixed(2),
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Export");

    const today = new Date().toISOString().slice(0, 10);
    const fileName = `accounts_payable_${isEmptyItem(itemEdit?.purchase_order_number, "order")}_${today}`;
    XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: "csv" });
  };

  return (
    <ModalWrapper
      label={`Order Details - ${itemEdit?.purchase_order_number}`}
      itemEdit={itemEdit}
      mutation={mutation}
      isOpen={true}
      handleClose={handleClose}
      width="min-w-[650px]!"
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
                  Item(s)
                </th>
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
                    <td className=" capitalize dark:bg-gray-900! ">
                      {a?.purchase_order_product_name}
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
                        amount={
                          itemPayments[a.purchase_order_aid]?.paid ??
                          Number(a.purchase_order_total_paid_per_product)
                        }
                      />
                    </td>
                    <td className="">
                      <AmountWithPesoSign
                        classN="size-3"
                        classAmnt="text-primary text-warning "
                        amount={
                          itemPayments[a.purchase_order_aid]?.balance ??
                          Number(a.purchase_order_total_balance_per_product)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
              <tr className="border-0!">
                <td
                  className="dark:bg-gray-900! text-right font-bold "
                  colSpan={3}
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
              {items?.map((i, aIndex) => {
                return (
                  <tr key={aIndex} className="border-0!">
                    <td className="text-center dark:bg-gray-900! last:opacity-100 last:group-hover:opacity-100 last:-right-3 last:z-10"></td>
                    <td className=" dark:bg-gray-900! "></td>
                    <td className=" dark:bg-gray-900! "></td>
                    <td className=" dark:bg-gray-900! "></td>
                    <td className="dark:bg-gray-900! text-right">
                      <button
                        className={`text-white bg-gray-500 hover:bg-green-800 rounded-sm p-1 text-[10px] disabled:opacity-50 disabled:cursor-not-allowed`}
                        type="button"
                        disabled={mutation.isPending}
                        onClick={() => handleSave(i)}
                      >
                        Save
                      </button>
                    </td>

                    <td className=" dark:bg-gray-900! ">
                      <input
                        type="number"
                        className="text-right! mt-0! disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={mutation.isPending}
                        value={i?.paid_amount}
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

      <ExportCSVButton onClick={handleExportCsv} />
    </ModalWrapper>
  );
};

export default UpdateAccountsPayableDetails;
