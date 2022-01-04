import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import jwt_decode from "jwt-decode";
import { getRefreshToken } from '#/store/dashboard/actions';
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from '#/store/dashboard/actionTypes';

class EventComponent extends React.Component {

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {
    event.preventDefault();
    const { token, loading } = this.props;
    const decoded = jwt_decode(token);

    const expTime = new Date(decoded.exp  * 1000);
    const currentTime = new Date();
    var DifferenceInTime = expTime.getTime() - currentTime.getTime();
    if(Math.floor(DifferenceInTime / 60000) < 5 && !loading) {
      return this.props.getRefreshToken();
    }
  }

  render() {
    const { Component } = this.props;

    return (
      <Component page="App" {...this.props} />
    )
  }
}

const mapStateToProps = (state) => {
  const { 
    user: { token }
  } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_REFRESH_TOKEN_REQUEST),
    token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getRefreshToken: () => dispatch(getRefreshToken()),
  };
};
export default React.memo(withRouter(connect(mapStateToProps, mapDispatchToProps)(EventComponent)));
