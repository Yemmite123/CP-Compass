import React from 'react';
import './style.scss'

const PpiCard = (props) => {
  const { item, handleSelect, classes } = props;

  return (
    <div id="ppi-card" className={`mb-3 cursor-pointer ${classes}`} onClick={() => handleSelect && handleSelect(item)}>
      <div className="img-cover" style={{ backgroundImage: `url(${item.image})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
        <div className="img-overlay">
          <h5 className="text-white text-capitalize cursor-pointer">{item.title}</h5>
        </div>
      </div>
      <div className="bottom">
        <p className="text-black mb-0 investment-description">{item.summary?.substring(0, 50)}{item.summary?.length > 50 && '...'}</p>
      </div>
    </div>
  )
}

export default PpiCard;
