// format the numbers separated by comma
export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// format the numbers separated by comma
export const numberWithCommasToFixed = (item, x) => {
  let result = "0.0000";
  console.log("item", item);
  if (typeof item !== "undefined" && item !== "") {
    result = item.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  }
  return result;
};
