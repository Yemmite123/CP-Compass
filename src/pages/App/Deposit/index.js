import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Textbox from "#/components/Textbox";
import PaymentMethod from "#/components/PaymentMethod";
import OffCanvas from "#/components/OffCanvas";
import Modal from "#/components/Modal";
import DebitCard from "#/components/DebitCard";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/wallet/actionTypes";
import { displayTransferModal } from "#/store/ui/actions";
import {
  getCards,
  depositFunds,
  depositFundsCard,
} from "#/store/wallet/actions";
import { paymentMethods, closeOffCanvas } from "#/utils";
import {
  validateFields,
  serializeErrors,
  formatStringToCurrency,
  formatCurrencyToString,
} from "#/utils";
import "./style.scss";

class Deposit extends React.Component {
  state = {
    amount: "",
    textInputAmount: "",
    errors: null,
    selectedMethod: null,
    selectedMethodError: null,
    selectedCard: null,
    newPayment: false,
    selectionError: null,
    showNoBvn: false,
    showCardsModal: false,
  };

  textInputRef = React.createRef();

  componentDidMount() {
    this.props.getCards();
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "amount") {
      if (isNaN(formatCurrencyToString(value)))
        return;
      this.setState({ errors: null });
      return this.setState({ [name]: formatCurrencyToString(value) }, () => {
        this.setState({ textInputAmount: formatCurrencyToString(value) });
        if (isNaN(this.state.amount)) {
          return this.setState({ errors: { amount: "enter a valid number" } });
        }
      });
    }
    this.setState({ [name]: value });
  };

  resetFields = () => {
    // console.log((this.textInputRef.current.value = 0));
    this.setState({ errors: null });
    this.setState({ textInputAmount: "" });
    this.setState({ selectedMethod: null });
  };

  handleSelectMethod = (event) => {
    this.setState({ selectedMethod: event.target.id });
  };

  toggleAllCardsModal = (e) => {
    e.preventDefault();
    this.setState({ showCardsModal: !this.state.showCardsModal });
  };

  handleSelectCard = (card) => {
    this.setState({ newPayment: false });
    this.setState({ selectedCard: card, type: "card" });
  };

  handleNewPayment = () => {
    this.setState({ newPayment: true });
    this.setState({ selectedCard: null, type: "card" });
  };

  // handles for when a funcding source is selected
  handleSelectedFundingSource = (e) => {
    if (this.state.newPayment) {
      const payload = { amount: this.state.amount, currency: "NGN" };
      this.props.depositFunds(payload);
      return this.toggleAllCardsModal(e);
    }

    const payload = {
      amount: this.state.amount,
      cardId: this.state.selectedCard.id,
    };

    this.setState({ amount: "" })
    this.props.depositFundsCard(payload, this.props.history);
    return this.toggleAllCardsModal(e);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { selectedMethod } = this.state;
    this.setState({ errors: null, selectionError: null });

    if (!selectedMethod) {
      return this.setState({
        selectionError: "please select a payment method",
      });
    }

    const data = this.state;
    const required = ["amount"];
    const errors = validateFields(data, required);

    if (isNaN(this.state.amount)) {
      return this.setState({ errors: { amount: "enter a valid number" } });
    }

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    this.resetFields();

    if (!this.props.isBvnActive) {
      closeOffCanvas("deposit-offcanvas");
      return this.toggleBvnModal();
    }

    if (selectedMethod === "transfer") {
      closeOffCanvas("deposit-offcanvas");
      return this.props.displayTransferModal();
    }

    if (this.props.cards && this.props.cards.cards.length > 0) {
      closeOffCanvas("deposit-offcanvas");
      this.toggleAllCardsModal(e);
    }
  };

  handleBvnSetup = () => {
    this.props.history.push("/app/onboarding");
  };

  toggleBvnModal = () => {
    this.setState((prevState) => ({ showNoBvn: !prevState.showNoBvn }));
  };

  render() {
    const {
      amount,
      textInputAmount,
      selectedMethod,
      errors,
      selectionError,
      showNoBvn,
      showCardsModal,
    } = this.state;
    const { error, loading, cards, walletDetails, payLoading } = this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="deposit-page">
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
                        handleSelect={this.handleSelectCard}
                        selected={this.state.selectedCard === card}
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
                  {/* {selectedMethodError && <p className="text-error mt-2">{selectedMethodError}</p>} */}
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
        <OffCanvas
          title=""
          position="end"
          id="deposit-offcanvas"
          onClose={this.resetFields}
        >
          <div className="px-3 h-100 d-flex flex-column flex-grow-1">
            <div className="mt-3 mb-2">
              <h3 className="font-bolder text-blue">Deposit Funds</h3>
              <p>Enter amount and choose a payment method</p>
            </div>

            <div className="mt-5">
              <p>How much do you want to deposit?</p>
              <Textbox
                onChange={this.handleChange}
                ref={this.textInputRef}
                type="text"
                value={formatStringToCurrency(textInputAmount)}
                label="Amount"
                placeholder="Amount"
                name="amount"
                error={
                  errors ? errors.amount : errorObject && errorObject["amount"]
                }
              />
            </div>
            <div className="mt-5 d-flex flex-column flex-grow-1">
              <div className="d-flex pb-2 flex-column flex-grow-1 justify-content-between">
                <div className="w-100">
                  <p>Choose a payment method</p>
                  <div className="row">
                    {paymentMethods.map((method) => (
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
                    onClick={this.handleSubmit}
                  >
                    Proceed with payment
                    {loading && (
                      <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                    )}
                  </button>
                  {error && <p className="text-error text-left">{error}</p>}
                  {selectionError && (
                    <p className="text-error text-left">{selectionError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </OffCanvas>

        {showNoBvn && (
          <Modal classes="bvn-active" onClose={this.toggleBvnModal}>
            <div className="text-center">
              <h3 className="text-blue">Please Setup your BVN to continue</h3>
              <button
                className="btn btn-primary btn-sm btn-block mt-4"
                onClick={this.handleBvnSetup}
              >
                Setup BVN
              </button>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    app: {
      wallet: { cards, error, walletDetails },
      profile: {
        userProfile: { data },
      },
    },
  } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.DEPOSIT_REQUEST),
    cards,
    error,
    walletDetails,
    isBvnActive: data && data.bvn ? true : false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    displayTransferModal: () => dispatch(displayTransferModal()),
    getCards: () => dispatch(getCards()),
    depositFunds: (payload) => dispatch(depositFunds(payload)),
    depositFundsCard: (payload, history) =>
      dispatch(depositFundsCard(payload, history)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Deposit)
);
