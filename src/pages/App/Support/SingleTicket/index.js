import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/support/actionTypes";
import { getSingleTicket, sendMessage } from "#/store/support/actions";
import Back from "#/components/Back";
import MessageItem from "#/components/MessageItem";
import Attachment from "#/assets/icons/attachment.svg";
import SendMessage from "#/assets/icons/send-message.svg";
import { validateFields, serializeErrors } from "#/utils";
import "./style.scss";
import Modal from "#/components/Modal";

class SingleTicket extends React.Component {
  state = {
    error: "",
    message: "",
    files: [],
    fileNames: [],
    messages: [],
    image: "",
    showImageModal: false,
  };
  imgRef = React.createRef();

  componentDidMount() {
    const { params } = this.props.match;
    this.props.getSingleTicket(params.ticketId).then((data) => {
      this.updateMessages(data.ticket?.ticketResponses);
    });
  }

  updateMessages = (messages) => {
    this.setState({ messages: [...this.state.messages, ...messages] });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });

    if (name === "message" && event.keyCode === 13) {
      return this.submitMessage();
    }
  };

  handleFileClick = (e) => {
    e.preventDefault();
    this.imgRef.current.click();
  };

  handleImageSelect = (event) => {
    event.persist();
    const { target } = event;
    const { fileNames, files } = this.state;

    if (target.files[0]) {
      this.setState({
        files: [...files, ...target.files],
        fileNames: [...fileNames, ...target.files],
      });
    }
  };

  handleShowImage = (image) => {
    this.setState({ image }, () => {
      this.toggleImageModal();
    });
  };

  removeAttachment = (index) => {
    const { files } = this.state;
    const updatedFiles = [...files].filter((v, i) => i !== index);

    this.setState({ files: updatedFiles });
  };

  submitMessage = (event) => {
    event.preventDefault();
    const { sendMessage, user } = this.props;
    const { params } = this.props.match;
    const { message, files, messages } = this.state;

    const data = this.state;
    const required = ["message"];
    const errors = validateFields(data, required);

    this.setState({ error: "" })

    if (!message && !files.length) {
      return this.setState({ error: "Field is required" })
    }

    if (Object.keys(errors).length > 0 && !files) {
      return;
    }

    const formData = new FormData();

    for (var x = 0; x < files.length; x++) {
      formData.append(
        files.length > 1 ? "attachment" : "attachment[]",
        files[x]
      );
    };

    formData.append("message", message);

    sendMessage(params.ticketId, formData).then((data) => {
      const messageItem = {
        ...data,
        user: { picture: user.pictureUrl, isStaff: 0, firstName: user.firstName, lastName: user.lastName },
      };

      this.setState({
        messages: [...messages, messageItem],
        message: "",
        files: [],
        fileNames: [],
      });
    });
  };

  toggleImageModal = () => {
    this.setState((prevState) => ({
      showImageModal: !prevState.showImageModal,
    }));
  };

  render() {
    const { ticket, loading, sendLoading, error } = this.props;
    const { message, files, messages, image, showImageModal } = this.state;
    const errorObject = serializeErrors(error);

    return (
      <div className="single-ticket-page">
        {showImageModal && (
          <Modal onClose={this.toggleImageModal}>
            <img src={image} alt="attachment" className="img-fluid" />
          </Modal>
        )}
        <div className="p-1 text-center mt-1">
          {loading && (
            <div className="text-center">
              <div className="spinner-border spinner-border-primary text-primary spinner-border-md mr-2"></div>
            </div>
          )}
          <h3 className="text-deep-blue text-medium mb-0 ticket-title">
            {ticket && ticket.title}
          </h3>
        </div>
        <div className="message-container border-top rounded-top border-left border-right">
          {messages &&
            messages.length > 0 &&
            messages.map((message) => (
              <MessageItem
                message={message}
                key={message.id}
                viewImage={this.handleShowImage}
              />
            ))}
        </div>
        <div className=" border rounded-bottom message-area pl-3 py-1 pr-3">
          <div className="d-flex w-100">
            <form onSubmit={this.submitMessage}>
              <textarea
                placeholder="Compose a message..."
                className="ps-3 border-0 w-100 message-input"
                value={message}
                name="message"
                onChange={this.handleChange}
                type="text"
              />
            </form>
            <div
              className="d-flex align-items-center justify-content-center cursor-pointer attachment-section"
              onClick={this.handleFileClick}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM5 11H7C7 11.7956 7.31607 12.5587 7.87868 13.1213C8.44129 13.6839 9.20435 14 10 14C10.7956 14 11.5587 13.6839 12.1213 13.1213C12.6839 12.5587 13 11.7956 13 11H15C15 12.3261 14.4732 13.5979 13.5355 14.5355C12.5979 15.4732 11.3261 16 10 16C8.67392 16 7.40215 15.4732 6.46447 14.5355C5.52678 13.5979 5 12.3261 5 11ZM6 9C5.60218 9 5.22064 8.84196 4.93934 8.56066C4.65804 8.27936 4.5 7.89782 4.5 7.5C4.5 7.10218 4.65804 6.72064 4.93934 6.43934C5.22064 6.15804 5.60218 6 6 6C6.39782 6 6.77936 6.15804 7.06066 6.43934C7.34196 6.72064 7.5 7.10218 7.5 7.5C7.5 7.89782 7.34196 8.27936 7.06066 8.56066C6.77936 8.84196 6.39782 9 6 9ZM14 9C13.6022 9 13.2206 8.84196 12.9393 8.56066C12.658 8.27936 12.5 7.89782 12.5 7.5C12.5 7.10218 12.658 6.72064 12.9393 6.43934C13.2206 6.15804 13.6022 6 14 6C14.3978 6 14.7794 6.15804 15.0607 6.43934C15.342 6.72064 15.5 7.10218 15.5 7.5C15.5 7.89782 15.342 8.27936 15.0607 8.56066C14.7794 8.84196 14.3978 9 14 9Z"
                  fill="#3A4080"
                />
              </svg>
            </div>
            <div
              className="d-flex align-items-center justify-content-center cursor-pointer attachment-section"
              onClick={this.handleFileClick}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.9885 8.71862L9.6135 17.1145C7.9885 18.7386 5.34516 18.7386 3.721 17.1145C2.09683 15.4903 2.096 12.8461 3.721 11.2211L12.5777 2.40029C13.5527 1.42529 15.1385 1.42529 16.1135 2.40029C17.0877 3.37529 17.0885 4.96029 16.1135 5.93529L9.02433 12.9886C8.69933 13.3136 8.171 13.3136 7.846 12.9886C7.521 12.6636 7.521 12.1353 7.846 11.8103L13.7568 5.93529L12.5777 4.75695L6.66683 10.6311C5.69016 11.6078 5.691 13.192 6.66683 14.1678C7.64266 15.1436 9.226 15.1436 10.2018 14.1678L17.291 7.11445C18.1052 6.30029 18.511 5.23445 18.511 4.16779C18.511 1.86029 16.6393 0.00195312 14.3443 0.00195312C13.2777 0.00195312 12.2118 0.40862 11.3977 1.22279L2.54183 10.042C1.4035 11.182 0.833496 12.6745 0.833496 14.1678C0.833496 17.387 3.44183 20.0011 6.66683 20.0011C8.16016 20.0011 9.65266 19.4311 10.7918 18.2928L19.1668 9.89695L17.9885 8.71862Z"
                  fill="#3A4080"
                />
              </svg>
            </div>
            <div
              className="d-flex align-items-center justify-content-center send-message cursor-pointer"
              onClick={this.submitMessage}
            >
              <svg
                width="20"
                height="19"
                viewBox="0 0 20 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.07206 10.5857L8.29507 9.34104C8.85073 9.23004 8.85073 9.04937 8.29507 8.93837L2.07206 7.6937C1.70139 7.6197 1.34039 7.25837 1.26639 6.88803L0.0217195 0.665024C-0.089614 0.109023 0.238053 -0.149311 0.753054 0.0883562L19.7428 8.8527C20.0858 9.01104 20.0858 9.26837 19.7428 9.4267L0.753054 18.191C0.238053 18.4287 -0.089614 18.1704 0.0217195 17.6144L1.26639 11.3914C1.34039 11.021 1.70139 10.6597 2.07206 10.5857Z"
                  fill="#3A4080"
                />
              </svg>

              {sendLoading && (
                <div className="spinner-border text-white spinner-border-sm"></div>
              )}
            </div>
          </div>
          <div className="d-flex">
            {files &&
              files.length > 0 &&
              files.map((file, index) => (
                <div className="file-items" key={index}>
                  <p>{file && file.name}</p>
                  <p
                    className="text-x-small mb-0 remove-item"
                    onClick={() => this.removeAttachment(index)}
                  >
                    remove
                  </p>
                </div>
              ))}
          </div>
        </div>
        <p className="text-error text-left">
          {errorObject && errorObject["attachment.0"]}
        </p>
        {error && typeof error === "string" && (
          <p className="text-error mt-2 mb-0">{error}</p>
        )}
        {this.state.error && (
          <p className="text-error mt-2 mb-0">{this.state.error}</p>
        )}
        <input
          type="file"
          className="file"
          ref={this.imgRef}
          accept="image/png, image/jpeg, application/pdf"
          onChange={this.handleImageSelect}
          multiple
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    app: {
      support: { ticket, error },
      profile: {
        userProfile: { data: user },
      },
    },
  } = state;

  return {
    loading: getActionLoadingState(
      state,
      actionTypes.GET_SINGLE_TICKET_REQUEST
    ),
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SingleTicket)
);
