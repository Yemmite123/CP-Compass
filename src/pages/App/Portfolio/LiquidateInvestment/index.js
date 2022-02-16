import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from 'moment';
import { getActionLoadingState } from "#/store/selectors";
import { liquidateInvestment, getLiquidationDetails } from '#/store/investment/actions';
import { fetchSingleInvestment } from '#/store/portfolio/actions';
import actionTypes from '#/store/investment/actionTypes';
import { confirmPin } from '#/store/security/actions'
import securityActionTypes from '#/store/security/actionTypes';
import Back from '#/components/Back';
import Card from '#/components/Card';
import Textbox from '#/components/Textbox';
import Modal from '#/components/Modal';
import PinInput from '#/components/PinInput';
import OffCanvas from "#/components/OffCanvas";
import {
  formatCurrency, serializeErrors, validateFields,
  formatStringToCurrency, formatCurrencyToString, openOffCanvas, closeOffCanvas
} from '#/utils'
import './style.scss';

class LiquidateInvestment extends React.Component {

  state = {
    title: '',
    textInputReason: '',
    reason: '',
    textInputAmount: '',
    amount: '',
    errors: null,
    showPinModal: false,
    confirmationModal: false,
    pinError: null,
    pin: {},
    amountToGet: '',
    interestToGet: '',
    investmentBalance: '',
    liquidationAmount: '',
    penalty: '',
  }

  componentDidMount() {
    const { params } = this.props.match;
    if (!Number.isInteger(parseInt(params.investmentId, 10))) {
      return this.props.history.push({
        pathname: `/app/portfolio/`,
        state: { routeName: 'Portfolio' },
      })
    }
    this.props.fetchSingleInvestment(params.investmentId);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'amount') {
      if (isNaN(this.state[name])) {
        return;
      }

      this.setState({ errors: null });
      return this.setState({ [name]: formatCurrencyToString(value) }, () => {
        this.setState({ textInputAmount: formatCurrencyToString(value) });
      });
    }
    this.setState({ [name]: value });
    this.setState({ textInputReason: value });
  }
  resetFields = () => {
    this.setState({ textInputAmount: "" });
    this.setState({ textInputReason: "" });

  };

  handlePin = (pin) => {
    this.setState({ pin })
  }

  //liquidate confirmation 
  handleLiquidate = (e) => {
    e.preventDefault();
    const { amount } = this.state
    const { investment } = this.props;

    if (!Math.floor(Number(this.state.amount)) || Number(this.state.amount) < 0) {
      return this.setState({ errors: { amount: "enter a valid amount" } });
    }


    const required = investment?.order_status === 'booked' ? [] : ['amount'];
    const errors = validateFields({ amount }, required)
    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    if (amount > this.props.investment?.balance) {
      return this.setState({ errors: { amount: 'Amount greater than investment balance' } });
    }
    if (investment?.order_status === 'booked') {
      return this.setState({ amount: '0' }, () => this.handleLiquidationDetails());
    }
    this.setState({ errors: null })
    this.resetFields();
    closeOffCanvas("liquidate-offcanvas");
    return this.handleLiquidationDetails();
  }

  handleLiquidationDetails = () => {
    const { amount } = this.state

    this.props.getLiquidationDetails({
      amount,
      balance: this.props.investment?.balance,
      targetAmount: this.props.investment?.targetAmount,
      accruedInterest: this.props.investment?.accruedInterest,
      interestRate: this.props.investment?.endDate ? this.props.predefinedLiquidationPenalty?.current : 0,
      type: this.props.investment?.endDate ? 'predefined' : 'collection',
      endDate: this.props.investment?.endDate && moment(this.props.investment?.endDate).format('YYYY-MM-DD')
    }).then(data => {
      this.setState({
        amountToGet: data.amountToGet,
        interestToGet: data.interestToGet,
        investmentBalance: data.investmentBalance,
        liquidationAmount: data.liquidationAmount,
        penalty: data.penalty,
      })
      return this.toggleConfirmationModal()
    })
  }

  handleEnterPin = () => {
    this.toggleConfirmationModal()
    this.toggleTransactionPinModal();
  }

  //submit transaction pin for verification
  handleTransactionVerification = (e) => {
    e.preventDefault()
    const { pin, reason, amount } = this.state
    const { params } = this.props.match;
    const { confirmPin, liquidateInvestment } = this.props
    this.setState({ pinError: null })

    const initialPin = [pin.value1, pin.value2, pin.value3, pin.value4].join('');
    if (initialPin.length < 4) {
      return this.setState({ pinError: 'field is required' })
    }
    confirmPin({ pin: initialPin })
      .then(data => {
        liquidateInvestment(params.investmentId, { message: reason, amount: formatCurrencyToString(amount) })
          .then(response => {
            this.toggleTransactionPinModal()
            this.setState({ amount: '', reason: '' })
          })
      })
  }

  toggleConfirmationModal = () => {
    this.setState(prevState => ({ confirmationModal: !prevState.confirmationModal }))
  }

  toggleTransactionPinModal = () => {
    this.setState(prevState => ({ showPinModal: !prevState.showPinModal }))
  }

  render() {
    const { textInputReason, reason, errors, textInputAmount, amount, showPinModal, pinError, confirmationModal } = this.state;
    const { error, pinLoading, confirmPinError, loading, predefinedLiquidationPenalty, investment, detailsLoading } = this.props;
    const errorObject = serializeErrors(error);
    return (
      <div className="liquidate-investment-page">
        {confirmationModal &&
          <Modal onClose={this.toggleConfirmationModal}>
            <div className="text-right pb-3">
              <img src={require('#/assets/icons/close.svg')} alt="close" onClick={this.toggleConfirmationModal} />
            </div>
            <div className="text-center confirmation-modal">
              <div className="px-5 mb-4">
                <h3 className="text-blue font-bolder info mb-3">Liquidation Information</h3>
                <div className="px-4">
                  <p className="text-small">By liquidating your investment, you confirm to the following terms:
                    You would bear <b> a penalty of {investment.endDate ? predefinedLiquidationPenalty?.current : 0}% on your interest earned </b>on the investment.
                    Interest accruing on the portion of the investment you are liquidating would stop.
                  </p>
                </div>
              </div>
              <div>
                <div className="liquidation-table">
                  <div className="liquidation-header">
                    <h3 className="text-white text-medium mb-0">Liquidation Details</h3>
                  </div>
                  <div className="liquidation-body">
                    <div className="row">
                      <div className="col-md-6 text-left">
                        <p className="mb-0 text-small">Liquidation Amount</p>
                      </div>
                      <div className="col-md-6 text-right">
                        <p className="mb-0 text-small">&#x20A6;{formatCurrency(amount)}</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 text-left">
                        <p className="mb-0 text-small">Penalty</p>
                      </div>
                      <div className="col-md-6 text-right">
                        <p className="mb-0 text-small">
                          &#x20A6;{investment.endDate ? this.state.penalty : '0.00'}
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 text-left">
                        <p className="mb-0 text-small">Interest to get</p>
                      </div>
                      <div className="col-md-6 text-right">
                        <p className="mb-0 text-small">
                          &#x20A6;{formatCurrency(this.state.interestToGet)}
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 text-left">
                        <p className="mb-0 text-small">Investment Balance</p>
                      </div>
                      <div className="col-md-6 text-right">
                        <p className="mb-0 text-small">
                          &#x20A6;{formatCurrency(this.state.investmentBalance)}
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 text-left">
                        <p className="mb-0 text-small">Amount you will get</p>
                      </div>
                      <div className="col-md-6 text-right">
                        <p className="mb-0 text-small">
                          &#x20A6;{formatCurrency(this.state.amountToGet)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-center mt-4">
                  <button className="btn py-3 btn-primary" onClick={this.handleEnterPin}>
                    Yes, liquidate
                  </button>
                  <p className="text-blue mt-3 mb-0 cursor-pointer" onClick={this.toggleConfirmationModal}>No, go back</p>
                </div>
              </div>
            </div>
          </Modal>
        }
        {showPinModal &&
          <Modal classes="transaction-modal" onClose={this.toggleTransactionPinModal}>
            <div className="text-right pb-3">
              <img src={require('#/assets/icons/close.svg')} alt="close" onClick={this.toggleTransactionPinModal} />
            </div>
            <div className="px-5">
              <div className="d-flex justify-content-center">
                <img src={require('#/assets/icons/bank-transfer.svg')} alt="bank" className="pb-3" />
              </div>
              <div className="text-center">
                <div className='mb-3'>
                  <h5 className="text-blue font-bolder">Enter Transaction PIN</h5>
                </div>
                <div className="w-100 ml-auto mr-auto">
                  <PinInput onChange={this.handlePin} error={pinError} />
                </div>
                <div className="px-3 mt-4">
                  <button className="btn py-3 btn-primary btn-block mt-3" onClick={this.handleTransactionVerification} disabled={pinLoading}>
                    Confirm Setup
                    {pinLoading &&
                      <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                    }
                  </button>
                  <p className="text-blue mt-3" onClick={this.toggleTransactionPinModal}>Cancel Setup</p>

                  {pinError && <p className="text-error mt-2">{pinError}</p>}
                  {confirmPinError && <p className="text-error mt-2">{confirmPinError}</p>}
                </div>
              </div>
            </div>
          </Modal>
        }
        <OffCanvas title="" position="end" id="liquidate-offcanvas" onClose={this.resetFields}>
          <div className="px-3 h-100 d-flex flex-column flex-grow-1">
            <div className="mt-3 mb-2">
              <h3 className="font-bolder text-blue">Liquidate Goal</h3>

            </div>

            <div className="mt-5">
              <p>How much do you want to liquidate?</p>
              <Textbox
                onChange={this.handleChange}
                type="text"
                label="Amount"
                placeholder="Amount"
                name="amount"
                value={formatStringToCurrency(textInputAmount)}
                error={
                  errors ? errors.amount : errorObject && errorObject["amount"]
                }
              />
            </div>
            <div className="mt-5 d-flex flex-column flex-grow-1">
              <div className="d-flex pb-2 flex-column flex-grow-1 justify-content-between">
                <div className="w-100">
                  <p>State reason for this liquidation</p>
                  <div className="">
                    <textarea
                      onChange={this.handleChange}
                      rows={5}
                      name="reason"
                      value={textInputReason}
                      className="w-100 border-faint border-radius-default"
                    />
                  </div>
                </div>
                <div className="w-100">
                  <button className="btn w-100 btn-sm btn-primary btn-md-block" onClick={this.handleLiquidate} >
                    Proceed
                    {detailsLoading &&
                      <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                    }
                  </button>
                  {error && typeof error === 'string' && <p className="text-error mt-2">{error}</p>}
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
      security: { error: confirmPinError },
      portfolio: { investment },
      investment: { error },
      config: { data }
    }
  } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.LIQUIDATE_INVESTMENT_REQUEST),
    detailsLoading: getActionLoadingState(state, actionTypes.GET_LIQUIDATION_DETAILS_REQUEST),
    pinLoading: getActionLoadingState(state, securityActionTypes.CONFIRM_PIN_REQUEST),
    confirmPinError,
    error,
    investmentConfig: data?.investmentConfig,
    predefinedLiquidationPenalty: data?.investmentConfig[2],
    investment,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSingleInvestment: (id) => dispatch(fetchSingleInvestment(id)),
    liquidateInvestment: (id, payload) => dispatch(liquidateInvestment(id, payload)),
    confirmPin: (payload) => dispatch(confirmPin(payload)),
    getLiquidationDetails: (payload) => dispatch(getLiquidationDetails(payload)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LiquidateInvestment));
