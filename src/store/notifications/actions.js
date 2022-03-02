import axios from 'axios';
import io from "socket.io-client";
import CONFIG from '#/config';
import * as actions from "./actionTypes";
import { logout, updateUser } from "#/store/user/actions";
import { showAlert } from '#/store/ui/actions';

const getAllNotificationsRequest = () => {
  return {
    type: actions.GET_ALL_NOTIFICATIONS_REQUEST,
  }
}

const getAllNotificationsError = (message) => {
  return {
    type: actions.GET_ALL_NOTIFICATIONS_ERROR,
    error: message,
  }
}

const getAllNotificationsSuccess = (data) => {
  return {
    type: actions.GET_ALL_NOTIFICATIONS_SUCCESS,
    data,
  }
}

export const getAllNotifications = (limit, page) => {
  return (dispatch, getState) => {
    dispatch(getAllNotificationsRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/notification?limit=${limit}&page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
        response.headers?.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        dispatch(getAllNotificationsSuccess(response.data));
      })
      .catch(({ response }) => {
        response && response?.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(getAllNotificationsError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(getAllNotificationsError('Oops! We did something wrong.'));
        }
        return dispatch(getAllNotificationsError('Oops! We did something wrong.'));
      })
  }
}

const updateNotificationRequest = () => {
  return {
    type: actions.UPDATE_NOTIFICATION_REQUEST,
  }
}

const updateNotificationError = (message) => {
  return {
    type: actions.UPDATE_NOTIFICATION_ERROR,
    error: message,
  }
}

const updateNotificationSuccess = (data) => {
  return {
    type: actions.UPDATE_NOTIFICATION_SUCCESS,
    data,
  }
}

export const updateNotification = (id, payload) => {
  return (dispatch, getState) => {
    dispatch(updateNotificationRequest());

    const { token } = getState().user;

    return new Promise((resolve, reject) => {
      axios.put(`${CONFIG.BASE_URL}/notification/${id}/read`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
          response.headers?.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(updateNotificationSuccess(response.data));
          resolve(response.data);
        })
        .catch(({ response }) => {
          response && response?.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if (response && [400, 404, 422, 403].includes(response.status)) {
            return dispatch(updateNotificationError(response.data.error ? response.data.error : response.data.message));
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && response.status >= 500) {
            return dispatch(updateNotificationError('Oops! We did something wrong.'));
          }
          return dispatch(updateNotificationError('Oops! We did something wrong.'));
        })
    })
  }
}

const deleteNotificationRequest = () => {
  return {
    type: actions.DELETE_NOTIFICATION_REQUEST,
  }
}

const deleteNotificationError = (message) => {
  return {
    type: actions.DELETE_NOTIFICATION_ERROR,
    error: message,
  }
}

const deleteNotificationSuccess = (data) => {
  return {
    type: actions.DELETE_NOTIFICATION_SUCCESS,
    data,
  }
}

export const deleteNotification = (id, payload) => {
  return (dispatch, getState) => {
    dispatch(deleteNotificationRequest());

    const { token } = getState().user;

    axios.delete(`${CONFIG.BASE_URL}/notification/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
        response.headers?.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        dispatch(deleteNotificationSuccess(response.data));
      })
      .catch(({ response }) => {
        response && response?.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(deleteNotificationError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(deleteNotificationError('Oops! We did something wrong.'));
        }
        return dispatch(deleteNotificationError('Oops! We did something wrong.'));
      })
  }
}

const addNewNotificationSuccess = (data) => {
  return {
    type: actions.ADD_NEW_NOTIFICATION_SUCCESS,
    data,
  }
}

export const connectToSocket = () => {
  return (dispatch, getState) => {

    const { token } = getState().user;
    const socket = io(CONFIG.BASE_URL, { query: `token=${token && token.split(' ')[1]}` });
    socket.connect();

    socket.on('connect', () => {

      socket.on('notifications', (data) => {
        dispatch(addNewNotificationSuccess(data));
      });

      socket.on("disconnect", () => {
        socket.removeAllListeners('notifications');
        socket.removeAllListeners('disconnect');
        socket.removeAllListeners('authenticateSocket');
        socket.removeAllListeners('setAuthenticated');
        socket.removeAllListeners('registerSocket');
        socket.removeAllListeners('newConnection');
        socket.connect();
      });
    });
  }
}