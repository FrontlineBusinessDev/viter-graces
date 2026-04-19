// Copyright year
export const copyrightYear = () => {
  return new Date(new Date().toString().split("GMT")[0] + " UTC")
    .toISOString()
    .split("T")[0]
    .split("-")[0];
};
