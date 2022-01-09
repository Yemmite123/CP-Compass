import React from 'react';
import './style.scss'

const MarketplaceCard = (props) => {
  const { item, handleSelect, classes } = props;

  return (
    <div className={`marketplace-card  ${classes}`} onClick={() => handleSelect && handleSelect(item)}>
        <img src={require(`#/assets/icons/setup-investment.svg`)}className="d-block ml-auto" alt="icon"/>
        <div>
          <h6 className="investment-name text-blue mb-0">{item.name}</h6>
          <p className='investment-description mb-0'>{item.description?.substring(0, 50)}...</p>
        </div>
    </div>
  )
}

export default MarketplaceCard;
