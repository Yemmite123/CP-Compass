import * as actions from "./actionTypes";

const onboardingDefaultState = {
  userData: null,
  data: null,
  error: false,
  loading: false,
}

export default (state = onboardingDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR:
      return { ...state, loading: true, error: false, data: null };
    case actions.VERIFY_IDENTITY_REQUEST:
      return { ...state, loading: true, error: false }
    case actions.VERIFY_IDENTITY_SUCCESS:
      return { ...state, loading: false, error: false, userData: action.data }
    case actions.VERIFY_IDENTITY_ERROR:
      return { ...state, loading: false, error: action.error }
    case actions.CONFIRM_IDENTITY_REQUEST:
      return { ...state, loading: true, error: false }
    case actions.CONFIRM_IDENTITY_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data }
    case actions.CONFIRM_IDENTITY_ERROR:
      return { ...state, loading: false, error: action.error }
    case actions.SUBMIT_OTP_REQUEST:
      return { ...state, loading: true, error: false }
    case actions.SUBMIT_OTP_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data }
    case actions.SUBMIT_OTP_ERROR:
      return { ...state, loading: false, error: action.error }
    case actions.SUBMIT_PIN_REQUEST:
      return { ...state, loading: true, error: false }
    case actions.SUBMIT_PIN_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data }
    case actions.SUBMIT_PIN_ERROR:
      return { ...state, loading: false, error: action.error }
    default:
      return state;
  }
}