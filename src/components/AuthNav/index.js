import React from 'react';
import CONFIG from '#/config';
import CPLogo from '#/assets/images/CP-Compass-New.svg'
import './style.scss';

const AuthNav = () => {

  return (
    <div className="auth-nav">
      <div className="container">
        <div className="d-flex justify-content-center">
          <div className="logo">
            <a href={`${CONFIG.WEBSITE_URL}`} target="_blank" rel="noopener noreferrer">
              <img src={CPLogo} alt="logo" className="cp-logo" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthNav;
