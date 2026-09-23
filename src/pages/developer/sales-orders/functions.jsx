import { setMessage } from "@/store/StoreAction";
import { isEmptyItem } from "@/utilities/isEmptyItem";

// Props Values
// scheduleRows: an edited order's saved Weekly/Monthly installment rows -
// when given, the installment amount mirrors how the backend rebalances the
// schedule on save (see rebalanceInstallmentSchedule in
// rest/v1/controllers/developer/sales-order/functions.php).
export const PropsValues = (props, items, _installmentItems, scheduleRows) => {
  const values = props.values;

  values.sales_order_total_amount = items?.reduce(
    (sum, item) =>
      sum +
      Number(item.sales_order_qty || 1) * Number(item.sales_order_price || 0),
    0,
  );
  values.sales_order_total_receivable_amount =
    items?.reduce(
      (sum, item) =>
        sum +
        Number(item.sales_order_qty || 1) * Number(item.sales_order_price || 0),
      0,
    ) - Number(values.sales_order_discount);

  values.subtotal = items?.reduce(
    (sum, item) =>
      sum +
      Number(item.sales_order_qty || 1) * Number(item.sales_order_price || 0),
    0,
  );

  // COMPUTATION OF INCLUSIVE TAX
  if (Number(values.sales_order_tax) === 1.12) {
    values.sales_order_tax_amount =
      Number(values.sales_order_total_receivable_amount) -
      Number(values.sales_order_total_receivable_amount) / 1.12;
  }

  // COMPUTATION OF EXCLUSIVE TAX
  if (Number(values.sales_order_tax) === 0.12) {
    values.sales_order_tax_amount =
      Number(values.sales_order_total_receivable_amount) * 0.12;

    values.sales_order_total_receivable_amount =
      Number(values.sales_order_total_receivable_amount) +
      Number(values.sales_order_tax_amount);
  }

  if (Number(values.sales_order_tax) === 0 || values.sales_order_tax === "--") {
    values.sales_order_tax_amount = 0;
    values.sales_order_total_receivable_amount = Number(
      values.sales_order_total_receivable_amount,
    );
  }

  values.sales_order_total_balance_amount =
    Number(values.sales_order_total_receivable_amount) -
    Number(values.sales_order_paid_amount);

  if (values.sales_order_installment_type?.toLocaleLowerCase() === "flexible") {
    // Flexible: no fixed schedule is created here - individual payments are
    // recorded later from Finance > Accounts Receivable, so this just shows
    // the full balance until then.
    values.sales_order_installment_amount = Number(
      values.sales_order_total_balance_amount,
    ).toFixed(2);
  } else if (scheduleRows?.length > 0) {
    // Existing schedule: paid rows stay as they are, so the balance is split
    // across the rows still unpaid - or, if every row is already paid, it
    // becomes one additional payment added after the last due date.
    const balance = Math.max(0, Number(values.sales_order_total_balance_amount));
    const openCount = scheduleRows.filter(
      (row) => Number(row.installment_payment_is_paid) === 0,
    ).length;
    const remainingCount = balance > 0 ? Math.max(openCount, 1) : 0;

    values.installment_remaining_count = remainingCount;
    values.installment_is_additional_payment = balance > 0 && openCount === 0;
    values.sales_order_installment_amount =
      remainingCount > 0 ? (balance / remainingCount).toFixed(2) : 0;
  } else if (
    Number(values.sales_order_total_balance_amount) !== 0 &&
    Number(values.sales_order_installment_count) !== 0
  ) {
    values.sales_order_installment_amount = Number(
      Number(values.sales_order_total_balance_amount) /
        Number(values.sales_order_installment_count),
    ).toFixed(2);
  } else {
    values.sales_order_installment_amount = 0;
  }

  if (values.sales_order_payment_method === "mutiple payment") {
    values.sales_order_paid_amount =
      Number(values.sales_order_cash) +
      Number(values.sales_order_check) +
      Number(values.sales_order_credit_memo) +
      Number(values.sales_order_online_transaction);
  }

  if (
    values.sales_order_discount_type === "percentage" &&
    Number(values.sales_order_discount_percentage) !== 0 &&
    Number(values.subtotal) !== 0
  ) {
    let percentageDiscount =
      Number(values.sales_order_discount_percentage) / 100;
    values.sales_order_discount =
      Number(values.subtotal) * Number(percentageDiscount);
  }

  console.log(
    "123",
    Number(values.sales_order_cash),
    Number(values.sales_order_check),
    Number(values.sales_order_credit_memo),
    Number(values.sales_order_online_transaction),
    Number(values.sales_order_total_balance_amount),
    Number(values.sales_order_installment_count),
  );
  return;
};
// Copyright year
export const Validations = (
  values,
  items,
  dispatch,
  creditMemoBalance = Infinity,
) => {
  const invalidItem = items.find(
    (item) =>
      isEmptyItem(item?.is_new, false) &&
      Number(item.old_qty) < Number(item.sales_order_qty),
  );

  if (invalidItem) {
    dispatch(
      setMessage(
        `Insufficient stock for ${invalidItem.sales_order_product_name}. Available: ${invalidItem.old_qty}, Requested: ${invalidItem.sales_order_qty}`,
      ),
    );
    return true;
  }

  if (Number(values.sales_order_received_by_id) === 0) {
    dispatch(setMessage("Invalid received by"));
    return true;
  }

  if (values.sales_order_payment_method === "mutiple payment") {
    const maxCreditMemo = Math.min(
      creditMemoBalance,
      Number(values.sales_order_total_receivable_amount),
    );

    if (Number(values.sales_order_credit_memo) > maxCreditMemo) {
      dispatch(
        setMessage(
          "Credit memo amount cannot exceed the available credit memo balance or the order total.",
        ),
      );
      return true;
    }
  }

  return false;
};
