import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import { sendResetLink  } from "#/store/login/actions";
import actionTypes from "#/store/login/actionTypes";
import { getActionLoadingState } from "#/store/selectors";
import Alert from '#/components/Alert';
import AuthNav from '#/components/AuthNav';
import './style.scss';

class ForgotPasswordConfirmation extends React.Component {

  componentDidMount(){
    const { location: { state } } = this.props.history;
    if(!state) {
      this.props.history.push('/forgot-password');
    }
  }

  handleResendLink = () => {
    const { location: { state } } = this.props.history;
    const { sendResetLink } = this.props;

    sendResetLink(state.email);
  }

  render () {
    const { loading, data } = this.props;

    return (
      <div className="forgot-password-confirmation-page text-center">
        <AuthNav />
        <div className="box">
          <div className="container">
            <img src={require("#/assets/icons/confirmation-blue.svg")} alt="confirmation"/>
            <h3>Your password reset link has been sent!</h3>
            <p>A password reset link has been sent to the email your provided, if it exists with us. 
                Please check your inbox for the link and more instructions on how to gain access to your account
            </p>
            <button className="btn btn-sm btn-white w-100" onClick={this.handleResendLink} disabled={loading}>
              Resend reset link
              {loading &&
                <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
              }
            </button>
            {data && <Alert alert={{ type: 'success', message: data.message }}/>}
            <div className="bottom-section mt-4">
              <p>
                Go back to our <span></span>
                <Link to="/login">home page</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { auth: { login: { data } }  } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.SEND_RESET_LINK_REQUEST),
    data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendResetLink: (email) => dispatch(sendResetLink(email)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordConfirmation))