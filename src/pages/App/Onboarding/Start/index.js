import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import AuthNav from "#/components/AuthNav";
import './style.scss';

class StartOnboarding extends React.Component {

  handleNextStep = () => {
    this.props.history.push('/app/onboarding/verify-identity-manually')
  }
  render() {

    return (
      <div className="start-onboarding-page text-center">
        <AuthNav />
        <div className="box">
          <div className="container py-4">
            <img src={require('#/assets/icons/setup-acct.svg')}  alt="setup"/>
            <h3 className="mt-3 text-blue font-bolder">Setup your account</h3>
            <p className="px-5 mt-3">Keep your account safe and unlock our investment plans in 2 simple stepss</p>
            <div className="px-5 mt-4">
              <button className="btn mb-3 py-3 btn-primary w-100" onClick={this.handleNextStep}>
                Continue
              </button>
              <Link to='/app'><b>Skip I'll do this later</b></Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(StartOnboarding);
