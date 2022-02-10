import React from 'react';
import { withRouter } from 'react-router-dom';
import './style.scss';

const Back = ({ onClick, ...props }) => {

  const handleBack = () => {
    
    if (onClick) {
      onClick();
      return;
    }
    props.history.goBack();
  }

  return (
    <div onClick={handleBack} className="go-back d-flex">
      <img
        src={require("#/assets/icons/back.svg")}
        alt="transfer logo"
        className="mr-2"
      />
    </div>
  )
}

export default withRouter(Back);
