import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/wallet/actionTypes";
import { getWalletDetails } from '#/store/wallet/actions';
import { getUserProfile } from "#/store/profile/actions";
import Card from '#/components/Card';
import Transaction from '#/components/Transaction';
import Modal from '#/components/Modal';
import InformationBar from '#/components/InformationBar';
import WalletTransaction from '#/components/WalletTransaction';
import WalletSkeleton from './Skeleton';
import { formatDate } from '#/utils';
import './style.scss';

class Wallet extends React.Component {

  state = {
    selectedTransaction: null,
    showTransactionModal: false,
    isBvnModal: false,
  }

  componentDidMount() {
    this.props.getWalletDetails();
    this.props.getUserProfile();
  }

  handleDeposit = () => {
    this.props.history.push({
      pathname: `/app/wallet/deposit`,
      state: { routeName: 'Deposit' }
      })
  }

  handleWithdraw = () => {
    if(!this.props.isBvnActive) {
      return this.toggleBvnModal()
    }
    this.props.history.push({
    pathname: `/app/wallet/withdraw`,
    state: { routeName: 'Withdraw' }
    })
  }

  handleTransactionSelect = (transaction) => {
    this.setState({ selectedTransaction: transaction },
      () => this.setState({ showTransactionModal: true }))
  }

  handleBvnSetup = () => {
    this.props.history.push('/app/onboarding');
  }

  navigateTotransactions = () => {
    this.props.history.push({
      pathname: `/app/wallet/transactions`,
      state: { routeName: 'Transactions' }
      })
  }

  toggleModal = () => {
    this.setState(prevState => ({ showTransactionModal: !prevState.showTransactionModal }))
  }

  toggleBvnModal = () => {
    this.setState(prevState => ({ isBvnModal: !prevState.isBvnModal }))
  }

  render() {
    const { loading, walletDetails, isBvnActive, isApproved } = this.props;
    const { showTransactionModal, selectedTransaction, isBvnModal } = this.state;

    return (
      <div className="wallet-dashboard-page">
        {loading && !walletDetails && <WalletSkeleton />}
        {isBvnModal &&
          <Modal classes="bvn-active" onClose={this.toggleBvnModal}>
            <div className="text-center">
              <h3 className="text-deep-blue">Please Setup your BVN to continue</h3>
              <button className="btn btn-primary btn-sm btn-block mt-4" onClick={this.handleBvnSetup}>
                Setup BVN
              </button>
            </div>
          </Modal>
        }
        {isBvnActive && !isApproved &&
          <InformationBar className="mt-3 mb-3 text-white">
            Your account is awaiting approval, you won't be able to perform some actions
          </InformationBar>
        }
        {
          showTransactionModal &&
          <Modal onClose={this.toggleModal} classes="tran-modal">
            <WalletTransaction transaction={selectedTransaction} />
            {selectedTransaction?.history?.length > 0 && 
              selectedTransaction?.history?.map(history => {
                return (
                <WalletTransaction transaction={history} />
                )
            })
            }
          </Modal>
        }
        {walletDetails &&
        <div>
          <div className="pt-3 overview">
            <Card classes="card">
              <div className="row no-gutters">
                <div className="col-md-6">
                  <div className="d-flex justify-content-between flex-wrap">
                    <div className="col-md-6 mt-2 mb-2">
                      <p className="label">NAIRA BALANCE</p>
                      <h3 className="balance-figure">&#x20A6; {walletDetails && walletDetails.wallet.NGN ? walletDetails.wallet.NGN : '0.00'}</h3>
                    </div>
                    <div className="col-md-6 mt-2 mb-2">
                      <p className="label">DOLLAR BALANCE</p>
                      <h3 className="balance-figure">&#36; 0.00 </h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-between mt-2 flex-wrap">
                    <div className="col-md-6 text-center mt-2 mb-2">
                      <button className="btn btn-primary btn-sm w-100" onClick={this.handleDeposit} disabled={loading && !walletDetails}>
                        Deposit
                    </button>
                    </div>
                    <div className="col-md-6 text-center mt-2 mb-2">
                      <button className="btn btn-white btn-sm w-100" onClick={this.handleWithdraw} disabled={loading && !walletDetails}>
                        Withdraw
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          {!walletDetails && loading &&
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary spinner-border-md text-center"></div>
            </div>
          }
          <div className="transactions">
            <Card classes="card">
              <div className="transactions-header d-flex justify-content-between">
                <h3 className="">Transactions</h3>
                <p className="text-blue mb-0 cursor-pointer" onClick={this.navigateTotransactions}>View all {'>'}</p>
              </div>
              {walletDetails
                ? (
                  Object.keys(walletDetails.transactions).map(day => {
                    return (
                      <div key={day} className="transaction-info">
                        <h4 className="text-deep-blue text-small mt-3">{formatDate(day)}</h4>
                        <div className={`${!walletDetails.transactions[day][walletDetails.transactions[day].length - 1] && 'border-bottom'}`}>
                          {walletDetails.transactions[day].length > 0 ?
                            walletDetails.transactions[day].map(transaction => (
                              <Transaction
                                transaction={transaction}
                                key={transaction.reference}
                                handleSelect={this.handleTransactionSelect}
                              />
                            ))
                            :
                            <p className="text-grey text-small text-center mt-2">No transactions for {day}</p>
                          }
                        </div>

                      </div>
                    )
                  })
                )
                : <p className="text-grey text-small text-center mt-2">No transactions</p>}
            </Card>
          </div>
        </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { app: { wallet: { walletDetails, error, data: walletData }, profile: { userProfile: { data } } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_WALLET_DETAILS_REQUEST),
    walletDetails,
    walletData,
    error,
    isBvnActive: data && data.bvn ? true : false,
    isApproved: data && data.isApproved === 1 ? true : false,
    // userProfile,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getWalletDetails: () => dispatch(getWalletDetails()),
    getUserProfile: () => dispatch(getUserProfile()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Wallet));