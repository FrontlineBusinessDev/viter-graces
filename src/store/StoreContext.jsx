import React from "react";
import { StoreReducer } from "./StoreReducer";
const isMobileOrTablet = window.matchMedia("(max-width:1027px)").matches;

const initVal = {
  error: false,
  success: false,
  isShow: isMobileOrTablet ? false : true,
  isStatus: false,
  isArchive: false,
  isDelete: false,
  isRestore: false,
  isAdd: false,
  isView: false,
  isSearch: false,
  isCreatePassSuccess: false,
  isForgotPassSuccess: false,
  isLogin: false,
  isLogout: false,
  isAccountUpdated: false,
  isResetPass: false,
  isSettingsOpen: false,
  isDonateNowOpen: false,
  isStripeError: null,
  isNavFullShow: isMobileOrTablet ? false : true,
  tabValue: "",
  scrollPosition: 0,
  credentials: {},
  // credentials: {
  //   data: { role_code: "r_is_developer", role_name: "developer" },
  // },
};

const StoreContext = React.createContext();

const StoreProvider = (props) => {
  const [store, dispatch] = React.useReducer(StoreReducer, initVal);

  return (
    <StoreContext.Provider value={{ store, dispatch }}>
      {props.children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
