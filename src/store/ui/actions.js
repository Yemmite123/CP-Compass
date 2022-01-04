import * as actions from "./actionTypes";

const showTransferModal = () => {
  return {
    type: actions.SHOW_TRANSFER_MODAL,
  }
}

const removeTransferModal = () => {
  return {
    type: actions.SHOW_TRANSFER_CLOSE,
  }
}

export const displayTransferModal = () => {
  return (dispatch) => {
      dispatch(showTransferModal())
  }
}

export const closeTransferModal = () => {
  return (dispatch) => {
      dispatch(removeTransferModal())
  }
}

export const showAlert= (message) => {
  return {
    type: actions.SHOW_ALERT,
    message
  }
}

const clearAlert = () => {
  return {
    type: actions.ALERT_CLEAR,
  }
}

export const removeAlert = () => {
  return (dispatch) => {
      dispatch(clearAlert())
  }
}