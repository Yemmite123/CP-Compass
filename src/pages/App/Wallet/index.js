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
import { formatDate, closeOffCanvas } from "#/utils";
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

    document.querySelector("#withdraw-offcanvas").classList.toggle("show");
    if (!document.querySelector(".offcanvas-backdrop")) {
      let offcanvasOverlay = document.createElement("div");
      offcanvasOverlay.classList.add("offcanvas-backdrop", "show", "fade");
      document.body.lastChild.after(offcanvasOverlay);
    } else {
      document.querySelector(".offcanvas-backdrop").remove();
    }
  };

  handleTransactionSelect = (transaction) => {
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
            <div className="text-center">
              <h3 className="text-deep-blue">
                Please Setup your BVN to continue
              </h3>
              <button
                className="btn btn-primary btn-sm btn-block mt-4"
                onClick={this.handleBvnSetup}
              >
                Setup BVN
              </button>
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
          <Modal onClose={this.toggleModal} classes="tran-modal">
            <WalletTransaction transaction={selectedTransaction} />
            {selectedTransaction?.history?.length > 0 &&
              selectedTransaction?.history?.map((history) => {
                return <WalletTransaction transaction={history} />;
              })}
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
                        title="Wallet balance"
                        total={
                          walletDetails && walletDetails.wallet.NGN
                            ? walletDetails.wallet.NGN
                            : "0.00"
                        }
                        percentageDiff="N/A"
                        backgroundImage={`url(${WalletBG})`}
                        iconColor="#871523"
                        iconName="white-wallet"
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
                        View details{" >"}
                      </p>
                    </div>
                    {walletDetails ? (
                      Object.keys(walletDetails.transactions).map((day) => {
                        return (
                          <div key={day} className="transaction-info">
                            <h4 className="text-deep-blue text-small mt-3">
                              {formatDate(day)}
                            </h4>
                            <div
                              className={`${
                                !walletDetails.transactions[day][
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
