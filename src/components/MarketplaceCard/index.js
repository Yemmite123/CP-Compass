import React from 'react';
import './style.scss'

const MarketplaceCard = (props) => {
  const { item, handleSelect, classes } = props;

  return (
    <div id="marketplace-card" className={`row no-gutters d-flex align-items-center mb-3 cursor-pointer ${classes}`} onClick={() => handleSelect && handleSelect(item)}>
      <div className="col-md-4 h-100">
        <div className="img-cover mr-3">
          <img src={item.icon} className="" alt="card"/>
        </div>
      </div>
      <div className="col-md-8">
      <div className="details-text">
        <h3 className="text-deep-blue text-medium mb-0 cursor-pointer investment-name">{item.name}</h3>
        <p className="text-black mb-0 investment-description">{item.description?.substring(0, 50)}...</p>
      </div>
      </div>
    </div>
  )
}

export default MarketplaceCard;
