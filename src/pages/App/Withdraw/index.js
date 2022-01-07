import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Back from '#/components/Back';
import Card from '#/components/Card';
import Textbox from '#/components/Textbox';
import OffCanvas from "#/components/OffCanvas";
import Modal from '#/components/Modal';
import PinInput from '#/components/PinInput';
import Alert from '#/components/Alert';
import { getActionLoadingState } from "#/store/selectors";
import { getAllBanks } from "#/store/profile/actions";
import { initializeWithdraw, confirmWithdraw } from "#/store/wallet/actions";
import actionTypes from "#/store/wallet/actionTypes";
import { closeOffCanvas } from "#/utils";
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
    
    closeOffCanvas("withdraw-offcanvas");
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
            <div className="text-right pb-3">
                <img src={require('#/assets/icons/close.svg')} alt="close" onClick={this.toggleConfirmationModal}/>
            </div>
            <div className="px-5">
              <div className="d-flex justify-content-center">
                <img src={require('#/assets/icons/bank-transfer.svg')} alt="bank" className="pb-3"/>
              </div>
              <div className="text-center">
                <h5 className="text-blue font-bolder">Review Withdrawal</h5>
                <p className="text-small text-grey">
                  From your withdrawal of <b className="text-black">&#x20A6;{amount}</b>, we will deduct a service charge of <b className="text-black">1%</b>. So, you will receive <b className="text-black">₦{formatCurrency(amount - (withdrawalFee && withdrawalFee[1].current))}</b> into your account.
                </p>
              </div>
              <div className="d-flex flex-column align-items-center">
                <button className="btn btn-primary py-3 w-100 mt-4" onClick={this.handleConfirmWithdraw}>
                  Proceed
                  {loading &&
                    <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                  }
                </button>
                <p className="text-blue mt-3 mb-0 cursor-pointer" onClick={this.toggleConfirmationModal}>Cancel Withdrawal</p>
              </div>
              {error && typeof error === 'string' && <p className="text-error text-center">{error}</p>}
            </div>
          </Modal>
        }
        { showModal && /* TODO: change icon */
          <Modal onClose={this.toggleModal}>
            <div className="text-right pb-3">
                <img src={require('#/assets/icons/close.svg')} alt="close" onClick={this.toggleConfirmationModal}/>
            </div>
            <div className="px-5">
              <div className="d-flex justify-content-center">
                <img src={require('#/assets/icons/bank-transfer.svg')} alt="bank" className="pb-3"/>
              </div>
              <div className="text-center">
                <div className='mb-3'>
                  <h5 class="text-blue font-bolder">Enter Transaction PIN</h5>
                  <p className="mb-0 text-grey">Confirm your withdrawal of
                  <b> ₦{formatCurrency(amount)}</b></p>
                </div>
                <div className="w-100 ml-auto mr-auto">
                  <PinInput onChange={this.handlePin} error={pinError} />
                </div>
                <div className="px-3 mt-4">
                <button className="btn py-3 btn-primary btn-block mt-3" onClick={this.handleWithdraw}>
                  Confirm Withdrawal
                  {confirmLoading &&
                    <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                  }
                </button>
                <p className="text-blue mt-3" onClick={this.toggleModal}>Cancel Withdrawal</p>
                {confirm && <Alert alert={{ type: "success", message: confirm.message }} />}
                {pinError && <p className="text-error mt-2">{pinError}</p>}
                {error && typeof error === 'string' && <p className="text-error text-center">{error}</p>}
                </div>
              </div>
            </div>
          </Modal>
        }


        <OffCanvas title="" position="end" id="withdraw-offcanvas">
          <div className="px-3 h-100 d-flex flex-column flex-grow-1">
            <div className="mt-3 mb-2">
              <h3 className="font-bolder text-blue">Withdraw Funds</h3>
              <p>Available Flex balance is: ₦{walletDetails && walletDetails.wallet.NGN ? walletDetails.wallet.NGN : 0}</p>
            </div>

            <div className="mt-5">
              <p>How much do you want to withdraw?</p>
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
                <div className="w-100 funds-card p-2">
                  <div className="d-flex">
                    <div className="d-flex mr-3 justify-content-center">
                      <img src={require('#/assets/icons/badge.svg')} alt="bank" className="pb-3"/>
                    </div>
                    <div> 
                      <p>
                        Your funds will be sent to your {bank && bank.name ? bank.name : 'No bank specified'}
                       </p>
                       <p className="mt-0">({bankDetails && bankDetails.accountNumber ? bankDetails.accountNumber : 'No account number added'}) 
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-100">
                  <button className="btn w-100 btn-sm btn-primary btn-md-block" onClick={this.handleSubmit}>
                    Proceed with withdrawal
                  </button>
                </div>
              </div>
            </div>
          </div>          
        </OffCanvas>
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
