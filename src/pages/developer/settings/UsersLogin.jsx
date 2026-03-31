import HeaderNav from "@/layout/header/HeaderNav";
import { StoreContext } from "@/store/StoreContext";
import { LayoutSettings } from "lucide-react";
import React from "react";
const UsersLogin = () => {
  const { store, dispatch } = React.useContext(StoreContext);

  return (
    <>
      <HeaderNav menu={"settings"}>
        <div className="my-2 sm:pr-0 pr-6 bg-pink-500">
          <div className="flex items-center justify-between ">
            <h4 className="text-base ">Settings</h4>
            <h1 className="text-9xl text-center pt-20 dark:text-white">
              <LayoutSettings className="text-9xl dark:text-white" /> SETTINGS
            </h1>
          </div>
        </div>
      </HeaderNav>
    </>
  );
};

export default UsersLogin;
