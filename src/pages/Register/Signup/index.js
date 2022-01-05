import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import PasswordStrengthBar from 'react-password-strength-bar';
import CONFIG from '#/config';
import Textbox from '#/components/Textbox';
import Alert from '#/components/Alert';
import PhoneTextbox from '#/components/PhoneTextBox';
import { getActionLoadingState } from "#/store/selectors";
import { register  } from "#/store/register/actions";
import actionTypes from "#/store/register/actionTypes";
import { validateFields, isPasswordEqual, serializeErrors } from '#/utils';
import './style.scss';
import { countryCodes } from '#/utils/countryCode';

class Signup extends React.Component {
  state = {
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

    this.setState({ errors: null });
    const { registerUser, history } = this.props;
    const { email, phoneNumber, password, errors, countryCode } = this.state;

    const error = isPasswordEqual(this.state.confirm, this.state.password);
    if (error) {
      return this.setState({ errors: { ...errors, ...error }})
    }

    const data = this.state;
    const required = [ 'email', 'password', 'phoneNumber', 'confirm'];
    const validateErrors = validateFields(data, required)

    if (Object.keys(validateErrors).length > 0) {
      return this.setState({ errors: validateErrors });
    }
    const payload = { email, phone: phoneNumber, password, countryCode };
    registerUser(payload, history);
  }

  render () {
    const { email, phoneNumber, password, confirm, showSignal, errors, passwordType, conPasswordType, countryCode } = this.state;
    const { loading, error, data } = this.props;
    const errorObject = serializeErrors(error);
    
    return (
      <div className="register-page vh-100">
        <div className="box ml-auto mr-auto">
          <div className="row no-gutters">
            {/* <div className="col-md-1 left-section">
            </div> */}
            <div className="col-md-12 text-center">
              <div className="form-section">
                <div>
                  <h3 style={{marginBottom: '3%'}}>Sign up with CPCompass</h3>
                  <p>Start your journey into financial freedom</p>
                </div>
                <form className="form" autoComplete="off" onSubmit={this.handleSubmit}>
                {data && <Alert alert={{ type: 'success', message: data.message }}/>}
                <Textbox
                    onChange={this.handleChange}
                    name="email"
                    value={email}
                    label="First Name"
                    placeholder="First Name"
                    boxClasses="mt-2"
                    error={errors ? errors.email : (errorObject && errorObject['email'])}
                  />
                    <Textbox
                    onChange={this.handleChange}
                    name="email"
                    value={email}
                    label="Last Name"
                    placeholder="Last Name"
                    boxClasses="mt-2"
                    error={errors ? errors.email : (errorObject && errorObject['email'])}
                  />
                  <Textbox
                    onChange={this.handleChange}
                    name="email"
                    value={email}
                    label="Email"
                    placeholder="Email address"
                    boxClasses="mt-2"
                    error={errors ? errors.email : (errorObject && errorObject['email'])}
                  />
                  <PhoneTextbox 
                    onChange={this.handleChange}
                    name="phoneNumber"
                    value={phoneNumber}
                    label="Phone number"
                    placeholder="Phone number"
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
                    label="Confirm password"
                    placeholder="Confirm Password"
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
                      <a style={{color:'#5D65AC'}} href={`${CONFIG.WEBSITE_URL}/cookiesPolicy`} target="_blank" rel="noopener noreferrer">
                        <span> </span>Privacy Policy
                      </a> and 
                      <a style={{color:'#5D65AC'}} href={`${CONFIG.WEBSITE_URL}/termsAndConditions`} target="_blank" rel="noopener noreferrer">
                      <span> </span>Terms of Service
                      </a>
                  </p>
                </div>
                <hr />
                <div className="sign-in mt-4">
                  <p>Have an account already? <Link to="/login"><b>Sign in</b></Link></p>
                </div>
              </div>
            </div>
          </div>
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
