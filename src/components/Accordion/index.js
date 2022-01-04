import React from 'react';
import closeAccordion from '#/assets/icons/close-accordion.svg';
import openAccordion from '#/assets/icons/open-accordion.svg';
import './style.scss'

const Accordion = ({ item, selectItem, open, closeItem }) => {

  const dropAccordion = () => {
    selectItem(item.id)
  }

  const collapseAccordion = () => {
    closeItem();
  }

  return (
    <div className="cp-accordion">
      <div className="d-flex justify-content-between align-items-center cursor-pointer" onClick={open ? collapseAccordion : dropAccordion}>
        <h3 className="text-medium text-black mb-0 cursor-pointer">{item.title}</h3>
        <img src={open ? closeAccordion : openAccordion} alt="toggle" className={`cursor-pointer ${open && 'rotate'}`} onClick={open ? collapseAccordion : dropAccordion}/>
      </div>
      {open &&
        <div className={`content ${open ? 'add-height' : 'no-height'} p-3`}>
          <p className="text-grey text-small mb-0">{item.content}</p>
        </div>
      }
    </div>
  )
}

export default Accordion;
