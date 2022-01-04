import React from 'react';
import './style.scss';

const SummaryCard = ({title, total, percentageDiff, backgroundImage, iconColor, iconName}) => {
  return (
    <div className="summary" data-color={backgroundImage} style={{backgroundImage}}>
        <p className="summary__type">{title}</p>
        <p className="summary__value">&#x20A6;{total}</p>
        {percentageDiff !== 'N/A' && <p className="summary__trend">
            <img 
                src={require(`#/assets/icons/${percentageDiff === 0 ? 'flatline' : 'trend-arrow'}.svg`)} 
                className={`${percentageDiff < 0 ? 'summary__trend-arrow' : ''}`} 
                alt="trend arrow"
            />
            <span className="summary__trend-value">{percentageDiff}%</span>
            <span className="summary__trend-period">(Last 7 days)</span>
        </p>}
        {/* <img className="summary__image" src={require('#/assets/icons/cp-back-logo.svg')} alt="trend arrow"/> */}
        <div className="summary__icon" style={{backgroundColor: iconColor}}>
            <img src={require(`#/assets/icons/${iconName}.svg`)} alt="icon"/>
        </div>
    </div>
  )
}

export default SummaryCard;
