import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import PasswordStrengthBar from 'react-password-strength-bar';
import Textbox from '#/components/Textbox';
import { resetPassword  } from "#/store/login/actions";
import actionTypes from "#/store/login/actionTypes";
import { getActionLoadingState } from "#/store/selectors";
import { validateFields, isPasswordEqual, serializeErrors } from '#/utils';
import AuthNav from '#/components/AuthNav';
import Alert from '#/components/Alert';
import './style.scss';

class NewPassword extends React.Component {

  state = {
    password: '',
    confirm: '',
    errors: null,
    passwordType: 'password',
    conPasswordType: 'password',
    showSignal: false,
  }


  handleChange = (event) => {
    const { errors } = this.state;

    const { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      if( name === 'confirm') {
        const error = isPasswordEqual(this.state.confirm, this.state.password);
        if(!error) {
          return this.setState({ errors: { ...errors, confirm: null }})
        }
        return this.setState({ errors: { ...errors, ...error }})
      }
    });
    if (name === 'password') {
      return this.setState({ showSignal: true})
    }
  }

  handlePasswordType = () => {
    const { passwordType } = this.state;
    if (passwordType === 'password') {
      return this.setState({ passwordType: 'text'})
    }
    return this.setState({ passwordType: 'password'})
  }

  handleConPasswordType = () => {
    const { conPasswordType } = this.state;
    if (conPasswordType === 'password') {
      return this.setState({ conPasswordType: 'text'})
    }
    return this.setState({ conPasswordType: 'password'})
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { resetPassword, history } = this.props;
    const { params: { token } } = this.props.match
    const { password } = this.state;

    this.setState({ errors: null });

    const data = this.state;
    const required = [ 'password', 'confirm' ];
    const errors = validateFields(data, required)

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }
    const payload = { password, resetToken: token }
    resetPassword(payload, history);
  }

  render () {
    const { password, confirm, errors, passwordType, conPasswordType, showSignal } = this.state
    const { loading, data, error } = this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="new-password-page text-center">
        <AuthNav />

        <div className="box">
          <div className="container">
            <h3 className="text-blue font-bolder">Set a new password</h3>
            <p className='mb-4'>Start your journey into financial freedom</p>
            <form autoComplete="off" onSubmit={this.handleSubmit}>
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
              <PasswordStrengthBar
                password={password}
                className={`${showSignal ? "d-block" : "d-none"} mt-2`}
              />
              <Textbox
                onChange={this.handleChange}
                name="confirm"
                value={confirm}
                label="Confirm Password"
                placeholder="Confirm Password"
                boxClasses="mt-3"
                type={conPasswordType}
                iconUrl={require("#/assets/icons/view-password.svg")}
                onIconClick={this.handleConPasswordType}
                error={errors && errors.confirm}
              />
              <button
                className="btn btn-sm btn-primary w-100 mt-3"
                disabled={loading}
              >
                Create new password
                {loading && (
                  <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                )}
              </button>
            </form>
            {data && (
              <Alert alert={{ type: "success", message: data.message }} />
            )}
            {error && typeof error === "string" && (
              <p className="text-error text-left">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth: { login: { data, error } } } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.RESET_PASSWORD_REQUEST),
    data,
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetPassword: (payload, history) => dispatch(resetPassword(payload, history)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewPassword));