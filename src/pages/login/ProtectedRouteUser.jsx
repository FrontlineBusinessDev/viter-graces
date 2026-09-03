import FetchingSpinner from "@/components/spinners/FetchingSpinner";
import { apiVersion, devNavUrl, UrlAdmin, UrlDeveloper } from "@/config/config";
import PageNotFound from "@/layout/PageNotFound";
import { queryData } from "@/services/queryData";
import { setCredentials } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { broadcastLogout, subscribeToLogout } from "@/utilities/authChannel";
import { performLogout } from "@/utilities/logout";
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRouteUser = ({ children }) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [loading, setLoading] = React.useState(true);
  const [isAuth, setIsAuth] = React.useState("");
  const [pageStatus, setPageStatus] = React.useState(false);
  const gracestoken = JSON.parse(localStorage.getItem("gracestoken"));

  React.useEffect(() => {
    const fetchLogin = async () => {
      const login = await queryData(`${apiVersion}/users/token`, "post", {
        token: gracestoken.token,
      });

      const isUserKeyMatched =
        login?.success == true &&
        login.data.user_key === login.data.user_account_password;
      // check if the password from database is matched
      // to the password used to login
      // if not, logout the user

      if (isUserKeyMatched === false) {
        setLoading(false);
        setIsAuth("456");
        localStorage.removeItem("gracestoken");
        // the password changed since this token was issued (server rejects it
        // with 401) — make sure any other open tab drops its session too
        broadcastLogout("password_changed");
        return;
      }

      if (typeof login == "undefined" || !login.success) {
        setIsAuth("456");
        setLoading(false);
      } else {
        dispatch(
          setCredentials({
            ...login.data,
            nickName:
              login.data.user_account_first_name[0] +
              login.data.user_account_last_name[0],
          }),
        );
        setIsAuth("123");
        setLoading(false);
        delete login.data.user_account_password;
        delete login.data.user_account_role_id;
        delete login.data.user_account_new_email;
        delete login.data.user_account_is_active;
      }
    };

    if (gracestoken !== null) {
      setLoading(true);
      fetchLogin();
    } else {
      setIsAuth("456");
      setLoading(false);
      localStorage.removeItem("gracestoken");
    }
  }, [dispatch]);

  // another tab changed the password (or otherwise invalidated the session) —
  // drop this tab's session immediately instead of waiting for a remount
  React.useEffect(() => {
    const unsubscribe = subscribeToLogout(() => {
      performLogout(dispatch);
    });
    return unsubscribe;
  }, [dispatch]);

  if (pageStatus) {
    return <PageNotFound />;
  } else {
    return (
      <>
        {loading ? (
          <FetchingSpinner />
        ) : isAuth === "123" ? (
          children
        ) : (
          <Navigate to={`${devNavUrl}/login`} />
        )}
      </>
    );
  }
};

export default ProtectedRouteUser;
