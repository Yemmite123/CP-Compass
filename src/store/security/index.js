import * as actions from "./actionTypes";

const employmentDefaultState = {
  data: null,
  error: false,
  loading: false,
}

export default (state = employmentDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_ERROR:
      return { ...state, error: false };
    case actions.CLEAR_DATA:
      return { ...state, data: false };
    case actions.CONFIRM_PIN_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data }
    case actions.CONFIRM_PIN_ERROR:
      return { ...state, loading: false, error: action.error }
    case actions.CHANGE_PASSWORD_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data }
    case actions.CHANGE_PASSWORD_ERROR:
      return { ...state, loading: false, error: action.error }
    default:
      return state;
  }
}