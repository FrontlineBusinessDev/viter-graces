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

    case "IS_SHOW":
      return {
        ...state,
        isShow: action.payload,
      };

    case "SHOW":
      return {
        ...state,
        isNavFullShow: action.payload,
      };

    case "ARCHIVE":
      return {
        ...state,
        isArchive: action.payload,
      };

    case "STATUS":
      return {
        ...state,
        isStatus: action.payload,
      };

    case "DELETE":
      return {
        ...state,
        isDelete: action.payload,
      };

    case "RESTORE":
      return {
        ...state,
        isRestore: action.payload,
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

    case "IS_VIEW":
      return {
        ...state,
        isView: action.payload,
      };

    case "IS_ADD_MODAL":
      return {
        ...state,
        isAddModal: action.payload,
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

    case "IS_LOGIN":
      return {
        ...state,
        isLogin: action.payload,
      };

    case "IS_LOGOUT":
      return {
        ...state,
        isLogout: action.payload,
      };

    case "IS_ACCOUNT_UPDATED":
      return {
        ...state,
        isAccountUpdated: action.payload,
      };

    case "IS_SETTINGS_OPEN":
      return {
        ...state,
        isSettingsOpen: action.payload,
      };

    case "IS_DONATE_NOW_OPEN":
      return {
        ...state,
        isDonateNowOpen: action.payload,
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

    case "CREDENTIALS":
      return {
        ...state,
        credentials: action.payload,
      };

    default:
      return state;
  }
};
