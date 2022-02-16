import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { getActionLoadingState } from "#/store/selectors";
import { calculateInvestment } from '#/store/investment/actions'
import investmentActionTypes from '#/store/investment/actionTypes';
import SelectBox from '#/components/SelectBox';
import Textbox from '#/components/Textbox';
import DateBox from '#/components/DateBox';
import Modal from '#/components/Modal';
import {
  validateFields, investmentFrequency, formatCurrency, verifyFrequencyPeriod, convertDate, serializeErrors, formatCurrencyToString,
  formatStringToCurrency
} from '#/utils';
import './style.scss';

class Calculator extends React.Component {
  state = {
    target: '',
    targetDate: new Date(),
    frequency: '',
    startDate: new Date(),
    errors: null,
    estimationModal: false,
    entryError: null,
    installment: '',
    expectedTotalReturns: '',
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'target') {
      if (isNaN(this.state[name])) {
        return;
      }
      this.setState({ errors: null });
      return this.setState({ [name]: formatCurrencyToString(value) }, () => {

      });
    }

    this.setState({ [name]: value });
  }

  handleChangeDate = (item, date) => {
    this.setState({ [item]: date });
  }

  toggleEstimationModal = () => {
    this.setState(prevState => ({ estimationModal: !prevState.estimationModal }))
  }

  submit = (e) => {
    e.preventDefault();
    this.setState({ errors: null, entryError: null });

    if (!Math.floor(Number(this.state.target)) || Number(this.state.target) < 0) {
      return this.setState({ errors: { target: 'enter a valid amount' } })
    }

    const data = this.state;
    const required = ['target', 'targetDate', 'frequency', 'startDate'];
    const errors = validateFields(data, required)

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    const info = {
      startDate: moment(this.state.startDate).format('YYYY-MM-DD'),
      endDate: moment(this.state.targetDate).format('YYYY-MM-DD'),
      frequency: this.state.frequency.toLowerCase(),
      targetAmount: formatCurrencyToString(this.state.target),
    }
    const entryError = verifyFrequencyPeriod(info)
    if (entryError) {
      return this.setState({ entryError });
    }
    this.props.calculateInvestment(info)
      .then(data => {
        this.setState({ installment: data.installment, expectedTotalReturns: data.expectedTotalReturns }, () => {
          this.toggleEstimationModal()
        })
      })
  }

  handleStartInvesting = () => {
    this.props.history.push({
      pathname: '/app/marketplace/',
      state: { routeName: 'Marketplace' },
    })
  }

  render() {
    const { errors, target, targetDate, startDate, estimationModal, frequency, entryError, installment, expectedTotalReturns } = this.state;
    const { interestRate, loading, error } = this.props;
    const errorObject = serializeErrors(error);


    return (
      <div className="investment-calculator-page">
        {estimationModal &&
          <Modal onClose={this.toggleEstimationModal}>
            <div className="text-right pb-3">
              <img className="cursor-pointer" src={require('#/assets/icons/close.svg')} alt="close" onClick={this.toggleEstimationModal} />
            </div>
            <div className="px-5">
              <div className="d-flex justify-content-center">
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="26" cy="26" r="26" fill="#EEF0FF" />
                  </svg>

                  <path d="M24.588 21.8154C25.0484 22.2758 25.6605 22.5293 26.3116 22.5293C26.9627 22.5293 27.5748 22.2758 28.0352 21.8154L28.5655 21.285C29.0259 20.8247 29.2795 20.2125 29.2795 19.5615C29.2795 18.9104 29.0259 18.2983 28.5655 17.8379L28.0352 17.3077C27.5748 16.8473 26.9627 16.5938 26.3116 16.5938C25.6605 16.5938 25.0484 16.8473 24.588 17.3077L24.0577 17.838C23.5973 18.2984 23.3438 18.9105 23.3438 19.5616C23.3438 20.2127 23.5973 20.8248 24.0577 21.2851L24.588 21.8154ZM25.3835 19.1638L25.9138 18.6335C26.0201 18.5273 26.1613 18.4687 26.3115 18.4687C26.4618 18.4687 26.6031 18.5272 26.7093 18.6335L27.2396 19.1638C27.3458 19.2701 27.4043 19.4113 27.4043 19.5615C27.4043 19.7118 27.3458 19.8531 27.2396 19.9593L26.7093 20.4896C26.603 20.5958 26.4618 20.6544 26.3115 20.6544C26.1613 20.6544 26.02 20.5959 25.9138 20.4896L25.3835 19.9593C25.2772 19.853 25.2187 19.7118 25.2187 19.5615C25.2187 19.4113 25.2773 19.27 25.3835 19.1638V19.1638Z" fill="#3A4080" />
                  <path d="M26.3115 26.125C29.9301 26.125 32.874 23.1811 32.874 19.5625C32.874 15.9439 29.9301 13 26.3115 13C22.693 13 19.749 15.9439 19.749 19.5625C19.749 23.1811 22.693 26.125 26.3115 26.125ZM26.3115 14.875C28.8962 14.875 30.999 16.9778 30.999 19.5625C30.999 22.1472 28.8962 24.25 26.3115 24.25C23.7268 24.25 21.624 22.1472 21.624 19.5625C21.624 16.9778 23.7268 14.875 26.3115 14.875Z" fill="#3A4080" />
                  <path d="M17.1984 30.8674L18.7343 31.9428C19.2242 32.2859 19.7864 32.4506 20.3435 32.4506C20.9246 32.4506 21.4995 32.2701 21.9809 31.9272L25.3739 34.303V35.1258H24.4364C23.9186 35.1258 23.4989 35.5456 23.4989 36.0633C23.4989 36.5811 23.9186 37.0008 24.4364 37.0008H28.1864C28.7042 37.0008 29.1239 36.5811 29.1239 36.0633C29.1239 35.5456 28.7042 35.1258 28.1864 35.1258H27.2489V28.5634C27.2489 28.0456 26.8292 27.6259 26.3114 27.6259C25.7936 27.6259 25.3739 28.0456 25.3739 28.5634V32.014L23.057 30.3917C23.3658 29.2759 22.9618 28.0361 21.9607 27.3351L20.4247 26.2596C19.1544 25.3701 17.3972 25.68 16.5077 26.9503C15.6182 28.2207 15.928 29.9779 17.1984 30.8674V30.8674ZM18.0436 28.0258C18.3408 27.6014 18.9267 27.4997 19.3492 27.7955L20.8852 28.871C21.3086 29.1675 21.4119 29.7532 21.1154 30.1767C21.1154 30.1767 21.1154 30.1767 21.1154 30.1768C20.8188 30.6002 20.2332 30.7034 19.8097 30.4069L18.2738 29.3314C17.8504 29.035 17.7471 28.4492 18.0436 28.0258V28.0258Z" fill="#3A4080" />
                  <path d="M30.6624 27.3332C29.6613 28.0342 29.2572 29.2739 29.5661 30.3897L28.9614 30.8131C28.5372 31.1101 28.4342 31.6946 28.7312 32.1188C29.0281 32.5428 29.6126 32.646 30.0368 32.349L30.6421 31.9252C31.5894 32.6001 32.89 32.6402 33.8887 31.9409L35.4246 30.8654C36.6949 29.9759 37.0047 28.2187 36.1152 26.9484C35.2257 25.678 33.4686 25.3682 32.1982 26.2577L30.6624 27.3332ZM34.5794 28.0239C34.8759 28.4473 34.7726 29.033 34.3491 29.3295L32.8132 30.405C32.3899 30.7015 31.8041 30.5982 31.5076 30.1749C31.5076 30.1748 31.5076 30.1748 31.5076 30.1748C31.211 29.7513 31.3144 29.1656 31.7378 28.8691L33.2737 27.7936C33.6971 27.4971 34.2829 27.6004 34.5794 28.0239V28.0239Z" fill="#3A4080" />
                </svg>


              </div>
              <div className="text-center mt-4">
                <h5 className="text-blue font-bolder">Estimated Returns</h5>
                <p className="text-small">
                  With an interest rate of <b>{interestRate && interestRate[1].current}%</b>, you would have to deposit <b> N{formatCurrency(installment)} {frequency}</b> to meet your target of
                  <b> N{formatCurrency(target)}</b> by <b>{convertDate(targetDate)}</b>. Your estimated return from this investment will be <b>₦{formatCurrency(expectedTotalReturns)}</b>
                </p>
              </div>
              <div className="d-flex flex-column align-items-center">
                <button className="btn btn-primary py-3 w-100 mt-4" onClick={this.handleStartInvesting}>
                  Start Investing
                  {loading &&
                    <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                  }
                </button>
              </div>
            </div>
          </Modal>
        }
        <h3 className="text-medium font-weight-bold text-center mt-5">CHECK YOUR ESTIMATED RETURNS</h3>
        <div className='row mt-4'>
          <div className="col-lg-6">

            <div className="card p-4 text-left">
              <div className="">
                <p className="text-black  mt-3 mb-0">Start Date</p>
                <div className="">
                  <DateBox
                    onChange={date => this.handleChangeDate('startDate', date)}
                    label="Choose Date"
                    placeholder="Set start date"
                    name="startDate"
                    value={startDate}
                    error={errors ? errors.startDate : (errorObject && errorObject['startDate'])}
                    min={new Date()}
                  />
                </div>
              </div>
              <div className="">
                <p className="text-black  mt-3 mb-0">End Date</p>
                <div className="">
                  <DateBox
                    onChange={date => this.handleChangeDate('targetDate', date)}
                    label="Choose Date"
                    placeholder="Set target date"
                    name="targetDate"
                    value={targetDate}
                    formatMonth={(locale, date) => moment(date).format("MMMM")}
                    error={errors ? errors.targetDate : (errorObject && errorObject['endDate'])}
                    min={new Date()}
                  />
                </div>
              </div>
              <div className="">
                <p className="text-black  mt-3 mb-0">Target Amount</p>
                <div className="">
                  <Textbox
                    onChange={this.handleChange}
                    type="text"
                    label="Enter Amount"
                    placeholder="&#x20A6;"
                    name="target"
                    value={formatStringToCurrency(target)}
                    error={errors ? errors.target : (errorObject && errorObject['targetAmount'])}
                  />
                </div>
              </div>

              <div className="">
                <p className="text-black  mt-3 mb-0">Frequency of Payment</p>
                <div className="">
                  <SelectBox
                    onChange={this.handleChange}
                    label="Choose a Frequency"
                    placeholder="Set frequency"
                    name="frequency"
                    boxClasses="active"
                    options={investmentFrequency}
                    value={frequency}
                    optionName="name"
                    error={errors ? errors.frequency : (errorObject && errorObject['frequency'])}
                  />
                  {entryError && <p className="text-error text-left mt-2 mr-3">{entryError}</p>}
                </div>
              </div>

              <div className="">
                <div className="">
                  <button className="btn py-3 mt-3 btn-block btn-primary" onClick={this.submit}>
                    Calculate your returns
                    {loading &&
                      <div className="spinner-border text-white spinner-border-sm ml-2"></div>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 align-self-center text-center">
            <div className=''>
              <svg className='mb-5' width="100" height="76" viewBox="0 0 100 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M54.1667 49.3542C54.1667 27.9333 70.3833 5.525 95.8333 0.5L99.9333 9.35833C90.7042 12.8375 82.5875 24.95 81.6833 33.3C92.0625 34.9333 100 43.9125 100 54.7542C100 68.0125 89.2333 75.5 78.3375 75.5C65.775 75.5 54.1667 65.8958 54.1667 49.3542ZM0 49.3542C0 27.9333 16.2167 5.525 41.6667 0.5L45.7667 9.35833C36.5375 12.8375 28.4208 24.95 27.5167 33.3C37.8958 34.9333 45.8333 43.9125 45.8333 54.7542C45.8333 68.0125 35.0667 75.5 24.1708 75.5C11.6083 75.5 0 65.8958 0 49.3542Z" fill="#EBEBEB" />
              </svg>
              <p className='text-center'>
                It's not how much money you make, but how much money you keep,
                how hard it works for you, and how many generations you keep it for.
              </p>
              <p className='text-center text-blue'>
                — Robert Kiyosaki
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    app: {
      config,
      investment: { data, error },
    }
  } = state;

  return {
    loading: getActionLoadingState(state, investmentActionTypes.CALCULATE_INVESTMENT_REQUEST),
    interestRate: config?.data?.investmentConfig,
    data,
    error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    calculateInvestment: (payload) => dispatch(calculateInvestment(payload)),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Calculator));
