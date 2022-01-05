import React from "react";
import DatePicker from "react-date-picker";
import calendarIcon from "#/assets/icons/calendar.svg";
import { countryCodes } from "#/utils/countryCode";

import "./style.scss";

const CustomInput = ({
  type,
  label,
  name,
  error,
  value,
  countryCodeValue, // for phone input
  disabled,
  maxDate, // for date input
  minDate, // for date input
  options, // for select
  onChange,
  valueKey, // for select
  customAttributes, // object of additional attributes you want
}) => {
  const [hasValue, setHasvalue] = React.useState(false);

  React.useEffect(() => {
    if (value) {
      setHasvalue(true);
    }
  }, [value]);

  const onInputChange = (e) => {
    setHasvalue(e.target.value.trim().length > 0 ? true : false);
    onChange(e);
  };

  const handleDateChange = (date) => {
    setHasvalue(true);
    onChange(date);
  };

  const randomId = Math.floor(Math.random() * 3271 * Math.random() * 1000);

  const commonProps = {
    ...customAttributes,
    name,
    disabled,
    id: randomId,
    className: "custom-input__input",
  };

  const inputProps = {
    ...commonProps,
    value,
    onChange: onInputChange,
  };

  const getSelectOptions = (options) => {
    return options.map((option) => {
      const name = typeof option === "string" ? option : option.name;
      const value =
        typeof option === "string" ? option : option.value ?? option[valueKey];
      return (
        <option value={value} key={value}>
          {name}
        </option>
      );
    });
  };

  return (
    <div
      className={`custom-input ${hasValue ? "custom-input__filled" : ""} 
        ${disabled ? "custom-input__disabled" : ""} 
        ${error ? "custom-input__errored" : ""}`}
    >
      <label
        htmlFor={randomId}
        className={`custom-input__label ${
          hasValue ? "custom-input__label--top" : ""
        }`}
      >
        {label}
      </label>
      {type === "date" ? (
        <DatePicker
          calendarIcon={<img src={calendarIcon} alt="calendar icon" />}
          onChange={handleDateChange}
          value={value}
          format="dd/MM/yyyy"
          clearIcon={null}
          maxDate={maxDate ?? null}
          minDate={minDate ?? null}
          {...commonProps}
        />
      ) : type === "select" ? (
        <select {...inputProps}>
          <option value="">...select...</option>
          {getSelectOptions(options)}
        </select>
      ) : type === "phone" ? (
        <div className="custom-input__phone">
          <select
            name="countryCode"
            value={countryCodeValue}
            onChange={onInputChange}
            disabled={disabled}
          >
            {countryCodes.map((code) => (
              <option value={code.dial_code} key={code.name}>
                {code.dial_code} {code.name}
              </option>
            ))}
          </select>
          <input {...inputProps} type="number" />
        </div>
      ) : (
        <input {...inputProps} type={type} />
      )}
      {error && <span className="custom-input__error">{error}</span>}
    </div>
  );
};

export default CustomInput;
