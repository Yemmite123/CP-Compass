import axios from 'axios';
import CONFIG from '#/config';
import * as actions from "./actionTypes";
import { logout, updateUser } from "#/store/user/actions";
import { showAlert } from '#/store/ui/actions';

const clear = () => {
  return {
    type: actions.CLEAR,
  }
}

const verifyIdentityRequest = () => {
  return {
    type: actions.VERIFY_IDENTITY_REQUEST,
  }
}

const verifyIdentityError = (message) => {
  return {
    type: actions.VERIFY_IDENTITY_ERROR,
    error: message,
  }
}

const verifyIdentitySuccess = (data) => {
  return {
    type: actions.VERIFY_IDENTITY_SUCCESS,
    data,
  }
}

const confirmIdentityRequest = () => {
  return {
    type: actions.CONFIRM_IDENTITY_REQUEST,
  }
}

const confirmIdentityError = (message) => {
  return {
    type: actions.CONFIRM_IDENTITY_ERROR,
    error: message,
  }
}

const confirmIdentitySuccess = (data) => {
  return {
    type: actions.CONFIRM_IDENTITY_SUCCESS,
    data,
  }
}

const submitOtpRequest = () => {
  return {
    type: actions.SUBMIT_OTP_REQUEST,
  }
}

const submitOtpError = (message) => {
  return {
    type: actions.SUBMIT_OTP_ERROR,
    error: message,
  }
}

const submitOtpSuccess = (data) => {
  return {
    type: actions.SUBMIT_OTP_SUCCESS,
    data,
  }
}

const submitPinRequest = () => {
  return {
    type: actions.SUBMIT_PIN_REQUEST,
  }
}

const submitPinError = (message) => {
  return {
    type: actions.SUBMIT_PIN_ERROR,
    error: message,
  }
}

const submitPinSuccess = (data) => {
  return {
    type: actions.SUBMIT_PIN_SUCCESS,
    data,
  }
}

export const verifyIdentity = (payload, history) => {
  return (dispatch, getState) => {
    dispatch(verifyIdentityRequest());

    const { token } = getState().user;

    axios.post(`${CONFIG.BASE_URL}/profile/bvn`, payload, {
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
          dispatch(verifyIdentitySuccess(response.data.data));
          history.push('/app/onboarding/confirm-identity');
        }
      })
      .catch(({ response }) => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 403].includes(response.status)) {
          return dispatch(verifyIdentityError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(verifyIdentityError('Oops! We did something wrong.'));
        }
        dispatch(verifyIdentityError('Oops! We did something wrong.'));
      })
  }
}

export const confirmIdentity = (payload, history) => {
  return (dispatch, getState) => {
    dispatch(confirmIdentityRequest());

    const { token } = getState().user;

    fetch(`${CONFIG.BASE_URL}/profile/bvn/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if ([200, 201].includes(response.status)) {
          response.json()
            .then(res => {
              dispatch(confirmIdentitySuccess(res));
              if (payload.manual === true) {
                setTimeout(() => dispatch(clear()), 4000)
                return setTimeout(() => history.push('/app/onboarding/transaction-identity'), 4000)
              }
              return history.push('/app/onboarding/otp');
            });
        }
        if ([400, 404].includes(response.status)) {
          response.json()
            .then(res => {
              !res.error && res.message && dispatch(showAlert({ type: 'error', message: res.message }))
              return dispatch(confirmIdentityError(res.error ? res.error : res.message));
            })
        }
        if ([403].includes(response.status)) {
          response.json()
            .then(res => {
              return dispatch(confirmIdentityError(res.message ? res.message : res.error));
            })
        }
        if ([401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response.status >= 500) {
          return dispatch(confirmIdentityError('Oops! We did something wrong.'));
        }
      })
      .catch(() => {
        return dispatch(confirmIdentityError('Oops! We did something wrong.'));
      })
  }
}

export const submitOtp = (payload, history) => {
  return (dispatch, getState) => {
    dispatch(submitOtpRequest());

    const { token } = getState().user;

    fetch(`${CONFIG.BASE_URL}/profile/bvn/token/confirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if ([200, 201].includes(response.status)) {
          response.json()
            .then(res => {
              dispatch(submitOtpSuccess(res));
              history.push('/app/onboarding/transaction-identity');
            });
        }
        if ([400, 404].includes(response.status)) {
          response.json()
            .then(res => {
              dispatch(submitOtpError(res.message ? res.message : res.error));
            })
        }
        if ([403].includes(response.status)) {
          response.json()
            .then(res => {
              dispatch(submitOtpError(res.message ? res.message : res.error));
            })
        }
        if ([401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response.status >= 500) {
          dispatch(submitOtpError('Oops! We did something wrong.'));
        }
      })
      .catch(() => {
        dispatch(submitOtpError('Oops! We did something wrong.'));
      })
  }
}

export const submitPin = (payload, history) => {
  return (dispatch, getState) => {
    dispatch(submitPinRequest());

    const { token } = getState().user;

    fetch(`${CONFIG.BASE_URL}/profile/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if ([200, 201].includes(response.status)) {
          response.json()
            .then(res => {
              dispatch(submitPinSuccess(res));
              history.push('/app/onboarding/complete');
            });
        }
        if ([400, 404].includes(response.status)) {
          response.json()
            .then(res => {
              dispatch(submitPinError(res.message ? res.message : res.error));
            })
        }
        if ([403].includes(response.status)) {
          response.json()
            .then(res => {
              dispatch(submitPinError(res.message ? res.message : res.error));
            })
        }
        if ([401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response.status >= 500) {
          dispatch(submitPinError('Oops! We did something wrong.'));
        }
      })
      .catch(() => {
        dispatch(submitPinError('Oops! We did something wrong.'));
      })
  }
}