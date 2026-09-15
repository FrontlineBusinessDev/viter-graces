import { setMessage } from "@/store/StoreAction";

// Copyright year
export const Validations = (values, items, dispatch) => {
  // `ordered` is the net remaining returnable qty for the selected order
  // (original qty minus prior pending/processed returns), not the order's
  // original qty - falls back to sales_order_qty for callers that don't
  // compute it
  const invalidItem = items.find(
    (item) =>
      item.selected &&
      Number(item.qty) > Number(item.ordered ?? item.sales_order_qty),
  );

  if (invalidItem) {
    dispatch(setMessage(`Invalid quantity`));
    return true;
  }

  return false;
};
