import axios from 'axios';
import CONFIG from '#/config';
import * as actions from "./actionTypes";
import { logout, updateUser } from "#/store/user/actions";
import { showAlert } from '#/store/ui/actions';


//get latest posts
const getRecentPostsRequest = () => {
  return {
    type: actions.GET_RECENT_POSTS_REQUEST,
  }
}

const getRecentPostsError = (message) => {
  return {
    type: actions.GET_RECENT_POSTS_ERROR,
    error: message,
  }
}

const getRecentPostsSuccess = (data) => {
  return {
    type: actions.GET_RECENT_POSTS_SUCCESS,
    data,
  }
}

export const getRecentPosts = (limit, page) => {
  return (dispatch, getState) => {
    dispatch(getRecentPostsRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/blog/posts/recent?limit=${limit}&page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
       response.headers?.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        dispatch(getRecentPostsSuccess(response.data));
      })
      .catch(({ response }) => {
        response && response?.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(getRecentPostsError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(getRecentPostsError('Oops! We did something wrong.'));
        }
        return dispatch(getRecentPostsError('Oops! We did something wrong.'));
      })
  }
}


const getTrendingPostsRequest = () => {
  return {
    type: actions.GET_TRENDING_POSTS_REQUEST,
  }
}

const getTrendingPostsError = (message) => {
  return {
    type: actions.GET_TRENDING_POSTS_ERROR,
    error: message,
  }
}

const getTrendingPostsSuccess = (data) => {
  return {
    type: actions.GET_TRENDING_POSTS_SUCCESS,
    data,
  }
}

export const getTrendingPosts = (limit, page) => {
  return (dispatch, getState) => {
    dispatch(getTrendingPostsRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/blog/posts/trends?limit=${limit}&page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
       response.headers?.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        dispatch(getTrendingPostsSuccess(response.data));
      })
      .catch(({ response }) => {
        response && response?.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(getTrendingPostsError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(getTrendingPostsError('Oops! We did something wrong.'));
        }
        return dispatch(getTrendingPostsError('Oops! We did something wrong.'));
      })
  }
}

//get latest posts
const getLatestPostsRequest = () => {
  return {
    type: actions.GET_LATEST_POSTS_REQUEST,
  }
}

const getLatestPostsError = (message) => {
  return {
    type: actions.GET_LATEST_POSTS_ERROR,
    error: message,
  }
}

const getLatestPostsSuccess = (data) => {
  return {
    type: actions.GET_LATEST_POSTS_SUCCESS,
    data,
  }
}

export const getLatestPosts = (limit, page) => {
  return (dispatch, getState) => {
    dispatch(getLatestPostsRequest());

    const { token } = getState().user;

    axios.get(`${CONFIG.BASE_URL}/blog/posts?limit=${limit}&page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then(response => {
       response.headers?.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        dispatch(getLatestPostsSuccess(response.data));
      })
      .catch(({ response }) => {
        response && response?.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
        if (response && [400, 404, 422, 403].includes(response.status)) {
          return dispatch(getLatestPostsError(response.data.error ? response.data.error : response.data.message));
        }
        if (response && [401].includes(response.status)) {
          dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
          return setTimeout(() => dispatch(logout()), 2000)
        }
        if (response && response.status >= 500) {
          return dispatch(getLatestPostsError('Oops! We did something wrong.'));
        }
        return dispatch(getLatestPostsError('Oops! We did something wrong.'));
      })
  }
}

//get single post
const getSinglePostRequest = () => {
  return {
    type: actions.GET_SINGLE_POST_REQUEST,
  }
}

const getSinglePostError = (message) => {
  return {
    type: actions.GET_SINGLE_POST_ERROR,
    error: message,
  }
}

const getSinglePostSuccess = (data) => {
  return {
    type: actions.GET_SINGLE_POST_SUCCESS,
    data,
  }
}

export const getSinglePost = (slug) => {
  return (dispatch, getState) => {
    dispatch(getSinglePostRequest());

    const { token } = getState().user;
    return new Promise((resolve, reject) => {

      axios.get(`${CONFIG.BASE_URL}/blog/posts/${slug}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
         response.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(getSinglePostSuccess(response.data));
          resolve(response.data?.data)
        })
        .catch(({ response }) => {
          reject(response)
          response && response?.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if (response && [400, 404, 422, 403].includes(response.status)) {
            return dispatch(getSinglePostError(response.data.error ? response.data.error : response.data.message));
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && response.status >= 500) {
            return dispatch(getSinglePostError('Oops! We did something wrong.'));
          }
          return dispatch(getSinglePostError('Oops! We did something wrong.'));
        })
    })
  }
}


//get single post comments
const getCommentsRequest = () => {
  return {
    type: actions.GET_COMMENTS_REQUEST,
  }
}

const getCommentsError = (message) => {
  return {
    type: actions.GET_COMMENTS_ERROR,
    error: message,
  }
}

const getCommentsSuccess = (data) => {
  return {
    type: actions.GET_COMMENTS_SUCCESS,
    data,
  }
}

export const getComments = (slug, page, limit) => {
  return (dispatch, getState) => {
    dispatch(getCommentsRequest());

    const { token } = getState().user;
    return new Promise((resolve, reject) => {

      axios.get(`${CONFIG.BASE_URL}/blog/posts/${slug}/comments?page=${page}&limit=${limit}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
         response.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(getCommentsSuccess(response.data));
          resolve(response.data)
        })
        .catch(({ response }) => {
          reject(response)
          response && response?.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if (response && [400, 404, 422, 403].includes(response.status)) {
            return dispatch(getCommentsError(response.data.error ? response.data.error : response.data.message));
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && response.status >= 500) {
            return dispatch(getCommentsError('Oops! We did something wrong.'));
          }
          return dispatch(getCommentsError('Oops! We did something wrong.'));
        })
    })
  }
}

//post single comments
const postCommentRequest = () => {
  return {
    type: actions.POST_COMMENT_REQUEST,
  }
}

const postCommentError = (message) => {
  return {
    type: actions.POST_COMMENT_ERROR,
    error: message,
  }
}

const postCommentSuccess = (data) => {
  return {
    type: actions.POST_COMMENT_SUCCESS,
    data,
  }
}

export const postComment = (slug, payload) => {
  return (dispatch, getState) => {
    dispatch(postCommentRequest());

    const { token } = getState().user;
    return new Promise((resolve, reject) => {

      axios.post(`${CONFIG.BASE_URL}/blog/posts/${slug}/comments`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
         response.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(postCommentSuccess(response.data));
          dispatch(showAlert({ type: 'success', message: 'Comment posted successfully' }))
          resolve(response.data?.data)
        })
        .catch(({ response }) => {
          reject(response)
          response && response?.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if (response && [400, 404, 422].includes(response.status)) {
            return dispatch(postCommentError(response.data.error ? response.data.error : response.data.message));
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && [403].includes(response.status)) {
            return dispatch(showAlert({ type: 'error', message: response.data.message }))
          }
          if (response && response.status >= 500) {
            return dispatch(postCommentError('Oops! We did something wrong.'));
          }
          return dispatch(postCommentError('Oops! We did something wrong.'));
        })
    })
  }
}

//reply single comments
const replyCommentRequest = () => {
  return {
    type: actions.REPLY_COMMENT_REQUEST,
  }
}

const replyCommentError = (message) => {
  return {
    type: actions.REPLY_COMMENT_ERROR,
    error: message,
  }
}

const replyCommentSuccess = (data) => {
  return {
    type: actions.REPLY_COMMENT_SUCCESS,
    data,
  }
}

export const replyComment = (slug, commentId, payload) => {
  return (dispatch, getState) => {
    dispatch(replyCommentRequest());

    const { token } = getState().user;
    return new Promise((resolve, reject) => {

      axios.post(`${CONFIG.BASE_URL}/blog/posts/${slug}/comments/${commentId}/reply`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
         response.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(replyCommentSuccess(response.data));
          dispatch(showAlert({ type: 'success', message: 'Reply sent successfully' }))
          resolve(response.data?.data)
        })
        .catch(({ response }) => {
          reject(response)
          response && response?.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          if (response && [400, 404, 422].includes(response.status)) {
            return dispatch(replyCommentError(response.data.error ? response.data.error : response.data.message));
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && [403].includes(response.status)) {
            return dispatch(showAlert({ type: 'error', message: response.data.message }))
          }
          if (response && response.status >= 500) {
            return dispatch(replyCommentError('Oops! We did something wrong.'));
          }
          return dispatch(replyCommentError('Oops! We did something wrong.'));
        })
    })
  }
}

//LIKE single comments
const likeCommentRequest = () => {
  return {
    type: actions.LIKE_COMMENT_REQUEST,
  }
}

const likeCommentError = (message) => {
  return {
    type: actions.LIKE_COMMENT_ERROR,
    error: message,
  }
}

const likeCommentSuccess = (data) => {
  return {
    type: actions.LIKE_COMMENT_SUCCESS,
    data,
  }
}

export const likeComment = (commentId, payload) => {
  return (dispatch, getState) => {
    dispatch(likeCommentRequest());

    const { token } = getState().user;
    return new Promise((resolve, reject) => {

      axios.post(`${CONFIG.BASE_URL}/blog/posts/comments/${commentId}/like`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
         response.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(likeCommentSuccess(response.data));
          dispatch(showAlert({ type: 'success', message: response.data?.message }))
          resolve(response.data?.data)
        })
        .catch(({ response }) => {
          reject(response)
        response && response?.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
          if (response && [400, 404, 422].includes(response.status)) {
            return dispatch(likeCommentError(response.data.error ? response.data.error : response.data.message));
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && [403].includes(response.status)) {
            return dispatch(showAlert({ type: 'error', message: response.data.message }))
          }
          if (response && response.status >= 500) {
            return dispatch(likeCommentError('Oops! We did something wrong.'));
          }
          return dispatch(likeCommentError('Oops! We did something wrong.'));
        })
    })
  }
}

//GET CATEGORY POSTS
const getCategoryPostsRequest = () => {
  return {
    type: actions.GET_CATEGORY_POSTS_REQUEST,
  }
}

const getCategoryPostsError = (message) => {
  return {
    type: actions.GET_CATEGORY_POSTS_ERROR,
    error: message,
  }
}

const getCategoryPostsSuccess = (data) => {
  return {
    type: actions.GET_CATEGORY_POSTS_SUCCESS,
    data,
  }
}

export const getCategoryPosts = (slug, page, limit) => {
  return (dispatch, getState) => {
    dispatch(getCategoryPostsRequest());

    const { token } = getState().user;
    return new Promise((resolve, reject) => {

      axios.get(`${CONFIG.BASE_URL}/blog/category/${slug}?page=${page}&limit=${limit}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
         response.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(getCategoryPostsSuccess(response.data));
          resolve(response.data?.data)
        })
        .catch(({ response }) => {
          reject(response)
        response && response?.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
          if (response && [400, 404, 422].includes(response.status)) {
            return dispatch(getCategoryPostsError(response.data.error ? response.data.error : response.data.message));
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && [403].includes(response.status)) {
            return dispatch(showAlert({ type: 'error', message: response.data.message }))
          }
          if (response && response.status >= 500) {
            return dispatch(getCategoryPostsError('Oops! We did something wrong.'));
          }
          return dispatch(getCategoryPostsError('Oops! We did something wrong.'));
        })
    })
  }
}

//FILTER BLOG POSTS
const filterPostsRequest = () => {
  return {
    type: actions.FILTER_POSTS_REQUEST,
  }
}

const filterPostsError = (message) => {
  return {
    type: actions.FILTER_POSTS_ERROR,
    error: message,
  }
}

const filterPostsSuccess = (data) => {
  return {
    type: actions.FILTER_POSTS_SUCCESS,
    data,
  }
}

export const filterPosts = (search, page, limit) => {
  return (dispatch, getState) => {
    dispatch(filterPostsRequest());

    const { token } = getState().user;
    return new Promise((resolve, reject) => {

      axios.get(`${CONFIG.BASE_URL}/blog/posts/filter?search=${search}&page=${page}&limit=${limit}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then(response => {
         response.headers.authorization && dispatch(updateUser({
            token: response.headers.authorization
          }))
          dispatch(filterPostsSuccess(response.data));
          resolve(response.data?.data)
        })
        .catch(({ response }) => {
          reject(response)
        response && response?.headers.authorization && dispatch(updateUser({
          token: response.headers.authorization
        }))
          if (response && [400, 404, 422, 403].includes(response.status)) {
            return dispatch(filterPostsError(response.data.error ? response.data.error : response.data.message));
          }
          if (response && [401].includes(response.status)) {
            dispatch(showAlert({ type: 'error', message: 'Your session has expired' }))
            return setTimeout(() => dispatch(logout()), 2000)
          }
          if (response && response.status >= 500) {
            return dispatch(filterPostsError('Oops! We did something wrong.'));
          }
          return dispatch(filterPostsError('Oops! We did something wrong.'));
        })
    })
  }
}