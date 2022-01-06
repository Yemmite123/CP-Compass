import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "#/store/login/actions";
import Textbox from "#/components/Textbox";
import actionTypes from "#/store/login/actionTypes";
import { getActionLoadingState } from "#/store/selectors";
import { validateFields, serializeErrors } from "#/utils";
import AuthNav from "#/components/AuthNav";
import "./style.scss";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    passwordType: "password",
    errors: null,
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handlePasswordType = () => {
    const { passwordType } = this.state;
    if (passwordType === "password") {
      return this.setState({ passwordType: "text" });
    }
    return this.setState({ passwordType: "password" });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { login, history } = this.props;
    const { email, password } = this.state;

    this.setState({ errors: null });

    const data = this.state;
    const required = ["email", "password"];
    const errors = validateFields(data, required);

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    const payload = { email, password };
    login(payload, history);
  };

  render() {
    const { email, password, passwordType, errors } = this.state;
    const { loading, error } = this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="login-page text-center">
        <AuthNav />
        <div className="box ml-auto mr-auto">
          <div className="d-flex justify-content-center">
            <div className="col-md-9 right-section">
              <div className="top-section mt-3">
                <h4 className="font-bolder text-blue">Welcome back!</h4>
                <p className="text-black">Sign into your account</p>
              </div>

              <div className="login-form">
                <div className="container">
                  <form autoComplete="off" onSubmit={this.handleSubmit}>
                    <Textbox
                      onChange={this.handleChange}
                      name="email"
                      value={email}
                      label="Email"
                      placeholder="Email address"
                      boxClasses="mt-3"
                      type="email"
                      error={
                        errors
                          ? errors.email
                          : errorObject && errorObject["email"]
                      }
                    />
                    <Textbox
                      onChange={this.handleChange}
                      name="password"
                      value={password}
                      label="Password"
                      placeholder="Password"
                      boxClasses="mt-3"
                      type={passwordType}
                      iconUrl={require("#/assets/icons/view-password.svg")}
                      onIconClick={this.handlePasswordType}
                      error={
                        errors
                          ? errors.password
                          : errorObject && errorObject["password"]
                      }
                    />

                    <button
                      className={`w-100 btn btn-sm btn-primary mt-4 ${
                        loading && "cursor-pointer"
                      }`}
                      disabled={loading}
                    >
                      Sign in
                      {loading && (
                        <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                      )}
                    </button>
                    {error && typeof error === "string" && (
                      <p className="text-error text-left">{error}</p>
                    )}
                  </form>
                  <div className="forgot-password text-center mt-3">
                    <Link to="/forgot-password">Forgot password?</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-section mt-2">
          <p className="text-black">
            Don't have an account? <span></span>
            <Link to="/register">
              <b>Create an account</b>
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    auth: {
      login: { error },
    },
  } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.LOGIN_REQUEST),
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (payload, history) => dispatch(login(payload, history)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
