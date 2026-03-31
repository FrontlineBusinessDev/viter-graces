import { setError } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { useField } from "formik";
import { CircleCheck } from "lucide-react";
import React from "react";

export const InputRadioButton = ({ label, onChange = null, ...props }) => {
  const { dispatch } = React.useContext(StoreContext);
  const [field, meta] = useField(props);
  console.log(field);
  return (
    <>
      <div className="flex items-center pl-0 w-fit relative">
        <span className="relative flex cursor-pointer items-center rounded-full ">
          <input
            checked={field.value}
            value={field.value}
            {...field}
            {...props}
            type="radio"
            className={
              meta.touched && meta.error
                ? "before:content[''] peer p-1 relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-accent transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-accent hover:border-accent checked:before:bg-accent hover:before:bg-accent hover:before:opacity-10 error-show"
                : "before:content[''] peer p-1 relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-accent transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-accent hover:border-accent checked:before:bg-accent hover:before:bg-accent hover:before:opacity-10"
            }
            onChange={(e) => {
              onChange !== null && onChange(e);
              field.onChange(e);
              dispatch(setError(false));
            }}
          />
          <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-accent opacity-0 transition-opacity peer-checked:opacity-100 peer-hover:opacity-100">
            <CircleCheck className="h-3.5 w-3.5 fill-current" />
          </div>
        </span>

        <label
          htmlFor={props.id || props.name}
          className="relative cursor-pointer after:bg-transparent "
        >
          {label}
        </label>
      </div>
    </>
  );
};
