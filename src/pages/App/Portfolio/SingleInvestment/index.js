import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/portfolio/actionTypes";
import {
  fetchSingleInvestment,
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
import LiquidateInvestment from "#/pages/App/Portfolio/LiquidateInvestment";
import {
  formatCurrency,
  validateFields,
  fundingSource,
  serializeErrors,
  formatCurrencyToString,
  formatStringToCurrency,
  openOffCanvas,
  closeOffCanvas,
} from "#/utils";
import "./style.scss";

class SingleInvestment extends React.Component {
  state = {
    amount: "",
    textInputAmount: "",
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

  handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "amount") {
      if (isNaN(formatCurrencyToString(value))) {
        return;
      }

      this.setState({ errors: null });
      return this.setState({ [name]: formatCurrencyToString(value) }, () => {
        this.setState({ textInputAmount: formatCurrencyToString(value) });
      });
    }
    this.setState({ [name]: value });
  };

  resetFields = () => {
    this.setState({ textInputAmount: "" });
    this.setState({ errors: null })
    this.setState({ selectedMethod: null });
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

  handleTopUp = () => {
    const { amount } = this.state;

    let required = ["amount"];
    let errors = validateFields({ amount }, required);

    if (!Math.floor(Number(this.state.amount)) || Number(this.state.amount) < 0) {
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

  }

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
      this.toggleAllCardsModal();
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
          {showPinModal && (
            <Modal
              classes="transaction-modal"
              onClose={this.toggleTransactionPinModal}
            >
              <div className="text-right pb-3">
                <img
                  style={{ cursor: "pointer" }}
                  src={require("#/assets/icons/close.svg")}
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
                      Confirm Setup
                      {pinLoading && (
                        <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                      )}
                    </button>
                    <p
                      className="text-blue mt-3"
                      onClick={this.toggleTransactionPinModal}
                      style={{ cursor: "pointer" }}
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
                          style={{ zIndex: 1, right: "0.35rem", top: "0.35rem" }}
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
              total={`${investment ? formatCurrency(investment.balance) : "0.00"}`}
              percentageDiff="N/A"
              backgroundImage={`url(${WalletBG})`}
              iconColor="#871523"
              iconName="white-wallet"
            />

            <SummaryCard
              title="Interest"
              showCurrency={true}
              total={`${investment ? formatCurrency(investment.accruedInterest) : "0.00"}`}
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
              <div className="col-md-4 text-center mt-2">
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
              <div className="col-md-4 text-center mt-2">
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
              <div className="col-md-4 text-center mt-2">
                <img
                  src={require("#/assets/icons/liquidate.svg")}
                  alt="plus"
                  className={`img-fluid ${["active", "booked"].includes(investment?.order_status)
                    ? "cursor-pointer"
                    : "cursor-block disabled"
                    }`}
                  onClick={
                    ["active", "booked"].includes(investment?.order_status)
                      ? this.handleLiquidate
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
                </div>
              </div>
            </div>
            <div className="col-md-4 mt-2">
              <div className="card p-3 px-4 min-height-small d-flex flex-column justify-content-between">
                <div>
                  <h5 className="text-blue">Investment Progress</h5>
                  <div className="progress position-relative">
                    {investment && investment.percentageCompletion < 10 ? <div style={{ top: "3px", left: "2px" }} className="position-absolute text-black font-weight-bold"> {investment.percentageCompletion}% </div> : <></>}

                    <div
                      className={`progress-bar bg-success ${investment && investment.percentageCompletion < 10 ? "text-black" : ""}`}
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
                      {investment && investment.percentageCompletion >= 10 ? `${investment.percentageCompletion}%` : ""}
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
                          ? moment(investment.startDate).format("MMM D, YYYY")
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
                          ? moment(investment.endDate).format("MMM D, YYYY")
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
    disableAutocharge: (id) => dispatch(disableAutocharge(id)),
    confirmPin: (payload) => dispatch(confirmPin(payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SingleInvestment)
);
