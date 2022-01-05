import React from 'react';
import moment from 'moment';
import { transactionType } from '#/utils';
import './style.scss';

const WalletTransaction = ({ transaction }) => {
  return (
    <div className="">
      <div className="d-flex border-bottom pb-1 align-items-start">
        <img src={transactionType(transaction.type)} className="img-fluid mr-3" alt="transaction type" />
        <div>
          <h3 className="text-deep-blue text-medium">Transaction Details</h3>
          <p className="tex-left text-small text-grey">{transaction.title}</p>
        </div>
      </div>
      <div className="d-flex justify-content-between mt-2">
        <div className="text-left">
          <p className="text-small mb-0">Amount</p>
          <p className="text-deep-blue text-small">&#x20A6;{transaction.amount}</p>
        </div>
        <div className="text-right">
          <p className="text-small mb-0">Date</p>
          <p className="text-deep-blue text-small">
            {moment(moment.utc(transaction.paidAt ? transaction.created_at : transaction.initializedAt).toDate()).local().format('ddd Do MMM, YYYY HH:mm')}
          </p>
        </div>
      </div>
      <div className="d-flex justify-content-between mt-2">
        <div className="text-left">
          <p className="text-small mb-0">Fee</p>
          <p className="text-deep-blue text-small">&#x20A6;{transaction.fees ? transaction.fees : '0.00'}</p>
        </div>
        <div className="text-right">
          <p className="text-small mb-0">Reference Number</p>
          <p className="text-deep-blue text-small">{transaction.reference}</p>
        </div>
      </div>
    </div>
  )
}

export default WalletTransaction;