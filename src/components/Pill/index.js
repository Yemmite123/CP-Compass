import React from 'react';
import './style.scss';

const Pill = ({ onSelect, selected, label, value, img }) => {

  return (
    <div className="pill" id={value} onClick={onSelect}>
      <div id={value} className={`pill-item cursor-pointer ${selected && 'selected'} mt-2 mr-2 d-flex`}>
        {img && <img src={img} alt="icon" className="mr-2 img-fluid"/>}
        <p id={value} className="mb-0 text-small">{label}</p>
      </div>
    </div>
  )
}

export default Pill;
