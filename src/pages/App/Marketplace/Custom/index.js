import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from 'moment';
import Back from '#/components/Back';
import Card from '#/components/Card';
import SelectBox from '#/components/SelectBox';
import Modal from '#/components/Modal';
import PinInput from '#/components/PinInput';
import Textbox from '#/components/Textbox';
import PaymentMethod from '#/components/PaymentMethod';
import DebitCard from '#/components/DebitCard';
import DateBox from '#/components/DateBox';
import { getActionLoadingState } from "#/store/selectors";
import { getCards } from '#/store/wallet/actions'
import { bookNewInvestment, bookInvestmentWithPay, calculateInvestment } from '#/store/investment/actions'
import investmentActionTypes from '#/store/investment/actionTypes';
import { confirmPin } from '#/store/security/actions'
import securityActionTypes from '#/store/security/actionTypes';
import {
  investmentFrequency,
  validateFields,
  serializeErrors,
  fundingSource,
  formatCurrency,
  convertDate,
  verifyFrequencyPeriod,
  formatCurrencyToString,
  formatStringToCurrency
} from '#/utils'
import './style.scss';

class Custom extends React.Component {

  state = {
    type: '',
    title: '',
    target: '',
    targetDate: '',
    frequency: '',
    startDate: '',
    confirmationModal: false,
    showTransactionModal: false,
    setupSuccessModal: false,
    addMoneyModal: false,
    fundingSourceModal: false,
    allCardsModal: false,
    enterAmountModal: false,
    showAutomateModal: false,
    amount: '',
    pin: {},
    pinError: null,
    selectedMethod: '',
    errors: null,
    selectedMethodError: null,
    entryError: null,
    selectedCard: null,
    installment: '',
    expectedTotalReturns: '',
    withpay: false,
    addEndDate: false,
    frequencyAmount: '',
  }

  componentDidMount() {
    const { location: { state } } = this.props.history
    if (!state?.investment) {
      this.props.history.push('/app/marketplace/termed-investments')
    }
    this.props.getCards();
  }

  handleChange = (event) => {
    const { name } = event.target
    let value
    if (event.target.type === "radio" && event.target.value === "true") {
      value = true;
    }
    else if (event.target.type === "radio" && event.target.value === "false") {
      value = false;
    }
    else {
      value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    }
    if (name === 'target' || name === 'amount' || name === 'frequencyAmount') {
      this.setState({ errors: null });
      return this.setState({ [name]: formatCurrencyToString(value) }, () => {
        if (isNaN(this.state[name])) {
          return this.setState({ errors: { [name]: 'enter a valid number' } })
        }
      });
    }
    this.setState({ [name]: value });
  }

  handleChangeDate = (item, date) => {
    this.setState({ [item]: date });
  }

  handlePin = (pin) => {
    this.setState({ pin })
  }

  handleSelectMethod = (event) => {
    this.setState({ selectedMethod: event.target.id });
  }

  //handles displaying the confirmation modal for the investment
  handleComfirmation = (e) => {
    e.preventDefault();
    this.setState({ errors: null, entryError: null });

    if(!this.props.isApproved) {
      return this.setState({ entryError: 'Your account is awaiting approval' })
    }
    if(!this.props.isBvnActive){
      return this.setState({ entryError: 'Access denied. Please complete your BVN profile' })
    }
    
    const data = this.state;
    const required = this.state.addEndDate
      ? ['title', 'target', 'targetDate', 'frequency', 'startDate']
      : ['title', 'target', 'frequency', 'startDate', 'frequencyAmount'];
    const errors = validateFields(data, required)

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }
    const info = {
      startDate: moment(this.state.startDate).format('YYYY-MM-DD'),
      endDate: moment(this.state.targetDate).format('YYYY-MM-DD'),
      frequency: this.state.frequency,
      targetAmount: formatCurrencyToString(this.state.target),
    }
    const entryError = verifyFrequencyPeriod(info)
    if (entryError) {
      return this.setState({ entryError });
    }
    this.state.addEndDate ? this.props.calculateInvestment(info)
      .then(data => {
        this.setState({ installment: data.installment, expectedTotalReturns: data.expectedTotalReturns }, () => {
          this.toggleConfirmationModal()
        })
      })
      : this.toggleConfirmationModal()
  }

  //move to enterering transaction pin
  handleEnterPin = () => {
    this.toggleConfirmationModal();
    this.toggleTransactionPinModal();
  }

  //submit transaction pin for verification
  handleTransactionVerification = (e) => {
    e.preventDefault()
    const { pin } = this.state
    const { confirmPin } = this.props
    this.setState({ pinError: null })

    const initialPin = [pin.value1, pin.value2, pin.value3, pin.value4].join('');
    if (initialPin.length < 4) {
      return this.setState({ pinError: 'field is required' })
    }
    confirmPin({ pin: initialPin })
      .then(data => {
        this.toggleTransactionPinModal();
        this.toggleAddMoneyModal()
      })
  }

  //submit booking details without payment
  handleBookWithoutPay = (e) => {
    e.preventDefault();

    const { bookNewInvestment } = this.props;
    const { location: { state } } = this.props.history
    const { title, target, startDate, targetDate, frequency, frequencyAmount } = this.state
    const payload = this.state.addEndDate ?
      { title, targetAmount: formatCurrencyToString(target), currency: 'NGN', startDate: moment(startDate).format('YYYY-MM-DD'), endDate: moment(targetDate).format('YYYY-MM-DD'), frequency }
      : { title, targetAmount: formatCurrencyToString(target), currency: 'NGN', startDate: moment(startDate).format('YYYY-MM-DD'), amount: formatCurrencyToString(frequencyAmount), frequency }
    const data = { type: 'custom', payload, id: state?.investment.id }

    bookNewInvestment(data)
      .then(data => {
        this.toggleAddMoneyModal();
        this.toggleSetupSuccessModal();
      });
  }

  //handle proceed from the success modal
  handleSuccess = () => {
    this.toggleSetupSuccessModal();
    this.props.history.push('/app/marketplace/termed-investments')
  }

  //displays the modal to enter the amount you might want to invest
  handleEnterAmount = () => {
    this.toggleAddMoneyModal();
    this.toggleAmountModal();
  }

  //displays the modal to select a funding course
  handlePickFundingSource = () => {
    this.toggleAmountModal();
    this.toggleFundingModal();
  }

  // handles for when a funcding source is selected
  handleSelectedFundingSource = () => {
    const { selectedMethod } = this.state

    const required = ['selectedMethod'];
    const errors = validateFields({ selectedMethod }, required)
    if (Object.keys(errors).length > 0) {
      return this.setState({ selectedMethodError: 'please select a method' });
    }
    if (selectedMethod === 'wallet') {
      this.setState({ type: 'wallet' });
      this.toggleFundingModal();
      return this.toggleAutomateModal();
    }
    this.toggleFundingModal();
    return this.toggleAllCardsModal()
  }


  handleSelectCard = (card) => {
    this.setState({ selectedCard: card, type: 'card' },
      () => {
        this.toggleAllCardsModal();
        return this.toggleAutomateModal();
      })
  }

  handleAutomateStep = () => {
    this.setState({ type: 'card' },
      () => {
        this.toggleAllCardsModal();
        return this.toggleAutomateModal();
      })
  }

  //submit booking details without payment
  handleBookWithPay = (autoCharge) => {
    const { selectedCard } = this.state;
    const { bookInvestmentWithPay } = this.props;
    const { location: { state } } = this.props.history
    const { title, target, startDate, targetDate, frequency, type, frequencyAmount, amount } = this.state;
    const payment = { method: type, type: 'debit', reoccurring: selectedCard ? true : false, cardId: selectedCard && selectedCard.id }
    const payload = this.state.addEndDate ?
      {
        title, targetAmount: formatCurrencyToString(target), currency: 'NGN', startDate: moment(startDate).format('YYYY-MM-DD'), endDate: moment(targetDate).format('YYYY-MM-DD'), frequency, payment,
        initialAmount: formatCurrencyToString(amount), autoCharge
      }
      : {
        title, targetAmount: formatCurrencyToString(target), currency: 'NGN', startDate: moment(startDate).format('YYYY-MM-DD'), frequency, payment,
        amount: formatCurrencyToString(frequencyAmount), initialAmount: formatCurrencyToString(amount), autoCharge
      }
    const data = { type: 'custom', payload, id: state?.investment.id }

    bookInvestmentWithPay(data)
      .then(data => {
        this.setState({ withpay: true });
        type === 'wallet' && this.closeAutomateSuccess();
        type === 'card' && selectedCard && this.closeAutomateSuccess();
      });
  }

  closeAutomateSuccess = () => {
    this.toggleAutomateModal();
    this.toggleSetupSuccessModal();
  }

  toggleConfirmationModal = () => {
    this.setState({ confirmationModal: !this.state.confirmationModal })
  }

  toggleAddMoneyModal = () => {
    this.setState({ addMoneyModal: !this.state.addMoneyModal })
  }

  toggleFundingModal = () => {
    this.setState({ fundingSourceModal: !this.state.fundingSourceModal })
  }

  toggleAmountModal = () => {
    this.setState({ enterAmountModal: !this.state.enterAmountModal })
  }

  toggleAllCardsModal = () => {
    this.setState({ allCardsModal: !this.state.allCardsModal })
  }

  toggleTransactionPinModal = () => {
    this.setState({ showTransactionModal: !this.state.showTransactionModal })
  }

  toggleSetupSuccessModal = () => {
    this.setState({ setupSuccessModal: !this.state.setupSuccessModal })
  }

  toggleAutomateModal = () => {
    this.setState(prevState => ({ showAutomateModal: !prevState.showAutomateModal }));
  }

  render() {
    const {
      title, target, targetDate,
      startDate, confirmationModal, showTransactionModal,
      pinError, errors, addMoneyModal,
      fundingSourceModal, selectedMethod, selectedMethodError,
      allCardsModal, setupSuccessModal, enterAmountModal,
      frequency, entryError, amount, showAutomateModal,
      installment, withpay, expectedTotalReturns, addEndDate, frequencyAmount,
    } = this.state;

    const { error, cards, pinLoading, confirmPinError, newError, loading, payLoading, walletDetails, calcLoading } = this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="predefined-page">
        {confirmationModal &&
          <Modal>
            <div className="text-left">
              <h3 className="text-deep-blue">Confirm Investment Setup</h3>
              {addEndDate && <p>To achieve your target of <b>N{formatCurrency(target)}</b> by <b>{convertDate(targetDate)}</b>, you have to save
            <b> N{formatCurrency(installment)} {frequency}</b>.
              Adding interests, your target amount will be approximately
              <b> N{formatCurrency(expectedTotalReturns)}.</b>
              </p>}
              {!addEndDate && <p>To achieve your target of <b>N{formatCurrency(target)}</b>, you have decided to save <b>N{formatCurrency(frequencyAmount)} {frequency}</b>.</p>}
              <div className="d-flex justify-content-end align-items-center">
                <p className="text-deep-blue mr-3 mb-0 cursor-pointer" onClick={this.toggleConfirmationModal}>Review Plan</p>
                <button className="btn btn-sm btn-primary" onClick={this.handleEnterPin}>
                  Set up
              </button>
              </div>
            </div>
          </Modal>
        }
        {showTransactionModal &&
          <Modal onClose={this.toggleModal}>
            <div className="text-center">
              <h3>Enter Transaction PIN</h3>
              <div className="w-100 ml-auto mr-auto mt-3">
                <PinInput onChange={this.handlePin} error={pinError} />
              </div>
              <button className="btn btn-sm btn-primary btn-block mt-5" onClick={this.handleTransactionVerification} disabled={pinLoading}>
                Confirm Investment Setup
                {pinLoading &&
                  <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                }
              </button>
              {pinError && <p className="text-error mt-2">{pinError}</p>}
              {confirmPinError && <p className="text-error mt-2">{confirmPinError}</p>}
            </div>
          </Modal>
        }
        {setupSuccessModal &&
          <Modal>
            <div className="text-center">
              <img src={require('#/assets/icons/complete-success.svg')} alt="setup" />
              <h3>Investment setup successful!</h3>
              <p className="text-black mb-0">Your Custom investment plan has been setup {!withpay && <span><span className="text-blue font-weight-bold">pay</span> so</span>} you can start enjoying returns on your principal.</p>
              <button className="btn btn-sm btn-primary btn-block mt-3" onClick={this.handleSuccess}>
                Proceed
                </button>
            </div>
          </Modal>
        }
        {addMoneyModal &&
          <Modal>
            <div className="text-right pb-3">
              <img src={require('#/assets/icons/close.svg')} alt="close" onClick={this.toggleAddMoneyModal} className="cursor-pointer" />
            </div>
            <div className="text-left">
              <h3>Do you want to add money to this investment now?</h3>
              <div className="d-flex justify-content-end align-items-center">
                {loading &&
                  <div className="spinner-border spinner-border-primary text-primary spinner-border-sm mr-2"></div>
                }
                <p className="mr-3 text-deep-blue mb-0 cursor-pointer" onClick={this.handleBookWithoutPay}>No, I’ll add money later</p>
                <button className="btn btn-sm btn-primary" onClick={this.handleEnterAmount}>
                  Yes
                </button>
              </div>
              {newError && typeof newError === 'string' && <p className="text-error mt-2">{newError}</p>}
            </div>
          </Modal>
        }
        {
          enterAmountModal &&
          <Modal>
            <div>
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
            </div>
            {walletDetails &&
              <p className="text-grey text-x-small mb-0">Available balance <span className="text-deep-blue">
                &#x20A6; {walletDetails && walletDetails.wallet.NGN ? walletDetails.wallet.NGN : 0}
              </span>
              </p>
            }
            <div className="text-right mt-2">
              <button className="btn btn-sm btn-primary" onClick={this.handlePickFundingSource}>
                Proceed
              </button>
            </div>

          </Modal>
        }
        {fundingSourceModal &&
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
                {payLoading &&
                    <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                  }
                </button>
              </div>
            </div>
          </Modal>
        }
        {allCardsModal &&
          <Modal>
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
            <div className="d-flex justify-content-between align-items-center cursor-pointer" onClick={this.handleAutomateStep}>
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
              <p className="text-small text-black">Allow us to fund from your source {frequency} without asking.</p>
            </div>
            <div className="d-flex justify-content-end align-items-center">
              {payLoading &&
                <div className="spinner-border spinner-border-primary text-primary spinner-border-sm mr-2"></div>
              }
              <p className="mr-3 text-deep-blue mb-0 cursor-pointer" onClick={() => this.handleBookWithPay(false)}>No, I’ll add money myself</p>
              <button className="btn btn-sm btn-primary" onClick={() => this.handleBookWithPay(true)} disabled={payLoading}>
                Yes
              </button>
            </div>
            {newError && typeof newError === 'string' && <p className="text-error mt-2">{newError}</p>}
          </Modal>
        }

        <div className="row">
          <div className="col-md-2">
            <Back />
          </div>
          <div className="col-md-5 text-center">
            <h3 className="text-medium text-deep-blue ">Create new custom investment plan</h3>
          </div>
        </div>
        <Card classes="card mt-3">
          <form>
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="text-black text-medium mt-3">Give your new investment a name. You could name it after your goal. E.g. Freedom goal</p>
              </div>
              <div className="col-md-6">
                <Textbox
                  onChange={this.handleChange}
                  type="text"
                  label="Plan title"
                  placeholder="Plan title"
                  name="title"
                  value={title}
                  error={errors ? errors.title : (errorObject && errorObject['title'])}
                />
              </div>
            </div>

            <div className="row mt-4 align-items-center">
              <div className="col-md-6">
                <p className="text-black text-medium mt-3">How much do you need to make this goal work?</p>
              </div>
              <div className="col-md-6">
                <Textbox
                  onChange={this.handleChange}
                  type="text"
                  label="Target amount"
                  placeholder="Set target amount"
                  name="target"
                  value={formatStringToCurrency(target)}
                  error={errors ? errors.target : (errorObject && errorObject['target'])}
                />
              </div>
            </div>

            <div className="row mt-4 align-items-center">
              <div className="col-md-6">
                <p className="text-black text-medium mt-3">When do you want to start?</p>
              </div>
              <div className="col-md-6">
                <DateBox
                  onChange={date => this.handleChangeDate('startDate', date)}
                  label="Start Date"
                  placeholder="Set start date"
                  name="startDate"
                  value={startDate}
                  error={errors ? errors.startDate : (errorObject && errorObject['startDate'])}
                  min={new Date()}
                />
                <div className="mt-2">
                  <input
                    id="addEndDate"
                    className="mr-2"
                    type="checkbox"
                    name="addEndDate"
                    value={addEndDate}
                    onChange={this.handleChange}
                    checked={addEndDate}
                  />
                  <label htmlFor="addEndDate">Do you want to add a target date to this investment?</label>
                </div>
              </div>
            </div>

            {addEndDate && <div className="row mt-4 align-items-center">
              <div className="col-md-6">
                <p className="text-black text-medium mt-3">By what date do you want to have your invested target amount?</p>
              </div>
              <div className="col-md-6">
                <DateBox
                  onChange={date => this.handleChangeDate('targetDate', date)}
                  label="Target date"
                  placeholder="Set target date"
                  name="targetDate"
                  value={targetDate}
                  error={errors ? errors.targetDate : (errorObject && errorObject['targetDate'])}
                  min={new Date()}
                />
              </div>
            </div>}

            <div className="row mt-4 align-items-center">
              <div className="col-md-6">
                <p className="text-black text-medium mt-3">How often do you want to set money aside for this investment?</p>
              </div>
              <div className="col-md-6">
                <SelectBox
                  onChange={this.handleChange}
                  label="Frequency"
                  placeholder="Set frequency"
                  name="frequency"
                  boxClasses="mt-3"
                  options={investmentFrequency}
                  value="value"
                  optionName="name"
                  error={errors ? errors.frequency : (errorObject && errorObject['frequency'])}
                />
              </div>
            </div>

            {!addEndDate && <div className="row mt-4 align-items-center">
              <div className="col-md-6">
                <p className="text-black text-medium mt-3">How much do you want to pay on every frequency?</p>
              </div>
              <div className="col-md-6">
                <Textbox
                  onChange={this.handleChange}
                  type="text"
                  label="Frequency amount"
                  placeholder="Set frequency amount"
                  name="frequencyAmount"
                  value={formatStringToCurrency(frequencyAmount)}
                  error={errors ? errors.frequencyAmount : (errorObject && errorObject['amount'])}
                />
              </div>
            </div>}

            <div className="text-right mt-3 d-flex justify-content-end">
              {entryError && <p className="text-error mt-2 mr-3">{entryError}</p>}

              <button className="btn btn-sm btn-primary btn-md-block" onClick={this.handleComfirmation}>
                Proceed
                {calcLoading &&
                  <div className="spinner-border text-white spinner-border-sm ml-2"></div>
                }
              </button>
            </div>
          </form>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    app: {
      wallet: { cards, walletDetails },
      security: { error: confirmPinError },
      investment: { newError },
      config,
      profile: { userProfile: { data } }
    }
  } = state;

  return {
    loading: getActionLoadingState(state, investmentActionTypes.BOOK_NEW_INVESTMENT_REQUEST),
    payLoading: getActionLoadingState(state, investmentActionTypes.BOOK_INVESTMENT_WITH_PAY_REQUEST),
    pinLoading: getActionLoadingState(state, securityActionTypes.CONFIRM_PIN_REQUEST),
    calcLoading: getActionLoadingState(state, investmentActionTypes.CALCULATE_INVESTMENT_REQUEST),
    cards,
    confirmPinError,
    newError,
    walletDetails,
    interestRate: config?.data?.investmentConfig,
    isBvnActive: data && data.bvn ? true : false,
    isApproved: data && data.isApproved === 1 ? true : false,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCards: () => dispatch(getCards()),
    bookNewInvestment: (data) => dispatch(bookNewInvestment(data)),
    bookInvestmentWithPay: (data) => dispatch(bookInvestmentWithPay(data)),
    confirmPin: (payload) => dispatch(confirmPin(payload)),
    calculateInvestment: (payload) => dispatch(calculateInvestment(payload)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Custom));
