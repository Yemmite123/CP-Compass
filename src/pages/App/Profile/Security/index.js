import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Alert from "#/components/Alert";
import CustomInput from "#/components/CustomInput";
import Textbox from "#/components/Textbox";
import { getActionLoadingState } from "#/store/selectors";
import { updatePin } from "#/store/profile/actions";
import actionTypes from "#/store/profile/actionTypes";
import { changePassword } from "#/store/security/actions";
import passActionTypes from "#/store/security/actionTypes";
import { isPasswordEqual, serializeErrors, validateFields } from "#/utils";
import "./style.scss";

class Security extends React.Component {
  state = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    errors: null,
    oldPasswordType: "password",
    passwordType: "password",
    conPasswordType: "password",
    pin: "",
    confirmPin: "",
    pinValidate: null,
    userPass: "",
    userPasswordType: "password",
    showPasswordModal: false,
    showSignal: false,
  };

  pinForm = React.createRef();

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      return this.setState({
        pin: "",
        confirmPin: "",
        showPasswordModal: false,
        userPass: "",
      });
    }
    if (this.props.securityData !== prevProps.securityData) {
      return this.setState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }

  handlePasswordType = () => {
    const { passwordType } = this.state;
    if (passwordType === "password") {
      return this.setState({ passwordType: "text" });
    }
    return this.setState({ passwordType: "password" });
  };

  handleOldPasswordType = () => {
    const { oldPasswordType } = this.state;
    if (oldPasswordType === "password") {
      return this.setState({ oldPasswordType: "text" });
    }
    return this.setState({ oldPasswordType: "password" });
  };

  handleConPasswordType = () => {
    const { conPasswordType } = this.state;
    if (conPasswordType === "password") {
      return this.setState({ conPasswordType: "text" });
    }
    return this.setState({ conPasswordType: "password" });
  };

  handleUserPasswordType = () => {
    const { userPasswordType } = this.state;
    if (userPasswordType === "password") {
      return this.setState({ userPasswordType: "text" });
    }
    return this.setState({ userPasswordType: "password" });
  };

  handleChange = (event) => {
    const { errors } = this.state;
    const { name, value } = event.target;

    this.setState({ [name]: value }, () => {
      if (name === "confirmPassword") {
        const error = isPasswordEqual(
          this.state.confirmPassword,
          this.state.newPassword
        );
        if (!error) {
          return this.setState({ errors: { ...errors, confirm: null } });
        }
        return this.setState({ errors: { ...errors, ...error } });
      }
    });

    if (name === "newPassword") {
      return this.setState({ showSignal: true });
    }
  };
  handlePinChange = (event) => {
    const { errors } = this.state;
    const { name, value } = event.target;
    if (!isNaN(event.target.value) === true) {
      this.setState({ [name]: value });
    }
  };

  togglePasswordModal = () => {
    this.setState({
      showPasswordModal: !this.state.showPasswordModal,
      userPass: "",
    });
  };

  handlePin = (pin) => {
    this.setState({ pin });
  };

  handleConPin = (pin) => {
    this.setState({ confirmPin: pin });
  };

  handleSubmitPin = (e) => {
    e.preventDefault();

    const { updatePin } = this.props;
    this.setState({ errors: null, pinValidate: "" });
    const { userPass, confirmPin, pin } = this.state;

    if (pin.length < 4 || confirmPin.length < 4) {
      return this.setState({ pinValidate: "pin must be up to 4 characters" });
    }
    if (pin !== confirmPin) {
      return this.setState({ pinValidate: "PINs do not match" });
    }

    const data = this.state;
    const required = ["userPass"];
    const errors = validateFields(data, required);

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    updatePin({ confirmPin, pin, password: userPass })
      .then(() => {
        this.setState((prevState) => ({
          userPass: "",
          confirmPin: "",
          pin: "",
        }));
      })
      .catch(() => {
        this.setState((prevState) => ({
          userPass: "",
          confirmPin: "",
          pin: "",
        }));
      });
  };

  resetForm = (e) => {
    e.preventDefault();
    console.log(this.pinForm.current);
    this.pinForm.current.reset();
  };

  handleSubmitPassword = (e) => {
    e.preventDefault();

    const { changePassword } = this.props;
    this.setState({ errors: null });
    const { currentPassword, newPassword, confirmPassword } = this.state;

    const data = this.state;
    const required = ["currentPassword", "newPassword", "confirmPassword"];
    const errors = validateFields(data, required);

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    changePassword({ currentPassword, password: newPassword, confirmPassword });
  };

  render() {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
      errors,
      pinValidate,
      userPass,
      confirmPin,
      pin,
    } = this.state;
    const { pinLoading, error, pinError, data, passLoading, securityData } =
      this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="mb-5">
        <div className="section-container">
          <h2 className="section-header mb-3">Change Password</h2>
          <div className="section-form mt-4">
            <Textbox
              name="currentPassword"
              label="Current Password"
              placeholder="Current Password"
              value={currentPassword}
              type="password"
              onChange={this.handleChange}
              error={
                errors
                  ? errors.currentPassword
                  : errorObject && errorObject["currentPassword"]
              }
            />
            <Textbox
              name="newPassword"
              label="New Password"
              placeholder="New Password"
              value={newPassword}
              type="password"
              onChange={this.handleChange}
              error={
                errors
                  ? errors.newPassword
                  : errorObject && errorObject["password"]
              }
            />
            <Textbox
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm Password"
              value={confirmPassword}
              type="password"
              onChange={this.handleChange}
              error={
                errors
                  ? errors.confirmPassword
                  : errorObject && errorObject["confirmPassword"]
              }
            />
            <div className="section-form__button-area">
              {error && typeof error === "string" && (
                <p className="text-error mt-2">{error}</p>
              )}
              {securityData && (
                <Alert
                  alert={{ type: "success", message: securityData.message }}
                />
              )}
              <button
                className="btn-default"
                disabled={passLoading}
                onClick={this.handleSubmitPassword}
              >
                Save changes
                {passLoading && (
                  <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="section-container">
          <h2 className="section-header mb-3">Change Trasaction Pin</h2>
          <div className="section-form mt-4">
            <Textbox
              name="userPass"
              label="Your Password"
              placeholder="Your Password"
              value={userPass}
              type="password"
              onChange={this.handleChange}
              error={
                errors
                  ? errors.userPass
                  : errorObject && errorObject["userPass"]
              }
            />
            <Textbox
              name="pin"
              label="New Transaction Pin"
              placeholder="New Transaction Pin"
              value={pin}
              type="password"
              onChange={this.handlePinChange}
              maxlength={4}
            />
            <Textbox
              name="confirmPin"
              label="Confirm New Transaction Pin"
              placeholder="Confirm New Transaction Pin"
              value={confirmPin}
              type="password"
              onChange={this.handlePinChange}
              maxlength={4}
              error={pinValidate}
            />
            <div className="section-form__button-area">
              {data && (
                <Alert alert={{ type: "success", message: data.message }} />
              )}
              {pinError && typeof pinError === "string" && (
                <p className="text-error text-left">{pinError}</p>
              )}
              <button
                className="btn-default"
                disabled={pinLoading}
                onClick={this.handleSubmitPin}
              >
                Save changes
                {pinLoading && (
                  <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    app: {
      profile: {
        security: { data, pinError },
      },
      security: { error, data: securityData },
    },
  } = state;
  return {
    pinLoading: getActionLoadingState(state, actionTypes.UPDATE_PIN_REQUEST),
    passLoading: getActionLoadingState(
      state,
      passActionTypes.CHANGE_PASSWORD_REQUEST
    ),
    pinError,
    data,
    error,
    securityData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePin: (payload) => dispatch(updatePin(payload)),
    changePassword: (payload) => dispatch(changePassword(payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Security)
);
