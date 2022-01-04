import * as actions from "./actionTypes";

const portfolioDefaultState = {
  data: null,
  error: false,
  loading: false,
  investment: null,
}

export default (state = portfolioDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_DATA:
      return { ...state, data: null };
      case actions.CLEAR_ERROR:
        return { ...state, error: false};
    case actions.FETCH_PORTFOLIO_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data }
    case actions.FETCH_PORTFOLIO_ERROR:
      return { ...state, loading: false, error: action.error };
    case actions.FETCH_SINGLE_INVESTMENT_SUCCESS:
      return { ...state, loading: false, error: false, investment: action.data }
    case actions.FETCH_SINGLE_INVESTMENT_ERROR:
      return { ...state, loading: false, error: action.error };
      case actions.TOP_UP_INVESTMENT_SUCCESS:
        return { ...state, loading: false, error: false, data: action.data }
      case actions.TOP_UP_INVESTMENT_ERROR:
        return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}