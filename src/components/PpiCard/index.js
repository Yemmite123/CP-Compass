import React from 'react';
import './style.scss'

const PpiCard = (props) => {
  const { item, handleSelect, classes } = props;

  return (
    <div className={`marketplace-card position-relative ${classes}`} onClick={() => handleSelect && handleSelect(item)} style={{ backgroundImage: `url(${item.image})` }}>
      <div style={{ zIndex: 1 }}>
        <h6 className="investment-name text-white mb-0">{item.title}</h6>
        <p className='investment-description text-white mb-0'>{item.summary?.substring(0, 50)}...</p>
      </div>
    </div>
  )
}

export default PpiCard;
