import { setError } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { useField } from "formik";
import { Check } from "lucide-react";
import React from "react";

export const InputCheckbox = ({
  label,
  onChange = null,
  required = false,
  ...props
}) => {
  const { dispatch } = React.useContext(StoreContext);
  const [field, meta] = useField(props);
  return (
    <>
      <div className="flex items-center gap-2">
        <div
          className="relative flex cursor-pointer items-center justify-center rounded-full"
          htmlFor={props.id || props.name}
        >
          <input
            checked={field.value}
            value={field.value}
            {...field}
            {...props}
            className={
              meta.touched && meta.error
                ? "w-auto h-auto error-show"
                : "p-1.5 before:content-[''] peer relative h-auto w-auto cursor-pointer border-accent appearance-none rounded-sm transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:-translate-y-2/4 before:-translate-x-2/4 before:opacity-0 before:transition-opacity checked:bg-accent"
            }
            type="checkbox"
            onChange={(e) => {
              onChange !== null && onChange(e);
              field.onChange(e);
              dispatch(setError(false));
            }}
          />
          <span className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
            <Check className="h-3 w-3" />
          </span>
        </div>

        <label
          htmlFor={props.id || props.name}
          className={`${
            meta.touched && meta.error ? "w-auto h-auto error-show" : ""
          } cursor-pointer -bottom-2 m-0 -translate-y-4 relative`}
        >
          {label}
          {required && <span className="text-alert">*</span>}
        </label>
      </div>
    </>
  );
};
