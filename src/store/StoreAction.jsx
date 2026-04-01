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

export const setSuccess = (val) => {
  return {
    type: "SUCCESS",
    payload: val,
  };
};

export const setIsAction = (val) => {
  return {
    type: "ACTION",
    payload: val,
  };
};

export const setIsLogin = (val) => {
  return {
    type: "IS_LOGIN",
    payload: val,
  };
};

export const setIsNavFullShow = (val) => {
  return {
    type: "NAV_FULL_SHOW",
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
