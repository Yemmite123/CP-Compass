import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { submitPin  } from "#/store/onboarding/actions";
import actionTypes from "#/store/onboarding/actionTypes";
import { getActionLoadingState } from "#/store/selectors";
import PinInput from '#/components/PinInput';
import AuthNav from "#/components/AuthNav";
import './style.scss';

class TransactionPin extends React.Component {

  state = {
    errors: null,
    pin: {},
    confirmPin: {},
  }

  handleNextStep = (e) => {
    e.preventDefault();
    const { history, submitPin } = this.props;
    const { pin, confirmPin } = this.state
    this.setState({ errors: null })

    const initialPin = [ pin.value1, pin.value2, pin.value3, pin.value4 ].join('');
    const confirm = [ confirmPin.value1, confirmPin.value2, confirmPin.value3, confirmPin.value4 ].join('');

    if (initialPin.length < 4 || confirm.length < 4) {
      return this.setState({ errors: 'all fields are required'})
    }
    if ( initialPin !== confirm) {
      return this.setState({ errors: 'pins are not equal'})
    }
    
    submitPin({ pin: initialPin, confirmPin: confirm }, history);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value })
  }

  handlePin = (pin) => {
    this.setState({pin})
  }

  handleConfirmPin = (pin) => {
    this.setState({ confirmPin: pin})
  }

  render() {
    const { errors } = this.state
    const { error, loading } = this.props;

    return (
      <div className="transaction-pin-page text-center">
        <AuthNav/>
        <div className="box text-left">
          <div className="container">
            <h3 className="mt-3 text-center font-bolder text-blue">Set your transaction PIN</h3>
            <p>Keep your account and investments safe by setting a transction PIN.</p>
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="w-100">
                  <PinInput onChange={this.handlePin} error={errors} />
                </div>
              </div>
            </div>
            <div className="row mt-4 justify-content-center">
              <div className="col-md-10">
                <div className="w-100">
                   <p>Confirm transaction PIN.</p>
                  <PinInput onChange={this.handleConfirmPin} error={errors} />
                </div>
              </div>
            </div>
            <div className="px-3">
            <button className="btn py-3 btn-primary w-100 mt-4" onClick={this.handleNextStep} disabled={loading}>
              Set transaction PIN
              {loading &&
                <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
              }
            </button>
            {errors && <p className="pin-error">{errors}</p>}
            {error && <p className="pin-error">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { app: { onboarding: { error } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.SUBMIT_PIN_REQUEST),
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitPin: (payload, history) => dispatch(submitPin(payload, history)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionPin));
