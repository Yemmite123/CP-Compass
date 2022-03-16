import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { persistor } from "#/store";
import { PersistGate } from "redux-persist/integration/react";
import NotFound from '#/components/NotFound';
import NavigationListener from '#/components/NavigationListener'
import Preloader from '#/components/Preloader';
import Register from '#/pages/Register';
import Login from '#/pages/Login/Signin';
import ForgotPassword from '#/pages/Login/ForgotPassword';
import ForgotPasswordConfirmation from '#/pages/Login/ForgotPasswordConfirmation';
import NewPassword from '#/pages/Login/NewPassword';
import EventComponent from './components/EventComponent';
import './style/styles.scss';
import PasswordLinkExpired from './pages/Login/PasswordLinkExpired';

const App = ({ authorized, isStaff }) => {

  return (
    <PersistGate persistor={persistor} loading={null}>
      <Router>
        <NavigationListener />
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route path="/forgot-password-confirmation">
            <ForgotPasswordConfirmation />
          </Route>
          <Route path="/reset-password/:token">
            <NewPassword />
          </Route>
          <Route path="/link-expired">
            <PasswordLinkExpired />
          </Route>
          <Route path="/app">
            {!authorized || isStaff ? (() => {
              if (window.location.href.includes("blog")) {
                window.sessionStorage.setItem("blogPost", window.location.href);
              }
              return <Redirect to="/login" />
            })()
              : <EventComponent Component={Preloader} />}
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </PersistGate>
  );
}

const mapStateToProps = (state) => {
  const {
    app: { profile: { userProfile: { data } } },
    user: { authorized, isStaff },
  } = state;
  return {
    data,
    authorized,
    isStaff,
  };
};

export default connect(mapStateToProps)(App);
