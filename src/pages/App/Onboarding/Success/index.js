import React from 'react';
import { withRouter } from 'react-router-dom';
import './style.scss';

class OnboardingComplete extends React.Component {

  handleNextStep = (e) => {
    e.preventDefault();
    this.props.history.push('/app')
  }

  render() {

    return (
      <div className="onboarding-end-page text-center">
        <div className="box">
          <div className="container">
            <img src={require('#/assets/icons/complete-success.svg')}  alt="setup"/>
            <h2 className="mt-3">Account setup successful!</h2>
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
