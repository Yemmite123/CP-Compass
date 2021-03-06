import React from "react";
import { closeTransferModal } from "#/store/ui/actions";
import Modal from "#/components/Modal";
import { connect } from "react-redux";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import copyIcon from "../../assets/icons/copy-icon.svg";
import "./style.scss";

const BankTransferModal = ({ details, closeTransferModal, confirmPayment }) => {
  const [isCopied, setIsCopied] = useState(false);

  const closeModal = () => {
    closeTransferModal();
  };
  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const onClipboardCopy = () => {
    navigator.clipboard.writeText(details.accountNumber.toString());
  };

  return (
    <Modal onClose={closeModal}>
      <div className="text-right pb-3">
        <img
          src={require("#/assets/icons/close.svg")}
          alt="close"
          onClick={closeModal}
        />
      </div>
      <div className="px-3">
        <div className="d-flex justify-content-center">
          <img
            src={require("#/assets/icons/bank-transfer.svg")}
            alt="bank"
            className="pb-3"
          />
        </div>
        <div className="text-center">
          <h5 className="text-blue font-bolder">Direct Bank Transfer</h5>
          <small>
            This is your dedicated bank account number. Funds would be credited
            to your account immediately. You can save these account details as a
            beneficiary for easy access for future use.
          </small>
        </div>
        <div className="account-details">
          <div className="mt-5 d-flex justify-content-between">
            <small className="label text-secondary text-left">
              Account number
            </small>
            <h6 className="font-weight-bolder text-blue text-capitalize account-value text-right">
              {details ? (
                <>
                  <span>{details.accountNumber}</span>
                  <CopyToClipboard
                    text={details.accountNumber}
                    onCopy={onCopyText}
                  >
                    <span className={isCopied ? "px-2" : null}>
                      {isCopied ? (
                        "Copied!"
                      ) : (
                        <img
                          src={copyIcon}
                          style={{ cursor: "pointer" }}
                          alt="copy"
                          className="mb-1 pl-1"
                        />
                      )}
                    </span>
                  </CopyToClipboard>
                </>
              ) : (
                <span>no account number yet</span>
              )}
            </h6>
          </div>
          <div className="mt-3 d-flex justify-content-between">
            <small className="label text-secondary text-left">
              Account name
            </small>
            <h6 className="font-weight-bolder text-blue text-capitalize name-value text-right">
              {details ? details.accountName : "no account name yet"}
            </h6>
          </div>
          <div className="mt-3 d-flex justify-content-between">
            <small className="text-secondary label text-left">Bank</small>
            <h6 className="font-weight-bolder text-blue text-capitalize bank-value text-right">
              {details ? details.BankName : "no bank name yet"}
            </h6>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeTransferModal: () => dispatch(closeTransferModal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BankTransferModal);
