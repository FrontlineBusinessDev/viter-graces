export const StoreReducer = (state, action) => {
  switch (action.type) {
    case "ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "MESSAGE":
      return {
        ...state,
        message: action.payload,
      };

    case "SUCCESS":
      return {
        ...state,
        success: action.payload,
      };

    case "RESETPASS":
      return {
        ...state,
        isResetPass: action.payload,
      };

    case "IS_ADD":
      return {
        ...state,
        isAdd: action.payload,
      };

    case "IS_SEARCH":
      return {
        ...state,
        isSearch: action.payload,
      };

    case "IS_CREATE_PASS_SUCCCESS":
      return {
        ...state,
        isCreatePassSuccess: action.payload,
      };

    case "IS_FORGET_PASS_SUCCCESS":
      return {
        ...state,
        isForgotPassSuccess: action.payload,
      };

    case "IS_STRIPE_ERROR":
      return {
        ...state,
        isStripeError: action.payload,
      };

    case "SCROLL_POSITION":
      return {
        ...state,
        scrollPosition: action.payload,
      };

    case "TAB_VALUE":
      return {
        ...state,
        tabValue: action.payload,
      };

    case "ACTION":
      return {
        ...state,
        isAction: action.payload,
      };

    case "IS_LOGIN":
      return {
        ...state,
        isLogin: action.payload,
      };
    case "NAV_FULL_SHOW":
      return {
        ...state,
        isNavFullShow: action.payload,
      };

    case "CREDENTIALS":
      return {
        ...state,
        credentials: action.payload,
      };

    default:
      return state;
  }
};
