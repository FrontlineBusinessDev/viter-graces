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
