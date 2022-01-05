import * as actions from './actionTypes';

const blogDefaultState = {
  data: null,
  error: false,
  posts: null,
  post: null,
  comments: null,
  category: null,
  trending: null,
  recent: null,
  filter: null,
}

export default (state = blogDefaultState, action) => {
  switch (action.type) {
    case actions.GET_LATEST_POSTS_SUCCESS:
      return { ...state, error: false, data: action.data, posts: action.data.data }
    case actions.GET_LATEST_POSTS_ERROR:
      return { ...state, error: action.error }
    case actions.GET_TRENDING_POSTS_SUCCESS:
      return { ...state, error: false, data: action.data, trending: action.data.data }
    case actions.GET_TRENDING_POSTS_ERROR:
      return { ...state, error: action.error }
    case actions.GET_RECENT_POSTS_SUCCESS:
      return { ...state, error: false, data: action.data, recent: action.data.data }
    case actions.GET_RECENT_POSTS_ERROR:
      return { ...state, error: action.error }
    case actions.GET_SINGLE_POST_SUCCESS:
      return { ...state, error: false, post: action.data.data }
    case actions.GET_SINGLE_POST_ERROR:
      return { ...state, error: action.error }
    case actions.GET_COMMENTS_SUCCESS:
      return { ...state, error: false, comments: action.data.data }
    case actions.GET_COMMENTS_ERROR:
      return { ...state, error: action.error }
    case actions.POST_COMMENT_SUCCESS:
      return { ...state, error: false, comments: action.data.data }
    case actions.POST_COMMENT_ERROR:
      return { ...state, error: action.error }
    case actions.REPLY_COMMENT_SUCCESS:
      return { ...state, error: false, data: action.data.data }
    case actions.REPLY_COMMENT_ERROR:
      return { ...state, error: action.error }
    case actions.LIKE_COMMENT_SUCCESS:
      return { ...state, error: false, data: action.data.data }
    case actions.LIKE_COMMENT_ERROR:
      return { ...state, error: action.error }
    case actions.GET_CATEGORY_POSTS_SUCCESS:
      return { ...state, error: false, data: action.data.data, category: action.data.data }
    case actions.GET_CATEGORY_POSTS_ERROR:
      return { ...state, error: action.error }
    case actions.FILTER_POSTS_SUCCESS:
      return { ...state, error: false, data: action.data.data, filter: action.data.data }
    case actions.FILTER_POSTS_ERROR:
      return { ...state, error: action.error }
    default:
      return state;
  }
}