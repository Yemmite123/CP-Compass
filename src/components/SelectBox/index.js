import React from 'react';
import './style.scss';

const SelectBox = (
  { label, onChange, name, optionName, readonly, value, defaultValue, placeholder, boxClasses, type, error, disabled, options, required, actualDefaultValue }
  ) => {
  
    const onInputChange = (e) => {
      // setHasvalue(e.target.value.trim().length > 0 ? true : false);
      if (onChange)
        onChange(e);
    };
  

  return(
    <div className={`${boxClasses} selectbox`} tabIndex="1">
      <fieldset className={`${error && 'error'} ${disabled && 'disabled-input'}`}>
        <div className="d-flex position-relative">
          { label ? <span className={`${boxClasses?.includes("active") ? "active" : ""} mt-0 position-absolute ${error && 'label-error'}`}>{label}</span> : "" }
          <select className={`${boxClasses?.includes("active") ? "active" : ""}`} autoComplete="off" onChange={onInputChange} name={name} value={value} placeholder={placeholder} required={required} type={type} disabled={disabled && disabled} readOnly={readonly}>
            {/* <option value=''>{defaultValue}</option> */}
            {
              options && options.map(option => (
                <option key={Math.random()*1000} value={option[value]}>{option[optionName ? optionName : "name"]}</option>
              ))
            }
          </select>
          {error &&
            <img src={error && require("#/assets/icons/error-icon.svg")} alt="textbox-error"/>
          }
            {/* <img src={require('#/assets/icons/select-drop.svg')} alt="textbox-icon"/> */}
        </div>
        
      </fieldset>
      <p className={`${error ? 'd-block' : 'd-none'} input-error mt-1`}>{error}</p>
    </div>
  )
}

export default SelectBox;
