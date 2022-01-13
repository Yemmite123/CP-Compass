import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import { sendResetLink  } from "#/store/login/actions";
import actionTypes from "#/store/login/actionTypes";
import { getActionLoadingState } from "#/store/selectors";
import { validateFields, serializeErrors } from '#/utils';
import Textbox from '#/components/Textbox';
import AuthNav from '#/components/AuthNav';
import './style.scss';

class ForgotPassword extends React.Component {
  state = {
    email: '',
    errors: null,
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value })
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { sendResetLink, history } = this.props;
    const { email } = this.state;

    this.setState({ errors: null });

    const data = this.state;
    const required = [ 'email' ];
    const errors = validateFields(data, required)

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    sendResetLink(email, history);
  }

  render () {
    const { email, errors } = this.state;
    const { loading, error } = this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="forgot-password-page text-center">
        <AuthNav />
        <div className="box">
          <div className="container">
            <div>
              <h4 className="mt-4 font-bolder text-blue">
                Reset your password
              </h4>
              <p className='font-small'>Please input your registered email to reset your password</p>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-10 right-section">
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
                  <button
                    className="btn py-3 btn-primary w-100 mt-4"
                    disabled={loading}
                  >
                    Send me a reset link
                    {loading && (
                      <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                    )}
                  </button>
                </form>
                <div className="bottom-section mt-4">
                  <p>
                    Cancel password reset? <span></span>
                    <Link to="/login">
                      <b>Sign in</b>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth: { login: { error } }  } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.SEND_RESET_LINK_REQUEST),
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendResetLink: (email, history) => dispatch(sendResetLink(email, history)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ForgotPassword));
