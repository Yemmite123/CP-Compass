import React from 'react';
import './style.scss';

class FinancialInstruments extends React.Component {

  render() {
    return (
      <div className="instruments-page">
        <div className="text-center">
          <img src={require('#/assets/icons/coming-soon.svg')} alt="comming soon"/>
          <h2 className="text-blue mt-3">Coming soon!</h2>
        </div>
      </div>
    )
  }
}

export default FinancialInstruments;
