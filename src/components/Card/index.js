import React from 'react';
import './style.scss';

const Card = ({ classes, onclick, backgroundImage, children}) => {
  return (
    <div className={`card-container ${classes}`} onClick={onclick} style={{backgroundImage}}>
        {children}
    </div>
  )
}

export default Card;
