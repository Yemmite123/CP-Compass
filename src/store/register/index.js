import * as actions from "./actionTypes";

const defaultState = {
    data: null,
    error: false,
    loading: false,
}
     
export default (state = defaultState, action) => {
    switch(action.type) {
        case actions.CLEAR:
            return { ...state, loading: true, error: false, data: null };
        case actions.CLEAR_ERROR:
            return { ...state, error: false};
        case actions.REGISTER_SUCCESS:
            return { ...state, loading: false, error: false, data: action.data }
        case actions.REGISTER_ERROR:
            return { ...state, loading: false, error: action.error }
            case actions.REGISTER_REQUEST:
                return { ...state, error: false }
        case actions.VERIFY_EMAIL_REQUEST:
            return { ...state, loading: true, error: false }
        case actions.VERIFY_EMAIL_SUCCESS:
            return { ...state, loading: false, error: false, data: action.data }
        case actions.VERIFY_EMAIL_ERROR:
            return { ...state, loading: false, error: action.error }
        case actions.RESEND_TOKEN_REQUEST:
            return { ...state, loading: true, error: false }
        case actions.RESEND_TOKEN_SUCCESS:
            return { ...state, loading: false, error: false, data: action.data }
        case actions.RESEND_TOKEN_ERROR:
            return { ...state, loading: false, error: action.error }
        default:
            return state;
    }
}