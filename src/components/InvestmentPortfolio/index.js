import React from 'react';
import moment from 'moment';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { formatCurrency } from '#/utils';
import 'react-circular-progressbar/dist/styles.css';
import './style.scss';

const InvestmentPortfolio = ({ item, navigateToItem, ...props }) => {

  return (
    <div className="investment-portfolio cursor-pointer" onClick={() => navigateToItem(item.id)}>
      <div className="d-flex justify-content-between align-items-center">
        <p className="text-deep-blue text-medium cursor-pointer" onClick={() => navigateToItem(item.id)}>{item && item.title}</p>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div>
            <p className="text-grey text-small font-light mb-0">Target</p>
            <p className="text-black text-small">&#x20A6;{item ? formatCurrency(item.targetAmount) : 0}</p>
          </div>
          <div>
            <p className="text-grey text-small font-light mb-0">Interest per annum</p>
            <p className="text-black">{`${item ? item.interestRate : 0}%`}</p>
          </div>
          <div>
            <p className="text-grey text-small font-light mb-0">Next payment date</p>
            <p className="text-black">{item &&  item?.nextPaymentDate ?  moment(moment(item?.nextPaymentDate).toDate()).format('YYYY-MM-DD') : 'unavailable' }</p>
          </div>
        </div>
        <div className="col-md-6 progress-section">
          <CircularProgressbarWithChildren
          value={item ? item.percentageCompletion : 0}
          styles={{
            path: {
              stroke: `rgba(40, 167, 69)`,
            }
          }}
          className="progress-bar-portfolio">
            <p className="text-grey text-small mb-0">Progress</p>
            <h3 className="text-deep-blue text-large">{`${item ? item.percentageCompletion : 0}%`}</h3>
            <h3 className="text-black text-small font-light">&#x20A6;{item ? formatCurrency(item.balance) : 0}</h3>
          </CircularProgressbarWithChildren>
          <div className="text-center portfolio-status">
            <p className={`mb-0 status-${item.order_status}`}>{item.order_status}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestmentPortfolio;
