import React, { useRef } from 'react';
import './style.scss'

const SelectableList = ({ onSelect, selected, label, value, noImg, img, className }) => {

  const ref = useRef();

  return (
    <div className={`select-list  `} id={value} ref={ref} onClick={onSelect}>
      <div id={value} className={`px-5 text-center list-item d-flex justify-content-center ${selected && 'selected'} mt-4`}>
        <div id={value} className={`align-self-center ${img ? "d-flex flex-start" : ""}`} style={{flex: `${img ? 1 : ""}`}}>
        {img && <img src={img} alt="icon" className="mr-2 img-fluid"/>}
          <p id={value} className={`mb-0 text-small text-black ${img ? "align-self-center" : ""}`}>{label}</p>
        </div>
        {/* {!noImg && selected && <img src={require("#/assets/icons/check-blue.svg")} alt="check"/>} */}
      </div>
    </div>
    
  )
}

export default SelectableList;
