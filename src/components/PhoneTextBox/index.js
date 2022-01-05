import React from 'react';
import './style.scss';

const PhoneTextbox = (
  { label, onChange, name, value, placeholder, boxClasses, type, error, iconUrl, onIconClick, disabled, min, required, max, defaultValue, defaultNumber, options, onChangeSelect, selectName, maxlength, actualCodeDefaultValue }
  ) => {

  return(
    <div className={`${boxClasses} phone-textbox`} tabIndex="1">
      <fieldset className={`${error && 'error'} ${disabled && 'disabled-input'}`}>
        <legend id="label-legend" className={` pl-2 pr-2 ${error && 'label-error'}`}>{label}</legend>
        <div className="d-flex">
          <select autoComplete="off" onChange={onChangeSelect} name={selectName} value={defaultValue} defaultValue={actualCodeDefaultValue} disabled={disabled && disabled}>
            {
              options && options.map(option => (
              <option key={option.code} value={option.dial_code}>{option.dial_code} &nbsp; {`  ${option.name}`}</option>
              ))
            }
          </select>
          <input
            autoComplete="off"
            min={min && min}
            onChange={onChange}
            name={name}
            value={value}
            placeholder={placeholder}
            type={type}
            disabled={disabled && disabled}
            required={required}
            max={max && max}
            maxLength={maxlength && maxlength}
            defaultValue={defaultNumber}
          />
          {error && 
            <img src={error && require("#/assets/icons/error-icon.svg")} alt="textbox-error"/>
          }
          {
            iconUrl && <img src={iconUrl} alt="textbox-icon" onClick={onIconClick}/>
          }
        </div>
        
      </fieldset>
      <p className={`${error ? 'd-block' : 'd-none'} input-error mt-1`}>{error}</p>
    </div>
  )
}

export default PhoneTextbox;
