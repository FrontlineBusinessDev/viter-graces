import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
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
        }}
        autoComplete="off"
      />

      {meta.touched && meta.error ? (
        <span className="error-show">{meta.error}</span>
      ) : null}
    </>
  );
};

export const InputSelectArrayWithOptions = ({
  label,
  defaultValue = "",
  required = true,
  onChange = null,
  path = null,
  id = 0,
  options = [],
  ...props
}) => {
  const { store, dispatch } = React.useContext(StoreContext);
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
        className={meta.touched && meta.error ? "error-show" : " capitalize"}
        onChange={(e) => {
          onChange !== null && onChange(e);
          field.onChange(e);
        }}
        autoComplete="off"
      >
        <optgroup label={`Select a ${label}`}>
          <option value={defaultValue} hidden>
            {isEmptyItem(defaultValue, "--")}
          </option>

          {options?.map((item, key) => {
            return (
              <option key={key} value={item.id} className="capitalize">
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

export const InputSelectArray = ({
  label,
  required = true,
  onChange = null,
  path = null,
  id = 0,
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
    "post", // method
    `${path}`, // key
    { id: id },
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
        className={meta.touched && meta.error ? "error-show" : " capitalize"}
        onChange={(e) => {
          const selectedItem = result?.data?.find(
            (item) => Number(item.id) === Number(e.target.value),
          );

          onChange !== null && onChange(e, selectedItem);
          field.onChange(e, selectedItem);
        }}
        autoComplete="off"
      >
        <optgroup label={`Select ${label}`}>
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
                  <option key={key} value={item.id} className="capitalize">
                    {item.name}
                  </option>
                );
              })}
            </>
          ) : (
            <>
              {result?.data?.map((item, key) => {
                return isEmptyItem(item?.role_code, "") !== "r_is_developer" ? (
                  <option key={key} value={item.id} className="capitalize">
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

export const SearchableSelectFilterStatus = ({ column, options }) => {
  const value = column.getFilterValue();
  const selected = options.find((opt) => opt.value === value) || null;

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
          ` w-full! min-h-full! text-sm border rounded-lg! px-1 cursor-pointer! shadow-none! dark:bg-[#0b111e]!
       ${isFocused ? " border-primary! " : " border-gray-300 "}
       hover:border-primary! `,

        valueContainer: () => "px-1 py-0 ",

        input: () => "text-sm h-[22px]! text-gray-500!  ",

        placeholder: () => "text-gray-400! text-sm",

        singleValue: () => "normal-case! text-sm text-gray-500! ",

        indicatorsContainer: () => "",

        indicatorSeparator: () => "w-0!",

        dropdownIndicator: () =>
          "p-0! text-gray-500 hover:text-primary! cursor-pointer! ",

        clearIndicator: () =>
          "p-0! text-gray-500 hover:text-primary! cursor-pointer! ",

        menu: () =>
          "mt-1 border border-gray-100 rounded-lg! shadow-lg bg-white dark:bg-[#0b111e]! z-50",

        menuList: () => "py-1 max-h-60 overflow-auto ",

        option: ({ isFocused, isSelected }) =>
          ` normal-case! px-3 py-2 text-sm cursor-pointer! hover:text-secondary!  
       ${isSelected ? "bg-primary! text-secondary!" : " "}
       ${!isSelected && isFocused ? "bg-primary! text-secondary! " : " "}`,
      }}
    />
  );
};

export const SearchableSelectFilter = ({ column, path }) => {
  const value = column.getFilterValue();

  const { data: result } = useQueryData(
    `${apiVersion}/${path}`, // endpoint
    "get", // method
    `${path}`, // key
  );

  let options = result?.data?.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const selected = options?.find((opt) => opt.value === value) || null;

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
          ` w-full! min-h-full! text-sm border rounded-lg! px-1 cursor-pointer! shadow-none! dark:bg-[#0b111e]!
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
          "mt-1 border border-gray-100 rounded-lg! shadow-lg bg-white dark:bg-[#0b111e]! z-50",

        menuList: () => "py-1 max-h-60 overflow-auto ",

        option: ({ isFocused, isSelected }) =>
          ` normal-case! px-3 py-2 text-sm cursor-pointer! hover:text-secondary!  
       ${isSelected ? "bg-primary! text-secondary!" : " "}
       ${!isSelected && isFocused ? "bg-primary! text-secondary! " : " "}`,
      }}
    />
  );
};

export const InputSelectTagArray = ({
  label = "",
  onChange = null,
  path = null,
  placeholder = "",
  className,
  defaultValue = "",
  id = "0",
}) => {
  const { store, dispatch } = React.useContext(StoreContext);

  const {
    isLoading,
    isFetching,
    error,
    data: result,
  } = useQueryData(
    `${apiVersion}/${path}`, // endpoint
    "post", // method
    `${path}`, // key
    { id: id },
  );

  return (
    <>
      {label ? (
        <label htmlFor={label}>
          {label}
          {required && <span className="text-alert">*</span>}
        </label>
      ) : (
        ""
      )}

      <select
        onChange={(e) => {
          const selectedItem = result?.data?.find(
            (item) => Number(item.id) === Number(e.target.value),
          );
          onChange(e, selectedItem);
        }}
        autoComplete="off"
        id={label}
        className={`${className}`}
        defaultValue={defaultValue}
      >
        <optgroup label={`Select a ${placeholder}`}>
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

          {result?.data?.map((item, key) => {
            return isEmptyItem(item?.name, "") !== "developer" ? (
              <option key={key} value={item.id}>
                {item.name}
              </option>
            ) : (
              ""
            );
          })}
        </optgroup>
      </select>
    </>
  );
};
