import React from "react";
import CPLogo from '#/assets/images/cp-logo.svg'
import delay from "p-min-delay";
import loadable from "@loadable/component";
import './style.scss';

const Preloader = loadable(props => delay(import(`../../pages/${props.page}`), 1000), {
    fallback: (
      <div className="site-suspense d-flex align-items-center justify-content-center">
        <img src={CPLogo} alt="logo" className="cp-logo" />
      </div>
    ),
    cacheKey: props => props.page
});

export default Preloader;