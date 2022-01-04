import React from 'react';
import './style.scss';

const QuickActionCard = ({title, iconName, onclick}) => {
  return (
    <div className="action" onClick={onclick}>
        <img src={require(`#/assets/icons/${iconName}.svg`)} className="d-block ml-auto" alt="icon"/>
        <p className="action__text">{title}</p>
    </div>
  )
}

export default QuickActionCard;
