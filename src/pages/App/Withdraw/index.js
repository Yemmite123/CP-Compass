import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Back from '#/components/Back';
import Card from '#/components/Card';
import Textbox from '#/components/Textbox';
import Modal from '#/components/Modal';
import PinInput from '#/components/PinInput';
import Alert from '#/components/Alert';
import { getActionLoadingState } from "#/store/selectors";
import { getAllBanks } from "#/store/profile/actions";
import { initializeWithdraw, confirmWithdraw } from "#/store/wallet/actions";
import actionTypes from "#/store/wallet/actionTypes";
import { validateFields, serializeErrors, formatCurrency, formatStringToCurrency, formatCurrencyToString } from '#/utils';
import './style.scss';

class Withdraw extends React.Component {

  state = {
    amount: '',
    pin: {},
    errors: null,
    showModal: false,
    showComfirmationModal: false,
    pinError: null
  }

  componentDidMount() {
    this.props.getAllBanks();
  }


  handleChange = (event) => {
    const { name, value } = event.target
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ errors: null });

    const data = this.state;
    const required = ['amount'];
    const errors = validateFields(data, required)

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    this.toggleConfirmationModal();
  }

  handleConfirmWithdraw = () => {
    this.props.initializeWithdraw({ amount: formatCurrencyToString(this.state.amount), currency: 'NGN'})
      .then(data => {
      this.toggleConfirmationModal();
      this.toggleModal();
      })
  }

  handleWithdraw = (e) => {
    e.preventDefault();
    this.setState({ pinError: null });
    const { pin: { value1, value2, value3, value4 } } = this.state

    const token = [value1, value2, value3, value4].join('').trim();
    if (token.length < 4) {
      return this.setState({ pinError: 'enter a valid pin' })
    }

    this.props.confirmWithdraw({ pin: token }, this.props.history)
  }

  handlePin = (pin) => {
    this.setState({ pin })
  }

  toggleModal = () => {
    this.setState(prevState => ({ showModal: !prevState.showModal }))
  }

  toggleConfirmationModal = () => {
    this.setState(prevState => ({ showComfirmationModal: !prevState.showComfirmationModal }))
  }

  render() {
    const { amount, errors, showModal, pinError, showComfirmationModal } = this.state;
    const { error, bankDetails, banks, loading, confirmLoading, confirm, walletDetails, withdrawalFee } = this.props;
    const bank = bankDetails && banks && banks.find(bank => bank.code === bankDetails.bankCode);

    const errorObject = serializeErrors(error);
    return (
      <div className="withdraw-page">
        {showComfirmationModal &&
          <Modal onClose={this.toggleConfirmationModal}>
            <div className="text-left">
              <h3 className="text-deep-blue text-medium">Review Withdrawal</h3>
              <p className="text-small text-grey">
                Your withdrawal of <b className="text-black">&#x20A6;{amount}</b>, is subject to a <b className="text-black">&#x20A6;{formatCurrency(((withdrawalFee && withdrawalFee[1].current)))}</b> withdrawal charge. So, you will receive <b className="text-black">₦{formatCurrency(amount - (withdrawalFee && withdrawalFee[1].current))}</b> into your account.
              </p>
            </div>
            <div className="d-flex justify-content-end align-items-center">
              <p className="text-deep-blue text-medium mr-2 mb-0 cursor-pointer" onClick={this.toggleConfirmationModal}>Cancel</p>
              <button className="btn btn-primary btn-sm" onClick={this.handleConfirmWithdraw}>
                Proceed
                {loading &&
                  <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                }
              </button>
            </div>
            {error && typeof error === 'string' && <p className="text-error text-left">{error}</p>}
          </Modal>
        }
        {showModal &&
          <Modal onClose={this.toggleModal}>
            <div className="text-center">
              <h3>Enter Transaction PIN</h3>
              <p className="mb-0 text-grey">confirm your withdrawal of</p>
              <p><b>N{formatCurrency(amount)}</b></p>
              <div className="w-100 ml-auto mr-auto">
                <PinInput onChange={this.handlePin} error={pinError} />
              </div>
              <button className="btn btn-sm btn-primary btn-block mt-3" onClick={this.handleWithdraw}>
                Confirm Withdrawal
                {confirmLoading &&
                  <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                }
              </button>
              <p className="text-deep-blue mt-2" onClick={this.toggleModal}>Cancel Withdrawal</p>
              {confirm && <Alert alert={{ type: "success", message: confirm.message }} />}
              {pinError && <p className="text-error mt-2">{pinError}</p>}
              {error && typeof error === 'string' && <p className="text-error text-left">{error}</p>}
            </div>
          </Modal>
        }
        <div className="row">
          <div className="col-md-2">
            <Back />
          </div>
          <div className="col-md-5 text-center">
            <h3 className="text-medium text-deep-blue ">Withdraw Funds from Wallet</h3>
          </div>
        </div>
        <Card classes="mt-4 col col-md-9 card">
          <form>
            <div className="row">
              <div className="col-md-6">
                <p className="text-black text-medium mt-3">How much do you want to withdraw from your wallet?</p>
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
                <div className="text-right">
                  <p className="text-small">Available balance <span className="text-deep-blue">&#x20A6; {walletDetails && walletDetails.wallet.NGN ? walletDetails.wallet.NGN : 0}</span></p>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6">
                <p className="text-black text-medium mt-3">Withdrawing funds to your local bank account</p>
              </div>
              <div className="col-md-6">
                <div className="mt-3">
                  <div className="d-flex justify-content-between flex-wrap">
                    <p>Account number</p>
                    <p className="text-deep-blue">{bankDetails && bankDetails.accountNumber ? bankDetails.accountNumber : 'No account number added'}</p>
                  </div>
                  <div className="d-flex justify-content-between flex-wrap">
                    <p>Bank</p>
                    <p className="text-deep-blue">{bank && bank.name ? bank.name : 'No bank specified'}</p>
                  </div>
                </div>
                <div className="text-right mt-3">
                  <button className="btn btn-sm btn-primary btn-md-block" onClick={this.handleSubmit}>
                    Proceed
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

const mapStateToProps = (state) => {
  const { 
    app: { 
      profile: { userProfile: { data }, banks }, 
      wallet: { error, data: withdrawData, confirm, walletDetails },
      config
    } 
  } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.INITIALIZE_WITHDRAWAL_REQUEST),
    confirmLoading: getActionLoadingState(state, actionTypes.CONFIRM_WITHDRAWAL_REQUEST),
    bankDetails: data?.bankInfo,
    banks: banks.banks?.data && banks.banks.data.banks,
    error,
    withdrawData,
    confirm,
    walletDetails,
    withdrawalFee: config?.data?.systemConfig,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllBanks: () => dispatch(getAllBanks()),
    initializeWithdraw: (payload) => dispatch(initializeWithdraw(payload)),
    confirmWithdraw: (payload, history) => dispatch(confirmWithdraw(payload, history)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Withdraw));
