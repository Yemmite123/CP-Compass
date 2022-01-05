import React, { useRef } from 'react';
import './style.scss'

const SelectableList = ({ onSelect, selected, label, value, noImg, img }) => {

  const ref = useRef();

  return (
    <div className="select-list" id={value} ref={ref} onClick={onSelect}>
      <div id={value} className={`list-item d-flex justify-content-between ${selected && 'selected'} mt-2`}>
        <div id={value} className="d-flex align-items-center">
        {img && <img src={img} alt="icon" className="mr-2 img-fluid"/>}
          <p id={value} className="mb-0 text-small">{label}</p>
        </div>
        {!noImg && selected && <img src={require("#/assets/icons/check-blue.svg")} alt="check"/>}
      </div>
    </div>
    
  )
}

export default SelectableList;
