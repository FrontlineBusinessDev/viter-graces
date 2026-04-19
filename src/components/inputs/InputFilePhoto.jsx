import { StoreContext } from "@/store/StoreContext";
import { useField } from "formik";
import React from "react";

export const InputPhotoUpload = ({ label, ...props }) => {
  const { dispatch } = React.useContext(StoreContext);
  const [field, meta] = useField(props);
  return (
    <>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <span className="error--msg">{meta.error}</span>
      ) : null}
    </>
  );
};

export const InputFileUpload = ({ label, ...props }) => {
  const { dispatch } = React.useContext(StoreContext);
  const [field, meta] = useField(props);
  return (
    <>
      <input {...field} {...props} />
      {meta.touched && meta.error ? (
        <span className="error--msg">{meta.error}</span>
      ) : null}
    </>
  );
};
