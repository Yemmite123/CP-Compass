import React from 'react'
import { closeTransferModal } from "#/store/ui/actions";
import Modal from "#/components/Modal";
import { connect } from "react-redux";
import './style.scss';

const BankTransferModal = ({ details, closeTransferModal, confirmPayment }) => {

  const closeModal = () => {
    closeTransferModal();
  }

  return (
    <Modal onClose={closeModal}>
      <div className="text-right pb-3">
        <img src={require("#/assets/icons/close.svg")} alt="close" onClick={closeModal} />
      </div>
      <div className="px-3">
        <div className="d-flex justify-content-center">
          <img src={require("#/assets/icons/bank-transfer.svg")} alt="bank" className="pb-3" />

      </div>
      <div className="text-center">
        <h5 className="text-blue font-bolder">
          Direct Bank Transfer
        </h5>
        <p>Send money to the bank account details below</p>
      </div>
      <div className="account-details">
        <div className="d-flex justify-content-between">
          <p className="label text-left">Account number</p>
          <p className="account-value text-right">{details? details.accountNumber : 'no account number yet'}</p>
        </div>
        <div className="d-flex justify-content-between">
          <p className="label text-left">Account name</p>
          <p className="name-value text-right">{details? details.accountName : 'no account name yet'}</p>
        </div>
        <div className="d-flex justify-content-between">
          <p className="label text-left">Bank</p>
          <p className="bank-value text-right">{details? details.BankName : 'no bank name yet'}</p>
        </div>
      </div>
      </div>
    </Modal>
  )
}

const mapStateToProps = (state) => {
  return {}
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeTransferModal: () => dispatch(closeTransferModal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BankTransferModal);
