import React, { useEffect } from 'react';
import moment from 'moment';
import { getTransactionTypeColor, getTransactionTypeImg } from '#/utils';
import './style.scss';

const WalletTransaction = ({ transaction, onClose, multiple }) => {
  return (
    <div className="transaction-details-modal text-center">
      <div className="">
        {
          !multiple && <div className="text-right pb-3">
            <img src={require('#/assets/icons/close.svg')} style={{cursor: "pointer"}} alt="close" onClick={onClose}/>
          </div>
        }
        <div className="container">
          <header>
            <div className="mb-3">
              <img src={getTransactionTypeImg(transaction)} className="img-fluid mr-3 mb-4" alt="transaction type" />
                <h3 className={`font-weight-bold ${getTransactionTypeColor(transaction)}`}>Transaction Details</h3>
                <p className="transaction-title text-grey">{transaction.title}</p>
            </div>
          </header>
          <div className="d-flex justify-content-between mt-4 mb-4">
            <div className="text-left">
              <p className="text-small text-grey mb-0">Amount</p>
            </div>
            <div className="text-right">
              <p className={`font-weight-bold text-small ${getTransactionTypeColor(transaction)}`}>&#x20A6;{transaction.amount}</p>
            </div>
          </div>
           <div className="d-flex justify-content-between mt-2 mb-4">
            <div className="text-left">
              <p className="text-small text-grey mb-0">Date</p>
            </div>
            <div className="text-right">
              <p className="font-weight-bold  text-small">
                {moment(moment.utc(transaction.paidAt ? transaction.created_at : transaction.initializedAt).toDate()).local().format('ddd Do MMM, YYYY HH:mm')}
              </p>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-2 mb-4">
            <div className="text-left">
              <p className="text-small text-grey mb-0">Fee</p>
            </div>
            <div className="text-right">
                <p className="font-weight-bold  text-small">&#x20A6;{transaction.fees ? transaction.fees : '0.00'}</p>
              
            </div>
          </div>
           <div className="d-flex justify-content-between mt-2">
            <div className="text-left">
              <p className="text-small text-grey mb-0">Ref Number</p>
            </div>
            <div className="text-right">
              <p className="font-weight-bold  text-small">{transaction.reference}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletTransaction;