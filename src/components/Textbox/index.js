import React from 'react';
import './style.scss';

const Textbox = React.forwardRef(({ label, onChange, defaultValue, name, value, placeholder, boxClasses, type, error, iconUrl, onIconClick, disabled, min, required, max, maxlength }, ref) => {

  const inputRef = React.createRef();

  React.useEffect(() =>{
    if (inputRef.current.value){
      inputRef.current.parentNode.children[0].classList.add("active")
      inputRef.current.classList.add("active")
    }
    else{
      inputRef.current.parentNode.children[0].classList.remove("active");
      inputRef.current.classList.remove("active");
      }
  }, [value, error])

  return (
    <div  className={`${boxClasses} textbox`} tabIndex="1">
      <fieldset
        className={`${error && "error"} ${disabled && "disabled-input"}`}
      >
        {/* <legend id="label-legend" className={` pl-2 pr-2 ${error && 'label-error'}`}>{label}</legend> */}
        <div className="d-flex position-relative">
        { label ? <span className={`${boxClasses?.includes("active") ? "active" : ""} mt-0 position-absolute ${error && 'label-error'}`}>{label}</span> : "" }
          <input
            ref={inputRef}
            autoComplete="off"
            min={min && min}
            onChange={(e) => {
              if (e.target.value){
                e.target.parentNode.children[0].classList.add("active")
                e.target.classList.add("active")
              }
              else{
                e.target.parentNode.children[0].classList.remove("active");
                e.target.classList.remove("active");
                }
              if (onChange)
                onChange(e);
            }}
            className={`${boxClasses?.includes("active") ? "active" : ""}`}
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
          {error && (
            <img
              src={error && require("#/assets/icons/error-icon.svg")}
              alt="textbox-error"
            />
          )}
          {iconUrl && (
            <img src={iconUrl} alt="textbox-icon" onClick={onIconClick} />
          )}
        </div>
      </fieldset>
      <p className={`${error ? "d-block" : "d-none"} input-error mt-1`}>
        {error}
      </p>
    </div>
  );
})

export default Textbox;
