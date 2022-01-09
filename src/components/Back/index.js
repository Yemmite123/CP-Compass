import React from 'react';
import { withRouter } from 'react-router-dom';
import './style.scss';

const Back = ({ ...props }) => {

  const handleBack = () => {
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
