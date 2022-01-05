import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import './style.scss';

class StartOnboarding extends React.Component {

  handleNextStep = () => {
    this.props.history.push('/app/onboarding/verify-identity-manually')
  }
  render() {

    return (
      <div className="start-onboarding-page text-center">
        <div className="box">
          <div className="container">
            <img src={require('#/assets/icons/setup-icon.svg')}  alt="setup"/>
            <h2 className="mt-3">Setup your account</h2>
            <p>Keep your account safe and unlock our investment plans in 2 simple steps</p>
            <button className="btn btn-sm btn-primary w-100" onClick={this.handleNextStep}>
              Continue
            </button>
            <Link to='/app'><b>Skip I'll do this later</b></Link>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(StartOnboarding);
