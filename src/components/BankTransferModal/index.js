import React from 'react'
import { closeTransferModal } from "#/store/ui/actions";
import Modal from "#/components/Modal";
import { connect } from "react-redux";
import './style.scss';

const BankTransferModal = ({ details, closeTransferModal, confirmPayment }) => {
  const closeModal = () => {
    closeTransferModal();
  }

  const onClipboardCopy = () => {
    navigator.clipboard.writeText(details.accountNumber.toString());
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
          <small>This is your dedicated bank account number. Funds would be credited to your account immediately. You can save these account details as a beneficiary for easy access for future use.</small>
        </div>
        <div className="account-details">
          <div className="mt-5 d-flex justify-content-between">
            <small className="label text-secondary text-left">Account number</small>
            <h6 className="font-weight-bolder text-blue text-capitalize account-value text-right">
              {details ? details.accountNumber : 'no account number yet'}
              {details && details.accountNumber && <svg onClick={this.onClipboardCopy} className="me-2" width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.2273 7.10648e-08H6.81818C6.03228 -0.00016033 5.27046 0.271216 4.66166 0.7682C4.05285 1.26518 3.63445 1.95725 3.47727 2.72727H3.40909C2.50494 2.72727 1.63783 3.08644 0.9985 3.72577C0.359171 4.3651 0 5.23222 0 6.13636V11.5909C0 12.4951 0.359171 13.3622 0.9985 14.0015C1.63783 14.6408 2.50494 15 3.40909 15H6.81818C7.60408 15.0002 8.3659 14.7288 8.97471 14.2318C9.58351 13.7348 10.0019 13.0427 10.1591 12.2727H10.2273C10.675 12.2727 11.1183 12.1845 11.5319 12.0132C11.9455 11.8419 12.3213 11.5908 12.6379 11.2742C12.9544 10.9577 13.2055 10.5818 13.3769 10.1682C13.5482 9.75463 13.6364 9.31133 13.6364 8.86364V3.40909C13.6364 2.50494 13.2772 1.63783 12.6379 0.9985C11.9985 0.359171 11.1314 7.10648e-08 10.2273 7.10648e-08ZM8.86364 11.5909C8.86364 12.1334 8.64813 12.6537 8.26454 13.0373C7.88094 13.4209 7.36067 13.6364 6.81818 13.6364H3.40909C2.8666 13.6364 2.34633 13.4209 1.96274 13.0373C1.57914 12.6537 1.36364 12.1334 1.36364 11.5909V6.13636C1.36364 5.59388 1.57914 5.07361 1.96274 4.69001C2.34633 4.30641 2.8666 4.09091 3.40909 4.09091H6.81818C7.36067 4.09091 7.88094 4.30641 8.26454 4.69001C8.64813 5.07361 8.86364 5.59388 8.86364 6.13636V11.5909ZM12.2727 8.86364C12.2727 9.40613 12.0572 9.92639 11.6736 10.31C11.29 10.6936 10.7698 10.9091 10.2273 10.9091V6.13636C10.2273 5.23222 9.8681 4.3651 9.22877 3.72577C8.58944 3.08644 7.72233 2.72727 6.81818 2.72727H4.88864C5.02969 2.3283 5.29102 1.9829 5.6366 1.73867C5.98219 1.49445 6.39501 1.36341 6.81818 1.36364H10.2273C10.7698 1.36364 11.29 1.57914 11.6736 1.96274C12.0572 2.34633 12.2727 2.8666 12.2727 3.40909V8.86364Z" fill="#3A4080" />
              </svg>
              }
            </h6>
          </div>
          <div className="mt-3 d-flex justify-content-between">
            <small className="label text-secondary text-left">Account name</small>
            <h6 className="font-weight-bolder text-blue text-capitalize name-value text-right">{details ? details.accountName : 'no account name yet'}</h6>
          </div>
          <div className="mt-3 d-flex justify-content-between">
            <small className="text-secondary label text-left">Bank</small>
            <h6 className="font-weight-bolder text-blue text-capitalize bank-value text-right">{details ? details.BankName : 'no bank name yet'}</h6>
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
