import axios from 'axios';
import CONFIG from '#/config';
import * as actions from "./actionTypes";
import { logout, updateUser } from "#/store/user/actions";
import { showAlert } from '#/store/ui/actions';

const clearData = () => {
  return {
    type: actions.CLEAR_DATA,
  }
}

const clearError = () => {
  return {
    type: actions.CLEAR_ERROR,
  }
}

const depositFundsRequest = () => {
  return {
    type: actions.DEPOSIT_REQUEST,
  }
}

const depositFundsError = (message) => {
  return {
    type: actions.DEPOSIT_ERROR,
    error: message,
  }
}

const depositFundsSuccess = (data) => {
  return {
    type: actions.DEPOSIT_SUCCESS,
    data,
  }
}

export const depositFunds = (payload) => {
  return (dispatch, getState) => {
    dispatch(depositFundsRequest());

    const { token } = getState().user;

    axios.post(`${CONFIG.BASE_URL}/payment/initialize`, payload, {
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
          dispatch(showAlert({ type: 'success', message: response.data?.message, noBtn: true }))
          dispatch(depositFundsSuccess(response.data));
          dispatch(getWalletDetails());
          // getUserProfile();
          window.location = response.data.data?.authorization_url;
        }
      })
      .catch(({ response }) => {
        response.headers?.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 403, 404, 422, 403].includes(response.status)) {
          dispatch(depositFundsError(response.data.error ? response.data.error : response.data.message));
          return setTimeout(() => dispatch(clearError()), 2000)
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(depositFundsError('Oops! We did something wrong.'));
        }
        return dispatch(depositFundsError('Oops! We did something wrong.'));
      })
  }
}

//fetch all user's cards
const getCardsRequest = () => {
  return {
    type: actions.GET_ALL_CARDS_REQUEST,
  }
}

const getCardsError = (message) => {
  return {
    type: actions.GET_ALL_CARDS_ERROR,
    error: message,
  }
}

const getCardsSuccess = (data) => {
  return {
    type: actions.GET_ALL_CARDS_SUCCESS,
    data,
  }
}

export const getCards = () => {
  return (dispatch, getState) => {
    dispatch(getCardsRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/payment/cards`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
        response.headers?.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        dispatch(getCardsSuccess(response.data));
      })
      .catch(({ response }) => {
        response && response?.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404].includes(response.status)) {
          return dispatch(getCardsError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(getCardsError('Oops! We did something wrong.'));
        }
        return dispatch(getCardsError('Oops! We did something wrong.'));
      })
  }
}

//fetch user's wallet details
const getWalletDetailsRequest = () => {
  return {
    type: actions.GET_WALLET_DETAILS_REQUEST,
  }
}

const getWalletDetailsError = (message) => {
  return {
    type: actions.GET_WALLET_DETAILS_ERROR,
    error: message,
  }
}

const getWalletDetailsSuccess = (data) => {
  return {
    type: actions.GET_WALLET_DETAILS_SUCCESS,
    data,
  }
}

export const getWalletDetails = () => {
  return (dispatch, getState) => {
    dispatch(getWalletDetailsRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/users/wallets`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
        response.headers?.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        dispatch(getWalletDetailsSuccess(response.data));
      })
      .catch(({ response }) => {
        response && response?.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404].includes(response.status)) {
          return dispatch(getWalletDetailsError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(getWalletDetailsError('Oops! We did something wrong.'));
        }
        return dispatch(getWalletDetailsError('Oops! We did something wrong.'));
      })
  }
}

//deposit funds with existing card
const depositFundsCardRequest = () => {
  return {
    type: actions.DEPOSIT_CARD_REQUEST,
  }
}

const depositFundsCardError = (message) => {
  return {
    type: actions.DEPOSIT_CARD_ERROR,
    error: message,
  }
}

const depositFundsCardSuccess = (data) => {
  return {
    type: actions.DEPOSIT_CARD_SUCCESS,
    data,
  }
}

export const depositFundsCard = (payload, history) => {
  return (dispatch, getState) => {
    dispatch(depositFundsCardRequest());

    const { token } = getState().user;

    axios.post(`${CONFIG.BASE_URL}/payment/charge-card`, payload, {
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
          dispatch(depositFundsCardSuccess(response.data));
          dispatch(showAlert({ type: 'success', message: response.data?.message, noBtn: true }));
          setTimeout(() => getWalletDetails()(dispatch, getState), 4000);
          setTimeout(() => history.push('/app/wallet'), 3000);
        }
      })
      .catch(({ response }) => {
        response.headers?.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(depositFundsCardError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(depositFundsCardError('Oops! We did something wrong.'));
        }
        return dispatch(depositFundsCardError('Oops! We did something wrong.'));
      })
  }
}

//initialize Withdrawal from wallet
const initializeWithdrawRequest = () => {
  return {
    type: actions.INITIALIZE_WITHDRAWAL_REQUEST,
  }
}

const initializeWithdrawError = (message) => {
  return {
    type: actions.INITIALIZE_WITHDRAWAL_ERROR,
    error: message,
  }
}

const initializeWithdrawSuccess = (data) => {
  return {
    type: actions.INITIALIZE_WITHDRAWAL_SUCCESS,
    data,
  }
}

export const initializeWithdraw = (payload) => {
  return (dispatch, getState) => {
    dispatch(initializeWithdrawRequest());

    const { token } = getState().user;

    return new Promise((resolve) => {
      axios.post(`${CONFIG.BASE_URL}/users/initialize-withdrawal`, payload, {
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
            resolve(response.data.data)
            
            return dispatch(initializeWithdrawSuccess(response.data));
          }
        })
        .catch(({ response }) => {
          response && response?.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if (response && [400, 404, 422, 403].includes(response.status)) {
            dispatch(initializeWithdrawError(response.data.error ? response.data.error : response.data.message));
            return setTimeout(() => dispatch(clearError()), 3000)
          }

          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && response.status >= 500) {
            return dispatch(initializeWithdrawError('Oops! We did something wrong.'));
          }
          return dispatch(initializeWithdrawError('Oops! We did something wrong.'));
        })
    })
  }
}

//initialize Withdrawal from wallet
const confirmWithdrawRequest = () => {
  return {
    type: actions.CONFIRM_WITHDRAWAL_REQUEST,
  }
}

const confirmWithdrawError = (message) => {
  return {
    type: actions.CONFIRM_WITHDRAWAL_ERROR,
    error: message,
  }
}

const confirmWithdrawSuccess = (data) => {
  return {
    type: actions.CONFIRM_WITHDRAWAL_SUCCESS,
    data,
  }
}

export const confirmWithdraw = (payload, history) => {
  return (dispatch, getState) => {
    dispatch(confirmWithdrawRequest());

    const { token } = getState().user;

    axios.post(`${CONFIG.BASE_URL}/users/confirm-withdrawal`, payload, {
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
          dispatch(confirmWithdrawSuccess(response.data));
          setTimeout(() => getWalletDetails()(dispatch, getState), 4000);

          return setTimeout(() => {
            dispatch(clearData())
            history.push('/app/wallet')
          }, 2000)
        }
      })
      .catch(({ response }) => {
        response && response?.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(confirmWithdrawError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(confirmWithdrawError('Oops! We did something wrong.'));
        }
        return dispatch(confirmWithdrawError('Oops! We did something wrong.'));
      })
  }
}

//get transaction history
const getTransactionHistoryRequest = () => {
  return {
    type: actions.GET_TRANSACTION_HISTORY_REQUEST,
  }
}

const getTransactionHistoryError = (message) => {
  return {
    type: actions.GET_TRANSACTION_HISTORY_ERROR,
    error: message,
  }
}

const getTransactionHistorySuccess = (data) => {
  return {
    type: actions.GET_TRANSACTION_HISTORY_SUCCESS,
    data,
  }
}

export const getTransactionHistory = (limit, pageNumber) => {
  return (dispatch, getState) => {
    dispatch(getTransactionHistoryRequest());

    const { token } = getState().user;
    return new Promise((resolve) => {
      axios.get(`${CONFIG.BASE_URL}/users/transactions?limit=${limit}&page=${pageNumber}`, {
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
            resolve(response.data?.data);
            return dispatch(getTransactionHistorySuccess(response.data));
          }
        })
        .catch(({ response }) => {
          response && response?.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if (response && [400, 404, 422, 403].includes(response.status)) {
            return dispatch(getTransactionHistoryError(response.data.error ? response.data.error : response.data.message));
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && response.status >= 500) {
            return dispatch(getTransactionHistoryError('Oops! We did something wrong.'));
          }
          return dispatch(getTransactionHistoryError('Oops! We did something wrong.'));
        })
    })
  }
}