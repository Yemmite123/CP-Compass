import React from 'react';
import './style.scss';

const Textbox = ({ label, onChange, defaultValue, name, value, placeholder, boxClasses, type, error, iconUrl, onIconClick, disabled, min, required, max, maxlength }) => {

  return(
    <div className={`${boxClasses} textbox`} tabIndex="1">
      <fieldset className={`${error && 'error'} ${disabled && 'disabled-input'}`}>
        <legend id="label-legend" className={` pl-2 pr-2 ${error && 'label-error'}`}>{label}</legend>
        <div className="d-flex">
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
            defaultValue={defaultValue}
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

export default Textbox;
