import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import moment from 'moment';
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/blog/actionTypes";
import { getSinglePost, getComments, postComment, replyComment, likeComment } from '#/store/blog/actions';
import { showAlert } from '#/store/ui/actions';
import Back from '#/components/Back';
import CommentItem from '#/components/CommentItem';
import Modal from '#/components/Modal';
import Textbox from '#/components/Textbox';
import BlogItem from '#/components/BlogItem';
import AdminImg from '#/assets/images/admin-default-img.svg';
import DefaultImg from '#/assets/icons/profile-icon.svg';
import CopyLink from '#/assets/icons/copy-link.svg';
import { validateFields, serializeErrors } from '#/utils';
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  // LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon
} from "react-share";
import './style.scss';
import CONFIG from '#/config';

class SingleInsight extends React.Component {
  contentRef = React.createRef();

  state = {
    comment: '',
    errors: null,
    commentPage: 1,
    commentLimit: 10,
    comments: [],
    replyModal: false,
    selectedComment: null,
    commentReply: '',
    email: ""
  }

  componentDidMount() {
    const { match: { params }, getSinglePost, getComments } = this.props
    const { commentPage, commentLimit } = this.state;
    getComments(params.slug, commentPage, commentLimit)
      .then(data => {
        this.updateComments(data?.data)
      });
    getSinglePost(params.slug)
    .then(data => {
      if (this.contentRef.current) {
        this.contentRef.current.innerHTML = `${data.post.content}`
      }
    });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.location?.state?.routeName !== this.props.location?.state?.routeName) {
      const { match: { params }, getSinglePost, getComments } = this.props
      const { commentPage, commentLimit } = this.state;
      getComments(params.slug, commentPage, commentLimit)
        .then(data => {
          this.updateComments(data?.data)
        });
      getSinglePost(params.slug)
      .then(data => {
        if (this.contentRef.current) {
          this.contentRef.current.innerHTML = `${data.post.content}`
        }
      });
    }
  }

  updateComments = (data) => {
    this.setState({ comments:  data})
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  }
  
  handleNavigateToCategory(categoryName) {
    this.props.history.push({
      pathname: `/app/blogs/category/${categoryName}`,
      state: { routeName: categoryName}
    })
  }

  handlePostComment = (event) => {
    const { match: { params }, postComment, getComments  } = this.props
    const { comment, commentPage, commentLimit } = this.state;
    event.preventDefault();
    this.setState({ errors: null });

    const data = this.state;
    const required = ['comment'];
    const errors = validateFields(data, required)

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    postComment(params.slug, { comment  })
      .then(data => {
        this.setState({ comment: '' })
        getComments(params.slug, commentPage, commentLimit)
        .then(data => {
          this.updateComments(data?.data)
        });
      })
  }

  handlePostReply = (event) => {
    event.preventDefault();
    const { match: { params }, replyComment, getComments  } = this.props
    const { selectedComment, commentReply, commentPage, commentLimit  } = this.state;
    this.setState({ errors: null });

    const data = this.state;
    const required = ['commentReply'];
    const errors = validateFields(data, required)

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    replyComment(params.slug, selectedComment, { comment: commentReply  })
      .then(data => {
        this.setState({ commentReply: '' })
        this.toggleReplyModal();
        getComments(params.slug, commentPage, commentLimit)
          .then(data => {
            this.updateComments(data?.data)
          });
      })
  }

  handleReply = (comment) => {
    this.setState({ selectedComment: comment });
    this.toggleReplyModal();
  }

  toggleReplyModal = () => {
    this.setState(prevState =>  ({ replyModal: !prevState.replyModal}));
  }

  handleLikeComment = (commentId, type) => {
    const { match: { params }, likeComment, getComments  } = this.props
    const { commentPage, commentLimit  } = this.state;
    likeComment(commentId, { like: type})
      .then(data => {
        getComments(params.slug, commentPage, commentLimit)
          .then(data => {
            this.updateComments(data?.data)
          });
      })
  }

  handleNavigateToPost = (insight) => {
    this.props.history.push({
      pathname: `/app/blogs/blog/${insight.slug}`,
      state: { routeName: insight.title }
    })
  }

  shareToLinkedin = () => {
    const url = `http://www.linkedin.com/shareArticle?mini=true&url=${CONFIG.WEBSITE_URL}`;
    window.open(url, '_blank');
  }

  copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    this.props.showAlert({ type: 'success', message: 'Link copied!' })
  }

  render() {
    const { post, userData, blogError, postLoading, replyLoading, loading } = this.props;
    const { comment, errors, replyModal, commentReply, comments } = this.state;
    const errorObject = serializeErrors(blogError);

    return (
      <div className="single-insight-page">
        {replyModal &&
          <Modal onClose={this.toggleReplyModal}>
            <h3>Reply Comment</h3>
              <textarea 
                placeholder="Share your thoughts"
                className="p-3 w-100"
                rows="3"
                name="commentReply"
                value={commentReply}
                onChange={this.handleChange}
              />
              <p className="text-error mt-0 mb-0">{errors ? errors.commentReply : (errorObject && errorObject['commentReply'])}</p>
            <button className="btn btn-primary btn-sm mt-2" onClick={this.handlePostReply}>
              Submit
              {replyLoading &&
                <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
              }
            </button>
          </Modal>
          }
        <Back />
        <hr />
        {loading &&
          <div className="text-center">
            <div className="spinner-border text-blue spinner-border-md ml-2"></div>
          </div>
        }
        {post?.post &&
          <>
          <div className="">

            <div className="">
           
              <img
                className="feature-img img-fluid mt-3"
                alt="feature"
                src={post?.post?.image}
              />
                  <h3 className="mt-4 font-weight-bold">{post?.post?.title}</h3>

                 <div className="d-flex align-items-center mt-3 mb-3">
                  <img src={post?.post?.user?.pictureUrl ? post?.post?.user?.pictureUrl : AdminImg } className="mr-3 profile-photo" alt="author" />
                  <p className="mb-0">{post?.post?.user?.firstName} {post?.post?.user?.lastName} on {moment(post?.post?.created_at).format('MMM DD, YYYY')}</p>
                </div>
                <div className='row'>
                  <div className="content mt-3 pb-4 col-md-11">
                    <div ref={this.contentRef}></div>
                  </div>

                  <div className="col-md-1">
                    <div className="d-flex flex-column align-items-center flex-wrap social-share">

                        <LinkedinIcon size={25} round={true} onClick={this.shareToLinkedin} className="my-1 cursor-pointer" />
                      <WhatsappShareButton className="my-1" url={window.location.href} title={post?.post?.title}>
                        <WhatsappIcon size={25} round={true} />
                      </WhatsappShareButton>
                      <EmailShareButton className="my-1" url={window.location.href} subject={post?.post?.title} body={`${post?.post?.description}... \n \n Read full news here: \n`} separator={''}>
                        <EmailIcon size={25} round={true} />
                      </EmailShareButton>
                      <TwitterShareButton className="my-1" url={window.location.href} title={post?.post?.title} hashtag={['#CPCompass', '#investment']}>
                        <TwitterIcon size={25} round={true} />
                      </TwitterShareButton>
                      <FacebookShareButton quote={post?.post?.title} url={window.location.href} hashtag='#CPCompass'>
                        <FacebookIcon size={25} round={true} />
                      </FacebookShareButton>
                      {/* <img src={CopyLink} alt="copy" className="ml-2 cursor-pointer" onClick={this.copyLink}/> */}
                    </div>
                  </div>
                </div>

            </div>
          </div>

            <div className="d-flex align-items-start comment-box mt-5">
              <img src={userData?.pictureUrl ? userData?.pictureUrl : DefaultImg} alt="user" className="mr-3 profile-photo"/>
              <div className="w-100">
                <form onSubmit={this.handlePostComment}>
                  <textarea 
                    placeholder="Share your thoughts"
                    className="p-3"
                    rows="3"
                    name="comment"
                    value={comment}
                    onChange={this.handleChange}
                  />
                <p className="text-error mt-0 mb-0">{errors ? errors.comment : (errorObject && errorObject['attachment'])}</p>
                  <div className="text-right">
                    <button className="btn btn-primary btn-sm mt-2" onClick={this.handlePostComment}>
                      Submit
                      {postLoading &&
                        <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div>
            {comments?.data && comments?.data?.length > 0 ?
            comments?.data?.map(comment => (
              <CommentItem
                comment={comment}
                onUnLike={this.handleLikeComment}
                onLike={this.handleLikeComment}
                onReply={this.handleReply}
                key={comment.id}
                likes={comments?.likes}
                />
            ))
            :
            <div className="text-center w-100">
              <p className="text-deep-blue">No Comments</p>
            </div>
          }
          </div>
            <div className="recommendations mt-5">
            {post?.recommends?.length > 0 &&  <h3>More amazing articles for you</h3> }
              <div className="row mt-4">
              {post?.recommends?.length > 0 && 
                post?.recommends?.map(blogpost => (
                <div className="col-md-4" key={blogpost.id}>
                  <BlogItem item={blogpost} navigateToItem={this.handleNavigateToPost} navigateToCategory={this.handleNavigateToCategory}/>
                </div>
              ))
              }
              </div>
            </div>
          </>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { 
    app: { 
      blog,
      profile,
    } 
  } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_SINGLE_POST_REQUEST),
    postLoading: getActionLoadingState(state, actionTypes.POST_COMMENT_SUCCESS),
    replyLoading: getActionLoadingState(state, actionTypes.REPLY_COMMENT_REQUEST),
    post: blog?.post,
    userData: profile?.userProfile?.data,
    comments: blog?.comments,
    blogError: blog?.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSinglePost: (slug) => dispatch(getSinglePost(slug)),
    getComments: (slug, page, limit) => dispatch(getComments(slug, page, limit)),
    postComment: (slug, payload) => dispatch(postComment(slug, payload)),
    replyComment: (slug, commentId, payload) => dispatch(replyComment(slug, commentId, payload)),
    likeComment: (commentId, payload) => dispatch(likeComment(commentId, payload)),
    showAlert: (payload) => dispatch(showAlert(payload)),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleInsight));
