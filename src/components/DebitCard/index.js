import React from 'react';
import './style.scss';

const DebitCard = (props) => {
  const { card, selected, handleSelect } = props;

  return (
    <div className={`d-flex p-3 position-relative mb-2 cursor-pointer debit-card  ${selected ? "selected" : ""}`} onClick={() => handleSelect(card)}>
       {selected && <img className="position-absolute" width={16} src={require("#/assets/icons/success.svg")} style={{zIndex: 1, right: "0.35rem", top: "0.35rem"}} />}
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
