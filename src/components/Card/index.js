import React from 'react';
import './style.scss';

const Card = ({ classes, onclick, children}) => {
  return (
    <div className={`card-container ${classes}`} onClick={onclick}>
        {children}
    </div>
  )
}

export default Card;
