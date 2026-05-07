import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { setError } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { useField } from "formik";
import React from "react";
import Select from "react-select";

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
  path = null,
  ...props
}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [field, meta] = useField(props);

  const {
    isLoading,
    isFetching,
    error,
    data: result,
  } = useQueryData(
    `${apiVersion}/${path}`, // endpoint
    "get", // method
    `${path}`, // key
  );

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
          ) : isLoading || isFetching ? (
            <option value="" hidden>
              ...Loading
            </option>
          ) : error ? (
            <option value="" hidden>
              Server Error
            </option>
          ) : (
            <option value="" hidden>
              --
            </option>
          )}
          {store.credentials?.data?.role === "developer" ? (
            <>
              {result?.data?.map((item, key) => {
                return (
                  <option key={key} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </>
          ) : (
            <>
              {result?.data?.map((item, key) => {
                return isEmptyItem(item?.name, "") !== "developer" ? (
                  <option key={key} value={item.id}>
                    {item.name}
                  </option>
                ) : (
                  ""
                );
              })}
            </>
          )}
        </optgroup>
      </select>

      {meta.touched && meta.error ? (
        <span className="error-show">{meta.error}</span>
      ) : null}
    </>
  );
};

export const SearchableSelectFilter = ({ column, options }) => {
  const value = column.getFilterValue();
  const selected = options.find((opt) => opt.value === value) || null;

  // console.log("selected", selected?.value);
  // console.log("value", value);

  return (
    <Select
      placeholder="--"
      options={options}
      value={selected}
      onChange={(option) => {
        const value = option ? option.value : undefined;
        column.setFilterValue(value);
      }}
      isClearable
      classNames={{
        control: ({ isFocused }) =>
          ` w-full! min-h-full! text-sm border rounded-lg! px-1 cursor-pointer! shadow-none!
       ${isFocused ? " border-primary! " : " border-gray-300 "}
       hover:border-primary! `,

        valueContainer: () => "px-1 py-0",

        input: () => "text-sm h-[22px]! text-gray-500! ",

        placeholder: () => "text-gray-400! text-sm",

        singleValue: () => "normal-case! text-sm text-gray-500! ",

        indicatorsContainer: () => "",

        indicatorSeparator: () => "w-0!",

        dropdownIndicator: () =>
          "p-0! text-gray-500 hover:text-primary! cursor-pointer! ",

        clearIndicator: () =>
          "p-0! text-gray-500 hover:text-primary! cursor-pointer! ",

        menu: () =>
          "mt-1 border border-gray-100 rounded-lg! shadow-lg bg-white z-50",

        menuList: () => "py-1 max-h-60 overflow-auto",

        option: ({ isFocused, isSelected }) =>
          ` normal-case! px-3 py-2 text-sm cursor-pointer! hover:text-secondary!
       ${isSelected ? "bg-primary! text-secondary! " : " "}
       ${!isSelected && isFocused ? "bg-primary! text-secondary! " : " "}`,
      }}
    />
  );
};
