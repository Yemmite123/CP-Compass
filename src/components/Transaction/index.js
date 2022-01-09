import React from 'react';
import moment from 'moment';
import './style.scss';
import { transactionType, formatCurrency } from '#/utils';

const Transaction = (props) => {

  const { transaction, handleSelect } = props;

  return (
    <div className="transaction-container  border-bottom py-3">
      <div className="d-flex justify-content-between flex-wrap">
        <div className="d-flex mr-3">
          <img src={transactionType(transaction.type)} width='35px' className="img-fluid mr-5" alt="transaction type"/>
          <div className="details align-self-center">
            <h6 className="mb-0 cursor-pointer" onClick={() => handleSelect(transaction)}>{transaction.title}</h6>
          </div>
        </div>
        <div className="amount-details align-self-center">
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
