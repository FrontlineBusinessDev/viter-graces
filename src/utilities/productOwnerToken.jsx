import { isEmptyItem } from "./isEmptyItem";

// format the numbers separated by comma
export const ProductOwnerId = (store) => {
  const userId =
    isEmptyItem(store?.credentials?.data?.role, "admin") !== "developer" &&
    isEmptyItem(store?.credentials?.data?.role, "admin") !== "admin"
      ? store.credentials?.data?.id
      : 0;
  return userId;
};

export const ProductOwnerIdOnly = (store) => {
  const userId =
    isEmptyItem(store?.credentials?.data?.role, "admin") === "product owner"
      ? store.credentials?.data?.id
      : 0;
  return userId;
};

// format the numbers separated by comma
export const ProductOwnerName = (store) => {
  const userName =
    isEmptyItem(store?.credentials?.data?.role, "admin") !== "developer" &&
    isEmptyItem(store?.credentials?.data?.role, "admin") !== "admin"
      ? store.credentials?.data?.name
      : "";
  return userName;
};
