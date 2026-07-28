import { setMessage } from "@/store/StoreAction";

// Copyright year
export const Validations = (values, items, dispatch) => {
  const invalidItem = items.find(
    (item) => Number(item.qty) > Number(item.sales_order_qty),
  );

  if (invalidItem) {
    dispatch(setMessage(`Invalid quantity`));
    return true;
  }

  return false;
};
// Copyright year
export const ValidationsStockMovement = (values, items, dispatch) => {
  const invalidItem = items.find(
    (item) => Number(item.current_order_qty) > Number(item.purchase_order_qty),
  );

  if (invalidItem) {
    dispatch(setMessage(`Invalid quantity`));
    return true;
  }

  return false;
};

// Props Values
export const PropsValues = (props, items) => {
  const values = props.values;

  values.total_amount_without_discount_and_vat = items.reduce(
    (sum, item) =>
      sum +
      Number(item.purchase_order_qty || 0) *
        Number(item.purchase_order_price || 0),
    0,
  );
  values.total_amount =
    items.reduce(
      (sum, item) =>
        sum +
        Number(item.purchase_order_qty || 0) *
          Number(item.purchase_order_price || 0),
      0,
    ) - Number(values.purchase_order_discount);

  values.total_sub_amount = items.reduce(
    (sum, item) =>
      sum +
      Number(item.purchase_order_qty || 0) *
        Number(item.purchase_order_price || 0),
    0,
  );

  // COMPUTATION OF INCLUSIVE TAX
  if (Number(values.purchase_order_percent_tax) === 1.12) {
    values.purchase_order_tax =
      Number(values.total_amount) - Number(values.total_amount) / 1.12;
    values.total_sub_amount =
      Number(values.total_sub_amount) - Number(values.purchase_order_tax);
  }

  // COMPUTATION OF EXCLUSIVE TAX
  if (Number(values.purchase_order_percent_tax) === 0.12) {
    values.purchase_order_tax = Number(values.total_amount) * 0.12;
    values.total_amount =
      Number(values.total_amount) + Number(values.purchase_order_tax);
  }

  if (Number(values.purchase_order_percent_tax) === 0) {
    values.purchase_order_tax = 0;
  }

  if (values.purchase_order_payment_status === "paid") {
    values.purchase_order_payment = values.total_amount;
  }

  values.purchase_order_balance =
    Number(values.purchase_order_payment) <= 0
      ? Number(values.total_amount)
      : Number(values.total_amount) - Number(values.purchase_order_payment);

  console.log("values", values);
  return;
};
