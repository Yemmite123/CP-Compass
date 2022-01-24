import React, { useRef } from 'react';
import TitleCard from "#/components/TitleCard";
import './style.scss'

const PaymentMethod = ({ onSelect, selected, label, imgUrl, imgBlue, value, balance }) => {

  const ref = useRef();

  return (
    <div onClick={onSelect} id={value} className={`payment-type ${selected && "selected"} position-relative`}>
     {selected &&  <img className="position-absolute" width={16} src={require("#/assets/icons/success.svg")} style={{zIndex: 1, right: "0.35rem", top: "0.35rem"}} />}
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
