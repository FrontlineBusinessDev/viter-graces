import { setMessage } from "@/store/StoreAction";
import { isEmptyItem } from "@/utilities/isEmptyItem";

// Props Values
export const PropsValues = (props, items) => {
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

  if (
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

  return;
};
// Copyright year
export const Validations = (values, items, dispatch) => {
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
  return false;
};
