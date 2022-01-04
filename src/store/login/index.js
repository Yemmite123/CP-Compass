import * as actions from "./actionTypes";

const logindefaultState = {
    data: null,
    error: false,
    loading: false,
}
     
export default (state = logindefaultState, action) => {
    switch(action.type) {
      case actions.CLEAR:
          return { ...state, loading: true, error: false, data: null };
        case actions.CLEAR_ERROR:
        return { ...state, error: false };
      case actions.LOGIN_REQUEST:
          return { ...state, loading: true, error: false }
      case actions.LOGIN_SUCCESS:
          return { ...state, loading: false, error: false }
      case actions.LOGIN_ERROR:
          return { ...state, loading: false, error: action.error }
        case actions.SEND_RESET_LINK_REQUEST:
            return { ...state, loading: true, error: false }
        case actions.SEND_RESET_LINK_SUCCESS:
            return { ...state, loading: false, error: false, data: action.data }
        case actions.SEND_RESET_LINK_ERROR:
            return { ...state, loading: false, error: action.error }
        case actions.RESET_PASSWORD_REQUEST:
            return { ...state, loading: true, error: false }
        case actions.RESET_PASSWORD_SUCCESS:
            return { ...state, loading: false, error: false, data: action.data }
        case actions.RESET_PASSWORD_ERROR:
            return { ...state, loading: false, error: action.error }
      default:
        return state;
    }
}