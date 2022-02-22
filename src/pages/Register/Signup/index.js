import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import PasswordStrengthBar from 'react-password-strength-bar';
import CONFIG from '#/config';
import Textbox from '#/components/Textbox';
import Alert from '#/components/Alert';
import PhoneTextbox from '#/components/PhoneTextBox';
import { getActionLoadingState } from "#/store/selectors";
import { register } from "#/store/register/actions";
import actionTypes from "#/store/register/actionTypes";
import { validateFields, isPasswordEqual, serializeErrors } from '#/utils';
import './style.scss';
import { countryCodes } from '#/utils/countryCode';
import { validateEmail } from '#/utils';


class Signup extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: '',
    phoneNumber: '',
    password: '',
    confirm: '',
    showSignal: false,
    errors: null,
    passwordType: 'password',
    conPasswordType: 'password',
    countryCode: '+234'
  }

  handleChange = (event) => {
    const { errors } = this.state
    const { name, value } = event.target

    this.setState({ [name]: value }, () => {
      if (name === 'confirm') {
        const error = isPasswordEqual(this.state.confirm, this.state.password);
        if (!error) {
          return this.setState({ errors: { ...errors, confirm: null } })
        }
        return this.setState({ errors: { ...errors, ...error } })
      }
    });

    if (name === 'password') {
      return this.setState({ showSignal: true })
    }
  }

  handlePasswordType = () => {
    const { passwordType } = this.state;
    if (passwordType === 'password') {
      return this.setState({ passwordType: 'text' })
    }
    return this.setState({ passwordType: 'password' })
  }

  handleConPasswordType = () => {
    const { conPasswordType } = this.state;
    if (conPasswordType === 'password') {
      return this.setState({ conPasswordType: 'text' })
    }
    return this.setState({ conPasswordType: 'password' })
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({ errors: null });
    const { registerUser, history } = this.props;
    const { firstName, lastName, email, phoneNumber, confirm, password, errors, countryCode } = this.state;



    const error = isPasswordEqual(this.state.confirm, this.state.password);
    if (error) {
      return this.setState({ errors: { ...errors, ...error } })
    }



    const data = this.state;
    const required = ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'confirm'];
    const validateErrors = validateFields(data, required)

    if (Object.keys(validateErrors).length > 0) {
      const emailValid = validateEmail(this.state.email);

      if (!emailValid) {
        validateErrors.email = "email is invalid";
      }

      return this.setState({ errors: validateErrors });
    }


    const payload = { firstName: firstName, lastName: lastName, email, phone: phoneNumber, password, confirmPassword: confirm, countryCode };
    registerUser(payload, history);
  }

  render() {
    const { email, firstName, lastName, phoneNumber, password, confirm, showSignal, errors, passwordType, conPasswordType, countryCode } = this.state;
    const { loading, error, data } = this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="register-page">
        <div className="box ml-auto mr-auto">
          <div className="row no-gutters">
            <div className="col-md-12 text-center">
              <div className="form-section">
                <div>
                  <h3 style={{ marginBottom: '3%' }}>Sign up with CPCompass</h3>
                  <p>Start your journey into financial freedom</p>
                </div>
                <form className="form" autoComplete="off" onSubmit={this.handleSubmit}>
                  {data && <Alert alert={{ type: 'success', message: data.message }} />}

                  <Textbox
                    onChange={this.handleChange}
                    name="firstName"
                    value={firstName}
                    label="First Name"
                    placeholder="First Name"
                    boxClasses="mt-2"
                    error={errors ? errors.firstName : (errorObject && errorObject['firstName'])}
                  />
                  <Textbox
                    onChange={this.handleChange}
                    name="lastName"
                    value={lastName}
                    label="Last Name"
                    placeholder="Last Name"
                    boxClasses="mt-2"
                    error={errors ? errors.lastName : (errorObject && errorObject['lastName'])}
                  />
                  <Textbox
                    onChange={this.handleChange}
                    name="email"
                    type="email"
                    value={email}
                    label="Email Address"
                    placeholder="Email Address"
                    boxClasses="mt-2"
                    error={errors ? errors.email : (errorObject && errorObject['email'])}
                  />
                  <PhoneTextbox
                    onChange={this.handleChange}
                    name="phoneNumber"
                    value={phoneNumber}
                    label="Phone Number"
                    placeholder="Phone Number"
                    boxClasses="mt-2"
                    options={countryCodes}
                    onChangeSelect={this.handleChange}
                    selectName="countryCode"
                    defaultValue={countryCode}
                    type="number"
                    error={errors ? errors.phoneNumber : (errorObject && errorObject['phone'])}
                  />
                  <Textbox
                    onChange={this.handleChange}
                    name="password"
                    value={password}
                    label="Password"
                    placeholder="Password"
                    boxClasses="mt-2"
                    type={passwordType}
                    iconUrl={require("#/assets/icons/view-password.svg")}
                    onIconClick={this.handlePasswordType}
                    error={errors ? errors.password : (errorObject && errorObject['password'])}
                  />
                  <PasswordStrengthBar password={password} className={`${showSignal ? 'd-block' : 'd-none'} mt-2`} />
                  <Textbox
                    onChange={this.handleChange}
                    name="confirm"
                    value={confirm}
                    label="Confirm your Password"
                    placeholder="Confirm your Password"
                    boxClasses="mt-2"
                    type={conPasswordType}
                    iconUrl={require("#/assets/icons/view-password.svg")}
                    onIconClick={this.handleConPasswordType}
                    error={errors && errors.confirm}
                  />
                  <button type="submit" className="w-100 btn btn-md btn-primary mt-3" onClick={this.handleSubmit} disabled={loading}>
                    Create Account
                    {loading &&
                      <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                    }
                  </button>
                </form>
                <div className="notice mt-4">
                  <p className="w-75 text-center">
                    Creating a CPCompass account means you agree to our
                    <a style={{ color: '#5D65AC' }} href={`${CONFIG.WEBSITE_URL}/legal/privacypolicy`} target="_blank" rel="noopener noreferrer">
                      <span> </span>Privacy Policy
                    </a> and
                    <a style={{ color: '#5D65AC' }} href={`${CONFIG.WEBSITE_URL}/legal/termsandconditions`} target="_blank" rel="noopener noreferrer">
                      <span> </span>Terms of Service
                    </a>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="sign-in mt-4 text-center">
          <p>Have an account already? <Link to="/login"><b>Sign in</b></Link></p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { auth: { register: { error, data } } } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.REGISTER_REQUEST),
    error,
    data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registerUser: (payload, history) => dispatch(register(payload, history)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signup));
