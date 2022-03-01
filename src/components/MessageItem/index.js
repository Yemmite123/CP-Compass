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
    if (this.props.message) {
      this.messageRef.current.innerHTML = this.props.message.message ? `${this.props.message.message.replace(/(\r\n|\n|\r)/gm, "<br />")}` : ""
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.message !== this.props.message) {
      this.messageRef.current.innerHTML = `${this.props.message.message.replace(/(\r\n|\n|\r)/gm, "<br />")}`
    }
  }

  render() {
    const { message, viewImage } = this.props;
    return (
      <div className="message-item">
        <div className={`d-flex message__box__${message && message?.user.isStaff ? 'admin' : 'you'}`}>
          <div className='d-flex justify-content-center m-2 text-center ' style={{ width: "50px", height: "50px", border: "2px solid rgba(58, 64, 128, 0.1)", borderRadius: "50%" }}>
            {/* {message?.user */}
            <span className="font-bold text-blue align-self-center">
              {message?.user.firstName ? message?.user.firstName[0] + message?.user.lastName[0] : ""}
            </span>
          </div>
          {/* <img src={message && message?.user.isStaff ? AdminDefault : (message?.user.pictureUrl ? message?.user.pictureUrl : DefaultProfile)} className="img-fluid avatar" alt="user" /> */}
          <div className="w-75">
            {/*  <div className="d-flex justify-content-between">
              <p className="text-small">{message && message?.user.isStaff ? 'Admin' : 'You'}</p>
            </div> 
          */}
            <div className={`message message-${message && message?.user.isStaff ? 'admin' : 'you'}`}>
              <p className="text-grey text-small font-weight-normal" ref={this.messageRef}></p>
            </div>
            <div className="align-items-center position-relative mt-2">
              {message?.attachment?.length > 0 && message?.attachment?.map(item => (
                <div key={Math.random() * 1000} className="d-inline-block position-relative">
                  {item && checkFileType(item) === 'image' &&
                    <img src={item} alt="attachment" className="shadow rounded-lg attachment-img img-fluid cursor-pointer" onClick={() => viewImage(item)} />
                  }
                  {item && checkFileType(item) === 'file' &&
                    <div className="d-flex align-items-center">
                      <img src={Attachment} alt="attachment" className="mr-2 img-fluid attachment-img rounded-lg" />
                      <a className="file-type" href={item} target="_blank" rel="noopener noreferrer">view attachment</a>
                    </div>
                  }
                  <div className='attachment-info'>
                    <p>   {checkFileType(item) === 'file' ? "Image" : "File"}</p>
                  </div>
                </div>
              ))
              }

            </div>
            <p className="text-xs text-grey mt-1">{message && moment(message.created_at).format('hh:mm A MMM D, YYYY')}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default MessageItem;
