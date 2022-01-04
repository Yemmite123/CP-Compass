import React, { Component } from "react";
import { withRouter, Route, Redirect } from "react-router-dom";
import Signup from './Signup';
import ConfirmEmail from './ConfirmVerification';
import VerifyEmail from './VerifyEmail';
import AuthNav from '#/components/AuthNav';
import './style.scss';

class Register extends Component {
  render() {
    const { match } = this.props;
    const { path } = match;

    return (
      <div className="register">
        <AuthNav />
        <Route exact path={path}>
          <Redirect to={`${path}/signup`} />
        </Route>
        <Route path={`${path}/signup`}>
          <Signup />
        </Route>
        <Route path={`${path}/confirm-email`}>
          <ConfirmEmail />
        </Route>
        <Route path={`${path}/:email/verify-email/:token`}>
          <VerifyEmail />
        </Route>
        {/* <Route path={`${path}/*`}>
          <Redirect to={`${path}/signup`} />
        </Route> */}
      </div>
    )
  }
}

export default withRouter(Register);
