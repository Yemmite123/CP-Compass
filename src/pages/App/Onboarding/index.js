import React, { Component } from "react";
import { connect } from 'react-redux';
import { withRouter, Route, Redirect, Switch } from "react-router-dom";
import Start from './Start';
import VerifyIdentity from './VerifyIdentity';
import ManualVerification from './VerifyIdentityManually';
import ConfirmIdentity from './ConfirmIdentity';
import OneTimePassword from './OneTimePassword';
import TransactionPin from './TransactionPin';
import Success from './Success';
import './style.scss';

class Onboarding extends Component {
  render() {
    const { path } = this.props.match;

    return (
      <div className="onboarding-page">
        <Switch>
          <Route exact path={path}>
            <Redirect to={`${path}/start`} />
          </Route>
          <Route path={`${path}/start`}>
            <Start />
          </Route>
          <Route path={`${path}/verify-identity`}>
            <VerifyIdentity />
          </Route>
          <Route path={`${path}/verify-identity-manually`}>
            <ManualVerification />
          </Route>
          <Route path={`${path}/confirm-identity`}>
            <ConfirmIdentity />
          </Route>
          <Route path={`${path}/otp`}>
            <OneTimePassword />
          </Route>
          <Route path={`${path}/transaction-identity`}>
            <TransactionPin />
          </Route>
          <Route path={`${path}/complete`}>
            <Success />
          </Route>
          <Route path={`${path}/*`}>
            <Redirect to={`${path}/start`} />
          </Route>
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = state => {
  // const { user } = state;
  // const { authorized, token } = user;

  return {
    // authorized,
    // token,
  }
}

const mapDispatchToProps = dispatch => {
return {
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Onboarding));
