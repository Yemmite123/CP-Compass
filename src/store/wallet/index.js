import * as actions from './actionTypes';

const walletDefaultState = {
  data: null,
  error: false,
  cards: null,
  walletDetails: null,
  confirm: null,
  transactions: null,
}

export default (state = walletDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_DATA:
      return { ...state, data: null, confirm: null };
      case actions.CLEAR_ERROR:
        return { ...state, error: false };
    case actions.DEPOSIT_SUCCESS:
      return { ...state, error: false, data: action.data }
    case actions.DEPOSIT_ERROR:
      return { ...state, error: action.error }
    case actions.DEPOSIT_CARD_SUCCESS:
      return { ...state, error: false, data: action.data }
    case actions.DEPOSIT_CARD_ERROR:
      return { ...state, error: action.error }
    case actions.GET_ALL_CARDS_SUCCESS:
      return { ...state, error: false, data: action.data, cards: action.data.data }
    case actions.GET_ALL_CARDS_ERROR:
      return { ...state, error: action.error }
    case actions.GET_WALLET_DETAILS_SUCCESS:
      return { ...state, error: false, walletDetails: action.data.data }
    case actions.GET_WALLET_DETAILS_ERROR:
      return { ...state, error: action.error }
    case actions.INITIALIZE_WITHDRAWAL_SUCCESS:
      return { ...state, error: false, data: action.data }
    case actions.INITIALIZE_WITHDRAWAL_ERROR:
      return { ...state, error: action.error }
    case actions.CONFIRM_WITHDRAWAL_SUCCESS:
      return { ...state, error: false, confirm: action.data }
    case actions.CONFIRM_WITHDRAWAL_ERROR:
      return { ...state, error: action.error }
      case actions.GET_TRANSACTION_HISTORY_SUCCESS:
        return { ...state, error: false, transactions: action.data.data }
      case actions.GET_TRANSACTION_HISTORY_ERROR:
        return { ...state, error: action.error }
    default:
      return state;
  }
}