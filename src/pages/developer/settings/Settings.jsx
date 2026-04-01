import { StoreContext } from "@/store/StoreContext";
import React from "react";
import UsersAccount from "./UsersAccount";
import Roles from "./Roles";
const Settings = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  return (
    <>
      {store?.tabValue === "user" || store?.tabValue === "" ? (
        <UsersAccount />
      ) : (
        <Roles />
      )}
    </>
  );
};

export default Settings;
