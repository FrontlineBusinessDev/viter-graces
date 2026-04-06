export const checkLocalStorage = () => {
  let gracestoken = null;
  try {
    gracestoken = JSON.parse(localStorage.getItem("gracestoken"));
  } catch (error) {
    gracestoken = null;
  }

  return gracestoken;
};
