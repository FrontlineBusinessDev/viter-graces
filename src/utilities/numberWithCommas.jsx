// format the numbers separated by comma
export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// format the numbers separated by comma
export const numberWithCommasToFixed = (item, x = 0) => {
  let result = "0.0000";
  if (typeof item !== "undefined" && item !== "" && item !== null) {
    result = `${item}`?.toLocaleString("en-US", {
      minimumFractionDigits: Number(x),
      maximumFractionDigits: Number(x),
    });
  }
  return result;
};
