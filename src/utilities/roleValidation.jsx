// get the url id parameter
export const getProductOwnerRole = (store) => {
  const result = store.credentials?.data?.role === "product_owner";
  return result;
};
// get the url id parameter
export const getAdminDeveloperRole = (store) => {
  let result = true;

  if (
    store.credentials?.data?.role === "product_owner" ||
    store.credentials?.data?.role === "cashier"
  ) {
    result = false;
  }

  return result;
};
