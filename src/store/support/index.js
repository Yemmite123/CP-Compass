import * as actions from "./actionTypes";

const supportDefaultState = {
  data: null,
  error: false,
  loading: false,
  tickets: [],
  metadata: null,
  ticket: null,
  message: null,
  guides: null,
  faq: null,
}

export default (state = supportDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_DATA:
      return { ...state, data: null };
    case actions.CLEAR_ERROR:
      return { ...state, error: false };
    case actions.GET_TICKETS_SUCCESS:
      return { ...state, loading: false, error: false, tickets: action.data?.data, metadata: action.data }
    case actions.GET_TICKETS_ERROR:
      return { ...state, loading: false, error: action.error };
      case actions.CREATE_NEW_TICKET_REQUEST:
        return { ...state, error: false}
    case actions.CREATE_NEW_TICKET_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data }
    case actions.CREATE_NEW_TICKET_ERROR:
      return { ...state, loading: false, error: action.error };
    case actions.SEARCH_TICKETS_SUCCESS:
      return { ...state, loading: false, error: false, tickets: action.data?.tickets, data: action.data }
    case actions.SEARCH_TICKETS_ERROR:
      return { ...state, loading: false, error: action.error };
    case actions.GET_SINGLE_TICKET_SUCCESS:
      return { ...state, loading: false, error: false, ticket: action.data?.ticket }
    case actions.GET_SINGLE_TICKET_ERROR:
      return { ...state, loading: false, error: action.error };
      case actions.SEND_MESSAGE_REQUEST:
        return { ...state, loading: false, error: false }
    case actions.SEND_MESSAGE_SUCCESS:
      return { ...state, loading: false, error: false, message: action.data }
    case actions.SEND_MESSAGE_ERROR:
      return { ...state, loading: false, error: action.error };
      case actions.GET_ALL_USER_GUIDES_SUCCESS:
        return { ...state, loading: false, error: false, guides: action.data }
      case actions.GET_ALL_USER_GUIDES_ERROR:
        return { ...state, loading: false, error: action.error };
        case actions.GET_ALL_FAQS_SUCCESS:
          return { ...state, loading: false, error: false, faq: action.data }
        case actions.GET_ALL_FAQS_ERROR:
          return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}