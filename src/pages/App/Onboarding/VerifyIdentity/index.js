import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Textbox from '#/components/Textbox';
import Alert from '#/components/Alert';
import DateBox from '#/components/DateBox';
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/onboarding/actionTypes";
import { verifyIdentity } from '#/store/onboarding/actions';
import { validateFields, serializeErrors } from '#/utils';
import './style.scss';

class VerifyIdentity extends React.Component {

  state = {
    bvn: '',
    dob: '',
    errors: null,
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleChangeDate = (item, date) => {
    this.setState({ [item]: date });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { verifyIdentity, history } = this.props;
    const { dob, bvn } = this.state;

    this.setState({ errors: null });

    const data = this.state;
    const required = [ 'dob', 'bvn'];
    const errors = validateFields(data, required)

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }
    const payload = { dateOfBirth: moment(dob).format('YYYY-MM-DD'), bvn };
    verifyIdentity(payload, history);
  }

  render() {
    const { dob, bvn, errors } = this.state;
    const { error, loading } = this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="verify-identity-page text-center">
        <h3>ACCOUNT SETUP</h3>
        <div className="box">
          <div className="container">
            <h3 className="mt-3">Verify your identity</h3>
            <p>Please provide your Bank Verification Number (BVN) and date of birth to verify your identity and validate your profile.</p>
            <form onSubmit={this.handleSubmit}>
              <Textbox
                onChange={this.handleChange}
                name="bvn"
                value={bvn}
                label="BVN"
                placeholder="BVN"
                boxClasses="mt-2"
                error={errors ? errors.bvn : (errorObject && errorObject['bvn'])}
              />
                <DateBox
                  onChange={date => this.handleChangeDate('dob', date)}
                  label="Date of birth"
                  placeholder="Date of birth"
                  name="dob"
                  value={dob}
                  boxClasses="mt-2"
                  error={errors ? errors.dob : (errorObject && errorObject['dateOfBirth'])}
                />
              <button className="btn btn-sm btn-primary w-100 mt-3" disabled={loading}>
                Validate BVN
                {loading &&
                  <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                }
              </button>
            </form>
            {error && <Alert alert={{ type: 'danger', message: error }}/>}
            <div className="mt-3">
              <Link to='/app/onboarding/verify-identity-manually'><b>Verify BVN manually</b></Link>
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
    loading: getActionLoadingState(state, actionTypes.VERIFY_IDENTITY_REQUEST),
    error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    verifyIdentity: (payload, history) => dispatch(verifyIdentity(payload, history)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VerifyIdentity));
