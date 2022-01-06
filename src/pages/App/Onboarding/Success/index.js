import React from 'react';
import { withRouter } from 'react-router-dom';
import AuthNav from "#/components/AuthNav";
import './style.scss';

class OnboardingComplete extends React.Component {

  handleNextStep = (e) => {
    e.preventDefault();
    this.props.history.push('/app')
  }

  render() {

    return (
      <div className="onboarding-end-page text-center">
        <AuthNav/>
        <div className="box">
          <div className="container">
            <img src={require('#/assets/icons/complete-success.svg')}  alt="setup"/>
            <h3 className="mt-3 text-blue font-bolder">Account setup successful!</h3>
            <p>Your account is now safe and you can now start building your wealth.</p>
            <button className="btn btn-sm btn-primary w-100" onClick={this.handleNextStep}>
              Start investing
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(OnboardingComplete);
