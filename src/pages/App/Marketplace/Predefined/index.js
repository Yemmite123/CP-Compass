import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import Back from "#/components/Back";
import Card from "#/components/Card";
import SelectBox from "#/components/SelectBox";
import Modal from "#/components/Modal";
import PinInput from "#/components/PinInput";
import Textbox from "#/components/Textbox";
import PaymentMethod from "#/components/PaymentMethod";
import DebitCard from "#/components/DebitCard";
import OffCanvas from "#/components/OffCanvas";
import DateBox from "#/components/DateBox";
import { openOffCanvas, closeOffCanvas } from "#/utils";
import { getActionLoadingState } from "#/store/selectors";
import { getCards } from "#/store/wallet/actions";
import {
  bookNewInvestment,
  bookInvestmentWithPay,
  calculateInvestment,
} from "#/store/investment/actions";
import investmentActionTypes from "#/store/investment/actionTypes";
import { confirmPin } from "#/store/security/actions";
import securityActionTypes from "#/store/security/actionTypes";
import {
  investmentFrequency,
  validateFields,
  serializeErrors,
  fundingSource,
  formatCurrency,
  convertDate,
  verifyFrequencyPeriod,
  formatCurrencyToString,
  formatStringToCurrency,
} from "#/utils";
import "./style.scss";

class Predefined extends React.Component {
  state = {
    type: "",
    inputTitle: "",
    inputTarget: "",
    inputAmount: "",
    inputAddEndDate: false,
    inputStartDate: new Date(),
    inputTargetDate: new Date(),
    inputFrequencyAmount: "",
    title: "",
    target: "",
    targetDate: new Date(),
    frequency: "",
    inputFrequency: "",
    startDate: new Date(),
    confirmationModal: false,
    showTransactionModal: false,
    setupSuccessModal: false,
    addMoneyModal: false,
    fundingSourceModal: false,
    allCardsModal: false,
    enterAmountModal: false,
    showAutomateModal: false,
    amount: "",
    pin: {},
    pinError: null,
    selectedMethod: "",
    errors: null,
    selectedMethodError: null,
    entryError: null,
    selectedCard: null,
    installment: "",
    expectedTotalReturns: "",
    withpay: false,
  };

  componentDidMount() {
    const {
      location: { state },
    } = this.props.history;
    if (!state?.investment) {
      this.props.history.push("/app/marketplace/termed-investments");
    }
    this.props.getCards();
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "target" || name === "amount") {

      if (isNaN(formatCurrencyToString(value)))
        return;

      this.setState({ errors: null });
      return this.setState({ [name]: formatCurrencyToString(value) }, () => {
        if (name === "target")
          this.setState({ inputTarget: formatCurrencyToString(value) });

        if (isNaN(this.state[name])) {
          return this.setState({ errors: { [name]: "enter a valid number" } });
        }
      });
    }

    if (name === "title") this.setState({ inputTitle: value });
    if (name === "frequency") this.setState({ inputFrequency: value });

    this.setState({ [name]: value });
  };

  resetFields = () => {
    this.setState({ inputTitle: "" });
    this.setState({ inputTarget: "" });
    this.setState({ inputTargetDate: new Date() });
    this.setState({ inputFrequency: "" });
    this.setState({ inputStartDate: new Date() });
    this.setState({ inputFrequencyAmount: "" });
  };

  handleChangeDate = (item, date) => {
    if (item === "startDate") this.setState({ inputStartDate: date });
    if (item === "targetDate") this.setState({ inputTargetDate: date });
    this.setState({ [item]: date });
  };

  handlePin = (pin) => {
    this.setState({ pin });
  };

  handleSelectMethod = (event) => {
    this.setState({ selectedMethod: event.target.id });
  };

  //handles displaying the confirmation modal for the investment
  handleComfirmation = (e) => {
    e.preventDefault();
    this.setState({ errors: null, entryError: null });

    if (this.state.target)
      if (!Math.floor(Number(this.state.target)) || Number(this.state.target) < 0) {
        return this.setState({ errors: { target: 'enter a valid amount' } })
      }

    if (this.state.amount)
      if (!Math.floor(Number(this.state.amount)) || Number(this.state.amount) < 0) {
        return this.setState({ errors: { amout: 'enter a valid amount' } })
      }

    if (!this.props.isApproved) {
      return this.setState({ entryError: "Your account is awaiting approval" });
    }
    if (!this.props.isBvnActive) {
      return this.setState({
        entryError: "Access denied. Please complete your BVN profile",
      });
    }

    const data = {
      ...this.state,
      frequency: this.state.frequency.toLowerCase(),
    };
    const required = [
      "title",
      "target",
      "targetDate",
      "frequency",
      "startDate",
    ];
    const errors = validateFields(data, required);

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }
    const info = {
      startDate: moment(this.state.startDate).format("YYYY-MM-DD"),
      endDate: moment(this.state.targetDate).format("YYYY-MM-DD"),
      frequency: this.state.frequency.toLowerCase(),
      targetAmount: formatCurrencyToString(this.state.target),
    };
    const entryError = verifyFrequencyPeriod(info);
    if (entryError) {
      return this.setState({ entryError });
    }

    const {
      location: { state },
    } = this.props.history;

    this.props.calculateInvestment(info).then((data) => {
      this.setState(
        {
          installment: data.installment,
          expectedTotalReturns: data.expectedTotalReturns,
        },
        () => {
          closeOffCanvas(`offcanvas-${state?.investment.id}`);
          this.toggleConfirmationModal();
        }
      );
    });
  };

  //move to enterering transaction pin
  handleEnterPin = () => {
    this.resetFields();
    this.toggleConfirmationModal();
    this.toggleTransactionPinModal();
  };

  //submit transaction pin for verification
  handleTransactionVerification = (e) => {
    e.preventDefault();
    const { pin } = this.state;
    const { confirmPin } = this.props;
    this.setState({ pinError: null });

    const initialPin = [pin.value1, pin.value2, pin.value3, pin.value4].join(
      ""
    );
    if (initialPin.length < 4) {
      return this.setState({ pinError: "field is required" });
    }
    confirmPin({ pin: initialPin }).then((data) => {
      this.toggleTransactionPinModal();
      this.toggleAddMoneyModal();
    });
  };

  handleReviewPlan = () => {
    const { location: { state } } = this.props.history;
    openOffCanvas(`offcanvas-${state?.investment.id}`);
    this.toggleConfirmationModal()
  }

  //submit booking details without payment
  handleBookWithoutPay = (e) => {
    e.preventDefault();

    const { bookNewInvestment } = this.props;
    const {
      location: { state },
    } = this.props.history;
    const { title, target, startDate, targetDate, frequency } = this.state;
    const payload = {
      title,
      targetAmount: formatCurrencyToString(target),
      currency: "NGN",
      startDate: moment(startDate).format("YYYY-MM-DD"),
      endDate: moment(targetDate).format("YYYY-MM-DD"),
      frequency,
    };
    const data = { type: "predefined", payload, id: state?.investment.id };

    bookNewInvestment(data).then((data) => {
      this.toggleAddMoneyModal();
      this.toggleSetupSuccessModal();
    });
  };

  //handle proceed from the success modal
  handleSuccess = () => {
    this.toggleSetupSuccessModal();
    this.props.history.push("/app/marketplace/termed-investments");
  };

  //displays the modal to enter the amount you might want to invest
  handleEnterAmount = () => {
    this.toggleAddMoneyModal();
    this.toggleAmountModal();
  };

  //displays the modal to select a funding course
  handlePickFundingSource = () => {
    this.toggleAmountModal();
    this.toggleFundingModal();
  };

  // handles for when a funcding source is selected
  handleSelectedFundingSource = () => {
    const { selectedMethod } = this.state;

    const required = ["selectedMethod"];
    const errors = validateFields({ selectedMethod }, required);
    if (Object.keys(errors).length > 0) {
      return this.setState({ selectedMethodError: "please select a method" });
    }
    if (selectedMethod === "wallet") {
      this.setState({ type: "wallet" });
      this.toggleFundingModal();
      return this.toggleAutomateModal();
    }
    this.toggleFundingModal();
    return this.toggleAllCardsModal();
  };

  handleSelectCard = (card) => {
    this.setState({ selectedCard: card, type: "card" }, () => {
      this.toggleAllCardsModal();
      return this.toggleAutomateModal();
    });
  };

  handleAutomateStep = () => {
    this.setState({ type: "card" }, () => {
      this.toggleAllCardsModal();
      return this.toggleAutomateModal();
    });
  };

  //submit booking details without payment
  handleBookWithPay = (autoCharge) => {
    const { selectedCard } = this.state;
    const { bookInvestmentWithPay } = this.props;
    const {
      location: { state },
    } = this.props.history;
    const { title, target, startDate, targetDate, frequency, type, amount } =
      this.state;
    const payment = {
      method: type,
      type: "debit",
      reoccurring: selectedCard ? true : false,
      cardId: selectedCard && selectedCard.id,
    };
    const payload = {
      title,
      targetAmount: formatCurrencyToString(target),
      currency: "NGN",
      startDate: moment(startDate).format("YYYY-MM-DD"),
      endDate: moment(targetDate).format("YYYY-MM-DD"),
      frequency,
      payment,
      initialAmount: formatCurrencyToString(amount),
      autoCharge,
    };
    const data = { type: "predefined", payload, id: state?.investment.id };

    bookInvestmentWithPay(data).then((data) => {
      this.setState({ withpay: true });
      type === "wallet" && this.closeAutomateSuccess();
      type === "card" && selectedCard && this.closeAutomateSuccess();
    });
  };

  closeAutomateSuccess = () => {
    this.toggleAutomateModal();
    this.toggleSetupSuccessModal();
  };

  toggleConfirmationModal = () => {
    this.setState({ confirmationModal: !this.state.confirmationModal });
  };

  toggleAddMoneyModal = () => {
    this.setState({ addMoneyModal: !this.state.addMoneyModal });
  };

  toggleFundingModal = () => {
    this.setState({ fundingSourceModal: !this.state.fundingSourceModal });
  };

  toggleAmountModal = () => {
    this.setState({ enterAmountModal: !this.state.enterAmountModal });
  };

  toggleAllCardsModal = () => {
    this.setState({ allCardsModal: !this.state.allCardsModal });
  };

  toggleTransactionPinModal = () => {
    this.setState({ showTransactionModal: !this.state.showTransactionModal });
  };

  toggleSetupSuccessModal = () => {
    this.setState({ setupSuccessModal: !this.state.setupSuccessModal });
  };

  toggleAutomateModal = () => {
    this.setState((prevState) => ({
      showAutomateModal: !prevState.showAutomateModal,
    }));
  };

  render() {
    const {
      title,
      target,
      targetDate,
      inputTitle,
      inputTarget,
      inputStartDate,
      inputTargetDate,
      inputFrequency,
      startDate,
      confirmationModal,
      showTransactionModal,
      pinError,
      errors,
      addMoneyModal,
      fundingSourceModal,
      selectedMethod,
      selectedMethodError,
      allCardsModal,
      setupSuccessModal,
      enterAmountModal,
      frequency,
      entryError,
      amount,
      showAutomateModal,
      installment,
      withpay,
      expectedTotalReturns,
    } = this.state;

    const {
      error,
      cards,
      pinLoading,
      confirmPinError,
      newError,
      loading,
      payLoading,
      walletDetails,
      calcLoading,
      investError,
    } = this.props;
    const {
      location: { state },
    } = this.props.history;
    const errorObject = investError
      ? serializeErrors(investError)
      : serializeErrors(error);

    return (
      <div className="predefined-page">
        {confirmationModal && (
          <Modal onClose={this.toggleConfirmationModal}>
            <div className="text-right pb-3">
              <img
                src={require("#/assets/icons/close.svg")}
                alt="close"
                onClick={this.toggleConfirmationModal}
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
                <h5 className="text-blue font-bolder">
                  Confirm Investment Setup
                </h5>
                <p>
                  To achieve your target of <b>N{formatCurrency(target)}</b> by{" "}
                  <b>{convertDate(targetDate)}</b>, you have to save
                  <b>
                    {" "}
                    N{formatCurrency(installment)} {frequency}
                  </b>
                  . Adding interests, your target amount will be approximately
                  <b> N{formatCurrency(expectedTotalReturns)}.</b>
                </p>
              </div>
              <div className="d-flex flex-column align-items-center">
                <button
                  className="btn py-3 btn-primary w-100"
                  onClick={this.handleEnterPin}
                >
                  Setup Plan
                </button>
                <p
                  className="text-blue mt-3 mb-0 cursor-pointer"
                  onClick={this.handleReviewPlan}
                >
                  Review Plan
                </p>
              </div>
              {error && typeof error === "string" && (
                <p className="text-error text-center">{error}</p>
              )}
            </div>
          </Modal>
        )}
        {showTransactionModal && (
          <Modal onClose={this.toggleTransactionPinModal}>
            <div className="text-right pb-3">
              <img
                src={require("#/assets/icons/close.svg")}
                alt="close"
                onClick={this.toggleTransactionPinModal}
              />
            </div>
            <div className="px-5">
              <div className="d-flex justify-content-center">
                <img
                  src={require("#/assets/icons/transaction.svg")}
                  alt="bank"
                  className="pb-3"
                />
              </div>
              <div className="text-center">
                <div className="mb-3">
                  <h5 className="text-blue font-bolder">
                    Enter Transaction PIN
                  </h5>
                </div>
                <div className="w-100 ml-auto mr-auto">
                  <PinInput onChange={this.handlePin} error={pinError} />
                </div>
                <div className="px-3 mt-4">
                  <button
                    className="btn py-3 btn-primary btn-block mt-3"
                    onClick={this.handleTransactionVerification}
                    disabled={pinLoading}
                  >
                    Confirm Setup
                    {pinLoading && (
                      <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                    )}
                  </button>
                  <p
                    className="text-blue mt-3"
                    style={{ cursor: "pointer" }}
                    onClick={this.toggleTransactionPinModal}
                  >
                    Cancel Setup
                  </p>

                  {pinError && <p className="text-error mt-2">{pinError}</p>}
                  {confirmPinError && (
                    <p className="text-error mt-2">{confirmPinError}</p>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}
        {setupSuccessModal && (
          <Modal onClose={this.handleSuccess}>
            <div className="text-right pb-3">
              <img
                src={require("#/assets/icons/close.svg")}
                alt="close"
                onClick={this.toggleSetupSuccessModal}
              />
            </div>
            <div className="px-5">
              <div className="d-flex justify-content-center">
                <img
                  src={require("#/assets/icons/investment-cup.svg")}
                  alt="bank"
                  className="pb-3"
                />
              </div>
              <div className="text-center">
                <div className="mb-3">
                  <h5 className="text-blue font-bolder">
                    Investment setup successful!
                  </h5>
                </div>
                <div className="px-3 mt-4">
                  <p className="text-black mb-0">
                    Your {state?.investment.name} plan has been setup{" "}
                    {!withpay && (
                      <span>
                        <span className="text-blue font-weight-bold">pay</span>{" "}
                        so
                      </span>
                    )}{" "}
                    you can start enjoying returns on your principal.
                  </p>
                  <button
                    className="btn btn-sm btn-primary btn-block mt-3"
                    onClick={this.handleSuccess}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
        {addMoneyModal && (
          <Modal>
            <div className="text-right pb-3">
              <img
                src={require("#/assets/icons/close.svg")}
                alt="close"
                onClick={this.toggleAddMoneyModal}
                className="cursor-pointer"
              />
            </div>
            <div className="px-5">
              <div className="d-flex justify-content-center">
                <img
                  src={require("#/assets/icons/bank-transfer.svg")}
                  alt="bank"
                  className="pb-3"
                />
              </div>
              <div className="text-center">
                <div className="mb-3">
                  <h5 className="text-blue font-bolder">
                    Add money to investment
                  </h5>
                  <p>
                    You can add money to your new investment right now or you
                    can do that later.{" "}
                  </p>
                </div>
                <div className="px-3 mt-4">
                  {loading && (
                    <div className="spinner-border spinner-border-primary text-primary spinner-border-sm mr-2"></div>
                  )}
                  <button
                    className="btn btn-primary btn-block py-3 mt-3"
                    onClick={this.handleEnterAmount}
                  >
                    Yes, I'll add money
                  </button>
                  <p
                    className="mt-3 text-blue mb-2 cursor-pointer"
                    onClick={this.handleBookWithoutPay}
                  >
                    No, I’ll add money later
                  </p>
                  {newError && typeof newError === "string" && (
                    <p className="text-error mt-2">{newError}</p>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}
        {enterAmountModal && (
          <Modal>
            <div className="text-right pb-3">
              <img
                src={require("#/assets/icons/close.svg")}
                alt="close"
                onClick={this.toggleAddMoneyModal}
                className="cursor-pointer"
              />
            </div>
            <div className="px-2">
              <div className="d-flex justify-content-center">
                <img
                  src={require("#/assets/icons/naira-sign.svg")}
                  alt="bank"
                  className="pb-3"
                />
              </div>
              <div className="text-center">
                <div className="mb-3">
                  <h5 className="text-blue font-bolder">
                    How much do you want to add?
                  </h5>
                </div>
                <div className="px-1 mt-4">
                  <Textbox
                    onChange={this.handleChange}
                    type="text"
                    label="Amount"
                    placeholder="Amount"
                    name="amount"
                    value={formatStringToCurrency(amount)}
                    error={
                      errors
                        ? errors.amount
                        : errorObject && errorObject["amount"]
                    }
                  />
                </div>
                <div className="mt-4">
                  {walletDetails && (
                    <p className="text-grey mb-1">
                      Available balance{" "}
                      <span className="text-blue">
                        &#x20A6;{" "}
                        {walletDetails && walletDetails.wallet.NGN
                          ? walletDetails.wallet.NGN
                          : 0}
                      </span>
                    </p>
                  )}
                  <div className="mt-2">
                    <button
                      button
                      className="btn btn-primary btn-block py-3 mt-3"
                      onClick={this.handlePickFundingSource}
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
        {fundingSourceModal && (
          <Modal>
            <div className="text-right pb-3">
              <img
                src={require("#/assets/icons/close.svg")}
                alt="close"
                onClick={this.toggleAddMoneyModal}
                className="cursor-pointer"
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
                <div className="mb-3">
                  <h5 className="text-blue font-bolder">
                    Choose a funding source
                  </h5>
                  <p>
                    You can add money to your new investment right now or you
                    can do that later.{" "}
                  </p>
                </div>
                <div className="mt-4">
                  {fundingSource.map((method) => (
                    <div
                      id={method.value}
                      className={`d-flex p-3 mb-2 ${selectedMethod === method.value ? "selected" : ""
                        } payment-method`}
                      onClick={this.handleSelectMethod}
                    >
                      <div className="d-flex mr-3">
                        <img
                          src={require(`#/assets/icons/${method.imgUrl}.svg`)}
                          alt="icon"
                        />
                      </div>
                      <div>
                        <h6 className="text-left mb-0 font-bolder">
                          {method.label}
                        </h6>
                        {method.value === "card" ? (
                          cards &&
                          cards.cards.length > 0 && (
                            <p className="text-grey mb-0">
                              {cards.cards[0].brand} ending in{" "}
                              <span className="text-blue">
                                {" "}
                                **** {cards.cards[0].last4}
                              </span>
                            </p>
                          )
                        ) : (
                          <p className="text-grey mb-0">
                            Available balance{" "}
                            <span className="text-blue">
                              {" "}
                              &#x20A6;{" "}
                              {walletDetails && walletDetails.wallet.NGN
                                ? walletDetails.wallet.NGN
                                : 0}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  {selectedMethodError && (
                    <p className="text-error mt-2">{selectedMethodError}</p>
                  )}
                  <button
                    className="btn btn-primary btn-block py-3 mt-3"
                    onClick={this.handleSelectedFundingSource}
                    disabled={payLoading}
                  >
                    Proceed
                    {payLoading && (
                      <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
        {allCardsModal && (
          <Modal>
            <div className="text-right pb-3">
              <img
                src={require("#/assets/icons/close.svg")}
                alt="close"
                onClick={this.toggleAllCardsModal}
                className="cursor-pointer"
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
                <div className="mb-3">
                  <h5 className="text-blue font-bolder">Choose a bank card</h5>
                  <p>
                    You are about to add money to your customized investment
                  </p>
                </div>
                <div className="mt-4">
                  {cards &&
                    cards.cards.length > 0 &&
                    cards.cards.map((card) => (
                      <DebitCard
                        card={card}
                        selected={this.state.selectedCard === card}
                        handleSelect={this.handleSelectCard}
                        key={card.id}
                      />
                    ))}

                  <div
                    className={`position-relative d-flex p-3 mb-2 cursor-pointer debit-card`}
                    onClick={this.handleAutomateStep}
                  >
                    {(this.state.newPayment ? true : false) && (
                      <img
                        className="position-absolute"
                        width={16}
                        src={require("#/assets/icons/success.svg")}
                        style={{ zIndex: 1, right: "0.35rem", top: "0.35rem" }}
                      />
                    )}
                    <div className="d-flex mr-3">
                      <img
                        src={require("#/assets/icons/plus-circle.svg")}
                        alt="icon"
                        width={"35px"}
                      />
                    </div>
                    <div className="d-flex flex-column justify-content-center">
                      <h5 className="text-center  mb-0">Add new card</h5>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  {selectedMethodError && (
                    <p className="text-error mt-2">{selectedMethodError}</p>
                  )}
                  <button
                    className="btn btn-primary btn-block py-3 mt-3"
                    onClick={this.handleSelectedFundingSource}
                    disabled={payLoading}
                  >
                    Proceed
                    {payLoading && (
                      <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {showAutomateModal && (
          <Modal onClose={this.toggleAutomateModal}>
            <div className="text-right pb-3">
              <img
                src={require("#/assets/icons/close.svg")}
                alt="close"
                onClick={this.toggleAutomateModal}
                className="cursor-pointer"
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
                <div className="mb-3">
                  <h5 className="text-blue font-bolder">
                    Add money to investment
                  </h5>
                  <p>
                    Allow us to fund from your source {frequency} without
                    asking.
                  </p>
                </div>
                <div className="mt-4">
                  {payLoading && (
                    <div className="spinner-border spinner-border-primary text-primary spinner-border-sm mr-2"></div>
                  )}
                  <button
                    className="btn btn-primary btn-block py-3 mt-3"
                    onClick={() => this.handleBookWithPay(true)}
                    disabled={payLoading}
                  >
                    Yes, automate funding
                  </button>
                  <p
                    className="mt-4 text-blue mb-2 cursor-pointer"
                    onClick={() => this.handleBookWithPay(false)}
                  >
                    No, I’ll add money myself
                  </p>
                  {newError && typeof newError === "string" && (
                    <p className="text-error mt-2">{newError}</p>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}
        <OffCanvas
          title=""
          position="end"
          id={`offcanvas-${state?.investment.id}`}
          onClose={this.resetFields}
        >
          <div className="px-3 h-100 d-flex flex-column flex-grow-1">
            <div className="mt-3 mb-2">
              <h4 className="font-bolder text-blue">
                Create new {state?.investment.name} plan
              </h4>
            </div>

            <div className="mt-3">
              <p>Investment Name</p>
              <Textbox
                onChange={this.handleChange}
                type="text"
                label="Plan title"
                placeholder="Plan title"
                name="title"
                value={inputTitle}
                error={
                  errors ? errors.title : errorObject && errorObject["title"]
                }
              />
            </div>
            <div className="mt-3">
              <p>How much do you need to make this goal work?</p>
              <Textbox
                onChange={this.handleChange}
                type="text"
                label="Target amount"
                placeholder="Set target amount"
                name="target"
                value={formatStringToCurrency(inputTarget)}
                error={
                  errors ? errors.target : errorObject && errorObject["target"]
                }
              />
            </div>
            <div className="mt-3">
              <p>When do you want to start?</p>
              <DateBox
                onChange={(date) => this.handleChangeDate("startDate", date)}
                label="Start Date"
                placeholder="Set start date"
                name="startDate"
                value={inputStartDate}
                error={
                  errors
                    ? errors.startDate
                    : errorObject && errorObject["startDate"]
                }
                min={new Date()}
              />
            </div>
            <div className="mt-3">
              <p>When do you want your target amount?</p>
              <DateBox
                onChange={(date) => this.handleChangeDate("targetDate", date)}
                label="Target date"
                placeholder="Set target date"
                name="targetDate"
                value={inputTargetDate}
                error={
                  errors
                    ? errors.targetDate
                    : errorObject && errorObject["targetDate"]
                }
                min={new Date()}
              />
            </div>
            <div className="mt-3">
              <p>How often do you want to set money aside?</p>
              <SelectBox
                onChange={this.handleChange}
                label="Frequency"
                placeholder="Set frequency"
                name="frequency"
                boxClasses="mt-3"
                options={investmentFrequency}
                value={inputFrequency}
                optionName="name"
                error={
                  errors
                    ? errors.frequency
                    : errorObject && errorObject["frequency"]
                }
              />
            </div>
            <div className="mt-4 pb-3">
              {entryError && (
                <p className="text-error mt-2 mr-3">{entryError}</p>
              )}
              <button
                className="w-100 py-3 btn btn-primary btn-md-block"
                onClick={this.handleComfirmation}
              >
                Save changes
                {calcLoading && (
                  <div className="spinner-border text-white spinner-border-sm ml-2"></div>
                )}
              </button>
            </div>
          </div>
        </OffCanvas>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    app: {
      wallet: { cards, walletDetails },
      security: { error: confirmPinError },
      investment: { newError, error: investError },
      config,
      profile: {
        userProfile: { data },
      },
    },
  } = state;

  return {
    loading: getActionLoadingState(
      state,
      investmentActionTypes.BOOK_NEW_INVESTMENT_REQUEST
    ),
    payLoading: getActionLoadingState(
      state,
      investmentActionTypes.BOOK_INVESTMENT_WITH_PAY_REQUEST
    ),
    pinLoading: getActionLoadingState(
      state,
      securityActionTypes.CONFIRM_PIN_REQUEST
    ),
    calcLoading: getActionLoadingState(
      state,
      investmentActionTypes.CALCULATE_INVESTMENT_REQUEST
    ),
    cards,
    confirmPinError,
    newError,
    investError,
    walletDetails,
    interestRate: config?.data?.investmentConfig,
    isBvnActive: data && data.bvn ? true : false,
    isApproved: data && data.isApproved === 1 ? true : false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCards: () => dispatch(getCards()),
    bookNewInvestment: (data) => dispatch(bookNewInvestment(data)),
    bookInvestmentWithPay: (data) => dispatch(bookInvestmentWithPay(data)),
    confirmPin: (payload) => dispatch(confirmPin(payload)),
    calculateInvestment: (payload) => dispatch(calculateInvestment(payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Predefined)
);
