import React from 'react';
import moment from 'moment';
import Card from '#/components/Card';
import { formatCurrency } from '#/utils';
import './style.scss';

const Investment = (props) => {

  const { investment, navigateToInvestment } = props;
  return (
    <div className="investment-card">
      <Card classes="cursor-pointer" onclick={() => navigateToInvestment(investment.id)}>
        <h3 className="text-deep-blue text-medium cursor-pointer" onClick={() => navigateToInvestment(investment.id)}>{investment.title}</h3>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <p className="mb-0 text-grey text-x-small">Target met</p>
            <p className="mb-0 text-deep-blue">{investment.percentageCompletion}% <span className="text-black text-small">(&#x20A6;{formatCurrency(investment.balance)})</span></p>
          </div>
          <div>
            <p className="mb-0 text-grey text-x-small">Target</p>
            <p className="mb-0 text-deep-blue">&#x20A6;{formatCurrency(investment.targetAmount)}</p>
          </div>
        </div>
        <div className="progress">
          <div
          className="progress-bar bg-success"
          style={{ width: `${investment.percentageCompletion}%`}}
          role="progressbar"
          aria-valuenow={investment.percentageCompletion}
          aria-valuemin="0"
          aria-valuemax="100">
          </div>
        </div>
        <div className="d-flex justify-content-between mt-2">
          <p className="mb-0 text-black text-small">Next payment Date</p>
          <p className="mb-0 text-black text-small">{investment.nextPaymentDate ? moment(investment.nextPaymentDate).format('YYYY-MM-DD') : 'N/A'}</p>
        </div>
      </Card>
    </div>
  )
}
export default Investment;
