
import axios from 'axios';
import CONFIG from '#/config';
import * as actions from "./actionTypes";
import { logout, updateUser } from "#/store/user/actions";
import { showAlert } from '#/store/ui/actions';

const getSystemCinfigRequest = () => {
  return {
    type: actions.GET_SYSTEM_CONFIG_REQUEST,
  }
}

const getSystemCinfigError = (message) => {
  return {
    type: actions.GET_SYSTEM_CONFIG_ERROR,
    error: message,
  }
}

const getSystemCinfigSuccess = (data) => {
  return {
    type: actions.GET_SYSTEM_CONFIG_SUCCESS,
    data,
  }
}

export const getSystemCinfig = (payload, history) => {
  return (dispatch, getState) => {
    dispatch(getSystemCinfigRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/users/configurations`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
    .then(response => {
         response.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
      if ([200, 201].includes(response.status)) {
        dispatch(getSystemCinfigSuccess(response.data.data));
      }
    })
    .catch(({ response }) => {
         response && response.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
      if (response && [400, 404, 403].includes(response.status)) {
        return dispatch(getSystemCinfigError(response.data.error ? response.data.error : response.data.message));
      }
      if (response && [401].includes(response.status)) {
        dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
        return setTimeout(() => dispatch(logout()), 2000) 
      }
      if (response && response.status >= 500) {
        return dispatch(getSystemCinfigError('Oops! We did something wrong.'));
      }
      dispatch(getSystemCinfigError('Oops! We did something wrong.'));
    })
  }
}