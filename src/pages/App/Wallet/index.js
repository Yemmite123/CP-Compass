import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/wallet/actionTypes";
import { getWalletDetails } from "#/store/wallet/actions";
import { getUserProfile } from "#/store/profile/actions";
import Card from "#/components/Card";
import Transaction from "#/components/Transaction";
import Modal from "#/components/Modal";
import InformationBar from "#/components/InformationBar";
import WalletTransaction from "#/components/WalletTransaction";
import WalletBG from "#/assets/images/walletBG.svg";
import WaveBG from "#/assets/images/wave-bg.svg";
import WaveBlueBG from "#/assets/images/wave-blue.svg";
import SummaryCard from "#/components/SummaryCard";
import TitleCard from "#/components/TitleCard";
import WalletSkeleton from "./Skeleton";
import Deposit from "#/pages/App/Deposit";
import Withdraw from "#/pages/App/Withdraw";
import { formatDate, openOffCanvas } from "#/utils";
import "./style.scss";

class Wallet extends React.Component {
  state = {
    selectedTransaction: null,
    showTransactionModal: false,
    isBvnModal: false,
  };

  componentDidMount() {
    this.props.getWalletDetails();
    this.props.getUserProfile();
  }

  componentDidUpdate(prevProps) {
    console.log(this.props.walletDetails);
    console.log(prevProps.walletDetails)
    if (this.props.walletDetails && prevProps.walletDetails)
      if (this.props.walletDetails.wallet.NGN !== prevProps.walletDetails.wallet.NGN) {
        this.props.getWalletDetails();
        this.props.getUserProfile();
      }

  }

  handleDeposit = () => {
    document.querySelector("#deposit-offcanvas").classList.toggle("show");
    if (!document.querySelector(".offcanvas-backdrop")) {
      let offcanvasOverlay = document.createElement("div");
      offcanvasOverlay.classList.add("offcanvas-backdrop", "show", "fade");
      document.body.lastChild.after(offcanvasOverlay);
    }
  };

  handleWithdraw = () => {
    if (!this.props.isBvnActive) {
      return this.toggleBvnModal();
    }
    openOffCanvas("withdraw-offcanvas");
  };

  handleTransactionSelect = (transaction) => {
    console.log(this.state.selectedTransaction);

    this.setState({ selectedTransaction: transaction }, () =>
      this.setState({ showTransactionModal: true })
    );
  };

  handleBvnSetup = () => {
    this.props.history.push("/app/onboarding");
  };

  navigateTotransactions = () => {
    this.props.history.push({
      pathname: `/app/wallet/transactions`,
      state: { routeName: "Transactions" },
    });
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      showTransactionModal: !prevState.showTransactionModal,
    }));
  };

  toggleBvnModal = () => {
    this.setState((prevState) => ({ isBvnModal: !prevState.isBvnModal }));
  };

  render() {
    const { loading, walletDetails, isBvnActive, isApproved } = this.props;
    const { showTransactionModal, selectedTransaction, isBvnModal } =
      this.state;

    return (
      <div className="wallet-dashboard-page">
        {loading && !walletDetails && <WalletSkeleton />}
        {isBvnModal && (
          <Modal classes="bvn-active" onClose={this.toggleBvnModal}>
            <div className="text-right pb-3">
              <img src={require('#/assets/icons/close.svg')} alt="close" className="cursor-pointer" onClick={this.toggleBvnModal} />
            </div>
            <div className="px-4 mt">
              <div className="d-flex justify-content-center">
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="26" cy="26" r="26" fill="#EEF0FF" />
                  <path d="M26.0943 18.9523C26.6161 18.9523 27.0392 18.5292 27.0392 18.0074C27.0392 17.4855 26.6161 17.0625 26.0943 17.0625C25.5725 17.0625 25.1494 17.4855 25.1494 18.0074C25.1494 18.5292 25.5725 18.9523 26.0943 18.9523Z" fill="#3A4080" />
                  <path d="M37.2441 35.1104H14.9449C14.423 35.1104 14 35.5334 14 36.0552C14 36.5771 14.423 37.0001 14.9449 37.0001H37.2441C37.766 37.0001 38.189 36.5771 38.189 36.0552C38.189 35.5334 37.766 35.1104 37.2441 35.1104Z" fill="#3A4080" />
                  <path d="M38.189 18.9055C38.189 18.532 37.9689 18.1935 37.6275 18.0419L26.4543 13.0813C26.2096 12.9726 25.9305 12.973 25.6861 13.0819L14.5601 18.0425C14.2194 18.1944 14 18.5326 14 18.9055V21.4095C14 21.4175 14.001 21.4252 14.0012 21.4331C14.001 21.441 14 21.4487 14 21.4567C14 21.9786 14.423 22.4016 14.9449 22.4016C15.4997 22.4016 15.748 22.8762 15.748 23.3465V32.1583C15.748 32.1781 15.7498 32.1974 15.751 32.217C15.7498 32.2365 15.748 32.2558 15.748 32.2756C15.748 32.7975 16.1711 33.2205 16.6929 33.2205H35.5906C36.1124 33.2205 36.5354 32.7975 36.5354 32.2756C36.5354 31.7538 36.1124 31.3307 35.5906 31.3307H32.7559V23.3465C32.7559 22.8255 33.1798 22.4016 33.7008 22.4016C34.2218 22.4016 34.6457 22.8255 34.6457 23.3465V27.5284C34.6457 28.0503 35.0687 28.4733 35.5906 28.4733C36.1124 28.4733 36.5354 28.0503 36.5354 27.5284V23.3465C36.5354 23.1248 36.5866 22.4016 37.2441 22.4016C37.766 22.4016 38.189 21.9786 38.189 21.4567C38.189 21.4487 38.188 21.441 38.1878 21.4331C38.188 21.4252 38.189 21.4175 38.189 21.4095V18.9055ZM19.5276 31.3307H17.6378V23.3465C17.6378 22.8255 18.0617 22.4016 18.5827 22.4016C19.1037 22.4016 19.5276 22.8255 19.5276 23.3465V31.3307ZM23.3071 31.3307H21.4173V23.3465C21.4173 22.8255 21.8412 22.4016 22.3622 22.4016C22.8832 22.4016 23.3071 22.8255 23.3071 23.3465V31.3307ZM27.0866 31.3307H25.1969V23.3465C25.1969 22.8255 25.6207 22.4016 26.1417 22.4016C26.6627 22.4016 27.0866 22.8255 27.0866 23.3465V31.3307ZM30.8661 31.3307H28.9764V23.3465C28.9764 22.8255 29.4003 22.4016 29.9213 22.4016C30.4423 22.4016 30.8661 22.8255 30.8661 23.3465V31.3307ZM36.2992 20.4646H15.8898V19.5188L26.0717 14.9791L36.2992 19.5199V20.4646Z" fill="#3A4080" />
                </svg>
              </div>
              <div className="text-center">
                <h5 className="text-blue font-bolder mt-3"> Please Setup your BVN to continue</h5>
              </div>
              <div className="d-flex flex-column align-items-center">
                <button className="btn btn-primary py-3 w-100 mt-4" onClick={this.handleBvnSetup}>
                  Setup BVN
                </button>
              </div>
            </div>
          </Modal>
        )}
        {isBvnActive && !isApproved && (
          <InformationBar className="mt-3 mb-3 text-white">
            Your account is awaiting approval, you won't be able to perform some
            actions
          </InformationBar>
        )}
        {showTransactionModal && (
          <Modal classes="tran-modal" onClose={this.toggleModal}>
            <WalletTransaction transaction={selectedTransaction} onClose={this.toggleModal} />
            {selectedTransaction?.history?.length > 0 &&
              selectedTransaction?.history?.map(history => {
                return (
                  <div className="mt-5">
                    <WalletTransaction transaction={history} multiple={true} />
                  </div>
                )
              })
            }
          </Modal>
        )}
        {walletDetails && (
          <div>
            <p>
              Check your transaction histories and manage your deposits and
              withdrawals
            </p>
            <div className="row">
              <div className="col-lg-4">
                <div className="pt-3 overview">
                  <div className="row gx-0">
                    <div className="col-12">
                      <SummaryCard
                        className="BG"
                        // showCurrency={true}
                        title="Naira Balance"
                        total={
                          walletDetails && walletDetails.wallet.NGN
                            ? walletDetails.wallet.NGN
                            : "0.00"
                        }
                        percentageDiff="N/A"
                        backgroundImage={`url(${WalletBG})`}
                        iconColor="#871523"
                        iconName="naira-img"
                      />
                    </div>
                    <div
                      className="col mt-3 pr-0"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        loading && !walletDetails ? null : this.handleDeposit()
                      }
                    >
                      <TitleCard
                        title="Deposit"
                        backgroundColor="#53376c"
                        backgroundImage={`url(${WaveBG})`}
                        iconColor=""
                        iconName="deposit"
                        textColor={"#fff"}
                      />
                    </div>
                    <div
                      className="col mt-3"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        loading && !walletDetails ? null : this.handleWithdraw()
                      }
                    >
                      <TitleCard
                        title="Withdraw"
                        backgroundColor="#5d65ac"
                        backgroundImage={`url(${WaveBlueBG})`}
                        iconColor=""
                        iconName="withdraw"
                        textColor={"#fff"}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                {!walletDetails && loading && (
                  <div className="d-flex justify-content-center mt-5">
                    <div className="spinner-border text-primary spinner-border-md text-center"></div>
                  </div>
                )}
                <div className="transactions">
                  <Card classes="card">
                    <div className="transactions-header d-flex justify-content-between">
                      <h3 className="font-bolder">RECENT TRANSACTIONS</h3>
                      <p
                        className="text-blue mb-0 cursor-pointer"
                        onClick={this.navigateTotransactions}
                      >
                        {"View details "}
                        <svg
                          width="5"
                          strokeWidth={"2px"}
                          height="9"
                          viewBox="0 0 5 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 8L4 4.5L1 1"
                            stroke="#3A4080"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </p>
                    </div>
                    {walletDetails ? (
                      Object.keys(walletDetails.transactions).map((day) => {
                        return (
                          <div key={day} className="transaction-info">
                            <h4 className="text-small mt-3">
                              {formatDate(day)}
                            </h4>
                            <div
                              className={`${!walletDetails.transactions[day][
                                walletDetails.transactions[day].length - 1
                              ] && "border-bottom"
                                }`}
                            >
                              {walletDetails.transactions[day].length > 0 ? (
                                walletDetails.transactions[day].map(
                                  (transaction) => (
                                    <Transaction
                                      transaction={transaction}
                                      key={transaction.reference}
                                      handleSelect={
                                        this.handleTransactionSelect
                                      }
                                    />
                                  )
                                )
                              ) : (
                                <p className="text-grey text-small text-center mt-2">
                                  No transactions for {day}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-grey text-small text-center mt-2">
                        No transactions
                      </p>
                    )}
                  </Card>
                </div>
              </div>
            </div>
            <Deposit />
            <Withdraw />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    app: {
      wallet: { walletDetails, error, data: walletData },
      profile: {
        userProfile: { data },
      },
    },
  } = state;

  return {
    loading: getActionLoadingState(
      state,
      actionTypes.GET_WALLET_DETAILS_REQUEST
    ),
    walletDetails,
    walletData,
    error,
    isBvnActive: data && data.bvn ? true : false,
    isApproved: data && data.isApproved === 1 ? true : false,
    // userProfile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getWalletDetails: () => dispatch(getWalletDetails()),
    getUserProfile: () => dispatch(getUserProfile()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Wallet));
