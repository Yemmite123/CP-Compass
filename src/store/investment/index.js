import * as actions from './actionTypes';

const investmentDefaultState = {
  data: null,
  error: false,
  investments: null,
  order: null,
  newError: null,
  investmentList: null,
  recommended: null,
}

export default (state = investmentDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_DATA:
      return { ...state, data: null };
    case actions.CLEAR_ERROR:
      return { ...state, newError: null, error: null };
    case actions.GET_ALL_INVESTMENTS_SUCCESS:
      return { ...state, error: false, data: action.data, investments: action.data.data }
    case actions.GET_ALL_INVESTMENTS_ERROR:
      return { ...state, error: action.error }
    case actions.BOOK_NEW_INVESTMENT_SUCCESS:
      return { ...state, error: false, data: action.data, order: action.data.data }
    case actions.BOOK_NEW_INVESTMENT_REQUEST:
      return { ...state, newError: null }
    case actions.BOOK_NEW_INVESTMENT_ERROR:
      return { ...state, newError: action.error }
    case actions.BOOK_INVESTMENT_WITH_PAY_SUCCESS:
      return { ...state, error: false, data: action.data, order: action.data.data }
    case actions.BOOK_INVESTMENT_WITH_PAY_ERROR:
      return { ...state, newError: action.error }
    case actions.BOOK_INVESTMENT_WITH_PAY_REQUEST:
      return { ...state, newError: null }
    case actions.GET_INVESTMENT_DETAILS_SUCCESS:
      return { ...state, error: false, data: action.data, investmentList: action.data.data }
    case actions.GET_INVESTMENT_DETAILS_ERROR:
      return { ...state, newError: action.error }
    case actions.LIQUIDATE_INVESTMENT_SUCCESS:
      return { ...state, error: false, data: action.data }
    case actions.LIQUIDATE_INVESTMENT_ERROR:
      return { ...state, error: action.error }
    case actions.GET_RECOMMENDED_INVESTMENTS_SUCCESS:
      return { ...state, error: false, data: action.data, recommended: action.data?.data }
    case actions.GET_RECOMMENDED_INVESTMENTS_ERROR:
      return { ...state, error: action.error }
    case actions.CALCULATE_INVESTMENT_SUCCESS:
      return { ...state, error: false, data: action.data }
    case actions.CALCULATE_INVESTMENT_ERROR:
      return { ...state, error: action.error }
    default:
      return state;
  }
}