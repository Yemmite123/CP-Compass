import React from 'react';

const DebitCard = (props) => {
  const { card, handleSelect } = props;

  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex align-items-start">
        <img src={require('#/assets/icons/bank-card.svg')} className="img-fluid mr-3" alt="card"/>
        <div>
          <p className="text-deep-blue text-medium mb-0 cursor-pointer" onClick={() => handleSelect(card)}>**** **** **** {card.last4} </p>
          <p className="text-grey mb-0">{card.bank} ({card.brand})</p>
        </div>
      </div>
      <img src={require('#/assets/icons/right-arrow.svg')} className="img-fluid cursor-pointer" alt="card" onClick={() => handleSelect(card)}/>
    </div>
  )
}

export default DebitCard;
