import React from 'react';
import moment from 'moment';
import { checkFileType } from '#/utils';
import AdminDefault from '#/assets/icons/admin-default-img.svg';
import DefaultProfile from '#/assets/icons/profile-icon.svg';
import Attachment from '#/assets/icons/attachment.svg';
import './style.scss';

class MessageItem extends React.Component {

  messageRef = React.createRef();

  componentDidMount() {
    if(this.props.message) {
      this.messageRef.current.innerHTML = `${this.props.message.message.replace(/(\r\n|\n|\r)/gm, "<br />")}`
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.message !== this.props.message) {
      this.messageRef.current.innerHTML = `${this.props.message.message.replace(/(\r\n|\n|\r)/gm, "<br />")}`
    }
  }

  render() {
    const { message, viewImage } = this.props;
    return (
      <div className="message-item">
        <div className="d-flex">
          <img src={message && message?.user.isStaff ? AdminDefault : (message?.user.pictureUrl ? message?.user.pictureUrl : DefaultProfile)} className="img-fluid avatar" alt="user" />
          <div className="w-100">
            <div className="d-flex justify-content-between">
              <p className="text-small">{message && message?.user.isStaff ? 'Admin' : 'You'}</p>
              <p className="text-small text-grey ">{message && moment(message.created_at).format('hh:mm A MMM D, YYYY')}</p>
            </div>
            <p className="text-grey text-small" ref={this.messageRef}></p>
            <div className="d-flex align-items-center">
              {message?.attachment?.length > 0 && message?.attachment?.map(item => (
                <div key={Math.random() * 1000}>
                  {item && checkFileType(item) === 'image' &&
                    <img src={item} alt="attachment" className="attachment-img img-fluid cursor-pointer" onClick={() => viewImage(item)} />
                  }
                  {item && checkFileType(item) === 'file' &&
                    <div className="d-flex align-items-center">
                      <img src={Attachment} alt="attachment" className="mr-2 img-fluid" />
                      <a className="file-type" href={item} target="_blank" rel="noopener noreferrer">view attachment</a>
                    </div>
                  }
                </div>
              ))
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MessageItem;