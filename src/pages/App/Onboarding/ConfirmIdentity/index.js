import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/onboarding/actionTypes";
import { confirmIdentity } from '#/store/onboarding/actions';
import AuthNav from "#/components/AuthNav";
import './style.scss';

class ConfirmIdentity extends React.Component {
  componentDidMount() {
    const { userData, history } = this.props;
    if(!userData) return history.push('/app/onboarding/verify-identity')
  }

  handleConfirmIdentity = () => {
    const { confirmIdentity, history, data } = this.props;
    const payload = {
      bvn: data.bvn,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.formattedDob,
      manual: 'false'
    };
    confirmIdentity(payload, history);
  }

  handlePrevious = () => {
    this.props.history.goBack();
  }

  render() {
    const { data, loading, error } = this.props;
    return (
      <div className="confirm-identity-page text-center">
        <AuthNav />
        <div className="box">
          <div className="container">
            <h3 className="mt-3 text-blue font-bolder">Confirm your identity</h3>
            <p>The Bank Verification Number provided belongs to:</p>
            <div className="user-details text-center pt-3 pb-3">
              <label>First name</label>
              <h4>{data && data.firstName}</h4>
              <label>Last name</label>
              <h4>{data && data.lastName}</h4>
            </div>
            <button className="btn btn-sm btn-primary w-100 mt-3" onClick={this.handleConfirmIdentity} disabled={loading}>
              Proceed this is me
              {loading &&
                <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
              }
            </button>
            {error && <p className="bvn-error">{error}</p>}
            <div className="mt-3">
              <p className="text-blue" onClick={this.handlePrevious}><b>Go back this is not me</b></p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { app: { onboarding: { userData, error } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.CONFIRM_IDENTITY_REQUEST),
    data: userData?.userBvn,
    userData,
    error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    confirmIdentity: (payload, history) => dispatch(confirmIdentity(payload, history)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfirmIdentity));
