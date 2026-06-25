import { isEmptyItem } from "@/utilities/isEmptyItem";

// formatting date and time
export const DateFormat = (val = "") => {
  if (isEmptyItem(val, "") !== "") {
    const d = val?.split("-");

    const year = d[0];
    const month = d[1] - 1;
    const date = d[2];

    const monthShort = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthLong = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return `${monthShort[month]} ${date}, ${year}`;
    // return `${monthLong[month]} ${date}, ${year}`;
  }
  return val;
};
