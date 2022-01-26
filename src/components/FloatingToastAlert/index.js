import React from "react";
import { connect } from "react-redux";
import { removeAlert } from "#/store/ui/actions";
import Modal from "#/components/Modal";
import "./style.scss";

//TODO
class FloatingToastAlert extends React.Component {
  componentDidMount() {
    if (this.props.alert) {
      setTimeout(() => {
        this.props.removeAlert();
      }, 3000);
    }
  }

  componentDidUpdate() {
    if (this.props.alert) {
      setTimeout(() => {
        this.props.removeAlert();
      }, 3000);
    }
  }

  render() {
    const { alert } = this.props;
    return (
      <>
      { alert.type !== "error" ?
      <div className="alert-modal">
        <Modal onClose={this.props.removeAlert}>
          <div className="text-right pb-3">
            <img
              src={require("#/assets/icons/close.svg")}
              style={{ cursor: "pointer" }}
              alt="close"
              onClick={this.props.removeAlert}
            />
          </div>
          <div className="px-5">
            <div className="d-flex justify-content-center">
              <img
                src={require("#/assets/icons/done.svg")}
                alt="bank"
                className="pb-3"
              />
            </div>
            <div className="text-center">
              <div className="mb-3">
                <h5 className="text-blue font-bolder text-success">
                  {alert.type}
                </h5>
                <p className="mb-0 text-grey"> {alert.message}.</p>
              </div>
              <div className="px-3 mt-4">
                <button
                  className="btn py-3 btn-success btn-block mt-3"
                  onClick={this.props.removeAlert}
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
:
      <div className="floating-popup">
        <div className={`floating-popup--${alert.type}`}>
          <div className="floating-popup__message font-md">
            {alert.message}
          </div>
        </div>
      </div>}
      </>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeAlert: () => dispatch(removeAlert()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FloatingToastAlert);
