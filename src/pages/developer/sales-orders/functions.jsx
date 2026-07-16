import { setMessage } from "@/store/StoreAction";
import { isEmptyItem } from "@/utilities/isEmptyItem";

// Props Values
export const PropsValues = (props, items, installmentItems) => {
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

    values.subtotal =
      Number(values.sales_order_total_amount) -
      Number(values.sales_order_tax_amount);
  }

  // COMPUTATION OF EXCLUSIVE TAX
  if (Number(values.sales_order_tax) === 0.12) {
    values.sales_order_tax_amount =
      Number(values.sales_order_total_receivable_amount) * 0.12;

    values.sales_order_total_receivable_amount =
      Number(values.sales_order_total_receivable_amount) +
      Number(values.sales_order_tax_amount);
    values.subtotal =
      Number(values.sales_order_total_amount) +
      Number(values.sales_order_tax_amount);
  }

  if (Number(values.sales_order_tax) === 0) {
    values.sales_order_tax_amount = 0;
  }
  values.sales_order_total_balance_amount = Math.max(
    0,
    Number(values.sales_order_total_receivable_amount) -
      Number(values.sales_order_paid_amount),
  );

  values.total =
    installmentItems?.reduce(
      (isum, itemIns) => isum + Number(itemIns.installmet_payment_amount),
      0,
    ) + Number(values.sales_order_paid_amount);
  values.validationAmount =
    Number(values.total) >= Number(values.sales_order_total_receivable_amount);

  return;
};
// Copyright year
export const Validations = (values, items, dispatch) => {
  const invalidItem = items.find(
    (item) => Number(item.current_qty) < Number(item.sales_order_qty),
  );

  if (invalidItem) {
    dispatch(
      setMessage(
        `Insufficient stock for ${invalidItem.sales_order_product_name}. Available: ${invalidItem.current_qty}, Requested: ${invalidItem.sales_order_qty}`,
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
