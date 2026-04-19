// format the numbers separated by comma
export const isEmptyItem = (item, x = "") => {
  let result = x;

  if (typeof item !== "undefined" && item !== "") {
    result = item;
  }
  return result;
};

// if item is not empty or not a number
export const isNumberEmptyItem = (item, x = "", decimal = 0) => {
  let result = x;

  if (!isNaN(item) && item !== "" && item !== null) {
    result = Number(item).toFixed(Number(decimal));
  }
  return result;
};

// if item is not empty use the default value
export const isEmptyUseDefault = (item, newItem = "", x = "") => {
  let result = x;

  if (typeof item !== "undefined" && item !== "") {
    result = newItem;
  }
  return result;
};
