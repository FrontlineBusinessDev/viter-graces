export const getConvertStringToJSONparseData = (jsonString) => {
  let resultArray = [];

  try {
    resultArray = JSON.parse(jsonString);
  } catch (e) {
    // console.log(e);
  }

  return resultArray;
};
