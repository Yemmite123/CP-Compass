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
        src={require("#/assets/icons/back-arrow.svg")}
        alt="transfer logo"
        className="mr-2"
      />
      <p className="mb-0 text-blue">Back</p>
    </div>
  )
}

export default withRouter(Back);
