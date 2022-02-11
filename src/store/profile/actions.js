import axios from 'axios';
import CONFIG from '#/config';
import * as actions from "./actionTypes";
import { logout, updateUser } from "#/store/user/actions";
import { showAlert } from '#/store/ui/actions';

const clearData = () => {
  return {
    type: actions.CLEAR_DATA,
  }
}

const clearError = () => {
  return {
    type: actions.CLEAR_ERROR,
  }
}

const clearPinError = () => {
  return {
    type: actions.CLEAR_PIN_ERROR,
  }
}

const addEmploymentRequest = () => {
  return {
    type: actions.ADD_EMPLOYMENT_REQUEST,
  }
}

const addEmploymentError = (message) => {
  return {
    type: actions.ADD_EMPLOYMENT_ERROR,
    error: message,
  }
}

const addEmploymentSuccess = (data) => {
  return {
    type: actions.ADD_EMPLOYMENT_SUCCESS,
    data,
  }
}

const addNextOfKinRequest = () => {
  return {
    type: actions.ADD_NEXT_OF_KIN_REQUEST,
  }
}

const addNextOfKinError = (message) => {
  return {
    type: actions.ADD_NEXT_OF_KIN_ERROR,
    error: message,
  }
}

const addNextOfKinSuccess = (data) => {
  return {
    type: actions.ADD_NEXT_OF_KIN_SUCCESS,
    data,
  }
}

const addPoliticalStatusRequest = () => {
  return {
    type: actions.ADD_POLITICAL_STATUS_REQUEST,
  }
}

const addPoliticalStatusError = (message) => {
  return {
    type: actions.ADD_POLITICAL_STATUS_ERROR,
    error: message,
  }
}

const addPoliticalStatusSuccess = (data) => {
  return {
    type: actions.ADD_POLITICAL_STATUS_SUCCESS,
    data,
  }
}

const addBiodataRequest = () => {
  return {
    type: actions.ADD_BIODATA_REQUEST,
  }
}

const addBiodataError = (message) => {
  return {
    type: actions.ADD_BIODATA_ERROR,
    error: message,
  }
}

const addBiodataSuccess = (data) => {
  return {
    type: actions.ADD_BIODATA_SUCCESS,
    data,
  }
}

const getUserProfileRequest = () => {
  return {
    type: actions.GET_USER_PROFILE_REQUEST,
  }
}

const getUserProfileError = (message) => {
  return {
    type: actions.GET_USER_PROFILE_ERROR,
    error: message,
  }
}

const getUserProfileSuccess = (data) => {
  return {
    type: actions.GET_USER_PROFILE_SUCCESS,
    data,
  }
}

const addProfilePhotoRequest = () => {
  return {
    type: actions.ADD_PROFILE_PHOTO_REQUEST,
  }
}

const addProfilePhotoError = (message) => {
  return {
    type: actions.ADD_PROFILE_PHOTO_ERROR,
    error: message,
  }
}

const addProfilePhotoSuccess = (data) => {
  return {
    type: actions.ADD_PROFILE_PHOTO_SUCCESS,
    data,
  }
}

const updateKycRequest = () => {
  return {
    type: actions.UPDATE_KYC_REQUEST,
  }
}

const updateKycError = (message) => {
  return {
    type: actions.UPDATE_KYC_ERROR,
    error: message,
  }
}

const updateKycSuccess = (data) => {
  return {
    type: actions.UPDATE_KYC_SUCCESS,
    data,
  }
}

export const addEmploymentDetails = (payload) => {
  return (dispatch, getState) => {
    dispatch(addEmploymentRequest());

    const { token } = getState().user;

    axios.post(`${CONFIG.BASE_URL}/profile/employment`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if ([200, 201].includes(response.status)) {
          dispatch(addEmploymentSuccess(response.data));
          setTimeout(() => dispatch(clearData()), 3000)
        }
      })
      .catch(({ response }) => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 403].includes(response.status)) {
          return dispatch(addEmploymentError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(addEmploymentError('Oops! We did something wrong.'));
        }
        return dispatch(addEmploymentError('Oops! We did something wrong.'));
      })
  }
}

export const addNextOfKinDetails = (payload) => {
  return (dispatch, getState) => {
    dispatch(addNextOfKinRequest());

    const { token } = getState().user;

    axios.post(`${CONFIG.BASE_URL}/profile/next-of-kin`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if ([200, 201].includes(response.status)) {
          dispatch(addNextOfKinSuccess(response.data));
          setTimeout(() => dispatch(clearData()), 3000)
        }
      })
      .catch(({ response }) => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 403].includes(response.status)) {
          return dispatch(addNextOfKinError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(addNextOfKinError('Oops! We did something wrong.'));
        }
        return dispatch(addNextOfKinError('Oops! We did something wrong.'));
      })
  }
}

export const addPoliticalStatus = (payload) => {
  return (dispatch, getState) => {
    dispatch(addPoliticalStatusRequest());

    const { token } = getState().user;

    axios.post(`${CONFIG.BASE_URL}/profile/political-status`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if ([200, 201].includes(response.status)) {
          dispatch(addPoliticalStatusSuccess(response.data));
          setTimeout(() => dispatch(clearData()), 3000)
        }
      })
      .catch(({ response }) => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if ([400, 404, 403].includes(response.status)) {
          return dispatch(addPoliticalStatusError(response.data.error ? response.data.error : response.data.message));
        }
        if ([401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response.status >= 500) {
          return dispatch(addPoliticalStatusError('Oops! We did something wrong.'));
        }
        return dispatch(addPoliticalStatusError('Oops! We did something wrong.'));
      })
  }
}

export const addBioData = (payload) => {
  return (dispatch, getState) => {
    dispatch(addBiodataRequest());

    const { token } = getState().user;

    axios.post(`${CONFIG.BASE_URL}/profile/personal`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if ([200, 201].includes(response.status)) {
          dispatch(addBiodataSuccess(response.data));
          setTimeout(() => dispatch(clearData()), 3000)
        }
      })
      .catch(({ response }) => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 403].includes(response.status)) {
          return dispatch(addBiodataError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(addBiodataError('Oops! We did something wrong.'));
        }
        return dispatch(addBiodataError('Oops! We did something wrong.'));
      })
  }
}

export const addProfilePhoto = (payload) => {
  return (dispatch, getState) => {
    dispatch(addProfilePhotoRequest());

    const { token } = getState().user;

    axios.post(`${CONFIG.BASE_URL}/profile/picture`, payload, {
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data'
      },
    })
      .then(response => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if ([200, 201].includes(response.status)) {
          dispatch(addProfilePhotoSuccess(response.data.picture));
        }
      })
      .catch(({ response }) => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 403].includes(response.status)) {
          return dispatch(addProfilePhotoError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(addProfilePhotoError('Oops! We did something wrong.'));
        }
        return dispatch(addProfilePhotoError('Oops! We did something wrong.'));
      })
  }
}

export const getUserProfile = () => {
  return (dispatch, getState) => {
    dispatch(getUserProfileRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
        dispatch(updateUser({
          token: response.headers.authorization,
          isBvnActive: response.data.profile?.isApproved === 1 ? true : false
        }))
        if ([200, 201].includes(response.status)) {
          dispatch(getUserProfileSuccess(response.data.profile));
        }
      })
      .catch(({ response }) => {
        response && response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 403].includes(response.status)) {
          dispatch(getUserProfileError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          dispatch(getUserProfileError('Oops! We did something wrong.'));
        }
        dispatch(getUserProfileError('Oops! We did something wrong.'));
      })
  }
}

export const updateKyc = (payload) => {
  return (dispatch, getState) => {
    dispatch(updateKycRequest());

    const { token } = getState().user;

    axios.post(`${CONFIG.BASE_URL}/profile/documents`, payload, {
      headers: {
        Authorization: token,
      },
    })
      .then(response => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if ([200, 201].includes(response.status)) {
          dispatch(updateKycSuccess(response.data));
          setTimeout(() => dispatch(clearData()), 3000)
        }
      })
      .catch(({ response }) => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 403].includes(response.status)) {
          return dispatch(updateKycError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(updateKycError('Oops! We did something wrong.'));
        }
        return dispatch(updateKycError('Oops! We did something wrong.'));
      })
  }
}

const getAllBanksRequest = () => {
  return {
    type: actions.GET_ALL_BANKS_REQUEST,
  }
}

const getAllBanksError = (message) => {
  return {
    type: actions.GET_ALL_BANKS_ERROR,
    error: message,
  }
}

const getAllBanksSuccess = (data) => {
  return {
    type: actions.GET_ALL_BANKS_SUCCESS,
    data,
  }
}

export const getAllBanks = (payload) => {
  return (dispatch) => {
    dispatch(getAllBanksRequest());

    axios.get(`${CONFIG.BASE_URL}/banks`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        if ([200, 201].includes(response.status)) {
          dispatch(getAllBanksSuccess(response.data));
        }
      })
      .catch(({ response }) => {
        if (response && [400, 404, 403].includes(response.status)) {
          return dispatch(getAllBanksError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          return dispatch(logout())
        }
        if (response && response.status >= 500) {
          return dispatch(getAllBanksError('Oops! We did something wrong.'));
        }
        return dispatch(getAllBanksError('Oops! We did something wrong.'));
      })
  }
}

const addBanksDetailsRequest = () => {
  return {
    type: actions.ADD_BANK_DETAILS_REQUEST,
  }
}

const addBanksDetailsError = (message) => {
  return {
    type: actions.ADD_BANK_DETAILS_ERROR,
    error: message,
  }
}

const addBanksDetailsSuccess = (data) => {
  return {
    type: actions.ADD_BANK_DETAILS_SUCCESS,
    data,
  }
}

export const addBankDetails = (payload) => {
  return (dispatch, getState) => {
    dispatch(addBanksDetailsRequest());

    const { token } = getState().user;
    return new Promise((resolve) => {
    axios.post(`${CONFIG.BASE_URL}/profile/bank-info`, payload, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if ([200, 201].includes(response.status)) {
          dispatch(addBanksDetailsSuccess(response.data));
          setTimeout(() => dispatch(clearData()), 3000)
          resolve(response.data)
        }
      })
      .catch(({ response }) => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(addBanksDetailsError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(addBanksDetailsError('Oops! We did something wrong.'));
        }
        return dispatch(addBanksDetailsError('Oops! We did something wrong.'));
      })
    })
  }
}

const updatePinRequest = () => {
  return {
    type: actions.UPDATE_PIN_REQUEST,
  }
}

const updatePinError = (message) => {
  return {
    type: actions.UPDATE_PIN_ERROR,
    error: message,
  }
}

const updatePinSuccess = (data) => {
  return {
    type: actions.UPDATE_PIN_SUCCESS,
    data,
  }
}

export const updatePin = (payload) => {
  return (dispatch, getState) => {
    dispatch(updatePinRequest());

    const { token } = getState().user;
    return new Promise((resolve, reject) => {

      axios.post(`${CONFIG.BASE_URL}/profile/pin/update`, payload, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          response.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if ([200, 201].includes(response.status)) {
            dispatch(updatePinSuccess(response.data));
            dispatch(showAlert({ type: 'success', noBtn: true, message: response.data.message }))
            resolve()
            setTimeout(() => dispatch(clearData()), 3000)
          }
        })
        .catch(({ response }) => {
          reject()
          dispatch(updateUser({
            token: response?.headers?.authorization
          }))
          if (response && [400, 404, 422, 403].includes(response.status)) {
            dispatch(updatePinError(response.data.error ? response.data.error : response.data.message));
            return setTimeout(() => dispatch(clearPinError()), 3000)
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && response.status >= 500) {
            return dispatch(updatePinError('Oops! We did something wrong.'));
          }
          return dispatch(updatePinError('Oops! We did something wrong.'));
        })
    })
  }
}


const joinSegmentRequest = () => {
  return {
    type: actions.JOIN_SEGMENT_REQUEST,
  }
}

const joinSegmentError = (message) => {
  return {
    type: actions.JOIN_SEGMENT_ERROR,
    error: message,
  }
}

const joinSegmentSuccess = (data) => {
  return {
    type: actions.JOIN_SEGMENT_SUCCESS,
    data,
  }
}

export const joinSegment = (payload) => {
  return (dispatch, getState) => {
    dispatch(joinSegmentRequest());

    const { token } = getState().user;
    return new Promise((resolve) => {
      axios.patch(`${CONFIG.BASE_URL}/segments/join`, payload, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          response.headers?.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if ([200, 201].includes(response.status)) {
            dispatch(joinSegmentSuccess(response.data));
            resolve(response.data);
            setTimeout(() => dispatch(clearData()), 3000)
          }
        })
        .catch((error) => {
          error.response && error.response.headers.authorization && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 404, 422, 403].includes(error.response.status)) {
            dispatch(joinSegmentError(error.response.data.error ? error.response.data.error : error.response.data.message));
            return setTimeout(() => dispatch(clearError()), 5000)
          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            return dispatch(joinSegmentError('Oops! We did something wrong.'));
          }
          return dispatch(joinSegmentError('Oops! We did something wrong.'));
        })
    })
  }
}

const getSegmentQuestionsRequest = () => {
  return {
    type: actions.GET_SEGMENT_QUESTIONS_REQUEST,
  }
}

const getSegmentQuestionsError = (message) => {
  return {
    type: actions.GET_SEGMENT_QUESTIONS_ERROR,
    error: message,
  }
}

const getSegmentQuestionsSuccess = (data) => {
  return {
    type: actions.GET_SEGMENT_QUESTIONS_SUCCESS,
    data,
  }
}

export const getSegmentQuestions = () => {
  return (dispatch, getState) => {
    dispatch(getSegmentQuestionsRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/segments/questions?limit=40&page=1`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if ([200, 201].includes(response.status)) {
          dispatch(getSegmentQuestionsSuccess(response.data));
          setTimeout(() => dispatch(clearData()), 3000)
        }
      })
      .catch(({ response }) => {
        response && response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(getSegmentQuestionsError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(getSegmentQuestionsError('Oops! We did something wrong.'));
        }
        return dispatch(getSegmentQuestionsError('Oops! We did something wrong.'));
      })
  }
}

//get risk assessment questions
const getRiskQuestionsRequest = () => {
  return {
    type: actions.GET_RISK_QUESTIONS_REQUEST,
  }
}

const getRiskQuestionsError = (message) => {
  return {
    type: actions.GET_RISK_QUESTIONS_ERROR,
    error: message,
  }
}

const getRiskQuestionsSuccess = (data) => {
  return {
    type: actions.GET_RISK_QUESTIONS_SUCCESS,
    data,
  }
}

export const getRiskQuestions = () => {
  return (dispatch, getState) => {
    dispatch(getRiskQuestionsRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/questions/risk-assessment`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if ([200, 201].includes(response.status)) {
          dispatch(getRiskQuestionsSuccess(response.data));
          setTimeout(() => dispatch(clearData()), 3000)
        }
      })
      .catch(({ response }) => {
        response && response.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(getRiskQuestionsError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(getRiskQuestionsError('Oops! We did something wrong.'));
        }
        return dispatch(getRiskQuestionsError('Oops! We did something wrong.'));
      })
  }
}

const riskAssessmentRequest = () => {
  return {
    type: actions.SET_RISK_QUESTIONS_REQUEST,
  }
}

const riskAssessmentError = (message) => {
  return {
    type: actions.SET_RISK_QUESTIONS_ERROR,
    error: message,
  }
}

const riskAssessmentSuccess = (data) => {
  return {
    type: actions.SET_RISK_QUESTIONS_SUCCESS,
    data,
  }
}

export const riskAssessment = (payload) => {
  return (dispatch, getState) => {
    dispatch(riskAssessmentRequest());

    const { token } = getState().user;
    return new Promise((resolve) => {
      axios.post(`${CONFIG.BASE_URL}/risks/assessment`, payload, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          response.headers?.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if ([200, 201].includes(response.status)) {
            dispatch(riskAssessmentSuccess(response.data));
            resolve(response.data);
            setTimeout(() => dispatch(clearData()), 3000)
          }
        })
        .catch((error) => {
          error.response && error.response.headers.authorization && dispatch(updateUser({
            token: error.response.headers.authorization
          }))
          if (error.response && [400, 404, 422, 403].includes(error.response.status)) {
            dispatch(riskAssessmentError(error.response.data.error ? error.response.data.error : error.response.data.message));
            return setTimeout(() => dispatch(clearError()), 5000)
          }
          if (error.response && [401].includes(error.response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (error.response && error.response.status >= 500) {
            return dispatch(riskAssessmentError('Oops! We did something wrong.'));
          }
          return dispatch(riskAssessmentError('Oops! We did something wrong.'));
        })
    })
  }
}