import React from 'react';
import './style.scss';

const DebitCard = (props) => {
  const { card, selected, handleSelect } = props;

  return (
    <div className={`d-flex p-3 mb-2 cursor-pointer debit-card  ${selected ? "selected" : ""}`} onClick={() => handleSelect(card)}>
      <div className="d-flex mr-3">
        <img src={require(`#/assets/icons/bank-card.svg`)} width={"35px"} alt="icon" />
      </div>
      <div className="d-flex flex-column justify-content-center">
        <h5 className="text-center  mb-0">**** **** **** {card.last4}</h5>
        <p className="text-grey text-left mb-0 card-brand">{card.bank} ({card.brand})</p>
      </div>
    </div>
  )
}

export default DebitCard;
