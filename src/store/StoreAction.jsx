export const setError = (val) => {
  return {
    type: "ERROR",
    payload: val,
  };
};

export const setMessage = (val) => {
  return {
    type: "MESSAGE",
    payload: val,
  };
};

export const setIsNavFullShow = (val) => {
  return {
    type: "SHOW",
    payload: val,
  };
};

export const setSuccess = (val) => {
  return {
    type: "SUCCESS",
    payload: val,
  };
};

export const setIsShow = (val) => {
  return {
    type: "IS_SHOW",
    payload: val,
  };
};

export const setIsArchive = (val) => {
  return {
    type: "ARCHIVE",
    payload: val,
  };
};

export const setIsStatus = (val) => {
  return {
    type: "STATUS",
    payload: val,
  };
};

export const setIsDelete = (val) => {
  return {
    type: "DELETE",
    payload: val,
  };
};

export const setIsRestore = (val) => {
  return {
    type: "RESTORE",
    payload: val,
  };
};

export const setIsResetPass = (val) => {
  return {
    type: "RESETPASS",
    payload: val,
  };
};

export const setIsAdd = (val) => {
  return {
    type: "IS_ADD",
    payload: val,
  };
};

export const setIsView = (val) => {
  return {
    type: "IS_VIEW",
    payload: val,
  };
};

export const setIsAddModal = (val) => {
  return {
    type: "IS_ADD_MODAL",
    payload: val,
  };
};

export const setIsSearch = (val) => {
  return {
    type: "IS_SEARCH",
    payload: val,
  };
};

export const setTabValue = (val) => {
  return {
    type: "TAB_VALUE",
    payload: val,
  };
};

export const setIsSettingsOpen = (val) => {
  return {
    type: "IS_SETTINGS_OPEN",
    payload: val,
  };
};

export const setIsDonateNowOpen = (val) => {
  return {
    type: "IS_DONATE_NOW_OPEN",
    payload: val,
  };
};

export const setIsStripeError = (val) => {
  return {
    type: "IS_STRIPE_ERROR",
    payload: val,
  };
};

export const setCreatePassSuccess = (val) => {
  return {
    type: "IS_CREATE_PASS_SUCCCESS",
    payload: val,
  };
};

export const setForgotPassSuccess = (val) => {
  return {
    type: "IS_FORGET_PASS_SUCCCESS",
    payload: val,
  };
};

export const setIsLogin = (val) => {
  return {
    type: "IS_LOGIN",
    payload: val,
  };
};

export const setIsLogout = (val) => {
  return {
    type: "IS_LOGOUT",
    payload: val,
  };
};

export const setIsAccountUpdated = (val) => {
  return {
    type: "IS_ACCOUNT_UPDATED",
    payload: val,
  };
};

export const setCredentials = (data) => {
  return {
    type: "CREDENTIALS",
    payload: {
      data,
    },
  };
};

export const setScrollPosition = (val) => {
  return {
    type: "SCROLL_POSITION",
    payload: val,
  };
};
