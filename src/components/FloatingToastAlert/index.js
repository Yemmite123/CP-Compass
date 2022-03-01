import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { removeAlert } from "#/store/ui/actions";
import Modal from "#/components/Modal";
import "./style.scss";

//TODO: make center
class FloatingToastAlert extends React.Component {
  componentDidMount() {
    if (this.props.alert) {
      if (!this.props.alert.isStatic) {
        setTimeout(() => {
          this.props.removeAlert();
        }, 3000);
      }
    }
  }

  componentDidUpdate() {
    if (this.props.alert) {
      if (!this.props.alert.isStatic) {
        setTimeout(() => {
          this.props.removeAlert();
        }, 3000);
      }
    }
  }

  handleClick = () => {
    if (this.props.alert.url) {
      this.props.history.push({
        pathname: this.props.alert.url,
        // state: { routeName: insight.title }
      })
    }

    this.props.removeAlert();
  }

  render() {
    const { alert } = this.props;
    return (
      <>
        {alert.type !== "error" ? !alert.headerOnly ?
          <div className="alert-modal">
            <Modal onClose={this.props.removeAlert}>
              <div className="text-right pb-3">
                <img
                  style={{ cursor: "pointer" }}
                  src={require("#/assets/icons/close.svg")}
                  alt="close"
                  onClick={this.props.removeAlert}
                />
              </div>
              <div className="px-3">
                <div className="d-flex justify-content-center">
                  <img
                    src={require("#/assets/icons/done.svg")}
                    alt="bank"
                    className="pb-3"
                  />
                </div>
                <div className="text-center">
                  <div className="mb-3">
                    <h5 className="font-bolder text-success text-capitalize">
                      {alert.type}
                    </h5>
                    <p className="mb-0 text-grey"> {alert.message}.</p>
                  </div>
                  <div className="px-3 mt-4">
                    {alert.button ? <button
                      className="btn py-3 btn-success btn-block mt-3"
                      onClick={this.handleClick}

                    >
                      {alert.button ? alert.button : "Go back"}
                    </button> : <></>
                    }
                  </div>
                </div>
              </div>
            </Modal>
          </div> :
          <div className="alert-modal">
            <Modal onClose={this.props.removeAlert}>
              <div className="text-right pb-3">
                <img
                  style={{ cursor: "pointer" }}
                  src={require("#/assets/icons/close.svg")}
                  alt="close"
                  onClick={this.props.removeAlert}
                />
              </div>
              <div className="px-3">
                <div className="d-flex justify-content-center">
                  <img
                    src={require("#/assets/icons/done.svg")}
                    alt="bank"
                    className="pb-3"
                  />
                </div>
                <div className="text-center">
                  <div className="mb-3">
                    <h5 className="font-bolder text-success">
                      {alert.message}
                    </h5>
                    <h5 className="font-bolder text-success">
                      {alert.message2}
                    </h5>
                  </div>
                  <div className="px-3 mt-4">
                    {alert.button ? <button
                      className="btn py-3 btn-success btn-block mt-3"
                      onClick={this.handleClick}
                    >
                      {alert.button ? alert.button : "Go back"}
                    </button> : <></>
                    }
                  </div>
                </div>
              </div>
            </Modal>
          </div>
          : (
            <div className="floating-popup">
              <div className={`floating-popup--${alert.type}`}>
                <div className="floating-popup__message font-md">
                  {alert.message}
                </div>
              </div>
            </div>
          )}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FloatingToastAlert));
