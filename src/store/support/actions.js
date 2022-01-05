import axios from 'axios';
import CONFIG from '#/config';
import * as actions from "./actionTypes";
import { logout, updateUser } from "#/store/user/actions";
import { showAlert } from '#/store/ui/actions';

const getTicketsRequest = () => {
  return {
    type: actions.GET_TICKETS_REQUEST,
  }
}

const getTicketsError = (message) => {
  return {
    type: actions.GET_TICKETS_ERROR,
    error: message,
  }
}

const getTicketsSuccess = (data) => {
  return {
    type: actions.GET_TICKETS_SUCCESS,
    data,
  }
}

export const getTickets = (limit, pageNumber) => {
  return (dispatch, getState) => {
    dispatch(getTicketsRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/users/tickets?limit=${limit}&page=${pageNumber}`, {
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
          dispatch(getTicketsSuccess(response.data.data));
        }
      })
      .catch((error) => {
        error.response && error.response.headers.authorization && dispatch(updateUser({
          token: error.response.headers.authorization
        }))
        if (error.response && [400, 404, 403, 422].includes(error.response.status)) {
          return dispatch(getTicketsError(error.response.data.error ? error.response.data.error : error.response.data.message));
        }
        if (error.response && [401].includes(error.response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (error.response && error.response.status >= 500) {
          return dispatch(getTicketsError('Oops! We did something wrong.'));
        }
        dispatch(getTicketsError('Oops! We did something wrong.'));
      })
  }
}

// create new tickets
const createNewTicketRequest = () => {
  return {
    type: actions.CREATE_NEW_TICKET_REQUEST,
  }
}

const createNewTicketError = (message) => {
  return {
    type: actions.CREATE_NEW_TICKET_ERROR,
    error: message,
  }
}

const createNewTicketSuccess = (data) => {
  return {
    type: actions.CREATE_NEW_TICKET_SUCCESS,
    data,
  }
}

export const createNewTicket = (payload) => {
  return (dispatch, getState) => {
    dispatch(createNewTicketRequest());

    const { token } = getState().user;
    return new Promise((resolve) => {
      axios.post(`${CONFIG.BASE_URL}/users/tickets`, payload, {
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
            dispatch(createNewTicketSuccess(response.data.data));
            dispatch(showAlert({ type: 'success', message: 'Ticket created successfully' }))
            return resolve(response.data.data)
          }
        })
        .catch((error) => {
          error.response && error.response.headers.authorization && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 404, 403, 422].includes(error.response.status)) {
            return dispatch(createNewTicketError(error.response.data.error ? error.response.data.error : error.response.data.message));
          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            return dispatch(createNewTicketError('Oops! We did something wrong.'));
          }
          dispatch(createNewTicketError('Oops! We did something wrong.'));
        })
    })
  }
}

//filter tickets/ search tickets
const searchTicketsRequest = () => {
  return {
    type: actions.SEARCH_TICKETS_REQUEST,
  }
}

const searchTicketsError = (message) => {
  return {
    type: actions.SEARCH_TICKETS_ERROR,
    error: message,
  }
}

const searchTicketsSuccess = (data) => {
  return {
    type: actions.SEARCH_TICKETS_SUCCESS,
    data,
  }
}

export const searchTickets = (payload) => {
  return (dispatch, getState) => {
    dispatch(searchTicketsRequest());

    const { token } = getState().user;
    return new Promise((resolve) => {
      axios.get(`${CONFIG.BASE_URL}/users/tickets/filter?search=${payload.search}`, {
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
            dispatch(searchTicketsSuccess(response.data.data));
            return resolve(response.data.data)
          }
        })
        .catch((error) => {
          error.response && error.response.headers.authorization && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 404, 403, 422].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: error?.response?.data?.message }))
            return dispatch(searchTicketsError(error.response.data.error ? error.response.data.error : error.response.data.message));
          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            return dispatch(searchTicketsError('Oops! We did something wrong.'));
          }
          dispatch(searchTicketsError('Oops! We did something wrong.'));
        })
    })
  }
}


//GET SINGLE TICKET
const getSingleTicketRequest = () => {
  return {
    type: actions.GET_SINGLE_TICKET_REQUEST,
  }
}

const getSingleTicketError = (message) => {
  return {
    type: actions.GET_SINGLE_TICKET_ERROR,
    error: message,
  }
}

const getSingleTicketSuccess = (data) => {
  return {
    type: actions.GET_SINGLE_TICKET_SUCCESS,
    data,
  }
}

export const getSingleTicket = (id) => {
  return (dispatch, getState) => {
    dispatch(getSingleTicketRequest());

    const { token } = getState().user;
    return new Promise((resolve) => {
      axios.get(`${CONFIG.BASE_URL}/users/tickets/${id}`, {
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
            dispatch(getSingleTicketSuccess(response.data.data));
            return resolve(response.data.data)
          }
        })
        .catch((error) => {
          error.response && error.response.headers.authorization && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 404, 403, 422].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: error?.response?.data?.message }))
            return dispatch(getSingleTicketError(error.response.data.error ? error.response.data.error : error.response.data.message));
          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            return dispatch(getSingleTicketError('Oops! We did something wrong.'));
          }
          dispatch(getSingleTicketError('Oops! We did something wrong.'));
        })
    })
  }
}

//send message
const sendMessageRequest = () => {
  return {
    type: actions.SEND_MESSAGE_REQUEST,
  }
}

const sendMessageError = (message) => {
  return {
    type: actions.SEND_MESSAGE_ERROR,
    error: message,
  }
}

const sendMessageSuccess = (data) => {
  return {
    type: actions.SEND_MESSAGE_SUCCESS,
    data,
  }
}

export const sendMessage = (id, payload) => {
  return (dispatch, getState) => {
    dispatch(sendMessageRequest());

    const { token } = getState().user;
    return new Promise((resolve) => {
      axios.post(`${CONFIG.BASE_URL}/users/tickets/${id}/message`, payload, {
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
            dispatch(sendMessageSuccess(response.data.data));
            return resolve(response.data.data)
          }
        })
        .catch((error) => {
          error.response && error.response.headers.authorization && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 404, 403, 422].includes(error.response.status)) {
            return dispatch(sendMessageError(error.response.data.error ? error.response.data.error : error.response.data.message));
          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            return dispatch(sendMessageError('Oops! We did something wrong.'));
          }
          dispatch(sendMessageError('Oops! We did something wrong.'));
        })
    })
  }
}

//send message
const getAllUserGuidesRequest = () => {
  return {
    type: actions.GET_ALL_USER_GUIDES_REQUEST,
  }
}

const getAllUserGuidesError = (message) => {
  return {
    type: actions.GET_ALL_USER_GUIDES_ERROR,
    error: message,
  }
}

const getAllUserGuidesSuccess = (data) => {
  return {
    type: actions.GET_ALL_USER_GUIDES_SUCCESS,
    data,
  }
}

export const getAllUserGuides = () => {
  return (dispatch, getState) => {
    dispatch(getAllUserGuidesRequest());

    const { token } = getState().user;
    return new Promise((resolve) => {
      axios.get(`${CONFIG.BASE_URL}/users/guides`, {
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
            dispatch(getAllUserGuidesSuccess(response.data.data));
            return resolve(response.data.data)
          }
        })
        .catch((error) => {
          error.response && error.response.headers.authorization && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 404, 403, 422].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: error?.response?.data?.message }))
            return dispatch(getAllUserGuidesError(error.response.data.error ? error.response.data.error : error.response.data.message));
          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            return dispatch(getAllUserGuidesError('Oops! We did something wrong.'));
          }
          dispatch(getAllUserGuidesError('Oops! We did something wrong.'));
        })
    })
  }
}


//get all FAQs
const getAllFaqsRequest = () => {
  return {
    type: actions.GET_ALL_FAQS_REQUEST,
  }
}

const getAllFaqsError = (message) => {
  return {
    type: actions.GET_ALL_FAQS_ERROR,
    error: message,
  }
}

const getAllFaqsSuccess = (data) => {
  return {
    type: actions.GET_ALL_FAQS_SUCCESS,
    data,
  }
}

export const getAllFaqs = () => {
  return (dispatch) => {
    dispatch(getAllFaqsRequest());

    axios.get(`${CONFIG.BASE_URL}/faq`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        if ([200, 201].includes(response.status)) {
          return dispatch(getAllFaqsSuccess(response.data.data));
        }
      })
      .catch((error) => {
        if (error.response && [400, 404, 403, 422].includes(error.response.status)) {
          dispatch(showAlert({ type: 'error', message: error?.response?.data?.message }))
          return dispatch(getAllFaqsError(error.response.data.error ? error.response.data.error : error.response.data.message));
        }
        if (error.response && [401].includes(error.response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (error.response && error.response.status >= 500) {
          return dispatch(getAllFaqsError('Oops! We did something wrong.'));
        }
        dispatch(getAllFaqsError('Oops! We did something wrong.'));
      })
  }
}