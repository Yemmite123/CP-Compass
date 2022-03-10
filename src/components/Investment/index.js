import React from 'react';
import moment from 'moment';
import Card from '#/components/Card';
import { formatCurrency } from '#/utils';
import './style.scss';

const Investment = (props) => {

  const { investment, navigateToInvestment } = props;
  return (
    <div className="investment-card">
      <Card classes="cursor-pointer" onclick={() => { console.log(investment); navigateToInvestment(investment.id) }}>
        <h3 className="text-blue text-medium text-capitalize" >{investment.title.length > 20 ? investment.title.slice(0, 19) + "..." : investment.title}</h3>
        <div className="progress position-relative">
          {investment && investment.percentageCompletion < 10 ? <div className="text-black position-absolute font-weight-bold" style={{ top: "1px", left: "2px" }} > {investment.percentageCompletion}% </div> : <></>}
          <div
            className={`progress-bar bg-success ${investment.percentageCompletion == 0 ? "d-none" : ""}`}
            style={{ width: `${investment.percentageCompletion}%` }}
            role="progressbar"
            aria-valuenow={investment.percentageCompletion}
            aria-valuemin="0"
            aria-valuemax="100">
            {investment && investment.percentageCompletion >= 10 ? `${investment.percentageCompletion}%` : ""}
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <small className="mb-0 text-grey">Target</small>
            <p className="mb-0 text-small">&#x20A6;{formatCurrency(investment.targetAmount)}</p>
          </div>
          <div>
            {/* TOOD: Update Value from server */}
            <small className="mb-0 text-grey">Interest per annum</small>
            <p className="mb-0"><span className="text-black text-small">{investment.interestRate}%</span></p>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <div>
            <small className="mb-0 text-black text-grey">Next payment date</small>
            <p className="mb-0 text-black text-small">{investment.nextPaymentDate ? moment(moment(investment.nextPaymentDate).toDate()).format('DD MMMM, YYYY') : 'N/A'}</p>
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
