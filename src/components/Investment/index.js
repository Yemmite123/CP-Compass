import React from 'react';
import moment from 'moment';
import Card from '#/components/Card';
import { formatCurrency } from '#/utils';
import './style.scss';

const Investment = (props) => {

  const { investment, navigateToInvestment } = props;
  return (
    <div className="investment-card">
      <Card classes="cursor-pointer" onclick={() => { console.log(investment); navigateToInvestment(investment.id)}}>
        <h3 className="text-blue text-medium text-capitalize" >{investment.title}</h3>
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
        <div className="d-flex justify-content-between mt-4">
          <div>
            <p className="mb-0 text-grey">Target</p>
            <p className="mb-0">&#x20A6;{formatCurrency(investment.targetAmount)}</p>
          </div>
          <div>
            <p className="mb-0 text-grey">Target met</p>
            <p className="mb-0">{investment.percentageCompletion}% <span className="text-black text-small">(&#x20A6;{formatCurrency(investment.balance)})</span></p>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <p className="mb-0 text-black text-grey">Next payment Date</p>
            <p className="mb-0 text-black">{investment.nextPaymentDate ? moment(investment.nextPaymentDate).format('YYYY-MM-DD') : 'N/A'}</p>
          </div>
        </div>
        <div className="mt-3">
          <span className={`status py-1 px-4 text-capitalize ${investment.order_status}`}>{investment.order_status}</span>
        </div>

      </Card>
    </div>
  )
}
export default Investment;