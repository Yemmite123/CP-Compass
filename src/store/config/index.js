import * as actions from './actionTypes';

const configDefaultState = {
  data: null,
  error: false,
}

export default (state = configDefaultState, action) => {
  switch (action.type) {
    case actions.GET_SYSTEM_CONFIG_SUCCESS:
      return { ...state, error: false, data: action.data?.configurations }
    case actions.GET_SYSTEM_CONFIG_ERROR:
      return { ...state, error: action.error }
    default:
      return state;
  }
}