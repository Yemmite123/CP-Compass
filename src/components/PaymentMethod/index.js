import React, { useRef } from 'react';
import './style.scss'

const PaymentMethod = ({ onSelect, selected, label, imgUrl, imgBlue, value, balance }) => {

  const ref = useRef();

  return (
    <div className="payment-types" id={value} ref={ref} onClick={onSelect}>
      <div id={value} className={`payment-method d-flex justify-content-between ${selected && 'selected'} mt-2`}>
        <div id={value} className="d-flex align-items-center">
          <img id={value} src={selected ? imgBlue : imgUrl} alt="payment method" className="mr-3"/>
          <div>
            <p id={value} className="mb-0">{label}</p>
            {value === 'wallet' && balance &&  <p className="text-grey text-x-small mb-0">Available balance <span className="text-deep-blue">&#x20A6; {balance}</span></p>}
          </div>
        </div>
        {selected && <img src={require("#/assets/icons/check-blue.svg")} alt="check"/>}
      </div>
    </div>
    
  )
}

export default PaymentMethod;
