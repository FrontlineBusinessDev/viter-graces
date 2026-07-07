// fetch for uploading photo or file
export const fetchFormData = (url, fd = {}) => {
  // console.log("url", url);
  const data = fetch(url, {
    method: "post",
    body: fd,
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error(error + " api endpoint error");
    });
  return data;
};
