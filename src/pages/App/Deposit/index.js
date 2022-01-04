import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Back from '#/components/Back';
import Card from '#/components/Card';
import Textbox from '#/components/Textbox';
import PaymentMethod from '#/components/PaymentMethod';
import Modal from '#/components/Modal';
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/wallet/actionTypes";
import { displayTransferModal } from '#/store/ui/actions'
import { getCards, depositFunds } from '#/store/wallet/actions'
import { paymentMethods } from '#/utils';
import { validateFields, serializeErrors, formatStringToCurrency, formatCurrencyToString } from '#/utils';
import './style.scss';

class Deposit extends React.Component {

  state = {
    amount: '',
    errors: null,
    selectedMethod: null,
    selectionError: null,
    showNoBvn: false,
  }

  componentDidMount () {
    this.props.getCards();
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    if(name === 'amount') {
    this.setState({ errors: null});
      return this.setState({ [name]: formatCurrencyToString(value)}, ()=> {
        if(isNaN(this.state.amount)) {
          return this.setState({ errors: { amount: 'enter a valid number' } })
        }
      });
    }
    this.setState({ [name]: value });
  }

  handleSelectMethod = (event) => {
    this.setState({ selectedMethod: event.target.id });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { selectedMethod } = this.state;
    this.setState({ errors: null, selectionError: null });

    if (!selectedMethod) {
      return this.setState({ selectionError: 'please select a payment method' });
    }

    const data = this.state;
    const required = [ 'amount' ];
    const errors = validateFields(data, required)

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    if(!this.props.isBvnActive) {
      return this.toggleBvnModal()
    }

    if(selectedMethod === 'transfer') {
      return this.props.displayTransferModal();
    }

    if(this.props.cards && this.props.cards.cards.length > 0) {
      return this.props.history.push({
        pathname: "/app/wallet/cards",
        state: { amount: formatCurrencyToString(this.state.amount) },
      });
    }
    const payload = { amount: formatCurrencyToString(this.state.amount), currency: 'NGN' }
    //check for cards before this
    this.props.depositFunds(payload)
  }

  handleBvnSetup = () => {
    this.props.history.push('/app/onboarding');
  }

  toggleBvnModal = () => {
    this.setState(prevState => ({ showNoBvn: !prevState.showNoBvn }))
  }


  render() {
    const { amount, selectedMethod, errors, selectionError, showNoBvn } = this.state;
    const { error, loading, walletDetails } = this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="deposit-page">
        {showNoBvn &&
          <Modal classes="bvn-active" onClose={this.toggleBvnModal}>
            <div className="text-center">
              <h3 className="text-deep-blue">Please Setup your BVN to continue</h3>
              <button className="btn btn-primary btn-sm btn-block mt-4" onClick={this.handleBvnSetup}>
                Setup BVN
              </button>
            </div>
          </Modal>
        }
        <div className="row">
          <div className="col-md-2">
            <Back />
          </div>
          <div className="col-md-5 text-center">
            <h3 className="text-medium text-deep-blue ">Deposit Funds into Wallet</h3>
          </div>
        </div>
        <Card classes="mt-4 col col-md-9 card">
          <form>
            <div className="row">
              <div className="col-md-6">
                <h3 className="default-black text-medium mt-3">How much do you want to deposit into your wallet?</h3>
              </div>
              <div className="col-md-6">
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
                &#x20A6; {walletDetails && walletDetails.wallet.NGN ? walletDetails.wallet.NGN : '0.00'}
                </span>
              </p>
            }
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-md-6">
                <h3 className="default-black text-medium mt-3">Choose a payment method</h3>
              </div>
              <div className="col-md-6">
                <div>
                  {paymentMethods.map(method => (
                    <PaymentMethod
                      onSelect={this.handleSelectMethod}
                      selected={selectedMethod === method.value ? true : false}
                      imgUrl={method.imgUrl}
                      imgBlue={method.imgBlue}
                      key={Math.random() * 1000}
                      value={method.value}
                      label={method.label}
                    />
                  ))}
                </div>
                {error && <p className="text-error text-left">{error}</p>}
                {selectionError && <p className="text-error text-left">{selectionError}</p>}
                <div className="text-right mt-3">
                  <button className="btn btn-sm btn-primary btn-md-block" onClick={this.handleSubmit}>
                    Proceed
                    {loading &&
                      <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                    }
                </button>
                </div>
              </div>
            </div>
          </form>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { app: { wallet: { cards, error, walletDetails }, profile: { userProfile: { data } } } } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.DEPOSIT_REQUEST),
    cards,
    error,
    walletDetails,
    isBvnActive: data && data.bvn ? true : false,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    displayTransferModal: () => dispatch(displayTransferModal()),
    getCards: () => dispatch(getCards()),
    depositFunds: (payload) => dispatch(depositFunds(payload))
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Deposit));
