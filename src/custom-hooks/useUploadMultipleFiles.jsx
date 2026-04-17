import getBlobDuration from "get-blob-duration";
import React from "react";
import { setError, setMessage } from "@/store/StoreAction";
import { convertTimeToDecimal } from "@/utilities/convertTimeToDecimal";
import { devApiUrl } from "@/config/config";
import { fetchFormData } from "@/utilities/fetchFormData";

const handleGetSeconds = async (blobFile) => {
  let result = 0,
    isFileOrBlob = blobFile instanceof File || blobFile instanceof Blob;
  if (!isFileOrBlob) return result;
  const isVideo = blobFile.type.split("/").includes("video");
  if (!isVideo) return result;
  const duration = await getBlobDuration(blobFile);
  return convertTimeToDecimal(0, 0, duration);
};

const handleMergeTwoArrayFiles = async (arrayOne = [], arrayTwo = []) => {
  let result = [];
  for (let i = 0; i < arrayOne.length; i++) {
    const duration = await handleGetSeconds(arrayOne[i]);
    arrayOne[i].duration = duration;
    const newFile = JSON.stringify({
      ...arrayOne[i],
      name: arrayOne[i].name,
      id: arrayOne[i]?.id || "",
    });
    result.push(newFile);
  }
  for (let i = 0; i < Array.from(arrayTwo).length; i++) {
    const duration = await handleGetSeconds(Array.from(arrayTwo)[i]);
    Array.from(arrayTwo)[i].duration = duration;
    const newFile = JSON.stringify({
      ...Array.from(arrayTwo)[i],
      name: Array.from(arrayTwo)[i].name,
      id: Array.from(arrayTwo)[i]?.id || "",
    });
    result.push(newFile);
  }
  return result;
};

const useUploadMultipleFiles = (url, dispatch, size = null) => {
  const [filesArrayList, setFilesArrayList] = React.useState([]);
  const [files, setFiles] = React.useState([]);

  const uploadMultipleFiles = async () => {
    // console.log(clientId);
    if (filesArrayList.length > 0) {
      const fd = new FormData();
      let count = 0;
      for (let i = 0; i < filesArrayList.length; i++) {
        if (
          filesArrayList[i] instanceof File !== true ||
          filesArrayList[i] instanceof Blob !== true
        ) {
          continue;
        }
        fd.append(
          `file${count}`,
          filesArrayList[i],
          filesArrayList[i].name.toLowerCase(),
        );
        count++;
      }
      // if (isFilesJsonString) return { success: true };
      if (count == 0) return { success: true };

      const data = await fetchFormData(`${devApiUrl}` + url, fd, dispatch);

      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
      return data;
    }
    return { success: true };
  };

  const uploadFiles = async () => {
    // console.log(clientId);
    if (files.length > 0) {
      const fd = new FormData();
      let count = 0;
      for (let i = 0; i < files.length; i++) {
        if (
          files[i] instanceof File !== true ||
          files[i] instanceof Blob !== true
        ) {
          continue;
        }
        fd.append(`file${count}`, files[i], files[i].name.toLowerCase());
        count++;
      }
      // if (isFilesJsonString) return { success: true };
      if (count == 0) return { success: true };

      const data = await fetchFormData(`${devApiUrl}` + url, fd, dispatch);

      if (!data.success) {
        dispatch(setError(true));
        dispatch(setMessage(data.error));
      }
      return data;
    }
  };

  const handleChangeMultipleFiles = async (
    e,
    propsField,
    setFilesArrayList,
    fieldValue,
    fileLimit = 20,
    isAcceptImageOnly = false,
    sizeLimitKb = null,
    saveToServer = false,
  ) => {
    dispatch(setError(false));
    let allImageSizes = 0,
      kbPerMb = 1024;
    if (e.target.files.length === 0) return;
    // ACCEPT 20 and less lenght of files
    if (e.target.files.length > fileLimit) {
      dispatch(setError(true));
      dispatch(
        setMessage(`Invalid length of file. Only accept ${fileLimit} or less.`),
      );
      return false;
    }
    if (sizeLimitKb) {
      const filterExcessFileSize = Array.from(e.target.files).filter(
        (item) => Number(item.size) > Number(sizeLimitKb),
      );
      console.log(filterExcessFileSize);
      if (filterExcessFileSize?.length > 0) {
        dispatch(setError(true));
        dispatch(
          setMessage(
            `Only accept total of ${Number(sizeLimitKb)} kb and less. (${Number(
              filterExcessFileSize[0]?.size,
            )} kb)`,
          ),
        );
        return;
      }
    }

    // CHECK IF IMAGE ONLY
    if (isAcceptImageOnly) {
      const checkCountIfFileIsImage = Array.from(e.target.files).filter(
        (item) => {
          allImageSizes += item.size;
          return item.type.split("/")[0] !== "image";
        },
      );
      // console.log(allImageSizes);
      if (checkCountIfFileIsImage.length > 0) {
        dispatch(setError(true));
        dispatch(setMessage(`Invalid file. Input only accept images.`));
        return false;
      }
    }
    // get files and sort by name
    const files = Array.from(e.target.files).sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    const myFiles = Array.from(files);
    // RENAME FILE FOR UNIQUE FILENAME
    const fileBlob = myFiles.map((item, i) =>
      item.slice(0, myFiles[i].size, myFiles[i].type),
    );
    const fileName = myFiles.map((item, i) => item.name.split(".")[0]);
    const fileExtension = myFiles.map((item, i) => item.name.split(".")[1]);
    const blobToFile = myFiles.map((item, i) => {
      // const isVideo = item.type.split("/").includes("video");
      const file = new File(
        [fileBlob[i]],
        `${fileName[i].toLowerCase()}_${Date.now()}.${fileExtension[i]}`,
        {
          type: myFiles[i].type,
        },
      );
      return file;
    });
    // COMBINE OLD FILES AND NEW INPUT FILE
    const oldFiles =
      filesArrayList?.length > 0 && fileLimit > 1 ? filesArrayList : [];
    const mergeFilesData = await handleMergeTwoArrayFiles(oldFiles, blobToFile);
    if (saveToServer) {
      if (mergeFilesData?.length == 1) {
        const arrayFilesName = mergeFilesData.map(
          (item) => JSON.parse(item).name,
        );
        propsField.setFieldValue(fieldValue, arrayFilesName[0]);
      } else {
        const arrayFilesName = mergeFilesData.map(
          (item) => JSON.parse(item).name,
        );
        propsField.setFieldValue(fieldValue, arrayFilesName);
      }
    } else {
      propsField.setFieldValue(fieldValue, [...mergeFilesData]);
    }
    setFilesArrayList([...oldFiles, ...Array.from(blobToFile)]);
    setFiles([...Array.from(blobToFile)]);
  };

  return {
    uploadMultipleFiles,
    uploadFiles,
    handleChangeMultipleFiles,
    setFilesArrayList,
    filesArrayList,
    setFiles,
    files,
  };
};

export default useUploadMultipleFiles;
