import React, { useRef } from 'react';
import TitleCard from "#/components/TitleCard";
import './style.scss'

const PaymentMethod = ({ onSelect, selected, label, imgUrl, imgBlue, value, balance }) => {

  const ref = useRef();

  return (
    <div onClick={onSelect} id={value} className={`payment-type ${selected && "selected"}`}>
      <TitleCard
        id={value} 
        title={label}
        backgroundColor={"#fff"}
        backgroundImage={""}
        iconName={imgUrl}
        heading={"h6"}
        borderColor={selected ? "#3A4080" : "black"}
        textColor={selected ? "#3A4080" : "black" }
      />
    </div>
  );
}

export default PaymentMethod;
