import React, { useEffect, useRef, useState } from "react";
import { PropTypes } from "prop-types";
import Tooltip from "./Tooltip";

const TextInput = ({
  placeholder,
  onChange = null,
  secure = false,
  value = null,
  readOnly = false,
  id = "tooltip",
  inputType = "text",
  showLabelRadio = false,
  className = "form-input w-full focus:border-green-400 box-border focus:font-semibold overflow-visible focus:border-l-3",
  hgt = 4,
  textarea = false,
  label = "Votre label",
  tooltip = false,
  suffix = null,
  prefix = null,
  register = {},
  search = false,
  onSearchClick = null,
  inputRef,
}) => {
  const [isVisible, setIsVisible] = useState(secure);
  const [shwLabel, setShwLabel] = useState(false);
  const val = value === null ? {} : { value };

  useEffect(() => {
    if ((value || (typeof value == "number" && value == 0)) && !shwLabel) {
      setShwLabel(true);
    }
  }, [value]);
  return (
    <div
      className={`${
        inputType !== "radio"
          ? ""
          : "flex items-center px-5 pt-1 pb-2 text-center mr-3 rounded border border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center justify-between">
        {shwLabel && (
          <label className="absolute bg-white px-1 z-10 ml-4 text-slate-400 text-xs font-medium">
            {placeholder}
          </label>
        )}
        {tooltip && (
          <Tooltip className="ml-2" bg="dark" size="md">
            <div className="text-sm text-slate-200">{placeholder}.</div>
          </Tooltip>
        )}
      </div>
      <div
        className={`${
          inputType !== "radio" ? "relative focus:border-primary-500 " : ""
        }`}
      >
        {search && (
          <button
            className="absolute inset-0 right-auto group"
            onClick={onSearchClick}
            type="submit"
            aria-label="Search"
          >
            <svg
              className="w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-3 mr-2"
              viewBox="0 0 16 16"
            >
              <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
              <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
            </svg>
          </button>
        )}
        {prefix && (
          <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
            <span className="text-sm text-slate-400 font-medium px-3">
              {prefix}
            </span>
          </div>
        )}
        {!textarea && (
          <input
            ref={inputRef || null}
            id={id}
            readOnly={readOnly}
            className={`${className} ${search && "pl-9"}`}
            type={isVisible ? "text" : inputType}
            name="type"
            {...register}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            placeholder={!shwLabel && !value && placeholder}
            autoComplete={id}
            // {...val}
            value={value}
            onFocus={(e) => setShwLabel(true)}
            onBlur={() => {
              if (!(value || (typeof value == "number" && value == 0)))
                setShwLabel(false);
            }}
          />
        )}
        {textarea && (
          <textarea
            ref={inputRef || null}
            id={id}
            className={className}
            {...register}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            rows={hgt}
            placeholder={placeholder}
            value={value}
          />
        )}
        {suffix && (
          <div className="absolute inset-0 left-auto flex items-center pointer-events-none">
            <span className="text-sm text-slate-400 font-medium px-3">
              {suffix}
            </span>
          </div>
        )}
        {isVisible && inputType == "password" && (
          <div
            onClick={() => setIsVisible(!isVisible)}
            className="cursor-pointer absolute inset-0 left-auto flex items-center"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-primary-200 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}
        {!isVisible && inputType == "password" && (
          <div
            onClick={() => setIsVisible(!isVisible)}
            className="cursor-pointer absolute inset-0 left-auto flex items-center"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-primary-200 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          </div>
        )}
      </div>
      {showLabelRadio && (
        <label className="w-full ml-3 mt-1 text-sm font-medium">{label}</label>
      )}
    </div>
  );
};
TextInput.propTypes = {
  placeholder: PropTypes.string,
  inputType: PropTypes.string,
  label: PropTypes.string,
  hgt: PropTypes.number,
  // value: PropTypes.string || PropTypes.number,
  secure: PropTypes.bool,
  readOnly: PropTypes.bool,
  showLabel: PropTypes.bool,
  tooltip: PropTypes.bool,
  onChange: PropTypes.func,
};

TextInput.defaultProps = {
  placeholder: "",
  inputType: "text",
  label: "Votre label",
  hgt: 4,
  secure: false,
  readOnly: false,
  showLabel: false,
  tooltip: false,
  value: "",
  onChange: null,
};
export default TextInput;
