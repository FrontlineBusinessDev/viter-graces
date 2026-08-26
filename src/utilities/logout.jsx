import { devNavUrl } from "@/config/config";
import { setCredentials, setIsLogin } from "@/store/StoreAction";

export function clearSession(dispatch) {
  localStorage.removeItem("gracestoken");
  dispatch(setCredentials({}));
  dispatch(setIsLogin(false));
  // NOTE: this only clears the current browser's session. Invalidating the
  // user's other open sessions/devices requires backend support (e.g. token
  // revocation or a session-version bump on /users/password) that does not
  // exist in this repo.
}

export function performLogout(dispatch, redirectTo = `${devNavUrl}/login`) {
  clearSession(dispatch);
  window.location.replace(redirectTo);
}
