import { apiVersion } from "@/config/config";
import { queryDataInfinite } from "@/services/queryDataInfinite";
import { StoreContext } from "@/store/StoreContext";
import { isEmptyItem } from "@/utilities/isEmptyItem";
import { ProductOwnerId } from "@/utilities/productOwnerToken";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useField } from "formik";
import { Search } from "lucide-react";
import React, { useCallback, useMemo, useRef } from "react";
import Loadmore from "../Loadmore";

export const InputNumber = ({
  label = "",
  icon = "",
  required = true,
  className = "",
  onChange = null,
  refVal = null,
  ...props
}) => {
  const { dispatch } = React.useContext(StoreContext);
  const [field, meta] = useField(props);

  return (
    <>
      {label !== "" && (
        <label htmlFor={props.id || props.name}>
          {required && <span className="text-red-500">*</span>}
          {label}
        </label>
      )}

      <input
        {...field}
        {...props}
        type="number"
        className={`${
          meta.touched && meta.error ? `error-show ` : ""
        } ${className} `}
        autoComplete="off"
        onChange={(e) => {
          onChange !== null && onChange(e);
          field.onChange(e);
        }}
        ref={refVal}
        data-testid={props.name}
      />

      {meta.touched && meta.error ? (
        <span className={`error-show`}>{meta.error}</span>
      ) : null}
    </>
  );
};

export const InputText = ({
  label = "",
  icon = "",
  required = true,
  className = "",
  onChange = null,
  refVal = null,
  ...props
}) => {
  const { dispatch } = React.useContext(StoreContext);
  const [field, meta] = useField(props);

  return (
    <>
      {label !== "" ? (
        <label htmlFor={props.id || props.name}>
          {required && <span className="text-red-500"> *</span>}
          {label}
        </label>
      ) : (
        ""
      )}
      <input
        {...field}
        {...props}
        className={`${
          meta.touched && meta.error ? `error-show ` : ""
        } ${className} `}
        autoComplete="off"
        onChange={(e) => {
          onChange !== null && onChange(e);
          field.onChange(e);
        }}
        ref={refVal}
        data-testid={props.name}
      />

      {meta.touched && meta.error ? (
        <span className="error-show">{meta.error}</span>
      ) : null}
    </>
  );
};

export const InputMaxMinValue = ({ column, cypressTesting = "" }) => {
  let value = column.getFilterValue() || { min: 0, max: "" };

  return (
    <>
      <div className="flex items-center gap-1">
        {/* MIN */}
        <input
          type="search"
          inputMode="numeric"
          pattern="[0-9]*"
          // oninput={(this?.value = this?.value?.replaceAll(/[^0-9]/g, ""))}
          value={value?.min ?? ""}
          placeholder="min"
          data-testid={`${cypressTesting}_min`}
          className={`bg-white m-0! w-full! text-sm border rounded-md cursor-pointer! isFocused:border-primary!
                              isFocused:ring-1 isFocused:ring-primary! border-gray-300 hover:border-primary! `}
          onChange={(e) => {
            let min = e.target.value?.replaceAll(/[^0-9]/g, "")
              ? Number(e.target.value?.replaceAll(/[^0-9]/g, ""))
              : 0;

            const newValue = {
              ...value,
              min,
            };

            column.setFilterValue(newValue);
          }}
        />
        <span className="font-bold">-</span>
        {/* MAX */}
        <input
          type="search"
          inputMode="numeric"
          pattern="[0-9]*"
          // oninput={(this?.value = this?.value?.replaceAll(/[^0-9]/g, ""))}
          value={value?.max ?? ""}
          placeholder="max"
          data-testid={`${cypressTesting}_max`}
          className={`bg-white m-0! w-full! text-sm border rounded-md cursor-pointer! isFocused:border-primary!
                              isFocused:ring-1 isFocused:ring-primary! border-gray-300 hover:border-primary! `}
          onChange={(e) => {
            let max = e.target.value?.replaceAll(/[^0-9]/g, "")
              ? Number(e.target.value?.replaceAll(/[^0-9]/g, ""))
              : 0;

            const newValue = {
              ...value,
              max,
            };

            column.setFilterValue(newValue);
          }}
        />
      </div>
    </>
  );
};

export const InputLogin = ({
  label = "",
  icon = "",
  required = true,
  className = "",
  onChange = null,
  refVal = null,
  ...props
}) => {
  const { dispatch } = React.useContext(StoreContext);
  const [field, meta] = useField(props);

  return (
    <>
      <input
        {...field}
        {...props}
        className={`${
          meta.touched && meta.error ? `error-show ` : ""
        } ${className} pl-15`}
        autoComplete="off"
        onChange={(e) => {
          onChange !== null && onChange(e);
          field.onChange(e);
        }}
        data-testid={props.name}
        ref={refVal}
      />
      <label
        htmlFor={props.id || props.name}
        className="label_login disabled:text-gray-400!"
      >
        {icon}
      </label>

      {meta.touched && meta.error ? (
        <span className="error-show">{meta.error}</span>
      ) : null}
    </>
  );
};

export const InputCode = ({ length, loading, onComplete }) => {
  const [code, setCode] = React.useState([...Array(length)].map(() => ""));
  const inputs = React.useRef([]);

  const processInput = (e, slot) => {
    const num = e.target.value;
    if (/[^0-9]/.test(num)) return;

    let valCodeLength = isEmptyItem(e.target.value, "").length;
    let newCode = [...code];
    if (Number(valCodeLength) > 1) {
      newCode = [...Array(6)].map(() => "");
      for (let i = 0; i < Number(valCodeLength); i++) {
        if (i <= 5) {
          newCode[i] = num[i];
        }
      }
      setCode(newCode);
      if (num?.length - 1 !== length) {
        if (num?.length < 6) {
          inputs.current[num?.length].focus();
        } else {
          inputs.current[num?.length - 1].focus();
        }
      }
      if (newCode.every((num) => num !== "")) {
        onComplete(newCode.join(""));
      }
    } else {
      newCode[slot] = num;
      setCode(newCode);
      if (slot !== length - 1) {
        inputs.current[slot + 1].focus();
      }
      if (newCode.every((num) => num !== "")) {
        onComplete(newCode.join(""));
      }
    }
  };

  const onKeyUp = (e, slot) => {
    if (e.keyCode === 8 && !code[slot] && slot !== 0) {
      const newCode = [...code];
      newCode[slot - 1] = "";
      setCode(newCode);
      inputs.current[slot - 1].focus();
    }
  };

  return (
    <>
      <div className="">
        <div className="flex gap-x-3  ">
          {code.map((num, idx) => {
            return (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                // oninput={(this?.value = this?.value?.replaceAll(/[^0-9]/g, ""))}
                value={num}
                autoFocus={!code[0].length && idx === 0}
                readOnly={loading}
                disabled={loading}
                onChange={(e) => processInput(e, idx)}
                onKeyUp={(e) => onKeyUp(e, idx)}
                ref={(ref) => inputs.current.push(ref)}
                data-testid={props.name}
                placeholder="⚬"
                className="block w-9.5 text-center border-gray-200 rounded-md sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export const DebouncedInput = ({
  value: initialValue,
  cypressTesting = "",
  onChange,
  filterFn,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <>
      {(isEmptyItem(filterFn, "auto") === "auto" ||
        isEmptyItem(filterFn, "auto") === "date") && (
        <input
          {...props}
          type={isEmptyItem(filterFn, "auto") !== "date" ? "search" : "date"}
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value)}
          data-testid={cypressTesting}
        />
      )}

      {isEmptyItem(filterFn, "") === "between" && (
        <div className="flex items-center gap-1">
          <input
            {...props}
            value={value?.min ?? ""}
            type="search"
            inputMode="numeric"
            pattern="[0-9]*"
            // oninput={(this?.value = this?.value?.replaceAll(/[^0-9]/g, ""))}
            onChange={(e) => {
              let min = e.target.value?.replaceAll(/[^0-9]/g, "")
                ? Number(e.target.value?.replaceAll(/[^0-9]/g, ""))
                : "";
              let max = value?.max ?? "";
              const newValue = {
                ...value,
                min,
                max,
              };
              setValue(newValue);
            }}
            data-testid={`${cypressTesting}_min`}
            placeholder="min"
          />
          <span className="font-bold">-</span>
          <input
            {...props}
            value={value?.max ?? ""}
            type="search"
            inputMode="numeric"
            pattern="[0-9]*"
            // oninput={(this?.value = this?.value?.replaceAll(/[^0-9]/g, ""))}
            onChange={(e) => {
              let max = e.target.value?.replaceAll(/[^0-9]/g, "")
                ? Number(e.target.value?.replaceAll(/[^0-9]/g, ""))
                : "";
              let min = value?.min ?? "0";
              const newValue = {
                ...value,
                min,
                max,
              };
              setValue(newValue);
            }}
            data-testid={`${cypressTesting}_max`}
            placeholder="max"
          />
        </div>
      )}
    </>
  );
};
