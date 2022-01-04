import React from 'react';
import './style.scss';

class FinancialInstruments extends React.Component {

  render() {
    return (
      <div className="portfolio-financial-instruments">
        <div className="text-center w-100">
        <img src={require('#/assets/images/soon-graph.svg')} alt="comming soon"/>
          <p className="text-blue text-medium mt-3">Coming soon</p>
        </div>
      </div>
    )
  }
}

export default FinancialInstruments;
