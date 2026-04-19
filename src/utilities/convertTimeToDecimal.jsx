export const convertTimeToDecimal = (hrs, mins, secs = 0) => {
  const h = hrs * (1 / 1);
  const m = mins * (1 / 60);
  const s = secs * (1 / 3600);
  const total = h + m + s;
  return total.toFixed(4);
};
