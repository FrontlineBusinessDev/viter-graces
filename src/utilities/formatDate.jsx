import { setTimeZone } from "@/config/config";

export const formatDateRange = (sDateVal, eDateVal, val = "", format = "") => {
  let formatedDateTime = val;
  let formatedDate = val;
  let formatedTime = val;
  let startDateTime = "";
  let endDateTime = "";
  let startDate = "";
  let startTime = "";
  let endTime = "";
  let endDate = "";
  if (typeof sDateVal !== "undefined" && sDateVal !== "") {
    // formatting date
    const event = new Date(sDateVal);

    startTime = event.toLocaleString("en", options("time"));
    startDateTime = `${event.toLocaleString("en", options(""))} ${startTime}`;
    startDate = event.toLocaleString("en", options(""));
  }
  if (typeof eDateVal !== "undefined" && eDateVal !== "") {
    // formatting date
    const event = new Date(eDateVal);

    endTime = event.toLocaleString("en", options("time"));
    endDateTime = `${event.toLocaleString("en", options(""))} ${endTime}`;
    endDate = event.toLocaleString("en", options(""));
  }

  if (startDateTime !== "" && endDateTime !== "" && format === "dateTime") {
    formatedDateTime = `${startDateTime} - ${endDateTime}`;
    return formatedDateTime;
  }
  if (startDateTime !== "" && endDateTime !== "" && format === "date") {
    formatedDate = `${startDate} - ${endDate}`;
    return formatedDate;
  }
  if (startDateTime !== "" && endDateTime !== "" && format === "time") {
    formatedTime = `${startTime} - ${endTime}`;
    return formatedTime;
  }
  return formatedDate;
};

export const formatDate = (dateVal, val = "", format = "") => {
  const formatedDate = val;
  if (typeof dateVal !== "undefined" && dateVal !== "") {
    // formatting date
    const event = new Date(dateVal);

    return event.toLocaleString("en", options(format));
  }
  return formatedDate;
};

// formatting date and time
export const options = (format = "") => {
  const options =
    format == "time-only"
      ? {
          timeZone: setTimeZone,
          hour: "numeric", // Display hour
          minute: "2-digit", // Display minute with leading zero if needed
          hour12: true, // Enable 12-hour format with AM/PM
        }
      : format == "datetime"
        ? {
            timeZone: setTimeZone,
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric", // Display hour
            minute: "2-digit", // Display minute with leading zero if needed
            hour12: true, // Enable 12-hour format with AM/PM
          }
        : format == "time"
          ? {
              timeZone: setTimeZone,
              hour: "numeric", // Display hour
              minute: "2-digit", // Display minute with leading zero if needed
              hour12: true, // Enable 12-hour format with AM/PM
            }
          : format == "dateWithWeekName"
            ? {
                timeZone: setTimeZone,
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            : {
                timeZone: setTimeZone,
                month: "long",
                day: "numeric",
                year: "numeric",
              };

  return options;
};
