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

const getActivePpiRequest = () => {
  return {
    type: actions.GET_ACTIVE_PPI_REQUEST,
  }
}

const getActivePpiError = (message) => {
  return {
    type: actions.GET_ACTIVE_PPI_ERROR,
    error: message,
  }
}

const getActivePpiSuccess = (data) => {
  return {
    type: actions.GET_ACTIVE_PPI_SUCCESS,
    data,
  }
}

export const getActivePpi = (page, limit) => {
  return (dispatch, getState) => {
    dispatch(getActivePpiRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/mutual-funds?limit=${limit}&page=${page}`, {
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
          dispatch(getActivePpiSuccess(response.data.data));
        }
      })
      .catch((error) => {
        error.response && error.response.headers.authorization && dispatch(updateUser({
          token: error.response.headers.authorization
        }))
        if (error.response && [400, 404, 403].includes(error.response.status)) {
          return dispatch(getActivePpiError(error.response.data.error ? error.response.data.error : error.response.data.message));
        }
        if (error.response && [401].includes(error.response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (error.response && error.response.status >= 500) {
          return dispatch(getActivePpiError('Oops! We did something wrong.'));
        }
        dispatch(getActivePpiError('Oops! We did something wrong.'));
      })
  }
}

const getSinglePpiRequest = () => {
  return {
    type: actions.GET_SINGLE_PPI_REQUEST,
  }
}

const getSinglePpiError = (message) => {
  return {
    type: actions.GET_SINGLE_PPI_ERROR,
    error: message,
  }
}

const getSinglePpiSuccess = (data) => {
  return {
    type: actions.GET_SINGLE_PPI_SUCCESS,
    data,
  }
}

export const getSinglePpi = (slug) => {
  return (dispatch, getState) => {
    dispatch(getSinglePpiRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/mutual-funds/${slug}`, {
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
          dispatch(getSinglePpiSuccess(response.data.data));
        }
      })
      .catch((error) => {
        error.response && error.response.headers.authorization && dispatch(updateUser({
          token: error.response.headers.authorization
        }))
        if (error.response && [400, 404, 403].includes(error.response.status)) {
          return dispatch(getSinglePpiError(error.response.data.error ? error.response.data.error : error.response.data.message));
        }
        if (error.response && [401].includes(error.response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (error.response && error.response.status >= 500) {
          return dispatch(getSinglePpiError('Oops! We did something wrong.'));
        }
        dispatch(getSinglePpiError('Oops! We did something wrong.'));
      })
  }
}

const submitMutualFormRequest = () => {
  return {
    type: actions.SUBMIT_MUTUAL_FORM_REQUEST,
  }
}

const submitMutualFormError = (message) => {
  return {
    type: actions.SUBMIT_MUTUAL_FORM_ERROR,
    error: message,
  }
}

const submitMutualFormSuccess = (data) => {
  return {
    type: actions.SUBMIT_MUTUAL_FORM_SUCCESS,
    data,
  }
}

export const submitMutualForm = (slug, payload) => {
  return (dispatch, getState) => {
    dispatch(submitMutualFormRequest());

    const { token } = getState().user;

    return new Promise(resolve => {
      axios.post(`${CONFIG.BASE_URL}/mutual-funds/${slug}/subscribe`, payload, {
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
            dispatch(submitMutualFormSuccess(response.data.data));
            dispatch(showAlert({ type: 'success', message: response.data.message }))
            resolve();
          }
        })
        .catch((error) => {
          error.response && error.response.headers.authorization && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 404, 403].includes(error.response.status)) {
            dispatch(submitMutualFormError(error.response.data.error ? error.response.data.error : error.response.data.message));
            return setTimeout(() => dispatch(clearError()), 3000);

          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            return dispatch(submitMutualFormError('Oops! We did something wrong.'));
          }
          dispatch(submitMutualFormError('Oops! We did something wrong.'));
        })
    })
  }
}

const sendFormToMailRequest = () => {
  return {
    type: actions.SEND_FORM_TO_EMAIL_REQUEST,
  }
}

const sendFormToMailError = (message) => {
  return {
    type: actions.SEND_FORM_TO_EMAIL_ERROR,
    error: message,
  }
}

const sendFormToMailSuccess = (data) => {
  return {
    type: actions.SEND_FORM_TO_EMAIL_SUCCESS,
    data,
  }
}

export const sendFormToMail = (slug) => {
  return (dispatch, getState) => {
    dispatch(sendFormToMailRequest());

    const { token } = getState().user;

    return new Promise(resolve => {
      axios.get(`${CONFIG.BASE_URL}/mutual-funds/${slug}/download`, {
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
            dispatch(sendFormToMailSuccess(response.data.data));
            dispatch(showAlert({ type: 'success', message: response.data.message }))
            resolve(response.data.data);
          }
        })
        .catch((error) => {
          error.response && error.response.headers.authorization && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 404, 403].includes(error.response.status)) {
            return dispatch(sendFormToMailError(error.response.data.error ? error.response.data.error : error.response.data.message));
          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            return dispatch(sendFormToMailError('Oops! We did something wrong.'));
          }
          dispatch(sendFormToMailError('Oops! We did something wrong.'));
        })
    })
  }
}