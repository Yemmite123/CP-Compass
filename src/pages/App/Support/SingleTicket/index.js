import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/support/actionTypes";
import { getSingleTicket, sendMessage } from '#/store/support/actions'
import Back from '#/components/Back';
import MessageItem from '#/components/MessageItem';
import Attachment from '#/assets/icons/attachment.svg';
import SendMessage from '#/assets/icons/send-message.svg';
import { validateFields , serializeErrors} from '#/utils'
import './style.scss';
import Modal from '#/components/Modal';

class SingleTicket extends React.Component {

  state = {
    message: '',
    files: [],
    fileNames: [],
    messages: [],
    image: '',
    showImageModal: false,
    }
  imgRef = React.createRef();

  componentDidMount() {
    const { params } = this.props.match;
    this.props.getSingleTicket(params.ticketId)
      .then(data => {
        this.updateMessages(data.ticket?.ticketResponses);
      })
  }

  updateMessages = (messages) => {
    this.setState({ messages: [...this.state.messages, ...messages] })
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value });

    if(name === 'message' && event.keyCode === 13){
      return this.submitMessage()
    }
  }

  handleFileClick = (e) => {
    e.preventDefault();
    this.imgRef.current.click()
  }

  handleImageSelect = (event) => {
    event.persist()
    const { target } = event;
    const { fileNames, files } = this.state

    if(target.files[0]){
      this.setState({ files: [...files, ...target.files], fileNames: [...fileNames, ...target.files]})
    }
  }

  handleShowImage = (image) => {
    this.setState({ image }, () => {
      this.toggleImageModal()
    })
  }

  removeAttachment = (index) => {
    const { files } = this.state;
    const updatedFiles = [...files].filter((v, i) => i !==index);
    
    this.setState({ files: updatedFiles})
  }

  submitMessage = (event) => {
    event.preventDefault()
    const { sendMessage, user } = this.props;
    const { params } = this.props.match;
    const { message, files, messages } = this.state;

    const data = this.state;
    const required = [ 'message'];
    const errors = validateFields(data, required)

    if (Object.keys(errors).length > 0 && !files) {
      return;
    }

    const formData = new FormData();

    for(var x = 0; x < files.length; x++) {
      formData.append(files.length > 1 ? 'attachment' : 'attachment[]', files[x])
    }
    formData.append('message', message);

    sendMessage(params.ticketId, formData)
      .then(data => {
        const messageItem = {...data,
          user: { picture: user.pictureUrl, isStaff: 0, }
        }
        this.setState({ messages: [...messages, messageItem ], message: '', files: [], fileNames: [] })
      });
  }
  
  toggleImageModal = () => {
    this.setState(prevState => ({ showImageModal: !prevState.showImageModal }));
  }

  render() {
    const { ticket, loading, sendLoading, error } = this.props;
    const { message, files, messages, image, showImageModal } = this.state;
    const errorObject = serializeErrors(error);

    return (
      <div className="single-ticket-page">
        <Back/>
        {showImageModal && 
          <Modal onClose={this.toggleImageModal}>
            <img src={image} alt="attachment" className="img-fluid" />
          </Modal>
        }
        <div className="border p-4 text-center mt-3">
          {loading &&
            <div className="text-center">
              <div className="spinner-border spinner-border-primary text-primary spinner-border-md mr-2"></div>
            </div>
          }
          <h3 className="text-deep-blue text-medium mb-0 ticket-title">
            {ticket && ticket.title}
          </h3>
        </div>
        <div className="message-container">
          {messages && messages.length > 0 && messages.map(message => (
            <MessageItem message={message} key={message.id} viewImage={this.handleShowImage}/>
            ))
          }
        </div>
        <div className=" border message-area p-3 mt-2">
          <div className="d-flex w-100">
            <form onSubmit={this.submitMessage}>
              <textarea
                placeholder="Send a message..."
                className="border-0 w-100"
                value={message}
                name="message"
                onChange={this.handleChange}
                type="text"
              />
            </form>
            
            <div className="d-flex align-items-center justify-content-center cursor-pointer attachment-section" onClick={this.handleFileClick}>
              <img src={Attachment} alt="attachment"/>
            </div>
            <div className="bg-default d-flex align-items-center justify-content-center send-message cursor-pointer" onClick={this.submitMessage}>
              {!sendLoading && <img src={SendMessage} alt="send"/> }
              {sendLoading &&
              <div className="spinner-border text-white spinner-border-sm"></div>
              }
            </div>
          </div>
          <div className="d-flex">
              {files && files.length > 0  && 
              files.map((file, index) => (
                <div className="file-items" key={index}>
                  <p>{file && file.name}</p>
                  <p className="text-x-small mb-0 remove-item" onClick={() => this.removeAttachment(index)}>remove</p>
                </div>
              ))
              }
          </div>
        </div>
        <p className="text-error text-left">{errorObject && errorObject['attachment.0']}</p>
        {error && typeof error === 'string' && <p className="text-error mt-2">{error}</p>}
        <input type="file" className="file" ref={this.imgRef} accept="image/png, image/jpeg, application/pdf" onChange={this.handleImageSelect} multiple/> 
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { app: { support: { ticket, error }, profile: { userProfile: { data: user } } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_SINGLE_TICKET_REQUEST),
    sendLoading: getActionLoadingState(state, actionTypes.SEND_MESSAGE_REQUEST),
    ticket,
    user,
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSingleTicket: (id) => dispatch(getSingleTicket(id)),
    sendMessage: (id, payload) => dispatch(sendMessage(id, payload)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleTicket));
