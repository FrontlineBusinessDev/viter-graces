import { devNavUrl } from "@/config/config";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
// get user type
export const getUserType = () => {
  const { store } = React.useContext(StoreContext);

  let link = `${devNavUrl}`;
  // let link = `${devNavUrl}/${store.credentials?.data?.role_name?.toLowerCase()}`;

  return link;
};
