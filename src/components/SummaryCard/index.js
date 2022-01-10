import React from 'react';
import './style.scss';

const SummaryCard = ({title, total, showCurrency, percentageDiff, backgroundImage, iconColor, iconName}) => {
  return (
    <div className="summary" data-color={backgroundImage} style={{backgroundImage, backgroundSize: "cover"}}>
        <p className="summary__type">{title}</p>
        {showCurrency ? <p className="summary__value">&#x20A6;{total}</p> : <p className="summary__value">{total}</p>}
        {percentageDiff !== 'N/A' && <p className="summary__trend">
            <img 
                src={require(`#/assets/icons/${percentageDiff === 0 ? 'flatline' : 'trend-arrow'}.svg`)} 
                className={`${percentageDiff < 0 ? 'summary__trend-arrow' : ''}`} 
                alt="trend arrow"
            />
            <span className="summary__trend-value">{percentageDiff}%</span>
            <span className="summary__trend-period">(Last 7 days)</span>
        </p>}
        
        <div className="summary__icon" style={{backgroundColor: iconColor}}>
            <img src={require(`#/assets/icons/${iconName}.svg`)} alt="icon"/>
        </div>
    </div>
  )
}

export default SummaryCard;
