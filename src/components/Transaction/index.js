import React, { useEffect } from 'react';
import moment from 'moment';
import './style.scss';
import { getTransactionTypeImg, formatCurrency, getTransactionTypeColor } from '#/utils';

const Transaction = (props) => {

  const { transaction, handleSelect } = props;

  return (
    <div className="transaction-container py-3 cursor-pointer" onClick={() => handleSelect(transaction)}>
      <div className="d-flex justify-content-between flex-wrap">
        <div className="d-flex mr-3">
          <img src={getTransactionTypeImg(transaction)} width='35px' className="img-fluid mr-5" alt="transaction type"/>
          <div className="details align-self-center">
            <h6 className="mb-0 cursor-pointer" onClick={() => handleSelect(transaction)}>{transaction.title}</h6>
          </div>
        </div>
        <div className="amount-details align-self-center">
          <h3 className={`text-right ${getTransactionTypeColor(transaction)}`}>
              &#x20A6;{formatCurrency(transaction.fees ? transaction.amount + parseFloat(transaction.fees) : transaction.amount )}
          </h3>
          {/* <p className="balance text-right">&#x20A6;525,000</p> */}
        </div>
      </div>
    </div>
  )
}

export default Transaction;
