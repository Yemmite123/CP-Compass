import React from 'react';
import moment from 'moment';
import './style.scss';
import { transactionType, formatCurrency } from '#/utils';

const Transaction = (props) => {

  const { transaction, handleSelect } = props;

  return (
    <div className="transaction-container mt-3 border-bottom">
      <div className="d-flex justify-content-between flex-wrap">
        <div className="d-flex align-items-start mr-3">
          <img src={transactionType(transaction.type)} className="img-fluid mr-3" alt="transaction type"/>
          <div className="details">
            <h3 className="mb-0 cursor-pointer" onClick={() => handleSelect(transaction)}>{transaction.title}</h3>
            <p className="mt-1">
              {/* {new Date(transaction.paidAt ? transaction.paidAt : transaction.initializedAt).toUTCString()} */}
              {moment(moment.utc(transaction.paidAt ? transaction.created_at : transaction.initializedAt).toDate()).local().format('ddd, D MMM YYYY HH:mm')}
              </p>
          </div>
        </div>
        <div className="amount-details">
          <h3 className={`text-right ${transaction.type === 'credit' ? 'credit' : (transaction.type === 'invest' ? 'invest' : 'debit')}`}>
            {transaction.type === 'debit' && '-'}&#x20A6;{formatCurrency(transaction.fees ? transaction.amount + parseFloat(transaction.fees) : transaction.amount )}
          </h3>
          {/* <p className="balance text-right">&#x20A6;525,000</p> */}
        </div>
      </div>
    </div>
  )
}

export default Transaction;
