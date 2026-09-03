// Cross-tab session termination signal.
// Uses BroadcastChannel where available, with a localStorage fallback so tabs
// on older browsers (or the sending tab itself, on next mount) still see it.
const CHANNEL_NAME = "grace-auth-channel";
const STORAGE_KEY = "grace_auth_broadcast";

const channel =
  typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL_NAME) : null;

// Tell every other open tab that the current session is no longer valid.
export function broadcastLogout(reason = "session_invalidated") {
  const payload = { type: "logout", reason, ts: Date.now() };
  channel?.postMessage(payload);
  // storage writes only reach OTHER tabs, which is the desired fallback here
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

// Subscribe to logout broadcasts from other tabs. Returns an unsubscribe function.
export function subscribeToLogout(callback) {
  const handleMessage = (event) => {
    if (event?.data?.type === "logout") {
      callback(event.data);
    }
  };
  const handleStorage = (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) {
      return;
    }
    try {
      const payload = JSON.parse(event.newValue);
      if (payload?.type === "logout") {
        callback(payload);
      }
    } catch {
      // ignore malformed payloads
    }
  };

  channel?.addEventListener("message", handleMessage);
  window.addEventListener("storage", handleStorage);

  return () => {
    channel?.removeEventListener("message", handleMessage);
    window.removeEventListener("storage", handleStorage);
  };
}
