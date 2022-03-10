import React from 'react';
import moment from 'moment';
import DefaultImg from '#/assets/icons/profile-icon.svg';
import LikeIcon from '#/assets/icons/like-icon.svg';
import LikeBlueIcon from '#/assets/icons/like-blue.svg';
import ReplyIcon from '#/assets/icons/reply-icon.svg';
import { checkLike } from '#/utils'
import './style.scss';

const CommentItem = ({ comment, onLike, onUnLike, onReply, likes, ...props }) => {

  const handleLikeComment = (id) => {
    onLike(id, 'like')
  }

  const handleUnLikeComment = (id) => {
    onUnLike(id, 'unlike')
  }

  const handleReplyComment = () => {
    onReply(comment.id)
  }

  return (
    <div className="comment-item mt-3">
      <div className="d-flex align-items-start">
        <img src={comment?.user?.pictureUrl ? comment?.user?.pictureUrl : DefaultImg} alt="user" className="img-fluid mr-3 profile-photo" />
        <div className="pb-3">
          <p className="font-weight-bold mb-0">{comment?.user?.firstName} {comment?.user?.lastName}</p>
          <p className="mb-0">{comment?.comment}</p>
          <div className="d-flex align-items-center mt-2 flex-wrap">
            <div>
              <p className="mr-3 mb-0 text-l-small text-grey">{moment(moment(comment?.created_at).toDate()).fromNow()}</p>
            </div>
            <div className="d-flex">
              <img src={checkLike(likes, comment.id) ? LikeBlueIcon : LikeIcon} alt="like" className="img-fluid mr-2 cursor-pointer" onClick={() => checkLike(likes, comment.id) ? handleUnLikeComment(comment.id) : handleLikeComment(comment.id)} />
              <p className="mr-3 mb-0 text-l-small text-grey">{comment?.__meta__.likes_count} Like(s)</p>
            </div>
            <div className="d-flex">
              <div className="d-flex">
                <img src={ReplyIcon} alt="like" className="img-fluid cursor-pointer" onClick={handleReplyComment} />
                <p className="cursor-pointer mb-0 text-l-small text-blue ml-1" onClick={handleReplyComment}> Reply</p>
              </div>
              <p className="ml-2 mb-0 text-l-small text-grey"> {comment.replies?.length} Replies</p>
            </div>
          </div>
        </div>
      </div>
      {comment.replies?.length > 0 &&
        comment.replies?.map(reply => (
          <div className="ml-5" key={reply.id}>
            <div className="d-flex align-items-start">
              <img src={reply?.user?.pictureUrl ? reply?.user?.pictureUrl : DefaultImg} alt="user" className="img-fluid mr-3 profile-photo" />
              <div className="pb-3">
                <p className="font-weight-bold mb-0">{reply?.user?.firstName} {reply?.user?.lastName}</p>
                <p className="mb-0">{reply?.comment}</p>
                <div className="d-flex align-items-center mt-2">
                  <p className="mr-3 mb-0 text-l-small text-grey">{moment(moment(reply?.created_at).toDate()).fromNow()}</p>
                  <img src={checkLike(likes, reply.id) ? LikeBlueIcon : LikeIcon} alt="like" className="img-fluid mr-2 cursor-pointer" onClick={() => checkLike(likes, reply.id) ? handleUnLikeComment(reply.id) : handleLikeComment(reply.id)} />
                  <p className="mr-3 mb-0 text-l-small text-grey">{reply?.__meta__.likes_count} Like(s)</p>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default CommentItem;
