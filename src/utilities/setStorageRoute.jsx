// storage after login
export function setStorageRoute(jwt) {
  localStorage.setItem("gracestoken", JSON.stringify({ token: jwt }));
}
