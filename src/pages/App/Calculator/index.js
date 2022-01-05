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
import { validateFields, investmentFrequency, formatCurrency, verifyFrequencyPeriod, convertDate, serializeErrors,   formatCurrencyToString,
  formatStringToCurrency } from '#/utils';
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
    if(name === 'target') {
      this.setState({ errors: null});
        return this.setState({ [name]: formatCurrencyToString(value)}, ()=> {
          if(isNaN(this.state[name])) {
            return this.setState({ errors: { [name]: 'enter a valid number' } })
          }
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

    const data = this.state;
    const required = [ 'target', 'targetDate', 'frequency', 'startDate' ];
    const errors = validateFields(data, required)

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }
    const info = { 
      startDate: moment(this.state.startDate).format('YYYY-MM-DD'),
      endDate: moment(this.state.targetDate).format('YYYY-MM-DD'),
      frequency: this.state.frequency,
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
          <div className="text-center">
            <h3 className="text-deep-blue">Estimated Returns</h3>
            <p>With an interest rate of <b>{interestRate && interestRate[1].current}%</b>, you would have to deposit <b> N{formatCurrency(installment)} {frequency}</b> to meet your target of 
             <b> N{formatCurrency(target)}</b> by <b>{convertDate(targetDate)}</b>. Your estimated return from this investment will be <b>₦{formatCurrency(expectedTotalReturns)}</b>
            </p>
            <div className="d-flex justify-content-center align-items-center">
              <button className="btn btn-sm btn-primary" onClick={this.handleStartInvesting}>
                Start Investing
              </button>
            </div>
          </div>
        </Modal>
        }
        <div className="col-md-9 text-center">
          <h3 className="text-medium text-deep-blue">Check your estimated returns</h3>

          <div className="card p-4">
            <div className="row mt-4 align-items-center">
              <div className="col-md-4 text-left">
                <p className="text-black text-medium mt-3">Start Date</p>
              </div>
              <div className="col-md-8">
                <DateBox
                  onChange={date => this.handleChangeDate('startDate', date)}
                  label="Start Date"
                  placeholder="Set start date"
                  name="startDate"
                  value={startDate}
                  error={errors ? errors.startDate : (errorObject && errorObject['startDate'])}
                  min={new Date()}
                />
              </div>
            </div>
            <div className="row mt-4 align-items-center">
              <div className="col-md-4 text-left">
                <p className="text-black text-medium mt-3">End Date</p>
              </div>
              <div className="col-md-8">
              <DateBox
                onChange={date => this.handleChangeDate('targetDate', date)}
                label="End Date"
                placeholder="Set target date"
                name="targetDate"
                value={targetDate}
                error={errors ? errors.targetDate : (errorObject && errorObject['endDate'])}
                min={new Date()}
                />
              </div>
            </div>
            <div className="row mt-4 align-items-center">
              <div className="col-md-4 text-left">
                <p className="text-black text-medium mt-3">Target Amount</p>
              </div>
              <div className="col-md-8">
                <Textbox
                  onChange={this.handleChange}
                  type="text"
                  label="Target amount"
                  placeholder="&#x20A6;"
                  name="target"
                  value={formatStringToCurrency(target)}
                  error={errors ? errors.target : (errorObject && errorObject['targetAmount'])}
                />
              </div>
            </div>

            <div className="row mt-4 align-items-center">
              <div className="col-md-4 text-left">
                <p className="text-black text-medium mt-3">Frequency of Payment</p>
              </div>
              <div className="col-md-8">
                <SelectBox
                  onChange={this.handleChange}
                  label="Frequency"
                  placeholder="Set frequency"
                  name="frequency"
                  boxClasses="mt-3"
                  options={investmentFrequency}
                  value="value"
                  optionName="name"
                  error={errors ? errors.frequency : (errorObject && errorObject['frequency'])}
                />
                {entryError && <p className="text-error text-left mt-2 mr-3">{entryError}</p>}
              </div>
            </div>

            <div className="row mt-4 align-items-center justify-content-end">
              <div className=" col-md-5 text-right">
                <button className="btn btn-sm btn-block btn-primary" onClick={this.submit}>
                  Calculate your returns
                  {loading &&
                    <div className="spinner-border text-white spinner-border-sm ml-2"></div>
                  }
                </button>
              </div>
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
