// format the numbers separated by comma
export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// format the numbers separated by comma
export const numberWithCommasToFixed = (item, x) => {
  let result = "0.00";

  if (typeof item !== "undefined" && item !== "") {
    result = numberWithCommas(Number(item).toFixed(x));
  }
  return result;
};
