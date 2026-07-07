import React from "react";

import { fetchFormData } from "@/utilities/fetchFormData";
import { devApiUrl } from "@/config/config";
import { setError, setMessage } from "@/store/StoreAction";

const useUploadPhoto = (url, dispatch) => {
  const [photo, setPhoto] = React.useState(null);

  const uploadPhoto = async () => {
    if (photo) {
      const fd = new FormData();
      fd.append("photo", photo);

      const data = await fetchFormData(devApiUrl + url, fd);

      console.log(data);
      return data;
    }
  };

  const handleChangePhoto = (e) => {
    if (!e.target.files[0]) {
      setPhoto("");
      dispatch(setError(false));
      // dispatch(setErrorMessage(""));
      return;
    }

    const img = e.target.files[0];
    console.log(img);
    if (img.size > 200000) {
      dispatch(setError(true));
      dispatch(
        setMessage(
          "Photo is too big. It should be less than 200Kb for better result.",
        ),
      );
    } else {
      dispatch(setError(false));
      // console.log("Set photo");
      setPhoto(img);
    }
  };

  return { uploadPhoto, handleChangePhoto, photo };
};

export default useUploadPhoto;
