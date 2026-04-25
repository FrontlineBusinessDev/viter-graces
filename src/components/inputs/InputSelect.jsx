import { setError } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { useField } from "formik";
import React from "react";

export const InputSelect = ({
  label,
  required = true,
  onChange = null,
  ...props
}) => {
  const { dispatch } = React.useContext(StoreContext);
  const [field, meta] = useField(props);

  return (
    <>
      <label htmlFor={props.id || props.name}>
        {required && <span className="text-alert">*</span>}
        {label}
      </label>

      <select
        {...field}
        {...props}
        className={meta.touched && meta.error ? "error-show" : null}
        onChange={(e) => {
          onChange !== null && onChange(e);
          field.onChange(e);
          dispatch(setError(false));
        }}
        autoComplete="off"
      />

      {meta.touched && meta.error ? (
        <span className="error-show">{meta.error}</span>
      ) : null}
    </>
  );
};

export const InputSelectArray = ({
  label,
  required = true,
  onChange = null,
  result,
  isLoading = false,
  error = false,
  ...props
}) => {
  const { dispatch } = React.useContext(StoreContext);
  const [field, meta] = useField(props);

  return (
    <>
      <label htmlFor={props.id || props.name}>
        {label} {""}
        {required && <span className="text-alert">*</span>}
      </label>

      <select
        {...field}
        {...props}
        className={meta.touched && meta.error ? "error-show" : null}
        onChange={(e) => {
          onChange !== null && onChange(e);
          field.onChange(e);
          dispatch(setError(false));
        }}
        autoComplete="off"
      >
        <optgroup label="Select a role">
          {result?.count === 0 ? (
            <option value="" hidden>
              No data
            </option>
          ) : isLoading ? (
            <option value="" hidden>
              ...Loading
            </option>
          ) : error ? (
            <option value="" hidden>
              Server Error
            </option>
          ) : (
            <option value="" hidden></option>
          )}
          {result?.data?.map((item, key) => {
            return (
              <option key={key} value={item.id}>
                {item.name}
              </option>
            );
          })}
        </optgroup>
      </select>

      {meta.touched && meta.error ? (
        <span className="error-show">{meta.error}</span>
      ) : null}
    </>
  );
};
