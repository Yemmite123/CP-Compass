import React from 'react';
import './style.scss';

const SelectBox = (
  { label, onChange, name, optionName, readonly, value, defaultValue, placeholder, boxClasses, type, error, disabled, options, required, actualDefaultValue }
  ) => {

  return(
    <div className={`${boxClasses} selectbox`} tabIndex="1">
      <fieldset className={`${error && 'error'} ${disabled && 'disabled-input'}`}>
        <legend id="label-legend" className={` pl-2 pr-2 ${error && 'label-error'}`}>{label}</legend>
        <div className="d-flex">
          <select autoComplete="off" onChange={onChange} name={name} value={defaultValue} placeholder={placeholder} defaultValue={actualDefaultValue} required={required} type={type} disabled={disabled && disabled} readOnly={readonly}>
            <option value=''>...select...</option>
            {
              options && options.map(option => (
                <option key={Math.random()*1000} value={option[value]}>{option[optionName]}</option>
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
