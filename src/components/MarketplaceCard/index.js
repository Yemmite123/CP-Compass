import React from 'react';
import './style.scss'

const MarketplaceCard = (props) => {
  const { item, handleSelect, classes } = props;

  return (
    <div className={`marketplace-card position-relative ${classes}`} onClick={() => handleSelect && handleSelect(item)} style={{backgroundImage: `url(${require(`#/assets/images/marketplace-img.png`)})`}}>
        <div style={{zIndex: 1}}>
          <h6 className="investment-name text-white mb-0">{item.name}</h6>
          <p className='investment-description text-white mb-0'>{item.description?.substring(0, 50)}...</p>
        </div>
    </div>
  )
}

export default MarketplaceCard;
