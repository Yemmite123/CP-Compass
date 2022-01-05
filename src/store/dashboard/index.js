import * as actions from './actionTypes';

const defaultState = {
  data: null,
  error: false,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case actions.GET_DASHBOARD_INFO_SUCCESS:
      return { ...state, error: false, data: action.data?.data }
    case actions.GET_DASHBOARD_INFO_ERROR:
      return { ...state, error: action.error }
      default:
        return state;
    }
  }