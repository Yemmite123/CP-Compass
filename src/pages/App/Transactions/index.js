import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/wallet/actionTypes";
import { getTransactionHistory } from '#/store/wallet/actions';
import Back from '#/components/Back';
import Transaction from '#/components/Transaction';
import Modal from '#/components/Modal';
import WalletTransaction from '#/components/WalletTransaction';
import './style.scss';

class Transactions extends React.Component {

  state = {
    showTransactionModal: false,
    selectedTransaction: null,
    limit: 10,
    page: 1,
    transactions: {},
  }
  componentDidMount() {
    this.props.getTransactionHistory(this.state.limit, 1)
      .then(data => this.updateTransactions(data));
  }

  updateTransactions = (data) => {
    this.setState({ transactions: { ...this.state.transactions, ...data } })
  }

  handleTransactionSelect = (transaction) => {
    this.setState({ selectedTransaction: transaction },
      () => this.setState({ showTransactionModal: true }))
  }

  fetchMore = () => {
    this.setState({ page: this.state.page + 1 }, () => {
      this.props.getTransactionHistory(this.state.limit, this.state.page)
        .then(data => this.updateTransactions(data));
    })
  }

  fetchPrevious = () => {
    if (this.state.page === 1) {
      return;
    }
    this.setState({ page: this.state.page - 1 }, () => {
      this.props.getTransactionHistory(this.state.limit, this.state.page)
        .then(data => this.updateTransactions(data));
    })
  }

  toggleModal = () => {
    this.setState(prevState => ({ showTransactionModal: !prevState.showTransactionModal }))
  }

  render() {
    const { loading } = this.props;
    const { showTransactionModal, selectedTransaction, transactions } = this.state;

    return (
      <div className="all-transactions-page">
        {
          showTransactionModal &&
          <Modal onClose={this.toggleModal}>
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
        <div className="row">
          <div className="col-md-2">
            <Back />
          </div>
          <div className="col-md-8 text-center">
            <h3 className="text-medium text-deep-blue ">Transaction History</h3>
          </div>
        </div>
        <div className="card p-3 mt-2">
          {loading &&
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary spinner-border-md text-center"></div>
            </div>
          }
          {transactions?.transactions && Object.keys(transactions.transactions).length > 0 ?
            Object.keys(transactions.transactions).map(day => {
              return (
                <div key={day} className="transaction-info">
                  <h4 className="text-deep-blue text-small mt-3">{day}</h4>
                  <div className={`${!transactions.transactions[day][transactions.transactions[day].length - 1] && 'border-bottom'}`}>
                    {transactions.transactions[day].length > 0 ?
                      transactions.transactions[day].map(transaction => (
                        <Transaction
                          transaction={transaction}
                          key={Math.random() * 1000}
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
            :
            (!loading &&
              <div className="text-center mt-4">
                <img src={require('#/assets/icons/receipt.svg')} alt="plus" className="img-fluid" />
                <p className="font-light text-grey"> No Transactions</p>
              </div>
            )}

          <div className="text-center d-flex justify-content-between align-items-center mt-3">
            <div>
              <button className="btn btn-primary btn-sm mr-2" onClick={this.fetchPrevious} disabled={loading || this.state.page === 1}>
                Prev
              </button>
              <button className="btn btn-primary btn-sm ml-2" onClick={this.fetchMore} disabled={loading || this.state.page === transactions?.lastPage}>
                Next
              </button>
            </div>
            <p className="text-grey text-small">Page {this.state.page}</p>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { app: { wallet: { transactions, error } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.GET_TRANSACTION_HISTORY_REQUEST),
    transactions,
    error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTransactionHistory: (limit, pageNumber) => dispatch(getTransactionHistory(limit, pageNumber)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Transactions));
