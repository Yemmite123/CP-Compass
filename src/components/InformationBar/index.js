import React from 'react';
import './style.scss';

const InformationBar = ({ children, className, ...props }) => {

  return (
    <div className="information-bar-wrap">
      <div className={`information-bar ${className}`}>
        {children}
      </div>
    </div>
  )
}

export default InformationBar;