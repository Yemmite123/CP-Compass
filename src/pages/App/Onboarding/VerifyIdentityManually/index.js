import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { getActionLoadingState } from "#/store/selectors";
import { getUserProfile } from "#/store/profile/actions";
import actionTypes from "#/store/onboarding/actionTypes";
import { confirmIdentity } from '#/store/onboarding/actions';
import Textbox from '#/components/Textbox';
import Alert from '#/components/Alert';
import DateBox from '#/components/DateBox';
import AuthNav from "#/components/AuthNav";
import { validateFields, serializeErrors } from '#/utils';
import './style.scss';

class VerifyIdentityManually extends React.Component {

  state = {
    bvn: '',
    firstName: '',
    lastName: '',
    errors: null,
    dob: '',
  }

  componentDidMount() {
    this.props.getUserProfile();
    console.log(this.props)
  }

  componentDidUpdate() {
    if (this.props.userData?.firstName && !this.state.firstName) {
      this.setState({ firstName: this.props.userData?.firstName });
    }

    if (this.props.userData?.lastName && !this.state.lastName) {
      this.setState({ lastName: this.props.userData?.lastName });
    }

    if (this.props.userData?.dateOfBirth && !this.state.dob) {
      this.setState({ dob: this.props.userData?.dateOfBirth });
    }
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

    const { confirmIdentity, history } = this.props;
    const { bvn, firstName, lastName, dob } = this.state;

    this.setState({ errors: null });

    const data = this.state;
    const required = ['firstName', 'lastName', 'bvn', 'dob'];
    const errors = validateFields(data, required)

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }
    const payload = { bvn, firstName, lastName, dateOfBirth: moment(dob).format('YYYY-MM-DD'), manual: true };
    confirmIdentity(payload, history);
  }

  render() {
    const { firstName, lastName, bvn, errors, dob } = this.state;
    const { error, loading, data } = this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="verify-identity-manually-page text-center">
        <AuthNav />
        <div className="box">
          <div className="container">
            <h3 className="mt-3 text-blue font-bolder">BVN Verification</h3>
            <p>Please enter your BVN credentials</p>
            <form onSubmit={this.handleSubmit}>
              <Textbox
                onChange={this.handleChange}
                name="bvn"
                value={bvn}
                label="BVN"
                maxlength={11}
                placeholder="BVN"
                boxClasses="mt-4"
                error={errors ? errors.bvn : (errorObject && errorObject['bvn'])}
              />
              <Textbox
                onChange={this.handleChange}
                name="firstName"
                value={firstName}
                // disabled={this.props.userData?.firstName}
                label="First name"
                placeholder="First name"
                boxClasses="mt-4"
                error={errors ? errors.firstName : (errorObject && errorObject['firstName'])}
              />
              <Textbox
                onChange={this.handleChange}
                name="lastName"
                value={lastName}
                // disabled={this.props.userData?.lastName}
                label="Last name"
                placeholder="Last name"
                boxClasses="mt-4"
                error={errors ? errors.lastName : (errorObject && errorObject['lastName'])}
              />
              <DateBox
                onChange={date => this.handleChangeDate('dob', date)}
                label="Date of birth"
                placeholder="Date of birth"
                name="dob"
                startDate={moment().subtract(18, "y").toDate()}
                max={moment().subtract(18, "y").toDate()}
                value={dob}
                boxClasses="mt-4"
                error={errors ? errors.dob : (errorObject && errorObject['dateOfBirth'])}
              />
              <button className="btn py-3 btn-primary w-100 mt-4 mb-2" disabled={loading}>
                Verify your details
                {loading &&
                  <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                }
              </button>
            </form>
            {data && <Alert alert={{ type: 'success', message: 'Admin will validate your BVN' }} />}
            {error && <Alert alert={{ type: 'danger', message: error }} />}
            {/* <div className="mt-3">
              <Link to='/app/onboarding/verify-identity'><b>Verify BVN automatically</b></Link>
            </div> */}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { app: { profile: { userProfile }, onboarding: { data, error } } } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.CONFIRM_IDENTITY_REQUEST),
    data,
    userData: userProfile.data,
    error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserProfile: () => dispatch(getUserProfile()),
    confirmIdentity: (payload, history) => dispatch(confirmIdentity(payload, history)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VerifyIdentityManually));
