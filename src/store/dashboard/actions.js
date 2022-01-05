import axios from 'axios';
import CONFIG from '#/config';
import * as actions from "./actionTypes";
import { logout, updateUser } from "#/store/user/actions";
import { showAlert } from '#/store/ui/actions';


const getDashboardInfoRequest = () => {
  return {
    type: actions.GET_DASHBOARD_INFO_REQUEST,
  }
}

const getDashboardInfoError = (message) => {
  return {
    type: actions.GET_DASHBOARD_INFO_ERROR,
    error: message,
  }
}

const getDashboardInfoSuccess = (data) => {
  return {
    type: actions.GET_DASHBOARD_INFO_SUCCESS,
    data,
  }
}

export const getDashboardInfo = () => {
  return (dispatch, getState) => {
    dispatch(getDashboardInfoRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/users/dashboard`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        dispatch(getDashboardInfoSuccess(response.data));
      })
      .catch(({ response }) => {
        response && response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(getDashboardInfoError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(getDashboardInfoError('Oops! We did something wrong.'));
        }
        return dispatch(getDashboardInfoError('Oops! We did something wrong.'));
      })
  }
}

const getRefreshTokenRequest = () => {
  return {
    type: actions.GET_REFRESH_TOKEN_REQUEST,
  }
}

const getRefreshTokenError = (message) => {
  return {
    type: actions.GET_REFRESH_TOKEN_ERROR,
    error: message,
  }
}

const getRefreshTokenSuccess = (data) => {
  return {
    type: actions.GET_REFRESH_TOKEN_SUCCESS,
    data,
  }
}

export const getRefreshToken = () => {
  return (dispatch, getState) => {
    dispatch(getRefreshTokenRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/auth/refresh-token`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        dispatch(getRefreshTokenSuccess(response.data));
      })
      .catch(({ response }) => {
        response && response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(getRefreshTokenError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(getRefreshTokenError('Oops! We did something wrong.'));
        }
        return dispatch(getRefreshTokenError('Oops! We did something wrong.'));
      })
  }
}