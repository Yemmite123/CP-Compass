import axios from 'axios';
import CONFIG from '#/config';
import * as actions from "./actionTypes";
import { logout, updateUser } from "#/store/user/actions";
import { fetchSingleInvestment } from "#/store/portfolio/actions"
import { showAlert } from '#/store/ui/actions';

const clearError = () => {
  return {
    type: actions.CLEAR_ERROR,
  }
}

const getTermedInvestmentsRequest = () => {
  return {
    type: actions.GET_ALL_INVESTMENTS_REQUEST,
  }
}

const getTermedInvestmentsrror = (message) => {
  return {
    type: actions.GET_ALL_INVESTMENTS_ERROR,
    error: message,
  }
}

const getTermedInvestmentsSuccess = (data) => {
  return {
    type: actions.GET_ALL_INVESTMENTS_SUCCESS,
    data,
  }
}

export const getTermedInvestments = () => {
  return (dispatch, getState) => {
    dispatch(getTermedInvestmentsRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/services/termed/investments?limit=40&page=1`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        dispatch(getTermedInvestmentsSuccess(response.data));
      })
      .catch(({ response }) => {
        response && response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(getTermedInvestmentsrror(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(getTermedInvestmentsrror('Oops! We did something wrong.'));
        }
        return dispatch(getTermedInvestmentsrror('Oops! We did something wrong.'));
      })
  }
}


const getInvestmentDetailsRequest = () => {
  return {
    type: actions.GET_INVESTMENT_DETAILS_REQUEST,
  }
}

const getInvestmentDetailsError = (message) => {
  return {
    type: actions.GET_INVESTMENT_DETAILS_ERROR,
    error: message,
  }
}

const getInvestmentDetailsSuccess = (data) => {
  return {
    type: actions.GET_INVESTMENT_DETAILS_SUCCESS,
    data,
  }
}

export const getInvestmentDetails = (id) => {
  return (dispatch, getState) => {
    dispatch(getInvestmentDetailsRequest());

    const { token } = getState().user;
    axios.get(`${CONFIG.BASE_URL}/services/${id}/investments`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        dispatch(getInvestmentDetailsSuccess(response.data));
      })
      .catch(({ response }) => {
        response && response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(getInvestmentDetailsError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(getInvestmentDetailsError('Oops! We did something wrong.'));
        }
        return dispatch(getInvestmentDetailsError('Oops! We did something wrong.'));
      })
  }
}

//book new investment
const bookNewInvestmentRequest = () => {
  return {
    type: actions.BOOK_NEW_INVESTMENT_REQUEST,
  }
}

const bookNewInvestmentError = (message) => {
  return {
    type: actions.BOOK_NEW_INVESTMENT_ERROR,
    error: message,
  }
}

const bookNewInvestmentSuccess = (data) => {
  return {
    type: actions.BOOK_NEW_INVESTMENT_SUCCESS,
    data,
  }
}

export const bookNewInvestment = (data) => {
  return (dispatch, getState) => {
    dispatch(bookNewInvestmentRequest());
    const { type, payload, id } = data;
    const { token } = getState().user;

    return new Promise((resolve) => {
      axios.post(`${CONFIG.BASE_URL}/services/${id}/${type}/orders`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
          response.headers?.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(bookNewInvestmentSuccess(response.data));
          resolve(response.data.data)
        })
        .catch((error) => {
          error.response && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 404, 422, 403].includes(error.response.status)) {
            setTimeout(() => dispatch(clearError()), 5000)
            return dispatch(bookNewInvestmentError(error.response.data.error ? error.response.data.error : error.response.data.message));
          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            dispatch(bookNewInvestmentError('Oops! We did something wrong.'));
            return setTimeout(() => dispatch(clearError()), 5000)
          }
          dispatch(bookNewInvestmentError('Oops! We did something wrong.'));
          return setTimeout(() => dispatch(clearError()), 5000)
        })
    })
  }
}

//book new investment with payment
const bookInvestmentWithPayRequest = () => {
  return {
    type: actions.BOOK_INVESTMENT_WITH_PAY_REQUEST,
  }
}

const bookInvestmentWithPayError = (message) => {
  return {
    type: actions.BOOK_INVESTMENT_WITH_PAY_ERROR,
    error: message,
  }
}

const bookInvestmentWithPaySuccess = (data) => {
  return {
    type: actions.BOOK_INVESTMENT_WITH_PAY_SUCCESS,
    data,
  }
}

export const bookInvestmentWithPay = (data) => {
  return (dispatch, getState) => {
    dispatch(bookInvestmentWithPayRequest());
    const { type, payload, id } = data;
    const { token } = getState().user;

    return new Promise((resolve) => {
      axios.post(`${CONFIG.BASE_URL}/services/${id}/${type}/investment/pay`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
          response.headers?.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(bookInvestmentWithPaySuccess(response.data));
          resolve(response.data.data)
          if (response.data.data?.order?.investment.authorization_url) {
            return window.location = response.data.data.order.investment.authorization_url;
          }
        })
        .catch(({ response }) => {
          response && response?.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if (response && [400, 404, 422, 403].includes(response.status)) {
            dispatch(bookInvestmentWithPayError(response.data.error ? response.data.error : response.data.message));
            return setTimeout(() => dispatch(clearError()), 5000)
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && response.status >= 500) {
            dispatch(bookInvestmentWithPayError('Oops! We did something wrong.'));
            return setTimeout(() => dispatch(clearError()), 5000)
          }
          dispatch(bookInvestmentWithPayError('Oops! We did something wrong.'));
          return setTimeout(() => dispatch(clearError()), 5000)
        })
    })
  }
}


//LIQUIDATE investment
const liquidateInvestmentRequest = () => {
  return {
    type: actions.LIQUIDATE_INVESTMENT_REQUEST,
  }
}

const liquidateInvestmentError = (message) => {
  return {
    type: actions.LIQUIDATE_INVESTMENT_ERROR,
    error: message,
  }
}

const liquidateInvestmentSuccess = (data) => {
  return {
    type: actions.LIQUIDATE_INVESTMENT_SUCCESS,
    data,
  }
}

export const liquidateInvestment = (id, payload) => {
  return (dispatch, getState) => {
    dispatch(liquidateInvestmentRequest());
    const { token } = getState().user;

    return new Promise((resolve) => {
      axios.post(`${CONFIG.BASE_URL}/services/investments/${id}/terminate`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
          response.headers?.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(liquidateInvestmentSuccess(response.data));
          dispatch(showAlert({ type: 'success', message: response.data?.message }))
          setTimeout(() => fetchSingleInvestment(id)(dispatch, getState), 4000);
          resolve(response.data.data)
        })
        .catch(({ response }) => {
          response && response?.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if (response && [400, 404, 422, 403].includes(response.status)) {
            dispatch(liquidateInvestmentError(response.data.error ? response.data.error : response.data.message));
            return setTimeout(() => dispatch(clearError()), 5000)
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && response.status >= 500) {
            return dispatch(liquidateInvestmentError('Oops! We did something wrong.'));
          }
          return dispatch(liquidateInvestmentError('Oops! We did something wrong.'));
        })
    })
  }
}

//LIQUIDATION DETAILS investment
const getLiquidationDetailsRequest = () => {
  return {
    type: actions.GET_LIQUIDATION_DETAILS_REQUEST,
  }
}

const getLiquidationDetailsError = (message) => {
  return {
    type: actions.GET_LIQUIDATION_DETAILS_ERROR,
    error: message,
  }
}

const getLiquidationDetailsSuccess = (data) => {
  return {
    type: actions.GET_LIQUIDATION_DETAILS_SUCCESS,
    data,
  }
}

export const getLiquidationDetails = (payload) => {
  return (dispatch, getState) => {
    dispatch(getLiquidationDetailsRequest());
    const { token } = getState().user;

    return new Promise((resolve) => {
      axios.post(`${CONFIG.BASE_URL}/services/investments/liquidation-details`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
          response.headers?.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(getLiquidationDetailsSuccess(response.data));
          resolve(response.data.data)
        })
        .catch(({ response }) => {
          response && response?.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if (response && [400, 404, 422, 403].includes(response.status)) {
            dispatch(getLiquidationDetailsError(response.data.error ? response.data.error : response.data.message));
            return setTimeout(() => dispatch(clearError()), 5000)
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && response.status >= 500) {
            return dispatch(getLiquidationDetailsError('Oops! We did something wrong.'));
          }
          return dispatch(getLiquidationDetailsError('Oops! We did something wrong.'));
        })
    })
  }
}


//get recommended investments
const getRecommendedInvestmentsRequest = () => {
  return {
    type: actions.GET_RECOMMENDED_INVESTMENTS_REQUEST,
  }
}

const getRecommendedInvestmentsError = (message) => {
  return {
    type: actions.GET_RECOMMENDED_INVESTMENTS_ERROR,
    error: message,
  }
}

const getRecommendedInvestmentsSuccess = (data) => {
  return {
    type: actions.GET_RECOMMENDED_INVESTMENTS_SUCCESS,
    data,
  }
}

export const getRecommendedInvestments = (id, payload) => {
  return (dispatch, getState) => {
    dispatch(getRecommendedInvestmentsRequest());
    const { token } = getState().user;

    return new Promise((resolve) => {
      axios.get(`${CONFIG.BASE_URL}/segments/recommendations`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
          response.headers?.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(getRecommendedInvestmentsSuccess(response.data));
          resolve(response.data.data)
        })
        .catch(({ response }) => {
          response && response?.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if (response && [400, 404, 422, 403].includes(response.status)) {
            return dispatch(getRecommendedInvestmentsError(response.data.error ? response.data.error : response.data.message));
            // return setTimeout(() => dispatch(clearError()), 5000)
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && response.status >= 500) {
            return dispatch(getRecommendedInvestmentsError('Oops! We did something wrong.'));
          }
          return dispatch(getRecommendedInvestmentsError('Oops! We did something wrong.'));
        })
    })
  }
}

//CALCULATE investment
const calculateInvestmentRequest = () => {
  return {
    type: actions.CALCULATE_INVESTMENT_REQUEST,
  }
}

const calculateInvestmentError = (message) => {
  return {
    type: actions.CALCULATE_INVESTMENT_ERROR,
    error: message,
  }
}

const calculateInvestmentSuccess = (data) => {
  return {
    type: actions.CALCULATE_INVESTMENT_SUCCESS,
    data,
  }
}

export const calculateInvestment = (payload) => {
  return (dispatch, getState) => {
    dispatch(calculateInvestmentRequest());
    const { token } = getState().user;

    return new Promise((resolve) => {
      axios.post(`${CONFIG.BASE_URL}/services/investments/calculator`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
          response.headers?.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(calculateInvestmentSuccess(response.data));
          resolve(response.data.data)
        })
        .catch(({ response }) => {
          response && response?.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if (response && [400, 404, 422, 403].includes(response.status)) {
            dispatch(calculateInvestmentError(response.data.error ? response.data.error : response.data.message));
            return setTimeout(() => dispatch(clearError()), 5000)
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && response.status >= 500) {
            dispatch(calculateInvestmentError('Oops! We did something wrong.'));
            return setTimeout(() => dispatch(clearError()), 5000)
          }
          dispatch(calculateInvestmentError('Oops! We did something wrong.'));
          return setTimeout(() => dispatch(clearError()), 5000)
        })
    })
  }
}

//CALCULATE investment
const disableAutochargeRequest = () => {
  return {
    type: actions.DISABLE_AUTOCHARGE_REQUEST,
  }
}

const disableAutochargeError = (message) => {
  return {
    type: actions.DISABLE_AUTOCHARGE_ERROR,
    error: message,
  }
}

const disableAutochargeSuccess = (data) => {
  return {
    type: actions.DISABLE_AUTOCHARGE_SUCCESS,
    data,
  }
}

export const disableAutocharge = (id) => {
  return (dispatch, getState) => {
    dispatch(disableAutochargeRequest());
    const { token } = getState().user;

    return new Promise((resolve) => {
      axios.put(`${CONFIG.BASE_URL}/services/investments/${id}/disable-autocharge`, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
          response.headers?.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(showAlert({ type: 'success', message: response.data.message }))
          dispatch(disableAutochargeSuccess(response.data));

          setTimeout(() => fetchSingleInvestment(id)(dispatch, getState), 4000);
          resolve(response.data.data)
        })
        .catch(({ response }) => {
          response && response?.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if (response && [400, 404, 422, 403].includes(response.status)) {
            dispatch(disableAutochargeError(response.data.error ? response.data.error : response.data.message));
            return setTimeout(() => dispatch(clearError()), 5000)
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && response.status >= 500) {
            return dispatch(disableAutochargeError('Oops! We did something wrong.'));
          }
          return dispatch(disableAutochargeError('Oops! We did something wrong.'));
        })
    })
  }
}