import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from 'moment';
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/portfolio/actionTypes";
import { fetchSingleInvestment, topUpInvestment } from '#/store/portfolio/actions';
import { disableAutocharge } from '#/store/investment/actions';
import { getCards } from '#/store/wallet/actions';
import { confirmPin } from '#/store/security/actions';
import securityActionTypes from '#/store/security/actionTypes';
import Card from '#/components/Card';
import PaymentMethod from '#/components/PaymentMethod';
import Modal from '#/components/Modal';
import DebitCard from '#/components/DebitCard';
import Textbox from '#/components/Textbox';
import Transaction from '#/components/Transaction';
import PinInput from '#/components/PinInput';
import { formatCurrency, validateFields, fundingSource, serializeErrors, transactionType, formatCurrencyToString,
  formatStringToCurrency } from '#/utils';
import './style.scss';

class SingleInvestment extends React.Component {

  state = {
    amount: '',
    showAmountModal: false,
    showFundingSourceModal: false,
    showCardsModal: false,
    showAutomateModal: false,
    showTransactionModal: false,
    selectedMethod: '',
    selectedMethodError: null,
    errors: null,
    cardId: null,
    selectedTransaction: null,
    showPinModal: false,
    pinError: null,
    pin: {},
  }

  componentDidMount() {
    const { params } = this.props.match;
    if (!Number.isInteger(parseInt(params.investmentId, 10))) {
      return this.props.history.push({
        pathname: `/app/portfolio/`,
        state: { routeName: 'Portfolio' },
      })
    }
    this.props.getCards();
    this.props.fetchSingleInvestment(params.investmentId);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    if(name === 'amount') {
      this.setState({ errors: null});
        return this.setState({ [name]: formatCurrencyToString(value)}, ()=> {
          if(isNaN(this.state[name])) {
            return this.setState({ errors: { [name]: 'enter a valid number' } })
          }
        });
      }
    this.setState({ [name]: value });
  }

  handlePin = (pin) => {
    this.setState({pin})
  }

  handleSelectMethod = (event) => {
    this.setState({ selectedMethod: event.target.id });
  }

  handleSelectAmount = () => {
    // this.toggleTransactionPinModal()
    this.toggleAmountModal()
  }

  handleTopUp = () => {
    const { amount } = this.state;

    const required = ['amount'];
    const errors = validateFields({ amount }, required)

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }
    this.toggleAmountModal();
    this.toggleTransactionPinModal()
  }

  // handles for when a funcding source is selected
  handleSelectedFundingSource = () => {
    const { selectedMethod } = this.state;

    const required = ['selectedMethod'];
    const errors = validateFields({ selectedMethod }, required);
    if (Object.keys(errors).length > 0) {
      return this.setState({ selectedMethodError: 'please select a method' });
    }
    if (selectedMethod === 'wallet') {
      this.toggleFundingModal()
      return this.props.investment?.autoCharge === 0 || this.props.investment?.autoChargeChannel !== selectedMethod ? this.toggleAutomateModal() : this.handlePay();
    }
    this.toggleFundingModal();
    this.toggleAllCardsModal()
  }

  handleSelectCard = (card) => {
    const { selectedMethod } = this.state

    this.setState({ cardId: card.id }, () => {
      this.toggleAllCardsModal()
      return this.props.investment?.autoCharge === 0 || this.props.investment?.autoChargeChannel !== selectedMethod ? this.toggleAutomateModal() : this.handlePay();
    })
  }

  handleNewCardSelect = () => {
    this.toggleAllCardsModal()
    return this.props.investment?.autoCharge === 0 ? this.toggleAutomateModal() : this.handlePay();
  }

  handlePay = (autoCharge) => {
    const { amount, selectedMethod, cardId } = this.state;
    const { params } = this.props.match;
    const payment = { method: selectedMethod, reoccurring: cardId ? true : false, cardId: cardId && cardId };
    const payload = { amount: formatCurrencyToString(amount), payment, currency: 'NGN', autoCharge: autoCharge && autoCharge }

    this.props.topUpInvestment(payload, params.investmentId)
      .then(data => {
        this.state.showAutomateModal && this.toggleAutomateModal();
        this.setState({ amount: '', selectedMethod: '', errors: null, cardId: null })
        setTimeout(() => this.props.fetchSingleInvestment(params.investmentId) , 3000) 
      })
  }

  handleTransactionSelect = (transaction) => {
    this.setState({ selectedTransaction: transaction },
      () => this.setState({ showTransactionModal: true }))
  }

  handleDisableAutocharge = () => {
    const { params } = this.props.match;
    this.props.disableAutocharge(params.investmentId)
      .then(data => {
        this.props.fetchSingleInvestment(params.investmentId);
      })
  }

  handleTransactionVerification = (e) => {
    e.preventDefault()
    const { pin } = this.state
    const { confirmPin } = this.props
    this.setState({ pinError: null })

    const initialPin = [ pin.value1, pin.value2, pin.value3, pin.value4 ].join('');
    if (initialPin.length < 4 ) {
      return this.setState({ pinError: 'field is required'})
    }
    confirmPin({ pin: initialPin })
      .then(data => {
        this.toggleTransactionPinModal()
        this.toggleFundingModal();
    })
  }

  //liquidate your account
  handleLiquidate = () => {
    const { params } = this.props.match;
    const { investment } = this.props;

    return this.props.history.push({
      pathname: `/app/portfolio/liquidate/${params.investmentId}`,
      state: { investment: investment, routeName: 'Liquidate Investment' },
    })
  }

  toggleModal = () => {
    this.setState(prevState => ({ showTransactionModal: !prevState.showTransactionModal }))
  }

  toggleTransactionPinModal = () => {
    this.setState(prevState => ({ showPinModal: !prevState.showPinModal }))
  }

  toggleAmountModal = () => {
    this.setState(prevState => ({ showAmountModal: !prevState.showAmountModal }));
  }

  toggleFundingModal = () => {
    this.setState(prevState => ({ showFundingSourceModal: !prevState.showFundingSourceModal }))
  }

  toggleAllCardsModal = () => {
    this.setState(prevState => ({ showCardsModal: !prevState.showCardsModal }))
  }

  toggleAutomateModal = () => {
    this.setState(prevState => ({ showAutomateModal: !prevState.showAutomateModal }));
  }

  render() {
    const { investment, walletDetails, payLoading, cards, error, pinLoading, confirmPinError } = this.props;
    const { showAmountModal, showFundingSourceModal, showCardsModal, selectedMethod,
      selectedMethodError, showAutomateModal, errors, amount,
      showTransactionModal, selectedTransaction, showPinModal, pinError } = this.state;
    const errorObject = serializeErrors(error);

    return (
      <div className="single-portfolio-page">
        {showPinModal &&
          <Modal classes="transaction-modal" onClose={this.toggleTransactionPinModal}>
            <div className="text-center">
              <h3>Enter Transaction PIN</h3>
              <div className="pin-section ml-auto mr-auto mt-3">
                <PinInput onChange={this.handlePin} error={pinError}/>
              </div>
              <button className="btn btn-sm btn-primary btn-block mt-5" onClick={this.handleTransactionVerification} disabled={pinLoading}>
                Continue
                {pinLoading &&
                  <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                }
              </button>
              {pinError && <p className="text-error mt-2">{pinError}</p>}
              {confirmPinError && <p className="text-error mt-2">{confirmPinError}</p>}
              {error && typeof(error) === 'string' && <p className="text-error mt-2">{error}</p>}
            </div>
          </Modal>
        }
        {
          showTransactionModal &&
          <Modal onClose={this.toggleModal}>
            <div className="">
              <div className="d-flex border-bottom pb-1 align-items-start">
                <img src={transactionType(selectedTransaction.type)} className="img-fluid mr-3" alt="transaction type" />
                <div>
                  <h3 className="text-deep-blue text-medium">Transaction Details</h3>
                  <p className="tex-left text-small text-grey">{selectedTransaction.title}</p>
                </div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <div className="text-left">
                  <p className="text-small mb-0">Amount</p>
                  <p className="text-deep-blue text-small">&#x20A6;{selectedTransaction.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-small mb-0">Date</p>
                  <p className="text-deep-blue text-small">
                    {new Date(selectedTransaction.paidAt ? selectedTransaction.paidAt : selectedTransaction.initializedAt).toDateString()}
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <div className="text-left">
                  <p className="text-small mb-0">Fee</p>
                  <p className="text-deep-blue text-small">&#x20A6;{selectedTransaction.fees ? selectedTransaction.fees : 0.00}</p>
                </div>
                <div className="text-right">
                  <p className="text-small mb-0">Reference Number</p>
                  <p className="text-deep-blue text-small">{selectedTransaction.reference}</p>
                </div>
              </div>
            </div>
          </Modal>
        }
        {showAmountModal &&
          <Modal onClose={this.toggleAmountModal}>
            <h3 className="text-deep-blue">How much do you want to add to this investment right now?</h3>
              <Textbox
                onChange={this.handleChange}
                type="text"
                label="Amount"
                placeholder="Amount"
                name="amount"
                value={formatStringToCurrency(amount)}
                error={errors ? errors.amount : (errorObject && errorObject['amount'])}
              />
              { walletDetails &&  
              <p className="text-grey text-x-small mb-0">Available balance <span className="text-deep-blue">
                &#x20A6; {walletDetails && walletDetails.wallet.NGN ? walletDetails.wallet.NGN : 0}
                </span>
              </p>
            }
              <div className="text-right mt-2">
              <button className="btn btn-sm btn-primary" onClick={this.handleTopUp}>
                Proceed
              </button>
            </div>
          </Modal>
        }

        {showFundingSourceModal &&
          <Modal onClose={this.toggleFundingModal}>
            <div className="text-left">
              <h3>Choose a funding source</h3>
              <div>
                {fundingSource.map(method => (
                  <PaymentMethod
                    onSelect={this.handleSelectMethod}
                    selected={selectedMethod === method.value ? true : false}
                    imgUrl={method.imgUrl}
                    imgBlue={method.imgBlue}
                    key={Math.random() * 1000}
                    value={method.value}
                    label={method.label}
                    balance={walletDetails && walletDetails.wallet.NGN ? walletDetails.wallet.NGN : 0}
                  />
                ))}
                {selectedMethodError && <p className="text-error mt-2">{selectedMethodError}</p>}
              </div>
              <div className="text-right">
                <button className="btn btn-sm btn-primary mt-3" onClick={this.handleSelectedFundingSource} disabled={payLoading}>
                  Proceed
                </button>
              </div>
            </div>
          </Modal>
        }

        {showCardsModal &&
          <Modal onClose={this.toggleAllCardsModal}>
            <div className="text-right pb-3">
              <img src={require('#/assets/icons/close.svg')} alt="close" onClick={this.toggleAllCardsModal} className="cursor-pointer" />
            </div>
            {
              cards &&
              cards.cards.length > 0 &&
              cards.cards.map(card => (
                <DebitCard card={card} handleSelect={this.handleSelectCard} key={card.id} />
              ))
            }
            <div className="d-flex justify-content-between align-items-center cursor-pointer" onClick={this.handleNewCardSelect}>
              <div className="d-flex align-items-center">
                <img src={require('#/assets/icons/add-card.svg')} className="img-fluid mr-3" alt="card" />
                <p className="text-deep-blue text-medium mb-0">Add money from a new debit card</p>
              </div>
              <img src={require('#/assets/icons/right-arrow.svg')} className="img-fluid cursor-pointer" alt="arrow" />
            </div>
          </Modal>
        }

        {showAutomateModal &&
          <Modal onClose={this.toggleAutomateModal}>
            <div className="text-left">
              <h3>Automate funding for this investment</h3>
              <p className="text-small text-black">Let us help you reach your target easily by funding from your chosen source on a {investment && investment.frequency} basis.</p>
            </div>
            <div className="d-flex justify-content-end align-items-center">
              {payLoading &&
                <div className="spinner-border spinner-border-primary text-primary spinner-border-sm mr-2"></div>
              }
              <p className="mr-3 text-deep-blue mb-0 cursor-pointer" onClick={() => this.handlePay(false)}>No, I’ll add money myself</p>
              <button className="btn btn-sm btn-primary" onClick={() => this.handlePay(true)}>
                Yes
              </button>
            </div>
            {error && typeof error === 'string' && <p className="text-error mt-2">{error}</p>}
          </Modal>
        }

        <div className="d-flex justify-content-between">
          <div onClick={()=> this.props.history.push('/app/portfolio')} className="cursor-pointer">
            <img
              src={require("#/assets/icons/back-arrow.svg")}
              alt="transfer logo"
              className="mr-2"
            />
            Back
          </div>
          <p className={`pl-3 pr-3 text-small text-capitalize single-portfolio-page--${investment?.order_status}`}>{investment?.order_status}</p>
        </div>
        <div className="row mt-2">
          <div className="col-md-4 mt-2">
            <Card classes="text-center p-4 border-blue">
              <p className="text-small text-grey">Amount Invested</p>
              <h3 className="text-blue">&#x20A6; {investment ? formatCurrency(investment.balance) : 0}</h3>
            </Card>
          </div>
          <div className="col-md-4 mt-2">
            <Card classes="text-center p-4 border-blue">
              <p className="text-small text-grey">Interest</p>
              <h3 className="text-blue">&#x20A6; {investment ? formatCurrency(investment.accruedInterest) : 0}</h3>
            </Card>
          </div>
          <div className="col-md-4 mt-2">
            <Card classes="text-center p-4 bg-default">
              <p className="text-small text-white">Interest Rate P.A.</p>
              <h3 className="text-white">{investment ? investment.interestRate : 0}%</h3>
            </Card>
          </div>
        </div>
        <Card classes="mt-4 card">
          <div className="row">
            <div className="col-md-4 text-center mt-2">
              <img src={require('#/assets/icons/top-up.svg')}
                alt="plus"
                className={`img-fluid ${['active', 'booked'].includes(investment?.order_status) ? 'cursor-pointer' : 'cursor-block disabled'}`}
                onClick={['active', 'booked'].includes(investment?.order_status) ? this.handleSelectAmount : null}
              />
              <p
              className={`text-blue mb-0 text-small ${['active', 'booked'].includes(investment?.order_status) ? 'cursor-pointer' : 'cursor-block disabled'}`}
              onClick={['active', 'booked'].includes(investment?.order_status) ? this.handleSelectAmount : null}>
                Top up
              </p>
            </div>
            <div className="col-md-4 text-center mt-2">
              {investment?.autoChargeChannel && investment?.autoChargeChannel !== '' &&
              <>
              <img src={investment?.autoCharge === 0 ? require('#/assets/icons/toggle-off.svg') : require('#/assets/icons/toggle-on.svg')}
                alt="plus"
                className={`img-fluid ${['active', 'booked'].includes(investment?.order_status) ? 'cursor-pointer' : 'cursor-block disabled'}`}
                onClick={['active', 'booked'].includes(investment?.order_status) ? this.handleDisableAutocharge : null}
              />
              <p
              className={`text-blue mb-0 text-small ${['active', 'booked'].includes(investment?.order_status) ? 'cursor-pointer' : 'cursor-block disabled'}`}
              onClick={['active', 'booked'].includes(investment?.order_status) ? this.handleDisableAutocharge : null}>
                Automated Pay
              </p>
              </>
               }
            </div>
            <div className="col-md-4 text-center mt-2">
              <img
              src={require('#/assets/icons/liquidate.svg')}
              alt="plus"
              className={`img-fluid ${['active', 'booked'].includes(investment?.order_status) ? 'cursor-pointer' : 'cursor-block disabled'}`}
              onClick={['active', 'booked'].includes(investment?.order_status) ? this.handleLiquidate : null} />
              <p
              className={`text-blue mb-0 text-small ${['active', 'booked'].includes(investment?.order_status) ? 'cursor-pointer' : 'cursor-block disabled'}`}
              onClick={['active', 'booked'].includes(investment?.order_status) ? this.handleLiquidate : null}>
                Liquidate
              </p>
            </div>
          </div>
        </Card>

        <div className="row mt-3">
          <div className="col-md-4 mt-2">
            <div className="card p-3 min-height-small">
              <p className="border-bottom text-deep-blue text-small">Payment Amount</p>
              <h3>&#x20A6;{investment ? formatCurrency(investment.installment) : 0} <span className="text-blue text-small">/{investment && investment.frequency}</span></h3>
              <p className="font-light">Next Deposit Date - <b>{investment && investment.nextPaymentDate ? moment(investment.nextPaymentDate).format('MMM D, YYYY') : 'Not Available'}</b></p>
            </div>
          </div>
          <div className="col-md-4 mt-2">
            <div className="card p-3 min-height-small">
              <p className="border-bottom text-deep-blue text-small">Investment Progress</p>
              <div className="d-flex justify-content-between align-items-end flex-wrap">
                <h3>{investment ? investment.percentageCompletion : 0}%</h3>
                <div>
                  <p className="right-side-text text-grey text-small mb-0">Target</p>
                  <h3>&#x20A6;{investment ? formatCurrency(investment.targetAmount) : 0}</h3>
                </div>
              </div>
              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${investment ? investment.percentageCompletion : 0}%` }}
                  role="progressbar"
                  aria-valuenow={investment ? investment.percentageCompletion : 0}
                  aria-valuemin="0"
                  aria-valuemax="100">
                </div>
              </div>
              <p className="text-grey text-small mt-2 mb-0">Your saving determine your plan progress</p>
            </div>
          </div>
          <div className="col-md-4 mt-2">
            <div className="card p-3 min-height-small">
              <p className="border-bottom text-deep-blue text-small">Investment Info</p>
              <div className="d-flex justify-content-between flex-wrap">
                <div>
                  <p className="font-light text-small mb-0">Investment Name</p>
                  <h5 className="font-normal">{investment ? investment.title : ''}</h5>
                </div>
                <div className="right-side-text">
                  <p className="font-light text-small mb-0">Target Amount</p>
                  <h5 className="font-normal">&#x20A6;{investment ? formatCurrency(investment.targetAmount) : 0}</h5>
                </div>
              </div>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="font-light text-small mb-0">Target Date</p>
                  <h5 className="font-normal">{investment && investment.endDate ? moment(investment.endDate).format('MMM D, YYYY') : 'No end date'}</h5>
                </div>
                <div className="right-side-text">
                  <p className="font-light text-small mb-0">Start Date</p>
                  <h5 className="font-normal">{investment && investment.startDate ? moment(investment.startDate).format('MMM D, YYYY') : 'N/A'}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 card p-3">
          <p className="border-bottom text-deep-blue text-small">Transactions</p>
          {investment && investment.transactions?.length > 0 ?
            investment.transactions?.map(transaction => (
              <Transaction
                transaction={transaction}
                key={transaction.reference}
                handleSelect={this.handleTransactionSelect}
              />
            ))
          :
          <div className="text-center mt-4">
            <img src={require('#/assets/icons/receipt.svg')} alt="plus" className="img-fluid" />
            <p className="font-light text-grey"> No Transactions</p>
          </div>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { app: {
    portfolio: { investment, error },
    wallet: { cards, walletDetails },
    security: { error: confirmPinError }, 
  } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.FETCH_SINGLE_INVESTMENT_REQUEST),
    payLoading: getActionLoadingState(state, actionTypes.TOP_UP_INVESTMENT_REQUEST),
    pinLoading: getActionLoadingState(state, securityActionTypes.CONFIRM_PIN_REQUEST),
    investment,
    walletDetails,
    confirmPinError,
    cards,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSingleInvestment: (id) => dispatch(fetchSingleInvestment(id)),
    getCards: () => dispatch(getCards()),
    topUpInvestment: (payload, id) => dispatch(topUpInvestment(payload, id)),
    disableAutocharge: (id) => dispatch(disableAutocharge(id)),
    confirmPin: (payload) => dispatch(confirmPin(payload)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleInvestment));