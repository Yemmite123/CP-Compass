import * as actions from './actionTypes';

const notificationsDefaultState = {
  data: null,
  error: false,
  notifications: {},
  meta: null,
}

export default (state = notificationsDefaultState, action) => {
  switch (action.type) {
    case actions.GET_ALL_NOTIFICATIONS_SUCCESS:
      return { ...state, error: false,
        data: action.data, meta: action.data.data, 
        notifications: action.data.data?.notifications
      }
    case actions.GET_ALL_NOTIFICATIONS_ERROR:
      return { ...state, error: action.error }
    case actions.UPDATE_NOTIFICATION_SUCCESS:
      return { ...state, error: false, data: action.data }
    case actions.UPDATE_NOTIFICATION_ERROR:
      return { ...state, error: action.error }
    case actions.DELETE_NOTIFICATION_SUCCESS:
      return { ...state, error: false, data: action.data.data }
    case actions.DELETE_NOTIFICATION_ERROR:
      return { ...state, error: action.error }
      case actions.ADD_NEW_NOTIFICATION_SUCCESS:
        return { ...state, error: false,
          data: action.data, meta: action.data.data, 
          notifications:
          Object.keys(state.notifications).includes(Object.keys(action.data)[0]) ?
          { [Object.keys(action.data)[0]]: [ action.data[Object.keys(action.data)[0]], ...state.notifications[Object.keys(action.data)[0]]  ] }
          : { [Object.keys(action.data)[0]]: [action.data[Object.keys(action.data)[0]]], ...state.notifications  }
        }
    default:
      return state;
  }
}