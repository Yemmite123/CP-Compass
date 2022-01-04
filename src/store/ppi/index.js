import * as actions from "./actionTypes";

const portfolioDefaultState = {
  data: null,
  error: false,
  loading: false,
  funds: null,
  fund: null,
}

export default (state = portfolioDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_DATA:
      return { ...state, data: null };
    case actions.CLEAR_ERROR:
      return { ...state, error: false };
    case actions.GET_ACTIVE_PPI_SUCCESS:
      return { ...state, loading: false, error: false, funds: action.data?.data, data: action.data }
    case actions.GET_ACTIVE_PPI_ERROR:
      return { ...state, loading: false, error: action.error };
    case actions.GET_SINGLE_PPI_SUCCESS:
      return { ...state, loading: false, error: false, fund: action.data }
    case actions.GET_SINGLE_PPI_ERROR:
      return { ...state, loading: false, error: action.error };
    case actions.SUBMIT_MUTUAL_FORM_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data }
    case actions.SUBMIT_MUTUAL_FORM_ERROR:
      return { ...state, loading: false, error: action.error };
    case actions.SEND_FORM_TO_EMAIL_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data }
    case actions.SEND_FORM_TO_EMAIL_ERROR:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}