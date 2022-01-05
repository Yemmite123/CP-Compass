import React from "react";
import "./style.scss";

const RadioInput = ({ name, value, checked, onChange, label }) => {
  const randomId = Math.floor(Math.random() * 10000);
  return (
    <>
      <input
        type="radio"
        name={name}
        value={value}
        className="radio__input"
        checked={checked}
        onChange={onChange}
        id={randomId}
      />
      <label className="radio__label" htmlFor={randomId}>
        <span className="radio__circle"></span> {label}
      </label>
    </>
  );
};

export default RadioInput;
