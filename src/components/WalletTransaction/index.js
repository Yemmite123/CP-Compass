import React from 'react';
import moment from 'moment';
import { transactionType } from '#/utils';
import './style.scss';

const WalletTransaction = ({ transaction }) => {
  return (
    <div className="transaction-details-modal text-center">
      <div className="">
        <div className="text-right pb-3">
            <img src={require('#/assets/icons/close.svg')} style={{cursor: "pointer"}} alt="close" onClick={() => {document.querySelector(".transaction-details-modal").parentElement.parentElement.remove()}}/>
        </div>
        <div className="container">
          <header>
            <div className="mb-3">
              <img src={transactionType(transaction.type)} className="img-fluid mr-3 mb-4" alt="transaction type" />
                <h3 className="text-medium">Transaction Details</h3>
                <p className="tex-left text-small text-grey">{transaction.title}</p>
            </div>
          </header>
          <div className="d-flex justify-content-between mt-4 mb-4">
            <div className="text-left">
              <p className="text-small text-grey mb-0">Amount</p>
            </div>
            <div className="text-right">
              <p className="text-deep-blue text-small">&#x20A6;{transaction.amount}</p>
            </div>
          </div>
           <div className="d-flex justify-content-between mt-2 mb-4">
            <div className="text-left">
              <p className="text-small text-grey mb-0">Date</p>
            </div>
            <div className="text-right">
              <p className="text-deep-blue text-small">
                {moment(moment.utc(transaction.paidAt ? transaction.created_at : transaction.initializedAt).toDate()).local().format('ddd Do MMM, YYYY HH:mm')}
              </p>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-2 mb-4">
            <div className="text-left">
              <p className="text-small text-grey mb-0">Fee</p>
            </div>
            <div className="text-right">
                <p className="text-deep-blue text-small">&#x20A6;{transaction.fees ? transaction.fees : '0.00'}</p>
              
            </div>
          </div>
           <div className="d-flex justify-content-between mt-2">
            <div className="text-left">
              <p className="text-small text-grey mb-0">Ref Number</p>
            </div>
            <div className="text-right">
              <p className="text-deep-blue text-small">{transaction.reference}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletTransaction;