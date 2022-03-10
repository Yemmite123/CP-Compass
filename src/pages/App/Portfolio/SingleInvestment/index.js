import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/portfolio/actionTypes";
import {
  fetchSingleInvestment,
  editInvestment,
  editInvestmentAmount,
  topUpInvestment,
} from "#/store/portfolio/actions";
import { disableAutocharge } from "#/store/investment/actions";
import { getCards } from "#/store/wallet/actions";
import { confirmPin } from "#/store/security/actions";
import securityActionTypes from "#/store/security/actionTypes";
import Card from "#/components/Card";
import PaymentMethod from "#/components/PaymentMethod";
import Modal from "#/components/Modal";
import DebitCard from "#/components/DebitCard";
import Textbox from "#/components/Textbox";
import Transaction from "#/components/Transaction";
import PinInput from "#/components/PinInput";
import SummaryCard from "#/components/SummaryCard";
import Back from "#/components/Back";
import WalletBG from "#/assets/images/walletBG.svg";
import InvestmentBG from "#/assets/images/InvestmentBG.svg";
import ReturnsBG from "#/assets/images/ReturnsBG.svg";
import OffCanvas from "#/components/OffCanvas";
import SelectBox from "#/components/SelectBox";
import DateBox from "#/components/DateBox";
import LiquidateInvestment from "#/pages/App/Portfolio/LiquidateInvestment";
import {
  investmentFrequency,
  formatCurrency,
  validateFields,
  fundingSource,
  serializeErrors,
  formatCurrencyToString,
  formatStringToCurrency,
  openOffCanvas,
  closeOffCanvas,
  verifyFrequencyPeriod,
} from "#/utils";
import "./style.scss";

class SingleInvestment extends React.Component {
  state = {
    type: "",
    amount: "",
    textInputAmount: "",
    title: "",
    inputTitle: "",
    frequency: "",
    inputFrequency: "",
    frequencyAmount: "",
    inputFrequencyAmount: "",
    targetDate: "",
    inputTargetDate: "",
    enterAmountModal: false,
    showAmountModal: false,
    showFundingSourceModal: false,
    showCardsModal: false,
    showAutomateModal: false,
    showTransactionModal: false,
    newPayment: false,
    tempSelectedMethod: "",
    selectedMethod: "",
    selectedMethodError: "",
    errors: null,
    entryError: null,
    cardId: null,
    selectedTransaction: null,
    showPinModal: false,
    pinError: null,
    pin: {},
  };

  componentDidMount() {
    const { params } = this.props.match;
    if (!Number.isInteger(parseInt(params.investmentId, 10))) {
      return this.props.history.push({
        pathname: `/app/portfolio/`,
        state: { routeName: "Portfolio" },
      });
    }

    this.props.getCards();
    this.props.fetchSingleInvestment(params.investmentId);
  }

  componentDidUpdate(previousProps) {
    if (previousProps.investment !== this.props.investment) {
      this.setValues()
    }
  }

  setValues = () => {
    const investment = this.props.investment;
    if (!investment)
      return;

    this.setState({ inputTitle: investment?.title });
    this.setState({ inputTargetDate: moment(investment?.endDate).toDate() });
    this.setState({ inputFrequency: investment?.frequency });
    this.setState({ inputFrequencyAmount: investment?.installment.toString() });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "amount" || name == "frequencyAmount") {
      if (isNaN(formatCurrencyToString(value))) {
        return;
      }

      this.setState({ errors: null });
      return this.setState({ [name]: formatCurrencyToString(value) }, () => {
        if (name == "amount")
          this.setState({ textInputAmount: formatCurrencyToString(value) });
        else {
          this.setState({
            inputFrequencyAmount: formatCurrencyToString(value),
          });
        }
      });
    }

    if (name === "title") this.setState({ inputTitle: value });
    if (name === "frequency") this.setState({ inputFrequency: value });
    if (name === "targetDate") this.setState({ inputTargetDate: value });

    this.setState({ [name]: value });
  };

  resetFields = () => {
    this.setState({ textInputAmount: "" });
    this.setState({ inputTitle: "" });
    this.setState({ inputTargetDate: "" });
    this.setState({ inputFrequency: "" });
    this.setState({ inputFrequencyAmount: "" });
    this.setState({ errors: null })
    this.setState({ selectedMethod: null });
    this.setValues();
  };

  handlePin = (pin) => {
    this.setState({ pin });
  };

  handleSelectMethod = (event) => {
    this.setState({ selectedMethod: event.target.id });
  };

  toggleOffCanvas = () => {
    openOffCanvas("single-investment-offcanvas");
  };

  toggleAmountModal = () => {
    this.setState({ textInputAmount: "" });
    this.setState({ enterAmountModal: !this.state.enterAmountModal });
  };

  openEditOffCanvas = () => {
    openOffCanvas("edit-investment-offcanvas");
  };

  handleEditAmount = () => {
    if (!Math.floor(Number(this.state.textInputAmount))) {
      return this.setState({ errors: { amount: "enter a valid amount" } });
    }

    this.props.editInvestmentAmount(
      { paymentAmount: Number(this.state.textInputAmount) },
      "custom",
      this.props.investment.id
    );
    this.toggleAmountModal();
  };

  handleEditPlan = (e) => {
    e.preventDefault();
    this.setState({ errors: null, entryError: "" });

    if (this.state.frequencyAmount)
      if (
        !Math.floor(Number(this.state.frequencyAmount)) ||
        Number(this.state.frequencyAmount) < 0
      ) {
        return this.setState({
          errors: { finalAmount: "enter a valid amount" },
        });
      }

    const data = this.state;
    const required = ["inputTitle", "inputFrequency"];

    if (
      this.props.investment &&
      this.props.investment.service.type !== "predefined"
    ) {
      required.push("inputFrequencyAmount");
    }

    if (
      this.props.investment &&
      this.props.investment.service.type !== "collection"
    ) {
      required.push("inputTargetDate");
    }

    const errors = validateFields(data, required);

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }


    const info = {
      startDate: moment(moment(this.props.investment.startDate).toDate()).format(),
      endDate: this.props.investment.endDate
        ? moment(moment(this.props.investment.endDate).toDate()).format()
        : moment(this.state.targetDate)
          ? moment(moment(this.state.targetDate).toDate()).format()
          : "",
      frequency: this.state.frequency.toLowerCase(),
      targetAmount: this.props.investment.targetAmount,
    };

    const entryError = verifyFrequencyPeriod(info);
    if (entryError) {
      return this.setState({ entryError });
    }

    const { inputTitle, inputTargetDate, inputFrequency, inputFrequencyAmount } = this.state;
    const payload = {
      title: inputTitle,
      targetAmount: this.props.investment.targetAmount,
      currency: "NGN",
      startDate: moment(this.props.investment.startDate).format("YYYY-MM-DD"),
      endDate: moment(inputTargetDate).format("YYYY-MM-DD"),
      frequency: inputFrequency,
      amount: Number(formatCurrencyToString(inputFrequencyAmount)),
    };

    const _data = {
      type: this.props.investment.service.type,
      payload,
      id: this.props.investment.id,
    };
    console.log(data);
    this.props.editInvestment(payload, _data.type, _data.id).then((date) => {
      this.resetFields();
      closeOffCanvas("edit-investment-offcanvas");
    });
  };

  handleTopUp = () => {
    const { textInputAmount } = this.state;

    let required = ["amount"];
    let errors = validateFields({ textInputAmount }, required);

    if (
      !Math.floor(Number(this.state.textInputAmount)) ||
      Number(this.state.textInputAmount) < 0
    ) {
      return this.setState({ errors: { amount: "enter a valid amount" } });
    }

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    const { selectedMethod } = this.state;

    required = ["selectedMethod"];
    errors = validateFields({ selectedMethod }, required);
    if (Object.keys(errors).length > 0) {
      return this.setState({
        selectedMethodError: "please select a payment method",
      });
    }

    this.setState({ tempSelectedMethod: selectedMethod });
    this.resetFields();

    // open transaction modal
    this.setState({ selectedMethodError: "" });
    closeOffCanvas("single-investment-offcanvas");
    this.toggleTransactionPinModal();
  };

  // handles for when a funcding source is selected
  handleSelectedFundingSource = () => {
    const { selectedMethod } = this.state;

    const required = ["selectedMethod"];
    const errors = validateFields({ selectedMethod }, required);
    if (Object.keys(errors).length > 0) {
      return this.setState({ selectedMethodError: "please select a method" });
    }
  };

  handleSelectCard = (card) => {
    this.setState({ newPayment: false });
    this.setState({ cardId: card.id });
  };

  handleNewPayment = () => {
    this.setState({ newPayment: true });
    this.setState({ cardId: "" });
  };

  handlePay = (autoCharge) => {
    this.toggleAutomateModal();
    const { amount, tempSelectedMethod, cardId } = this.state;
    const { params } = this.props.match;

    const payment = {
      method: tempSelectedMethod,
      reoccurring: cardId ? true : false,
      cardId: cardId && cardId,
    };
    const payload = {
      amount: formatCurrencyToString(amount),
      payment,
      currency: "NGN",
      autoCharge: autoCharge && autoCharge,
    };

    this.props.topUpInvestment(payload, params.investmentId).then((data) => {
      this.state.showAutomateModal && this.toggleAutomateModal();
      const { params } = this.props.match;
      this.setState({
        amount: "",
        selectedMethod: "",
        errors: null,
        cardId: null,
      });
      setTimeout(
        () => this.props.fetchSingleInvestment(params.investmentId),
        3000
      );
    });
  };

  handleTransactionSelect = (transaction) => {
    this.setState({ selectedTransaction: transaction }, () =>
      this.setState({ showTransactionModal: true })
    );
  };

  handleDisableAutocharge = () => {
    const { params } = this.props.match;
    this.props.disableAutocharge(params.investmentId).then((data) => {
      this.props.fetchSingleInvestment(params.investmentId);
    });
  };

  handleChangeDate = (item, date) => {
    console.log(date);
    this.setState({ inputTargetDate: date });
    this.setState({ [item]: date });
  };

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
      // close transaction modal
      this.toggleTransactionPinModal();

      if (this.state.tempSelectedMethod != "wallet") this.toggleAllCardsModal();
      else {
        this.toggleAutomateModal();
      }
    });
  };

  //liquidate your account
  handleLiquidate = () => {
    const { params } = this.props.match;
    const { investment } = this.props;

    openOffCanvas("liquidate-offcanvas");
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      showTransactionModal: !prevState.showTransactionModal,
    }));
  };

  toggleTransactionPinModal = () => {
    this.setState((prevState) => ({ showPinModal: !prevState.showPinModal }));
  };

  toggleAmountModal = () => {
    this.setState({ textInputAmount: "" });
    this.setState((prevState) => ({
      showAmountModal: !prevState.showAmountModal,
    }));
  };

  toggleFundingModal = () => {
    this.setState((prevState) => ({
      showFundingSourceModal: !prevState.showFundingSourceModal,
    }));
  };

  toggleAllCardsModal = () => {
    this.setState((prevState) => ({
      showCardsModal: !prevState.showCardsModal,
    }));
  };

  toggleAutomateModal = () => {
    this.setState((prevState) => ({ showCardsModal: false }));
    this.setState((prevState) => ({
      showAutomateModal: !prevState.showAutomateModal,
    }));
  };

  render() {
    const {
      investment,
      walletDetails,
      payLoading,
      cards,
      error,
      pinLoading,
      confirmPinError,
    } = this.props;
    const {
      inputTitle,
      entryError,
      enterAmountModal,
      inputFrequency,
      inputFrequencyAmount,
      inputTargetDate,
      showAmountModal,
      showFundingSourceModal,
      showCardsModal,
      selectedMethod,
      selectedMethodError,
      showAutomateModal,
      errors,
      amount,
      textInputAmount,
      showTransactionModal,
      selectedTransaction,
      showPinModal,
      pinError,
    } = this.state;
    const errorObject = serializeErrors(error);

    return (
      <>
        <div className="single-portfolio-page">
          {showAmountModal && (
            <Modal onClose={this.toggleAmountModal}>
              <div className="text-right pb-3">
                <img
                  src={require("#/assets/icons/close.svg")}
                  alt="close"
                  onClick={this.toggleAmountModal}
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
                      Edit your payment amount
                    </h5>
                  </div>
                  <div className="px-1 mt-4">
                    <Textbox
                      onChange={this.handleChange}
                      type="text"
                      label="Amount"
                      placeholder="Amount"
                      name="amount"
                      value={formatStringToCurrency(textInputAmount)}
                      error={
                        errors
                          ? errors.amount
                          : errorObject && errorObject["amount"]
                      }
                    />
                  </div>
                  <div className="mt-4">
                    {/* {walletDetails &&
                      <p className="text-grey mb-1">Available balance <span className="text-blue">
                        &#x20A6; {walletDetails && walletDetails.wallet.NGN ? walletDetails.wallet.NGN : 0}
                      </span>
                      </p>} */}
                    <div className="mt-2">
                      <button
                        className="btn btn-primary btn-block py-3 mt-3"
                        onClick={this.handleEditAmount}
                      >
                        Proceed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          )}
          {showPinModal && (
            <Modal
              classes="transaction-modal"
              onClose={this.toggleTransactionPinModal}
            >
              <div className="text-right pb-3">
                <img
                  style={{ cursor: "pointer" }}
                  src={require("#/assets/icons/close.svg")}
                  className="cursor-pointer"
                  alt="close"
                  onClick={this.toggleTransactionPinModal}
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
                      Confirm Top Up
                      {pinLoading && (
                        <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                      )}
                    </button>
                    <p
                      className="text-blue mt-3"
                      onClick={this.toggleTransactionPinModal}
                      style={{ cursor: "pointer" }}
                    >
                      Cancel Top Up
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
          {showCardsModal && (
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
                    <h5 className="text-blue font-bolder">
                      Choose a bank card
                    </h5>
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
                          handleSelect={this.handleSelectCard}
                          selected={this.state.cardId === card.id}
                          key={card.id}
                        />
                      ))}

                    <div
                      className={`d-flex p-3 mb-2 cursor-pointer debit-card new-payment position-relative ${this.state.newPayment ? "selected" : ""
                        }`}
                      onClick={this.handleNewPayment}
                    >
                      {(this.state.newPayment ? true : false) && (
                        <img
                          className="position-absolute"
                          width={16}
                          src={require("#/assets/icons/success.svg")}
                          style={{
                            zIndex: 1,
                            right: "0.35rem",
                            top: "0.35rem",
                          }}
                        />
                      )}
                      <div className="d-flex mr-3">
                        <img
                          src={require("#/assets/icons/plus-circle.svg")}
                          width={"35px"}
                          alt="icon"
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
                      onClick={this.toggleAutomateModal}
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
                      Allow us to fund from your source{" "}
                      {investment && investment.frequency} without asking.
                    </p>
                  </div>
                  <div className="mt-4">
                    {payLoading && (
                      <div className="spinner-border spinner-border-primary text-primary spinner-border-sm mr-2"></div>
                    )}
                    <button
                      className="btn btn-primary btn-block py-3 mt-3"
                      onClick={() => this.handlePay(true)}
                      disabled={payLoading}
                    >
                      Yes, automate funding
                    </button>
                    <p
                      className="mt-4 text-blue mb-2 cursor-pointer"
                      onClick={() => this.handlePay(false)}
                    >
                      No, I’ll add money myself
                    </p>
                    {error && typeof error === "string" && (
                      <p className="text-error mt-2">{error}</p>
                    )}
                  </div>
                </div>
              </div>
            </Modal>
          )}
          <div className="row mb-3">
            <div className="col-4">
              <Back />
            </div>
            <div className="col-4">
              <h3 className="text-uppercase text-center">
                {investment ? investment.title : ""}
              </h3>
            </div>
            <div className="col-4 text-right">
              <span
                className={`pl-3 pr-3 text-small text-capitalize single-portfolio-page--${investment?.order_status}`}
              >
                {investment?.order_status}
              </span>
            </div>
          </div>
          <div className="summary-container">
            <SummaryCard
              className="BG"
              title="Amount Invested"
              showCurrency={true}
              total={`${investment ? formatCurrency(investment.balance) : "0.00"
                }`}
              percentageDiff="N/A"
              backgroundImage={`url(${WalletBG})`}
              iconColor="#871523"
              iconName="white-wallet"
            />

            <SummaryCard
              title="Interest"
              showCurrency={true}
              total={`${investment ? formatCurrency(investment.accruedInterest) : "0.00"
                }`}
              percentageDiff={"N/A"}
              backgroundImage={`url(${InvestmentBG})`}
              iconColor="#B0500E"
              iconName="money"
            />
            <SummaryCard
              title="Intrest Rate P.A"
              showCurrency={false}
              total={`${investment ? investment.interestRate : 0}%`}
              percentageDiff={"N/A"}
              backgroundImage={`url(${ReturnsBG})`}
              iconColor="#3F2256"
              iconName="money-arrow"
            />
          </div>
          <Card classes="mt-4 card">
            <div className="row">
              <div className="col-md-3 align-self-center   text-center mt-2">
                <img
                  src={require("#/assets/icons/plus-circle.svg")}
                  alt="plus"
                  className={`img-fluid ${["active", "booked"].includes(investment?.order_status)
                    ? "cursor-pointer"
                    : "cursor-block disabled"
                    }`}
                  onClick={
                    ["active", "booked"].includes(investment?.order_status)
                      ? this.toggleOffCanvas
                      : null
                  }
                />
                <p
                  className={`text-blue mb-0 text-small ${["active", "booked"].includes(investment?.order_status)
                    ? "cursor-pointer"
                    : "cursor-block disabled"
                    }`}
                  onClick={
                    ["active", "booked"].includes(investment?.order_status)
                      ? this.toggleOffCanvas
                      : null
                  }
                >
                  Top up
                </p>
              </div>
              <div className="col-md-3 align-self-center   text-center mt-2">
                {investment?.autoChargeChannel &&
                  investment?.autoChargeChannel !== "" && (
                    <>
                      <img
                        src={
                          investment?.autoCharge === 0
                            ? require("#/assets/icons/toggle-off.svg")
                            : require("#/assets/icons/toggle-on.svg")
                        }
                        alt="plus"
                        className={`img-fluid ${["active", "booked"].includes(
                          investment?.order_status
                        )
                          ? "cursor-pointer"
                          : "cursor-block disabled"
                          }`}
                        onClick={
                          ["active", "booked"].includes(
                            investment?.order_status
                          )
                            ? this.handleDisableAutocharge
                            : null
                        }
                      />
                      <p
                        className={`text-blue mb-0 text-small ${["active", "booked"].includes(
                          investment?.order_status
                        )
                          ? "cursor-pointer"
                          : "cursor-block disabled"
                          }`}
                        onClick={
                          ["active", "booked"].includes(
                            investment?.order_status
                          )
                            ? this.handleDisableAutocharge
                            : null
                        }
                      >
                        Automated Payment
                      </p>
                    </>
                  )}
              </div>
              <div className="col-md-3 align-self-center   text-center mt-2">
                {investment?.autoChargeChannel &&
                  investment?.autoChargeChannel !== "" && (
                    <>
                      <svg
                        className={`${["active", "booked"].includes(
                          investment?.order_status
                        )
                          ? "cursor-pointer"
                          : "cursor-block disabled"
                          }`}
                        onClick={
                          ["active", "booked"].includes(
                            investment?.order_status
                          )
                            ? this.openEditOffCanvas
                            : null
                        }
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.6"
                          d="M17 34C26.3888 34 34 26.3888 34 17C34 7.61116 26.3888 0 17 0C7.61116 0 0 7.61116 0 17C0 26.3888 7.61116 34 17 34Z"
                          fill="#E5F1FF"
                        />
                        <path
                          d="M13.0322 17.8351V19.7351H14.9322L20.0112 14.6561L18.1112 12.7561L13.0322 17.8351Z"
                          fill="#3A4080"
                        />
                        <path
                          d="M21.5191 12.4411L20.3311 11.2561C20.2357 11.1609 20.1064 11.1074 19.9716 11.1074C19.8369 11.1074 19.7076 11.1609 19.6122 11.2561L18.6191 12.2481L20.5191 14.1481L21.5121 13.1551C21.6068 13.0608 21.6605 12.9331 21.6618 12.7995C21.6631 12.6659 21.6119 12.5372 21.5191 12.4411V12.4411Z"
                          fill="#3A4080"
                        />
                        <path
                          d="M23.189 21.2631H11V23.2951H23.189V21.2631Z"
                          fill="#3A4080"
                        />
                      </svg>

                      <p
                        className={`text-blue mb-0 text-small ${["active", "booked"].includes(
                          investment?.order_status
                        )
                          ? "cursor-pointer"
                          : "cursor-block disabled"
                          }`}
                        onClick={
                          ["active", "booked"].includes(
                            investment?.order_status
                          )
                            ? null
                            : null
                        }
                      >
                        Edit Plan
                      </p>
                    </>
                  )}
              </div>
              <div className="col-md-3 align-self-center   text-center mt-2">
                <img
                  src={require("#/assets/icons/liquidate.svg")}
                  alt="plus"
                  className={`img-fluid ${["active"].includes(investment?.order_status)
                    ? "cursor-pointer"
                    : "cursor-block disabled"
                    }`}
                  onClick={
                    ["active"].includes(investment?.order_status)
                      ? this.handleLiquidate
                      : null
                  }
                />
                <p
                  className={`text-blue mb-0 text-small ${["active"].includes(investment?.order_status)
                    ? "cursor-pointer"
                    : "cursor-block disabled"
                    }`}
                  onClick={
                    ["active"].includes(investment?.order_status)
                      ? this.handleLiquidate
                      : null
                  }
                >
                  Liquidate
                </p>
              </div>
            </div>
          </Card>
          <div className="row mt-3">
            <div className="col-md-4 mt-2">
              <div className="card p-3 px-4 min-height-small  d-flex flex-column justify-content-between">
                <h5 className="text-blue">Payment Amount</h5>
                <div>
                  <h3 className="font-weight-bold">
                    &#x20A6;
                    {investment
                      ? formatCurrency(investment.installment)
                      : 0}{" "}
                    <span className="text-blue text-small">
                      /{investment && investment.frequency}
                    </span>
                  </h3>
                  <p className="">
                    Next Deposit Date -{" "}
                    <b>
                      {investment && investment.nextPaymentDate
                        ? moment(investment.nextPaymentDate).format(
                          "MMM D, YYYY"
                        )
                        : "Not Available"}
                    </b>
                  </p>
                  <div>
                    {/* <svg className="mr-1" width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.51245 4.27722C0.547273 4.28227 0.582522 4.28461 0.6178 4.28422L6.63171 4.28422L6.50058 4.33822C6.37216 4.39239 6.25535 4.46617 6.15539 4.55622L4.47428 6.05622C4.36665 6.14781 4.29874 6.27038 4.28255 6.4023C4.26635 6.53422 4.30289 6.667 4.38574 6.77722C4.43707 6.83983 4.50282 6.89191 4.57857 6.92998C4.65432 6.96805 4.73832 6.99123 4.82494 6.99795C4.91155 7.00468 4.99877 6.9948 5.08076 6.96897C5.16274 6.94314 5.23758 6.90197 5.30026 6.84822L8.34644 4.13122C8.40317 4.08069 8.44817 4.02068 8.47888 3.95462C8.50959 3.88855 8.52539 3.81774 8.52539 3.74622C8.52539 3.6747 8.50959 3.60388 8.47888 3.53782C8.44817 3.47176 8.40317 3.41175 8.34644 3.36122L5.2969 0.640218C5.2355 0.585533 5.16173 0.543172 5.08051 0.515962C4.99929 0.488751 4.9125 0.477319 4.82593 0.48243C4.73937 0.487542 4.65502 0.509079 4.57853 0.545602C4.50204 0.582124 4.43517 0.632791 4.38238 0.694219C4.29953 0.804433 4.26298 0.937217 4.27918 1.06913C4.29538 1.20105 4.36329 1.32363 4.47091 1.41522L6.15203 2.92322C6.24136 3.00363 6.34421 3.07111 6.45687 3.12322L6.63955 3.19622L0.651422 3.19622C0.500672 3.1912 0.352897 3.23454 0.234879 3.31838C0.116861 3.40221 0.0364132 3.52101 0.00811577 3.65322C-0.00468922 3.72374 -0.00180149 3.79582 0.016614 3.86534C0.0350294 3.93487 0.0686111 4.00048 0.115443 4.05842C0.162275 4.11636 0.221439 4.16551 0.289557 4.20305C0.357677 4.24059 0.433415 4.26579 0.51245 4.27722Z" fill="#3A4080" />
                    </svg> */}
                    {/* version 2.0 */}
                    {/* <span className="cursor-pointer ms-1 text-blue" onClick={this.toggleAmountModal}>Edit Amount</span> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="card p-3 px-4 min-height-small d-flex flex-column justify-content-between">
                <div>
                  <h5 className="text-blue">Investment Progress</h5>
                  <div className="progress position-relative">
                    {investment && investment.percentageCompletion < 10 ? (
                      <div
                        style={{ top: "3px", left: "2px" }}
                        className="position-absolute text-black font-weight-bold"
                      >
                        {" "}
                        {investment.percentageCompletion}%{" "}
                      </div>
                    ) : (
                      <></>
                    )}

                    <div
                      className={`progress-bar bg-success ${investment && investment.percentageCompletion < 10
                        ? "text-black"
                        : ""
                        } ${investment && investment.percentageCompletion == 0
                          ? "d-none"
                          : ""
                        }`}
                      role="progressbar"
                      style={{
                        width: `${investment ? investment.percentageCompletion : 0
                          }%`,
                      }}
                      aria-valuenow={
                        investment ? investment.percentageCompletion : 0
                      }
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {investment && investment.percentageCompletion >= 10
                        ? `${investment.percentageCompletion}%`
                        : ""}
                    </div>
                  </div>
                </div>
                <div className="">
                  <p className="text-grey text-small mb-0">Target</p>
                  <h3 className="font-weight-bold">
                    &#x20A6;
                    {investment ? formatCurrency(investment.targetAmount) : 0}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="card p-3 px-4 min-height-small d-flex flex-column justify-content-between">
                <h5 className="text-blue">Investment Info</h5>
                <div>
                  <div className="d-flex justify-content-between flex-wrap">
                    <div>
                      <h5 className="text-small font-normal text-grey mb-0">
                        Investment Name
                      </h5>
                      <h5
                        className="font-normal text-capitalize font-weight-bold"
                        style={{ fontSize: "16px" }}
                      >
                        {investment ? investment.title : ""}
                      </h5>
                    </div>
                    <div className="right-side-text">
                      <h5 className="font-normal text-small text-grey mb-0">
                        Target Amount
                      </h5>
                      <h5
                        className="font-normal font-weight-bold"
                        style={{ fontSize: "16px" }}
                      >
                        &#x20A6;
                        {investment
                          ? formatCurrency(investment.targetAmount)
                          : 0}
                      </h5>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="font-normal text-small text-grey mb-0">
                        Start Date
                      </p>
                      <h5
                        className="font-normal font-weight-bold"
                        style={{ fontSize: "16px" }}
                      >
                        {investment && investment.startDate
                          ? moment(moment(investment.startDate).toDate()).format("MMM D, YYYY")
                          : "N/A"}
                      </h5>
                    </div>
                    <div className="right-side-text">
                      <p className="font-normal text-grey text-small mb-0">
                        Target Date
                      </p>
                      <h5
                        className="font-normal font-weight-bold"
                        style={{ fontSize: "16px" }}
                      >
                        {investment && investment.endDate
                          ? moment(moment(investment.endDate).toDate()).format("MMM D, YYYY")
                          : "No end date"}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 card p-5">
            <h5 className="mb-3 text-blue">Transactions</h5>
            {investment && investment.transactions?.length > 0 ? (
              investment.transactions?.map((transaction) => (
                <Transaction
                  transaction={transaction}
                  key={transaction.reference}
                  handleSelect={this.handleTransactionSelect}
                />
              ))
            ) : (
              <div className="text-center mt-4">
                <img
                  src={require("#/assets/icons/receipt.svg")}
                  alt="plus"
                  className="img-fluid"
                />
                <p className="font-light text-grey"> No Transactions</p>
              </div>
            )}
          </div>
          <OffCanvas
            title=""
            position="end"
            id="single-investment-offcanvas"
            onClose={this.resetFields}
          >
            <div className="px-3 h-100 d-flex flex-column flex-grow-1">
              <div className="mt-3 mb-2">
                <h3 className="font-bolder text-blue">Top up Goal</h3>
                <p>Enter amount to top-up</p>
              </div>

              <div className="mt-5">
                <p>How much do you want to deposit?</p>
                <Textbox
                  onChange={this.handleChange}
                  type="text"
                  label="Amount"
                  placeholder="Amount"
                  name="amount"
                  value={formatStringToCurrency(textInputAmount)}
                  error={
                    errors
                      ? errors.amount
                      : errorObject && errorObject["amount"]
                  }
                />
              </div>
              <div className="mt-5 d-flex flex-column flex-grow-1">
                <div className="d-flex pb-2 flex-column flex-grow-1 justify-content-between">
                  <div className="w-100">
                    <p>Choose a payment method</p>
                    <div className="row">
                      {fundingSource.map((method) => (
                        <div
                          className="col-lg-6 pr-0 mt-2"
                          key={Math.random() * 1000}
                        >
                          <PaymentMethod
                            onSelect={this.handleSelectMethod}
                            selected={
                              selectedMethod === method.value ? true : false
                            }
                            imgUrl={method.imgUrl}
                            imgBlue={method.imgBlue}
                            key={Math.random() * 1000}
                            value={method.value}
                            label={method.label}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-100">
                    <button
                      className="btn w-100 btn-sm btn-primary btn-md-block"
                      onClick={this.handleTopUp}
                    >
                      Proceed with payment
                      {this.props.loading && (
                        <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                      )}
                    </button>
                    {selectedMethodError && (
                      <p className="text-error mt-2">{selectedMethodError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </OffCanvas>
          <OffCanvas
            title=""
            position="end"
            id="edit-investment-offcanvas"
            onClose={this.resetFields}
          >
            <div className="px-3 h-100 d-flex flex-column flex-grow-1">
              <div className="mt-3 mb-2">
                <h4 className="font-bolder text-blue">Edit Plan</h4>
                <p>Make changes to your plan</p>
              </div>

              <div className="mt-3">
                <p>Plan Title</p>
                <Textbox
                  onChange={this.handleChange}
                  type="text"
                  label="New title"
                  placeholder="New title"
                  name="title"
                  value={inputTitle}
                  error={
                    errors ? errors.title : errorObject && errorObject["title"]
                  }
                />
              </div>
              {<div className="mt-3">
                <p>How often do you set aside money for this?</p>
                <SelectBox
                  onChange={this.handleChange}
                  boxClasses="mt-3 active"
                  label="Frequency"
                  placeholder="Set frequency"
                  name="frequency"
                  options={investmentFrequency}
                  value={inputFrequency}
                  optionName="name"
                  error={errors ? errors.frequency : (errorObject && errorObject['frequency'])}
                />
              </div>
              }
              {!(this.props.investment && this.props.investment.service && (this.props.investment.service.type === "predefined")) && <div className="mt-3">
                <p>How much do you want at each frequency?</p>
                <Textbox
                  onChange={this.handleChange}
                  type="text"
                  label="Frequency Amount"
                  placeholder="Frequency Amount"
                  name="frequencyAmount"
                  value={formatStringToCurrency(inputFrequencyAmount)}
                  error={
                    errors
                      ? errors.frequencyAmount
                      : errorObject && errorObject["frequencyAmount"]
                  }
                />
              </div>}
              {!(this.props.investment && this.props.investment.service && (this.props.investment.service.type === "collection")) && <div className="mt-3">
                <p>Edit target date?</p>
                <DateBox
                  onChange={date => this.handleChangeDate('targetDate', date)}
                  label="Target Date"
                  placeholder="Set target date"
                  name="targetDate"
                  value={inputTargetDate}
                  error={errors ? errors.targetDate : (errorObject && errorObject['targetDate'])}
                  min={new Date()}
                />
              </div>}
              <div className="mt-5 d-flex flex-column flex-grow-1">
                <div className="d-flex pb-2 flex-column flex-grow-1 justify-content-between">
                  <div className="mt-4 pb-3">
                    {entryError && (
                      <p className="text-error mt-2 mr-3">{entryError}</p>
                    )}

                    <button
                      className="w-100 py-3 btn btn-primary btn-md-block"
                      onClick={this.handleEditPlan}
                    >
                      Save changes
                      {/* {calcLoading &&
                    <div className="spinner-border text-white spinner-border-sm ml-2"></div>
                  } */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </OffCanvas>
        </div>
        <LiquidateInvestment />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    app: {
      portfolio: { investment, error },
      wallet: { cards, walletDetails },
      security: { error: confirmPinError },
    },
  } = state;

  return {
    loading: getActionLoadingState(
      state,
      actionTypes.FETCH_SINGLE_INVESTMENT_REQUEST
    ),
    payLoading: getActionLoadingState(
      state,
      actionTypes.TOP_UP_INVESTMENT_REQUEST
    ),
    pinLoading: getActionLoadingState(
      state,
      securityActionTypes.CONFIRM_PIN_REQUEST
    ),
    investment,
    walletDetails,
    confirmPinError,
    cards,
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSingleInvestment: (id) => dispatch(fetchSingleInvestment(id)),
    getCards: () => dispatch(getCards()),
    topUpInvestment: (payload, id) => dispatch(topUpInvestment(payload, id)),
    editInvestment: (payload, type, id) =>
      dispatch(editInvestment(payload, type, id)),
    editInvestmentAmount: (payload, type, id) =>
      dispatch(editInvestmentAmount(payload, type, id)),
    disableAutocharge: (id) => dispatch(disableAutocharge(id)),
    confirmPin: (payload) => dispatch(confirmPin(payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SingleInvestment)
);
