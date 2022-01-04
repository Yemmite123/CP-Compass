import * as actions from "./actionTypes";

const employmentDefaultState = {
  data: null,
  error: false,
  loading: false,
}

const employment = (state = employmentDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_ERROR:
      return { ...state, error: false };
    case actions.CLEAR_DATA:
      return { ...state, data: false };
    case actions.ADD_EMPLOYMENT_REQUEST:
      return { ...state, loading: true, error: false }
    case actions.ADD_EMPLOYMENT_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data }
    case actions.ADD_EMPLOYMENT_ERROR:
      return { ...state, loading: false, error: action.error }
    default:
      return state;
  }
}

const kinDefaultState = {
  data: null,
  error: false,
  loading: false,
}

const nextOfKin = (state = kinDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_ERROR:
      return { ...state, error: false };
    case actions.CLEAR_DATA:
      return { ...state, data: false };
      case actions.ADD_NEXT_OF_KIN_REQUEST:
        return { ...state, loading: true, error: false }
      case actions.ADD_NEXT_OF_KIN_SUCCESS:
        return { ...state, loading: false, error: false, data: action.data }
      case actions.ADD_NEXT_OF_KIN_ERROR:
        return { ...state, loading: false, error: action.error }
    default:
      return state;
  }
}

const politicsDefaultState = {
  data: null,
  error: false,
  loading: false,
}

const politics = (state = politicsDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_ERROR:
      return { ...state, error: false };
    case actions.CLEAR_DATA:
      return { ...state, data: false };
      case actions.ADD_POLITICAL_STATUS_REQUEST:
        return { ...state, loading: true, error: false }
      case actions.ADD_POLITICAL_STATUS_SUCCESS:
        return { ...state, loading: false, error: false, data: action.data }
      case actions.ADD_POLITICAL_STATUS_ERROR:
        return { ...state, loading: false, error: action.error }
    default:
      return state;
  }
}

const userProfileDefaultState = {
  data: null,
  error: false,
  loading: false,
}

const userProfile = (state = userProfileDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_ERROR:
      return { ...state, data: false };
      case actions.GET_USER_PROFILE_REQUEST:
        return { ...state, loading: true, error: false }
      case actions.GET_USER_PROFILE_SUCCESS:
        return { ...state, loading: false, error: false, data: action.data }
      case actions.GET_USER_PROFILE_ERROR:
        return { ...state, loading: false, error: action.error }
    default:
      return state;
  }
}

const biodataDefaultState = {
  data: null,
  error: false,
  loading: false,
  photo: null,
}

const bioData = (state = biodataDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_ERROR:
      return { ...state, error: false };
    case actions.CLEAR_DATA:
      return { ...state, data: false };
    case actions.ADD_BIODATA_REQUEST:
      return { ...state, loading: true, error: false }
    case actions.ADD_BIODATA_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data }
    case actions.ADD_BIODATA_ERROR:
      return { ...state, loading: false, error: action.error }
    case actions.ADD_PROFILE_PHOTO_REQUEST:
      return { ...state, loading: true, error: false }
    case actions.ADD_PROFILE_PHOTO_SUCCESS:
      return { ...state, loading: false, error: false, photo: action.data }
    case actions.ADD_PROFILE_PHOTO_ERROR:
      return { ...state, loading: false, error: action.error }
    default:
      return state;
  }
}

const kycDefaultState = {
  data: null,
  error: false,
  loading: false,
  documents: null,
}

const kyc = (state = kycDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_ERROR:
      return { ...state, error: false };
    case actions.CLEAR_DATA:
      return { ...state, data: false };
    case actions.UPDATE_KYC_REQUEST:
      return { ...state, loading: true, error: false }
    case actions.UPDATE_KYC_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data, documents: action.data }
    case actions.UPDATE_KYC_ERROR:
      return { ...state, loading: false, error: action.error }
    default:
      return state;
  }
}

const banksDefaultState = {
  data: null,
  error: false,
  loading: false,
  banks: null
}

const banks = (state = banksDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_DATA:
      return { ...state, data: false };
    case actions.GET_ALL_BANKS_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data, banks: action.data }
    case actions.GET_ALL_BANKS_ERROR:
      return { ...state, loading: false, error: action.error }
    case actions.ADD_BANK_DETAILS_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data }
    case actions.ADD_BANK_DETAILS_ERROR:
      return { ...state, loading: false, error: action.error }
    default:
      return state;
  }
}

const securityDefaultState = {
  data: null,
  error: false,
  loading: false,
  pinError: false,
}

const security = (state = securityDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_DATA:
      return { ...state, data: false };
    case actions.CLEAR_PIN_ERROR:
      return { ...state, pinError: false };
    case actions.UPDATE_PIN_SUCCESS:
      return { ...state, loading: false, pinError: false, data: action.data }
    case actions.UPDATE_PIN_ERROR:
      return { ...state, loading: false, pinError: action.error }
    default:
      return state;
  }
}

const segmentDefaultState = {
  data: null,
  error: false,
  loading: false,
  segments: null,
  risks: null,
}

const segment = (state = segmentDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_DATA:
      return { ...state, data: false };
      case actions.CLEAR_ERROR:
        return { ...state, error: false };
    case actions.JOIN_SEGMENT_SUCCESS:
      return { ...state, loading: false, error: false, data: action.data }
    case actions.JOIN_SEGMENT_ERROR:
      return { ...state, loading: false, error: action.error }
      case actions.GET_SEGMENT_QUESTIONS_SUCCESS:
        return { ...state, loading: false, error: false, segments: action.data?.data }
      case actions.GET_SEGMENT_QUESTIONS_ERROR:
        return { ...state, loading: false, error: action.error }
        case actions.SET_RISK_QUESTIONS_SUCCESS:
          return { ...state, loading: false, error: false, risks: action.data?.data }
        case actions.SET_RISK_QUESTIONS_ERROR:
          return { ...state, loading: false, error: action.error }
    default:
      return state;
  }
}

const riskDefaultState = {
  data: null,
  error: false,
  loading: false,
  risks: null
}

const risk = (state = riskDefaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_DATA:
      return { ...state, data: false };
      case actions.GET_RISK_QUESTIONS_SUCCESS:
        return { ...state, loading: false, error: false, risks: action.data?.data }
      case actions.GET_RISK_QUESTIONS_ERROR:
        return { ...state, loading: false, error: action.error }
    default:
      return state;
  }
}

export default (state = {}, action) => {
  return {
    userProfile: userProfile(state.userProfile, action),
    employment: employment(state.employment, action),
    nextOfKin: nextOfKin(state.nextOfKin, action),
    politics: politics(state.politics, action),
    security: security(state.security, action),
    segment: segment(state.segment, action),
    bioData: bioData(state.bioData, action),
    banks: banks(state.banks, action),
    risk: risk(state.risk, action),
    kyc: kyc(state.kyc, action),
  }
}