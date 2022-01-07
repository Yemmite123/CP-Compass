import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Textbox from "#/components/Textbox";
import PaymentMethod from "#/components/PaymentMethod";
import OffCanvas from "#/components/OffCanvas";
import Modal from "#/components/Modal";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/wallet/actionTypes";
import { displayTransferModal } from "#/store/ui/actions";
import { getCards, depositFunds } from "#/store/wallet/actions";
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
    errors: null,
    selectedMethod: null,
    selectionError: null,
    showNoBvn: false,
  };

  componentDidMount() {
    this.props.getCards();
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "amount") {
      this.setState({ errors: null });
      return this.setState({ [name]: formatCurrencyToString(value) }, () => {
        if (isNaN(this.state.amount)) {
          return this.setState({ errors: { amount: "enter a valid number" } });
        }
      });
    }
    this.setState({ [name]: value });
  };

  handleSelectMethod = (event) => {
    this.setState({ selectedMethod: event.target.id });
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

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

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
      return this.props.history.push({
        pathname: "/app/wallet/cards",
        state: { amount: formatCurrencyToString(this.state.amount) },
      });
    }
    const payload = {
      amount: formatCurrencyToString(this.state.amount),
      currency: "NGN",
    };

  
    //check for cards before this
    this.props.depositFunds(payload);
  };

  handleBvnSetup = () => {
    this.props.history.push("/app/onboarding");
  };

  toggleBvnModal = () => {
    this.setState((prevState) => ({ showNoBvn: !prevState.showNoBvn }));
  };

  render() {
    const { amount, selectedMethod, errors, selectionError, showNoBvn } =
      this.state;
    const { error, loading, walletDetails } = this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="deposit-page">
        <OffCanvas title="" position="end" id="deposit-offcanvas">
          <div className="px-3 h-100 d-flex flex-column flex-grow-1">
            <div className="mt-3 mb-2">
              <h3 className="font-bolder text-blue">Deposit Funds</h3>
              <p>Enter amout and destination for this fund</p>
            </div>

            <div className="mt-5">
              <p>How much do you want to deposit?</p>
              <Textbox
                onChange={this.handleChange}
                type="text"
                label="Amount"
                placeholder="Amount"
                name="amount"
                value={formatStringToCurrency(amount)}
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
                  {error && <p className="text-error text-left">{error}</p>}
                  {selectionError && (
                    <p className="text-error text-left">{selectionError}</p>
                  )}
                  <button
                    className="btn w-100 btn-sm btn-primary btn-md-block"
                    onClick={this.handleSubmit}
                  >
                    Proceed with payment
                    {loading && (
                      <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </OffCanvas>

        {showNoBvn && (
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
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Deposit)
);
