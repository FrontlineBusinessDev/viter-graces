import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { useField } from "formik";
import React, { useMemo } from "react";
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
        {required && <span className="text-red-500">*</span>}
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
        data-testid={props.name}
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
  dataTestIdSelect,
  ...props
}) => {
  const { store, dispatch } = React.useContext(StoreContext);
  const [field, meta] = useField(props);

  return (
    <>
      <label htmlFor={props.id || props.name}>
        {required && <span className="text-red-500">*</span>}
        {label}
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
        data-testid={dataTestIdSelect}
      >
        <optgroup label={`Select a ${label}`}>
          <option value={defaultValue} hidden>
            {isEmptyItem(defaultValue, "--")}
          </option>

          {options?.map((item, key) => {
            return (
              <option
                key={key}
                value={item.id}
                id={item.name}
                className="capitalize"
              >
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
  haveOtherInfo = false,
  dataTestIdSelect,
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

  const valData = useMemo(() => {
    if (!result?.count) return [];

    return result?.data;
  }, [result]);
  return (
    <>
      <label htmlFor={props.id || props.name}>
        {required && <span className="text-red-500">*</span>}
        {label}
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
        data-testid={dataTestIdSelect}
      >
        <optgroup label={`Select ${label}`}>
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
            <option value="" hidden>
              --
            </option>
          )}
          {store.credentials?.data?.role === "developer" ? (
            <>
              {valData?.map((item, key) => {
                return (
                  <option key={key} value={item.id} className="capitalize">
                    {item.name}
                  </option>
                );
              })}
            </>
          ) : (
            <>
              {valData?.map((item, key) => {
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

export const InputSelectCustomerArray = ({
  label,
  required = true,
  onChange = null,
  path = null,
  id = 0,
  haveOtherInfo = false,
  dataTestIdSelect,
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
        {required && <span className="text-red-500">*</span>}
        {label}
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
        data-testid={dataTestIdSelect}
      >
        <optgroup label={`Select ${label}`}>
          {result?.count === 0 ? (
            <option value="" hidden>
              --
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
            <option value="">--</option>
          )}

          {result?.data?.map((item, key) => {
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

export const SearchableSelectFilterStatus = ({
  column,
  options,
  testFilterStatusId,
  uppercase = "uppercase! ",
}) => {
  const value = column.getFilterValue();
  const selected = options.find((opt) => opt.value === value) || null;

  return (
    <div data-testid="filter-status-btn">
      <Select
        data-testid={testFilterStatusId}
        classNamePrefix="react-select"
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

          singleValue: () =>
            ` ${uppercase} normal-case! text-sm text-gray-500! `,

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
            ` ${uppercase} normal-case! px-3 py-2 text-sm cursor-pointer! hover:text-secondary!  
         ${isSelected ? "bg-primary! text-secondary!" : " "}
         ${!isSelected && isFocused ? "bg-primary! text-secondary! " : " "}`,
        }}
      />
    </div>
  );
};

export const SearchableSelectFilter = ({ column, path, testFilterId }) => {
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
    <div data-testid={testFilterId}>
      <Select
        placeholder="--"
        classNamePrefix="react-select"
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
    </div>
  );
};

export const InputSelectTagArray = ({
  label = "",
  onChange = null,
  itemEdit = null,
  path = null,
  placeholder = "",
  className,
  defaultValue = "",
  id = "0",
  required = true,
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
          {required && <span className="text-red-500">*</span>}
          {label}
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
              <option
                key={key}
                value={Number(item.id)}
                price={Number(isEmptyItem(item.amount, 0))}
              >
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

export const InputSalesOrderSelectTagArray = ({
  label = "",
  onChange = null,
  item = null,
  path = null,
  required = true,
  testFilterId = "",
}) => {
  const { data: result } = useQueryData(
    `${apiVersion}/${path}`, // endpoint
    "get", // method
    `${path}`, // key
  );
  const [selected, setSelected] = React.useState("");
  const options =
    result?.data?.map((item) => ({
      id: item.id,
      value: item.name,
      label: `${item.name} (${item.current_qty})`,
      ...item,
    })) || [];

  return (
    <>
      {label ? (
        <label htmlFor={label}>
          {required && <span className="text-red-500">*</span>}
          {label}
        </label>
      ) : (
        ""
      )}
      {Number(isEmptyItem(item?.sales_order_aid, 0)) !== 0 ? (
        <span>{item?.sales_order_product_name}</span>
      ) : (
        <div data-testid={testFilterId}>
          <Select
            placeholder="--"
            options={options}
            value={selected}
            onChange={(e) => {
              if (!e) {
                setSelected(null);
                onChange(null, null);
                return;
              }

              const selectedItem = result?.data?.find(
                (item) => Number(item.id) === Number(e.id),
              );

              setSelected(e);
              onChange(e, selectedItem);
            }}
            isClearable
            classNames={{
              control: ({ isFocused }) =>
                ` w-full! min-h-full! text-sm border rounded-lg! px-1 cursor-pointer! shadow-none! dark:bg-[#0b111e]!
         ${isFocused ? " border-primary! " : " border-gray-300 "}
         hover:border-primary! `,

              valueContainer: () => "px-1 py-0",

              input: () => "text-sm h-[27px]! text-gray-500! ",

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
        </div>
      )}
    </>
  );
};

export const InputPurchaseOrderSelectTagArray = ({
  label = "",
  onChange = null,
  itemEdit = null,
  item = null,
  path = null,
  placeholder = "",
  className,
  defaultValue = "",
  id = "0",
  required = true,
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
          {required && <span className="text-red-500">*</span>}
          {label}
        </label>
      ) : (
        ""
      )}
      {Number(isEmptyItem(item?.purchase_order_aid, 0)) !== 0 ? (
        <span>{item?.purchase_order_product_name}</span>
      ) : (
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
              return (
                <option key={key} value={Number(item.id)}>
                  {item.name}
                </option>
              );
            })}
          </optgroup>
        </select>
      )}
    </>
  );
};
