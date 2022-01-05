import React from 'react';
import './style.scss';

const Modal = (props) => {

  const onModalClick = (e) => {
    if(e.target.classList.contains("safe-area")) {
      props.onClose &&
          props.onClose();
    }
  }

  return (
    <div className={`cp-modal safe-area ${props.classes}`} onClick={onModalClick}>
      <div className="dialogue">
        {props.children}
      </div>
    </div>
  )
}

export default Modal;
