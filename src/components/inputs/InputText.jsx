import { setError } from "@/store/StoreAction";
import { StoreContext } from "@/store/StoreContext";
import { useField } from "formik";
import React from "react";
import { NumericFormat } from "react-number-format";

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
          {required && <span className="text-alert">*</span>}
          {label}
        </label>
      )}
      <NumericFormat
        {...field}
        {...props}
        allowLeadingZeros
        autoComplete="off"
        className={`${
          meta.touched && meta.error ? "error-show" : null
        }  ${className}`}
        onChange={(e) => {
          onChange !== null && onChange(e);
          field.onChange(e);
          dispatch(setError(false));
        }}
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
          {label}
          {required && <span className="text-alert"> *</span>}
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
      />

      {meta.touched && meta.error ? (
        <span className="error-show">{meta.error}</span>
      ) : null}
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
        ref={refVal}
      />
      <label htmlFor={props.id || props.name} className="label_login">
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
                value={num}
                autoFocus={!code[0].length && idx === 0}
                readOnly={loading}
                disabled={loading}
                onChange={(e) => processInput(e, idx)}
                onKeyUp={(e) => onKeyUp(e, idx)}
                ref={(ref) => inputs.current.push(ref)}
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
