export const getWeekName = (weekDays = 0) => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return days[Number(weekDays)];
};
