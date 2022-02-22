import React from 'react';
import DatePicker from 'react-date-picker';
import moment from "moment"
import './style.scss';

const Textbox = ({ label, startDate, formatMonth, onChange,defaultValue, value, boxClasses, error, iconUrl, onIconClick, disabled, min, required, max }) => {

  return(
    <div className={`${boxClasses} date-box`} tabIndex="1">
      <fieldset className={`${error && 'error'} ${disabled && 'disabled-input'}`}>
        {/* <legend id="label-legend" className={` pl-2 pr-2 ${error && 'label-error'}`}>{label}</legend> */}
        <div className="d-flex position-relative">
        { label ? <span className={`label position-absolute ${boxClasses?.includes("active") ? "active" : ""} ${error && 'label-error'}`}>{label}</span> : "" }
          <DatePicker activeStartDate={startDate} defaultValue={defaultValue} disabled={disabled} onChange={onChange} value={value} maxDate={max} minDate={min} required={required} format="dd/MM/yyyy" formatMonth={formatMonth} clearIcon={null} />
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
