import { apiVersion } from "@/config/config";
import useQueryData from "@/services/useQueryData";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { handleEscape } from "@/utilities/handleEscape";
import { useField } from "formik";
import { Check, ChevronDown } from "lucide-react";
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
        <optgroup label={`Select ${label}`}>
          <option value={defaultValue} hidden>
            {isEmptyItem(defaultValue, "--")}
          </option>

          {options?.map((item, key) => {
            return (
              item?.id !== "" && (
                <option
                  key={key}
                  value={item.id || item.value}
                  id={item.name || item.label}
                  className="capitalize"
                >
                  {item.name || item.label}
                </option>
              )
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

  // console.log("path", path);
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
          field.onChange(e);
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
              {/* {path === "product-owner/read-by-product-owner" && (
                <option
                  value={store.credentials?.data?.user_account_aid}
                  className="capitalize"
                >
                  {store.credentials?.data?.name}
                </option>
              )} */}
              {valData?.map((item, ikey) => {
                return (
                  <option key={ikey} value={item.id} className="capitalize">
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
          field.onChange(e);
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
            ` w-full! min-h-full! text-sm border rounded-lg! cursor-pointer! shadow-none! dark:bg-[#0b111e]! ${isFocused ? " border-primary! " : " border-gray-300 "}
         hover:border-primary! `,

          valueContainer: () => "px-1 py-0 ",

          input: () => "text-sm h-[22px]! text-gray-500! dark:text-white! ",

          placeholder: () => "text-gray-400! text-sm dark:text-white!",

          singleValue: () =>
            ` ${uppercase} normal-case! text-sm text-gray-500! dark:text-white!`,

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
          sessionStorage.removeItem("filter");
        }}
        isClearable
        classNames={{
          control: ({ isFocused }) =>
            ` w-full! min-h-full! text-sm border rounded-lg! px-1 cursor-pointer! shadow-none! dark:bg-[#0b111e]!
         ${isFocused ? " border-primary! " : " border-gray-300 "}
         hover:border-primary! `,

          valueContainer: () => "px-1 py-0",

          input: () => "text-sm h-[22px]! text-gray-500! dark:text-white  ",

          placeholder: () => "text-gray-400! text-sm dark:text-white!",

          singleValue: () =>
            "normal-case! text-sm text-gray-500! dark:text-white!",

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

// Reusable checkbox dropdown filter - lets a user select multiple values for
// a single column filter (OR'd together server-side). Drop-in alternative to
// SearchableSelectFilter for columns/tables that need multi-select instead of
// single-select. column.getFilterValue() is the source of truth: an array of
// the currently-applied values (or undefined when nothing is applied).
//
// Pass either `path` (fetches option names from an API endpoint, e.g.
// suppliers/customers) or `staticOptions` (options already known
// client-side, e.g. status/payment method/payment terms enums) - not both.
// `staticOptions` entries can be plain strings (label doubles as the filter
// value) or `{ label, value }` pairs when the filter value isn't the same
// as the text shown in the checkbox (e.g. an is_active toggle where the
// column stores 1/0 but the checkbox should read "Active"/"Inactive").
export const MultiSelectCheckboxFilter = ({
  column,
  path,
  staticOptions,
  testFilterId,
  placeholder = "--",
}) => {
  const { data: result } = useQueryData(
    staticOptions ? null : `${apiVersion}/${path}`, // endpoint
    "get", // method
    `${path}`, // key
  );

  const options = useMemo(
    () => staticOptions || result?.data?.map((item) => item.name) || [],
    [result, staticOptions],
  );

  const normalizedOptions = useMemo(
    () =>
      options.map((option) =>
        option && typeof option === "object"
          ? option
          : { label: String(option), value: option },
      ),
    [options],
  );

  const appliedValue = column.getFilterValue() || [];

  const [isOpen, setIsOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(appliedValue);
  const [search, setSearch] = React.useState("");
  const wrapperRef = React.useRef(null);

  const handleClose = () => setIsOpen(false);
  handleEscape(handleClose);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openDropdown = () => {
    setDraft(appliedValue);
    setSearch("");
    setIsOpen(true);
  };

  const toggleValue = (value) => {
    setDraft((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const applyFilter = () => {
    column.setFilterValue(draft.length ? draft : undefined);
    setIsOpen(false);
  };

  const clearFilter = () => {
    setDraft([]);
    column.setFilterValue(undefined);
    setIsOpen(false);
  };

  const visibleOptions = normalizedOptions.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  const triggerLabel =
    appliedValue.length === 0
      ? placeholder
      : appliedValue.length === 1
        ? (normalizedOptions.find((option) => option.value === appliedValue[0])
            ?.label ?? appliedValue[0])
        : `${appliedValue.length} selected`;

  return (
    <div className="relative" ref={wrapperRef} data-testid={testFilterId}>
      <button
        type="button"
        onClick={() => (isOpen ? handleClose() : openDropdown())}
        className={`flex items-center justify-between gap-1 w-full min-h-full text-sm border rounded-lg px-2 py-1.5 cursor-pointer shadow-none dark:bg-[#0b111e] normal-case
        ${isOpen ? "border-primary" : "border-gray-300"}
        hover:border-primary`}
      >
        <span
          className={`truncate ${appliedValue.length ? "text-gray-700 dark:text-white" : "text-gray-400"}`}
        >
          {triggerLabel}
        </span>
        <ChevronDown className="w-3.5 h-3.5 shrink-0 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-56 max-w-[80vw] border border-gray-100 rounded-lg shadow-lg bg-white dark:bg-[#0b111e]">
          <div className="sticky top-0 z-10 p-2 border-b border-gray-100 bg-white dark:bg-[#0b111e]">
            <input
              type="search"
              autoFocus
              value={search}
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full! m-0! text-sm border-gray-300 rounded-md"
              data-testid={`${testFilterId}-search`}
            />
          </div>

          <ul className="max-h-60 overflow-auto py-1">
            {visibleOptions.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-400">No options</li>
            )}
            {visibleOptions.map((option, key) => {
              const checked = draft.includes(option.value);
              return (
                <li key={key}>
                  <label
                    className={`flex items-center gap-2 px-3 py-2 text-sm normal-case cursor-pointer hover:bg-primary/10 ${checked ? "bg-primary/5" : ""}`}
                  >
                    <span
                      className={`flex items-center justify-center w-4 h-4 shrink-0 rounded-sm border ${checked ? "bg-primary border-primary" : "border-gray-300"}`}
                    >
                      {checked && <Check className="w-3 h-3 text-white" />}
                    </span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={() => toggleValue(option.value)}
                    />
                    <span className="truncate text-gray-700 dark:text-white capitalize!">
                      {isEmptyItem(option.label, "Emply value")}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 p-2 border-t border-gray-100">
            <button
              type="button"
              onClick={applyFilter}
              className="btn-modal-submit flex-1 py-1! text-sm"
            >
              Filter
            </button>
            <button
              type="button"
              onClick={clearFilter}
              className="btn-modal-cancel flex-1 py-1! text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const SearchableSelectModalFilter = ({ path, testFilterId }) => {
  const [value, setValue] = React.useState(null);
  const { data: result } = useQueryData(
    `${apiVersion}/${path}`, // endpoint
    "get", // method
    `${path}`, // key
  );

  let options = result?.data?.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  // console.log("value", value);

  const selected = options?.find((opt) => opt.value === value) || null;

  return (
    <div data-testid={testFilterId}>
      <Select
        placeholder="--"
        classNamePrefix="react-select"
        options={options}
        value={selected}
        onChange={(option) => {
          setValue(option ? option.value : undefined);
        }}
        isClearable
        classNames={{
          control: ({ isFocused }) =>
            ` w-full! min-h-full! text-sm border rounded-lg! px-1 cursor-pointer! shadow-none! dark:bg-[#0b111e]!
         ${isFocused ? " border-primary! " : " border-gray-300 "}
         hover:border-primary! `,

          valueContainer: () => "px-1 py-0",

          input: () => "text-sm h-[22px]! text-gray-500! dark:text-white ",

          placeholder: () =>
            "text-gray-400! text-sm dark:text-white dark:text-white! ",

          singleValue: () =>
            "normal-case! text-sm text-gray-500! dark:text-white! ",

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
        className={`${className} min-w-20 `}
        defaultValue={defaultValue}
      >
        <optgroup label={`Select ${placeholder}`}>
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
  dataVal = null,
  item = null,
  path = null,
  required = true,
  testFilterId = "",
  id = "",
  className = "",
  store,
}) => {
  const userId = ProductOwnerId(store);
  const { data: result } = useQueryData(
    `${apiVersion}/${path}`, // endpoint
    "post", // method
    `${path}`, // key
    {
      searchValue: "",
      isDeveloper:
        isEmptyItem(store?.credentials?.data?.role, "admin") === "developer"
          ? "1"
          : "0",
      id: id,
      columnFilters: [],
      userId: userId,
    },
    {
      searchValue: "",
      isDeveloper:
        isEmptyItem(store?.credentials?.data?.role, "admin") === "developer"
          ? "1"
          : "0",
      id: id,
      columnFilters: [],
      userId: userId,
    },
  );
  const [selected, setSelected] = React.useState("");

  const newDataList = result?.data?.filter((item) => {
    return !dataVal?.find((listItem) => {
      return item.id === listItem.sales_order_product_id;
    });
  });

  const options =
    newDataList?.map((item) => ({
      id: item.id,
      value: item.name,
      label: `${item.name} (${item.current_qty})`,
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
            // render the menu through a portal on <body> so it is never
            // clipped by an ancestor's overflow (e.g. the modal body/table's
            // overflow-auto scroll containers) or stuck behind a sibling's
            // stacking context
            menuPortalTarget={
              typeof document !== "undefined" ? document.body : null
            }
            menuPosition="fixed"
            classNames={{
              control: ({ isFocused }) =>
                `z-[999]!  w-full! min-h-full! text-sm border rounded-lg! px-1 cursor-pointer! shadow-none! dark:bg-[#0b111e]!
         ${isFocused ? " border-primary! " : " border-gray-300 "}
         ${className}
         hover:border-primary! `,

              valueContainer: () => "px-1 py-0",

              input: () => "text-sm h-[27px]! text-gray-500! ",

              placeholder: () => "text-gray-400! text-sm dark:text-white!",

              singleValue: () =>
                "normal-case! text-sm text-gray-500! dark:text-white! ",

              indicatorsContainer: () => "",

              indicatorSeparator: () => "w-0!",

              dropdownIndicator: () =>
                "p-0! text-gray-500 hover:text-primary! cursor-pointer! ",

              clearIndicator: () =>
                "p-0! text-gray-500 hover:text-primary! cursor-pointer! ",

              menuPortal: () => "z-999!",

              menu: () =>
                "mt-1 border border-gray-100 rounded-lg! shadow-lg bg-white dark:bg-[#0b111e]! z-[999]! ",

              menuList: () => "py-1 max-h-60 overflow-auto ",

              option: ({ isFocused, isSelected }) =>
                ` normal-case! px-3 py-2 text-sm cursor-pointer! hover:text-secondary!  z-[999]!
         ${isSelected ? "bg-primary! text-secondary!" : " "}
         ${!isSelected && isFocused ? "bg-primary! text-secondary! " : " "}`,
            }}
          />
        </div>
      )}
    </>
  );
};

export const DefaultInputSelectTagArray = ({
  label = "",
  onChange = null,
  dataVal = null,
  item = null,
  path = null,
  required = true,
  testFilterId = "",
  store,
  defaultValue = [],
  excludeIds = [],
}) => {
  const userId = ProductOwnerId(store);
  const { data: result } = useQueryData(
    `${apiVersion}/${path}`, // endpoint
    "post", // method
    `${path}`, // key
    {
      searchValue: "",
      isDeveloper:
        isEmptyItem(store?.credentials?.data?.role, "admin") === "developer"
          ? "1"
          : "0",
      id: "",
      columnFilters: [],
      userId: userId,
    },
  );
  const [selected, setSelected] = React.useState(defaultValue);

  const excludeIdSet = new Set(
    excludeIds
      ?.filter((excludedId) => isEmptyItem(excludedId, "") !== "")
      .map(Number),
  );

  const newDataList = result?.data?.filter((item) => {
    const isAlreadySelected = !!dataVal?.find((listItem) => {
      return item.id === Number(listItem.purchase_order_product_id);
    });
    return !isAlreadySelected && !excludeIdSet.has(Number(item.id));
  });
  const options =
    newDataList?.map((item) => ({
      ...item,
      id: item.id,
      value: item.name,
      label: `${item.name}`,
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

            placeholder: () =>
              "text-gray-400! text-sm dark:text-white! dark:text-white!",

            singleValue: () =>
              "normal-case! text-sm text-gray-500! dark:text-white! ",

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
    </>
  );
};

export const ProductOwnerInputSelectTagArray = ({
  label = "",
  onChange = null,
  dataVal = null,
  item = null,
  path = null,
  required = true,
  testFilterId = "",
  store,
  defaultValue = null,
  filterField = null,
}) => {
  const userId = ProductOwnerId(store);

  const { data: result } = useQueryData(
    `${apiVersion}/${path}`,
    "post",
    `${path}`,
    {
      searchValue: "",
      isDeveloper:
        isEmptyItem(store?.credentials?.data?.role, "admin") === "developer"
          ? "1"
          : "0",
      id: "",
      columnFilters: [],
      userId: userId,
    },
  );

  const [selected, setSelected] = React.useState(defaultValue || null);

  React.useEffect(() => {
    setSelected(defaultValue || null);
  }, [defaultValue]);

  const newDataList =
    result?.data?.filter((optionItem) => {
      // No duplicate filtering requested
      if (!filterField || !Array.isArray(dataVal)) {
        return true;
      }

      return !dataVal.some((listItem) => {
        /*
         * Don't filter the value belonging to the current row.
         */
        if (
          item?.id != null &&
          listItem?.id != null &&
          Number(listItem.id) === Number(item.id)
        ) {
          return false;
        }

        const selectedId = listItem?.[filterField];

        /*
         * Ignore empty values.
         */
        if (
          selectedId === null ||
          selectedId === undefined ||
          selectedId === ""
        ) {
          return false;
        }

        return Number(optionItem.id) === Number(selectedId);
      });
    }) || [];

  const options = newDataList.map((optionItem) => ({
    ...optionItem,
    id: optionItem.id,
    value: optionItem.name,
    label: optionItem.name,
  }));

  return (
    <>
      {label ? (
        <label htmlFor={label}>
          {required && <span className="text-red-500">*</span>}
          {label}
        </label>
      ) : null}

      <div data-testid={testFilterId}>
        <Select
          placeholder="--"
          options={options}
          value={selected || null}
          onChange={(e) => {
            if (!e) {
              setSelected(null);

              if (onChange) {
                onChange(null, null);
              }

              return;
            }
            const selectedItem = result?.data?.find(
              (resultItem) => Number(resultItem.id) === Number(e.id),
            );

            setSelected(e);

            if (onChange) {
              onChange(e, selectedItem);
            }
          }}
          isClearable
          classNames={{
            control: ({ isFocused }) =>
              `w-full! min-h-full! text-sm border rounded-lg! px-1 cursor-pointer! shadow-none! dark:bg-[#0b111e]!
              ${isFocused ? "border-primary!" : "border-gray-300"}
              hover:border-primary!`,

            valueContainer: () => "px-1 py-0",

            input: () => "text-sm h-[27px]! text-gray-500!",

            placeholder: () => "text-gray-400! text-sm dark:text-white!",

            singleValue: () =>
              "normal-case! text-sm text-gray-500! dark:text-white!",

            indicatorsContainer: () => "",

            indicatorSeparator: () => "w-0!",

            dropdownIndicator: () =>
              "p-0! text-gray-500 hover:text-primary! cursor-pointer!",

            clearIndicator: () =>
              "p-0! text-gray-500 hover:text-primary! cursor-pointer!",

            menu: () =>
              "mt-1 border border-gray-100 rounded-lg! shadow-lg bg-white dark:bg-[#0b111e]! z-50",

            menuList: () => "py-1 max-h-60 overflow-auto",

            option: ({ isFocused, isSelected }) =>
              `normal-case! px-3 py-2 text-sm cursor-pointer! hover:text-secondary!
              ${isSelected ? "bg-primary! text-secondary!" : ""}
              ${!isSelected && isFocused ? "bg-primary! text-secondary!" : ""}`,
          }}
        />
      </div>
    </>
  );
};

export const InputSelectFilterTagArray = ({
  label = "",
  defaultValue = "",
  onChange = null,
  item = null,
  path = null,
  required = true,
  testFilterId = "",
  store,
  ...props
}) => {
  const userId = ProductOwnerId(store);
  // const [field, meta] = useField(props);
  const { data: result } = useQueryData(
    `${apiVersion}/${path}`, // endpoint
    "post", // method
    `${path}`, // key
    {
      searchValue: "",
      isDeveloper:
        isEmptyItem(store?.credentials?.data?.role, "admin") === "developer"
          ? "1"
          : "0",
      id: "",
      columnFilters: [],
      userId: userId,
    },
  );
  const [selected, setSelected] = React.useState(defaultValue);
  const options =
    result?.data?.map((item) => ({
      id: item.id,
      value: item.name,
      label: item.name,
    })) || [];

  const supplierOption = options.filter((i) => !i.value.includes("Other"));
  return (
    <>
      {label ? (
        <label htmlFor={label} className=" ">
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
            options={label === "Supplier" ? supplierOption : options}
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
            // render the menu through a portal on <body> so it is never
            // clipped by an ancestor's overflow (e.g. the modal body's
            // overflow-y-auto scroll container) or stuck behind a sibling's
            // stacking context
            menuPortalTarget={
              typeof document !== "undefined" ? document.body : null
            }
            menuPosition="fixed"
            classNames={{
              control: ({ isFocused }) =>
                ` w-full! min-h-full! text-sm border rounded-lg! px-1 mt-1! cursor-pointer! shadow-none! dark:bg-[#0b111e]!
         ${isFocused ? " border-primary! " : " border-gray-300 "}
         hover:border-primary! `,

              valueContainer: () => "",

              input: () => "text-sm h-[27px]! text-gray-500! ",

              placeholder: () =>
                "text-gray-400! text-sm dark:text-white! dark:text-white!",

              singleValue: () =>
                "normal-case! text-sm text-gray-500! dark:text-white! ",

              indicatorsContainer: () => "",

              indicatorSeparator: () => "w-0!",

              dropdownIndicator: () =>
                "p-0! text-gray-500 hover:text-primary! cursor-pointer! ",

              clearIndicator: () =>
                "p-0! text-gray-500 hover:text-primary! cursor-pointer! ",

              menuPortal: () => "z-999!",

              menu: () =>
                "mt-1 border border-gray-100 rounded-lg! shadow-lg bg-white dark:bg-[#0b111e]! z-50",

              menuList: () => "py-1 max-h-60 overflow-auto ",

              option: ({ isFocused, isSelected }) =>
                ` normal-case! px-3 py-2 text-sm cursor-pointer! hover:text-secondary! z-999!
         ${isSelected ? "bg-primary! text-secondary!" : " "}
         ${!isSelected && isFocused ? "bg-primary! text-secondary! " : " "}`,
            }}
          />
        </div>
      )}
      {/* {meta.touched && meta.error ? (
        <span className="error-show">{meta.error}</span>
      ) : null} */}
    </>
  );
};

export const InputPurchaseOrderSelectTagArray = ({
  label = "",
  onChange = null,
  itemEdit = null,
  item = null,
  path = null,
  dataVal = [],
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
    { id, path },
  );
  const newDataList = result?.data?.filter((item) => {
    return !dataVal?.find((listItem) => {
      return item.id === Number(listItem.purchase_order_product_id);
    });
  });

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
          className={`${className} min-w-20 `}
          defaultValue={defaultValue}
        >
          <optgroup label={`Select ${placeholder}`}>
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

            {newDataList?.map((item, key) => {
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

export const SearchableSelectFilterProductOwner = ({
  setColumn,
  column,
  path,
  testFilterId,
}) => {
  const { data: result } = useQueryData(
    `${apiVersion}/${path}`, // endpoint
    "get", // method
    `${path}`, // key
  );

  let options = result?.data?.map((item) => ({
    id: item.id,
    value: item.name,
    label: item.name,
  }));

  const selected =
    options?.find((opt) => Number(opt.id) === Number(column.id)) || null;

  console.log("column", column);

  return (
    <div data-testid={testFilterId}>
      <Select
        placeholder="--"
        classNamePrefix="react-select"
        options={options}
        value={selected}
        onChange={(option) => {
          const value = option ? option.id : 0;

          const selectedItem = options?.find(
            (a) => Number(a.id) === Number(value),
          );

          setColumn(value ? selectedItem : []);
        }}
        isClearable
        classNames={{
          control: ({ isFocused }) =>
            `mt-1 w-full! h-full! text-sm border rounded-lg! px-1 cursor-pointer! shadow-none! dark:bg-[#0b111e]!
         ${isFocused ? " border-primary! " : " border-gray-300 "}
         hover:border-primary! `,

          valueContainer: () => "px-1 py-0",

          input: () => "text-sm text-gray-500! dark:text-white mt-1 ",

          placeholder: () => "text-gray-400! text-sm dark:text-white!",

          singleValue: () =>
            "normal-case! text-sm text-gray-500! dark:text-white!",

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
