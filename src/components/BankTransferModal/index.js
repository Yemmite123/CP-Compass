import React from 'react'
import { closeTransferModal } from "#/store/ui/actions";
import { connect } from "react-redux";
import './style.scss';

const BankTransferModal = ({ details, closeTransferModal, confirmPayment }) => {

  const closeModal = () => {
    closeTransferModal();
  }

  return (
    <div className="bank-transfer-modal text-center">
        <div className="box ml-auto mr-auto">
          <div className="text-right pb-3">
            <img src={require('#/assets/icons/close.svg')} alt="close" onClick={closeModal}/>
          </div>
          <div className="container">
            <header>
              <img src={require('#/assets/icons/bank-transfer.svg')} alt="bank" className="pb-3"/>
              <h3>Direct Bank Transfer</h3>
              <p>Send money to the bank account details below</p>
            </header>
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
            <div>
              <button onClick={confirmPayment} className="btn btn-md btn-primary">
                I have made payment
              </button>
            </div>
          </div>
        </div>
    </div>
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
