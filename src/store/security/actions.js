import axios from 'axios';
import CONFIG from '#/config';
import * as actions from "./actionTypes";
import { logout, updateUser } from "#/store/user/actions";
import { showAlert } from '#/store/ui/actions';


const clearError = () => {
  return {
    type: actions.CLEAR_ERROR,
  }
}

const clearData = () => {
  return {
    type: actions.CLEAR_DATA
  }
}

const confirmPinRequest = () => {
  return {
    type: actions.CONFIRM_PIN_REQUEST,
  }
}

const confirmPinError = (message) => {
  return {
    type: actions.CONFIRM_PIN_ERROR,
    error: message,
  }
}

const confirmPinSuccess = (data) => {
  return {
    type: actions.CONFIRM_PIN_SUCCESS,
    data,
  }
}

export const confirmPin = (payload) => {
  return (dispatch, getState) => {
    dispatch(confirmPinRequest());

    const { token } = getState().user;

    return new Promise((resolve) => {
      axios.post(`${CONFIG.BASE_URL}/profile/pin/confirm`, payload, {
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
            dispatch(confirmPinSuccess(response.data));
            resolve(response.data)
          }
        })
        .catch((error) => {
          error.response && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 404, 403].includes(error.response.status)) {
            dispatch(confirmPinError(error.response.data.error ? error.response.data.error : error.response.data.message));
            return setTimeout(() => dispatch(clearError()), 5000)
          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            dispatch(confirmPinError('Oops! We did something wrong.'));
            return setTimeout(() => dispatch(clearError()), 5000)
          }
          dispatch(confirmPinError('Oops! We did something wrong.'));
          return setTimeout(() => dispatch(clearError()), 5000)
        })
    })
  }
}

//CHANGE PASSWORD 
const changePasswordRequest = () => {
  return {
    type: actions.CHANGE_PASSWORD_REQUEST,
  }
}

const changePasswordError = (message) => {
  return {
    type: actions.CHANGE_PASSWORD_ERROR,
    error: message,
  }
}

const changePasswordSuccess = (data) => {
  return {
    type: actions.CHANGE_PASSWORD_SUCCESS,
    data,
  }
}

export const changePassword = (payload) => {
  return (dispatch, getState) => {
    dispatch(changePasswordRequest());

    const { token } = getState().user;

    axios.post(`${CONFIG.BASE_URL}/auth/password/change`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
       response.headers?.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if ([200, 201].includes(response.status)) {
          dispatch(changePasswordSuccess(response.data));
          setTimeout(() => dispatch(clearData()), 3000)
        }
      })
      .catch((error) => {
        error.response && dispatch(updateUser({
          token: error.response.headers.authorization
        }))
        if (error.response && [400, 404, 403].includes(error.response.status)) {
          dispatch(changePasswordError(error.response.data.error ? error.response.data.error : error.response.data.message));
          return setTimeout(() => dispatch(clearError()), 5000)
        }
        if (error.response && [401].includes(error.response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (error.response && error.response.status >= 500) {
          dispatch(changePasswordError('Oops! We did something wrong.'));
          return setTimeout(() => dispatch(clearError()), 5000)
        }
        dispatch(changePasswordError('Oops! We did something wrong.'));
        return setTimeout(() => dispatch(clearError()), 5000)
      })
  }
}