import { devNavUrl } from "@/config/config";
import { setCredentials, setIsLogin } from "@/store/StoreAction";

export function clearSession(dispatch) {
  localStorage.removeItem("gracestoken");
  dispatch(setCredentials({}));
  dispatch(setIsLogin(false));
  // NOTE: this only clears the current tab's in-memory/local state. Other
  // open tabs of the same browser are notified separately — see
  // authChannel.jsx's broadcastLogout(), fired on password change and on the
  // server-side password-changed rejection from /users/token — and react via
  // performLogout() below. A different browser/device's session is unaffected
  // since the server rejects its stale token independently once its own
  // /users/token check runs (see tokenOther() in core/functions.php).
}

export function performLogout(dispatch, redirectTo = `${devNavUrl}/login`) {
  clearSession(dispatch);
  window.location.replace(redirectTo);
}
