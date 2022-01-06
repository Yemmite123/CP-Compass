import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/onboarding/actionTypes";
import { submitOtp } from '#/store/onboarding/actions';
import PinInput from '#/components/PinInput';
import AuthNav from "#/components/AuthNav";
import './style.scss';

class OneTimePassword extends React.Component {

  state = {
    errors: null,
    pin: {},
  }

  handleNextStep = (e) => {
    e.preventDefault();
    const { pin: { value1, value2, value3, value4  } } = this.state
    const { history, submitOtp } = this.props;
    this.setState({ errors: null })
    const token = [ value1, value2, value3, value4 ].join('');
    if (token.length < 4) {
      return this.setState({ errors: 'all fields are required'})
    }
    submitOtp({ token }, history);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value })
  }

  handlePin = (pin) => {
    this.setState({pin})
  }

  render() {
    const { errors } = this.state
    const { error, loading } = this.props;
    return (
      <div className="one-time-password-page text-center">
        <AuthNav/>
        <div className="box">
          <div className="container">
            <h3 className="mt-3 text-blue font-bold">Enter One-Time Password (OTP)</h3>
            <p>A One-Time Password has been sent to the email and phone number attached to your Bank Verification Number (BVN). Please enter the 4-digit number sent.</p>
            <div className="ml-auto mr-auto w-100">
              <PinInput onChange={this.handlePin} error={errors} />
            </div>
            <button className="btn btn-sm btn-primary w-100 mt-4" onClick={this.handleNextStep} disabled={loading}>
              Proceed
              {loading &&
                <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
              }
            </button>
            {errors && <p className="otp-error">{errors}</p>}
            {error && <p className="otp-error">{error}</p>}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { app: { onboarding: { error } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.SUBMIT_OTP_REQUEST),
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitOtp: (payload, history) => dispatch(submitOtp(payload, history)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OneTimePassword));
