import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import { resendToken  } from "#/store/register/actions";
import Alert from '#/components/Alert';
import './style.scss';

class ConfirmEmailVerification extends React.Component {

  navigateToLogin = () => {
    this.props.history.push('/login')
  }

  handleResendToken = () => {
    const { email, resendToken } = this.props;
    resendToken(email)
  }

  render () {
    const { email, data, error } = this.props
    return (
      <div className="confirm-email-page text-center">
        <div className="box">
          <div className="container">
              <img src={require('#/assets/icons/envelope-mail.svg')} alt="envelope"/>
              <h4 className="mt-3 text-blue font-bolder">Verify your email address</h4>
              <p className="mt-2">A verification link has been sent to <b>{email}</b> Please check your inbox to verify using the link sent.</p>
              <button className="btn btn-sm btn-primary" onClick={this.navigateToLogin}>
                I have verified my email
              </button>
            <div className="bottom-section mt-3">
              <p>
                Didn’t get the verification link?
                <span onClick={this.handleResendToken}><b> Send link again</b> </span>
              </p>
            </div>
            {data && <Alert alert={{ type: 'success', message: data.message }}/>}
            {error && <Alert alert={{ type: 'warning', message: error.message }}/>}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { user: { emailAddress }, auth: { register: { error, data } } } = state;
  return {
    email: emailAddress,
    error,
    data
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resendToken: (email) => dispatch(resendToken(email)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfirmEmailVerification));
