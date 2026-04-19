import { setIsLogin } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import React from "react";
import { queryData } from "./queryData";
import { apiVersion } from "@/config/config";
import { checkLocalStorage } from "@/utilities/CheckLocalStorage";
import { checkRoleToRedirect } from "@/custom-hooks/login-functions";

const userAccountLogin = (navigate) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [loginLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const fetchLogin = async () => {
      const login = await queryData(`${apiVersion}/users/token`, "post", {
        token: checkLocalStorage().token,
      });

      if (typeof login === "undefined" || !login?.success) {
        localStorage.removeItem("gracestoken");
        setLoading(false);
      } else {
        checkRoleToRedirect(navigate, login.data);
        // setLoading(false);
      }
    };
    if (
      checkLocalStorage() !== null &&
      checkLocalStorage().token !== undefined
    ) {
      fetchLogin();
      dispatch(setIsLogin(false));
    } else {
      setLoading(false);
      dispatch(setIsLogin(true));
    }
  }, []);

  return { loginLoading };
};

export default userAccountLogin;
