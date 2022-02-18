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

const fetchPortfolioRequest = () => {
  return {
    type: actions.FETCH_PORTFOLIO_REQUEST,
  }
}

const fetchPortfolioError = (message) => {
  return {
    type: actions.FETCH_PORTFOLIO_ERROR,
    error: message,
  }
}

const fetchPortfolioSuccess = (data) => {
  return {
    type: actions.FETCH_PORTFOLIO_SUCCESS,
    data,
  }
}

export const fetchPortfolio = (status) => {
  return (dispatch, getState) => {
    dispatch(fetchPortfolioRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/services/portfolio/termed/${status}`, {
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
          dispatch(fetchPortfolioSuccess(response.data.data));
        }
      })
      .catch((error) => {
        error.response && error.response.headers.authorization && dispatch(updateUser({
          token: error.response.headers.authorization
        }))
        if (error.response && [400, 404, 403, 402].includes(error.response.status)) {
          return dispatch(fetchPortfolioError(error.response.data.error ? error.response.data.error : error.response.data.message));
        }
        if (error.response && [401].includes(error.response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (error.response && error.response.status >= 500) {
          return dispatch(fetchPortfolioError('Oops! We did something wrong.'));
        }
        dispatch(fetchPortfolioError('Oops! We did something wrong.'));
      })
  }
}

//fetch single investment
const fetchSingleInvestmentRequest = () => {
  return {
    type: actions.FETCH_SINGLE_INVESTMENT_REQUEST,
  }
}

const fetchSingleInvestmentError = (message) => {
  return {
    type: actions.FETCH_SINGLE_INVESTMENT_ERROR,
    error: message,
  }
}

const fetchSingleInvestmentSuccess = (data) => {
  return {
    type: actions.FETCH_SINGLE_INVESTMENT_SUCCESS,
    data,
  }
}

export const fetchSingleInvestment = (id) => {
  return (dispatch, getState) => {
    dispatch(fetchSingleInvestmentRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/services/investments/${id}`, {
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
          dispatch(fetchSingleInvestmentSuccess(response.data.data));
        }
      })
      .catch((error) => {
        error.response && error.response.headers.authorization && dispatch(updateUser({
          token: error.response.headers.authorization
        }))
        if (error.response && [400, 403].includes(error.response.status)) {
          return dispatch(fetchSingleInvestmentError(error.response.data.error ? error.response.data.error : error.response.data.message));
        }
        if (error.response && [404].includes(error.response.status)) {
          dispatch(showAlert({ type: 'error', message: error.response.data.message }))
          return dispatch(fetchSingleInvestmentError(error.response.data.error ? error.response.data.error : error.response.data.message));
        }
        if (error.response && [401].includes(error.response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (error.response && error.response.status >= 500) {
          return dispatch(fetchSingleInvestmentError('Oops! We did something wrong.'));
        }
        dispatch(fetchSingleInvestmentError('Oops! We did something wrong.'));
      })
  }
}

const editInvestmentRequest = () => {
  return {
    type: actions.EDIT_INVESTMENT_REQUEST,
  }
}

const editInvestmentError = (message) => {
  return {
    type: actions.EDIT_INVESTMENT_ERROR,
    error: message,
  }
}

const editInvestmentSuccess = (data) => {
  return {
    type: actions.EDIT_INVESTMENT_SUCCESS,
    data,
  }
}

const editAmountInvestmentRequest = () => {
  return {
    type: actions.EDIT_AMOUNT_INVESTMENT_REQUEST,
  }
}

const editAmountInvestmentError = (message) => {
  return {
    type: actions.EDIT_AMOUNT_INVESTMENT_ERROR,
    error: message,
  }
}

const editAmountInvestmentSuccess = (data) => {
  return {
    type: actions.EDIT_AMOUNT_INVESTMENT_SUCCESS,
    data,
  }
}

export const editInvestmentAmount = (payload, type, id) => {
  return (dispatch, getState) => {
    dispatch(editAmountInvestmentRequest());

    const { token } = getState().user;
    return new Promise((resolve) => {

      axios.patch(`${CONFIG.BASE_URL}/services/${type}/plan/investments/${id}/payment-amount`, payload, {
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
            setTimeout(() => fetchSingleInvestment(id)(dispatch, getState), 4000);
            dispatch(editAmountInvestmentSuccess(response.data.data));
            resolve(response.data)
            if (response.data.data?.authorization_url) {
              return window.location = response.data.data.authorization_url;
            }
            return dispatch(showAlert({ type: 'success', message: response.data.message }))
          }
        })
        .catch((error) => {
          error.response && error.response.headers.authorization && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 422, 403].includes(error.response.status)) {
            dispatch(editAmountInvestmentError(error.response.data.error ? error.response.data.error : error.response.data.message));
            return setTimeout(() => dispatch(clearError()), 2000)
          }
          if (error.response && [404].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: error.response.data.message }))
            dispatch(editAmountInvestmentError(error.response.data.error ? error.response.data.error : error.response.data.message));
            return setTimeout(() => dispatch(clearError()), 2000)
          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            dispatch(editAmountInvestmentError('Oops! We did something wrong.'));
            return setTimeout(() => dispatch(clearError()), 2000)
          }
          dispatch(editAmountInvestmentError('Oops! We did something wrong.'));
          return setTimeout(() => dispatch(clearError()), 2000)
        })
    })
  }
}

export const editInvestment = (payload, type, id) => {
  return (dispatch, getState) => {
    dispatch(editInvestmentRequest());

    const { token } = getState().user;
    return new Promise((resolve) => {

      axios.put(`${CONFIG.BASE_URL}/services/${type}/plan/investments/${id}`, payload, {
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
            setTimeout(() => fetchSingleInvestment(id)(dispatch, getState), 4000);
            dispatch(editInvestmentSuccess(response.data.data));
            resolve(response.data)
            if (response.data.data?.authorization_url) {
              return window.location = response.data.data.authorization_url;
            }
            return dispatch(showAlert({ type: 'success', message: response.data.message }))
          }
        })
        .catch((error) => {
          error.response && error.response.headers.authorization && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 422, 403].includes(error.response.status)) {
            dispatch(editInvestmentError(error.response.data.error ? error.response.data.error : error.response.data.message));
            return setTimeout(() => dispatch(clearError()), 2000)
          }
          if (error.response && [404].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: error.response.data.message }))
            dispatch(editInvestmentError(error.response.data.error ? error.response.data.error : error.response.data.message));
            return setTimeout(() => dispatch(clearError()), 2000)
          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            dispatch(editInvestmentError('Oops! We did something wrong.'));
            return setTimeout(() => dispatch(clearError()), 2000)
          }
          dispatch(editInvestmentError('Oops! We did something wrong.'));
          return setTimeout(() => dispatch(clearError()), 2000)
        })
    })
  }
}

//topup single investment
const topUpInvestmentRequest = () => {
  return {
    type: actions.TOP_UP_INVESTMENT_REQUEST,
  }
}

const topUpInvestmentError = (message) => {
  return {
    type: actions.TOP_UP_INVESTMENT_ERROR,
    error: message,
  }
}

const topUpInvestmentSuccess = (data) => {
  return {
    type: actions.TOP_UP_INVESTMENT_SUCCESS,
    data,
  }
}

export const topUpInvestment = (payload, id) => {
  return (dispatch, getState) => {
    dispatch(topUpInvestmentRequest());

    const { token } = getState().user;
    return new Promise((resolve) => {

      axios.post(`${CONFIG.BASE_URL}/services/investments/${id}/top-up`, payload, {
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
            setTimeout(() => fetchSingleInvestment(id)(dispatch, getState), 4000);
            dispatch(topUpInvestmentSuccess(response.data.data));
            resolve(response.data)
            if (response.data.data?.authorization_url) {
              return window.location = response.data.data.authorization_url;
            }
            return dispatch(showAlert({ type: 'success', message: response.data.message }))
          }
        })
        .catch((error) => {
          error.response && error.response.headers.authorization && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 422, 403].includes(error.response.status)) {
            dispatch(topUpInvestmentError(error.response.data.error ? error.response.data.error : error.response.data.message));
            return setTimeout(() => dispatch(clearError()), 2000)
          }
          if (error.response && [404].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: error.response.data.message }))
            dispatch(topUpInvestmentError(error.response.data.error ? error.response.data.error : error.response.data.message));
            return setTimeout(() => dispatch(clearError()), 2000)
          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            dispatch(topUpInvestmentError('Oops! We did something wrong.'));
            return setTimeout(() => dispatch(clearError()), 2000)
          }
          dispatch(topUpInvestmentError('Oops! We did something wrong.'));
          return setTimeout(() => dispatch(clearError()), 2000)
        })
    })
  }
}