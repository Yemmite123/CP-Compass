import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import moment from 'moment';
import { getActionLoadingState } from "#/store/selectors";
import { addPoliticalStatus } from "#/store/profile/actions";
import actionTypes from "#/store/profile/actionTypes";
import Alert from '#/components/Alert';
import Modal from '#/components/Modal';
import RadioInput from "#/components/RadioInput";
import CustomInput from "#/components/CustomInput";
import { validateFields, serializeErrors, relationshipOption } from '#/utils';
import './style.scss';

class PoliticalStatus extends React.Component {
  state = {
    occupiedPoliticalPosition: false,
    hasPoliticalAssociate: false,
    relationshipWithAssociate: '',
    occupiedTillDate: false,
    associateOccupiedTillDate: false,
    positionName: '',
    associatePositionName: '',
    from: new Date(),
    to: new Date(),
    associateTo: new Date(),
    associateFrom: new Date(),
    errors: null,
    isBvnModal: false,
  }

  componentDidMount() {
    this.setValues()
  }

  setValues = () => {
    const { userInfo } = this.props;
    if (userInfo) {
      this.setState({
        occupiedPoliticalPosition: userInfo && userInfo.occupiedPoliticalPosition ? (userInfo.occupiedPoliticalPosition === 1 ? true : false) : false,
        hasPoliticalAssociate: userInfo && userInfo.hasPoliticalAssociate ? (userInfo.hasPoliticalAssociate === 1 ? true : false) : false,
        relationshipWithAssociate: userInfo && userInfo.relationshipWithAssociate ? userInfo.relationshipWithAssociate : '',
        occupiedTillDate: userInfo && userInfo.occupiedTillDate ? (userInfo.occupiedTillDate === 1 ? true : false) : false,
        associateOccupiedTillDate: userInfo && userInfo.politicalAssociate ? (userInfo.politicalAssociate.occupiedTillDate && userInfo.politicalAssociate.occupiedTillDate ) : false,
        associateTo: userInfo && userInfo.politicalAssociate ? ( userInfo.politicalAssociate.to ? new Date(userInfo.politicalAssociate.to.split('T')[0] ): '' ) : '',
        associateFrom: userInfo && userInfo.politicalAssociate ? ( userInfo.politicalAssociate.from ? new Date(userInfo.politicalAssociate.from.split('T')[0]) : '' ) : '',
        associatePositionName: userInfo && userInfo.politicalAssociate ? ( userInfo.politicalAssociate.positionName ? userInfo.politicalAssociate.positionName : '' ) : '',
        positionName: userInfo && userInfo.positionName ? userInfo.positionName : '',
        from: userInfo && userInfo.from ? new Date(userInfo.from.split('T')[0]) : '',
        to: userInfo && userInfo.to ? new Date(userInfo.to.split('T')[0]) : '',
      })
    }
  }

  handleChange = (event) => {
    const { name } = event.target;
    let value
    if (event.target.type === "radio" && event.target.value === "true") {
      value = true;
    }
    else if (event.target.type === "radio" && event.target.value === "false") {
      value = false;
    }
    else {
      value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    }
    this.setState({ [name]: value });
  }

  handleRelationshipChange = (event) => {
    const { value } = event.target
    this.setState({ relationshipWithAssociate: value });
  }

  handleChangeDate = (item, date) => {
    this.setState({ [item]: date });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { addPoliticalStatus } = this.props;
    const {
      occupiedPoliticalPosition,
      occupiedTillDate,
      hasPoliticalAssociate,
      positionName,
      from,
      to,
      relationshipWithAssociate,
      associatePositionName,
      associateOccupiedTillDate,
      associateFrom,
      associateTo,
    } = this.state;

    this.setState({ errors: null });

    if(occupiedPoliticalPosition){
      const data = this.state;
      const required = ['positionName'];
      const errors = validateFields(data, required)
      if (Object.keys(errors).length > 0) {
        return this.setState({ errors });
      }
    }

    if(occupiedTillDate && occupiedPoliticalPosition) {
      const data = this.state;
      const required = ['from'];
      const errors = validateFields(data, required)
      if (Object.keys(errors).length > 0) {
        return this.setState({ errors });
      }
    }

    if(!occupiedTillDate && occupiedPoliticalPosition) {
      const data = this.state;
      const required = ['from', 'to'];
      const errors = validateFields(data, required)
      if (Object.keys(errors).length > 0) {
        return this.setState({ errors });
      }
    }


    if (associateOccupiedTillDate) {
      const data = this.state;
      const required = ['associateFrom'];
      const errors = validateFields(data, required)
      if (Object.keys(errors).length > 0) {
        return this.setState({ errors });
      }
    }

    if (hasPoliticalAssociate && !associateOccupiedTillDate) {
      const data = this.state;
      const required = ['associateFrom', 'associateTo'];
      const errors = validateFields(data, required)
      if (Object.keys(errors).length > 0) {
        return this.setState({ errors });
      }
    }

    if(hasPoliticalAssociate){
      const data = this.state;
      const required = ['relationshipWithAssociate', 'associatePositionName'];
      const errors = validateFields(data, required)
      if (Object.keys(errors).length > 0) {
        return this.setState({ errors });
      }
    }

    if(!this.props.isBvnActive) {
      return this.toggleBvnModal()
    }

    const politicalAssociate = { 
      positionName: associatePositionName,
      occupiedTillDate: associateOccupiedTillDate,
      from: moment(associateFrom).format('YYYY-MM-DD'),
      to: moment(associateTo).format('YYYY-MM-DD')
    }
    const payload = { 
      occupiedPoliticalPosition,
      occupiedTillDate,
      hasPoliticalAssociate,
      positionName,
      from: moment(from).format('YYYY-MM-DD'),
      to: moment(to).format('YYYY-MM-DD'),
      relationshipWithAssociate,
      politicalAssociate,
    };
    addPoliticalStatus(payload);
  }

  handleBvnSetup = () => {
    this.props.history.push('/app/onboarding');
  }

  toggleBvnModal = () => {
    this.setState(prevState => ({ isBvnModal: !prevState.isBvnModal }))
  }

  render() {
    const {
      occupiedPoliticalPosition, 
      occupiedTillDate, 
      hasPoliticalAssociate, 
      positionName, 
      from, 
      to, 
      errors, 
      associateOccupiedTillDate,
      associateTo,
      associateFrom,
      associatePositionName,
      relationshipWithAssociate,
      isBvnModal,
    } = this.state;
    const { loading, error, data } = this.props;
    const errorObject = serializeErrors(error);
    
    return (
      <div className="section-container mb-5 pb-4">
         {isBvnModal &&
          <Modal classes="bvn-active" onClose={this.toggleBvnModal}>
            <div className="text-center">
              <h3 className="text-deep-blue">Please Setup your BVN to continue</h3>
              <button className="btn btn-primary btn-sm btn-block mt-4" onClick={this.handleBvnSetup}>
                Setup BVN
              </button>
            </div>
          </Modal>
        }

        <div>
          <h2 className="section-header mb-3">Political Status</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="single-row mb-5">
              <div className="question-box">
                <p className="question-box__question">Have you occupied any Political Position?</p>
                <div>
                  <RadioInput 
                    name="occupiedPoliticalPosition" 
                    label="Yes"
                    value={true}
                    checked={occupiedPoliticalPosition === true} 
                    onChange={this.handleChange} 
                  />
                  <RadioInput 
                    name="occupiedPoliticalPosition" 
                    label="No"
                    value={false} 
                    checked={occupiedPoliticalPosition === false} 
                    onChange={this.handleChange} 
                  />
                </div>
              </div>
              {occupiedPoliticalPosition && <>
                <CustomInput
                  name="positionName"
                  label="Name of Position"
                  value={positionName}
                  onChange={this.handleChange}
                  error={
                    errors ? errors.positionName : (errorObject && errorObject['positionName'])
                  }
                />
                <CustomInput
                  name="occupiedTillDate"
                  label="Do you still occupy this position"
                  value={occupiedTillDate ? "1" : "0"}
                  onChange={e => this.setState({occupiedTillDate: e.target.value === "1" ? true : false, to: ''})}
                  type="select"
                  options={[{name: 'Yes', value: "1"}, {name: 'No', value: "0"}]}
                  error={
                    errors ? errors.occupiedTillDate : errorObject && errorObject["occupiedTillDate"]
                  }
                />
                <div className="question-box">
                  <p className="question-box__question">When you occupied position?</p>
                </div>
                <CustomInput
                  name="from"
                  label="Start Date"
                  value={from}
                  type="date"
                  onChange={date => this.handleChangeDate('from', date)}
                  error={errors ? errors.from : (errorObject && errorObject['from'])}
                  maxDate={to || new Date()}
                />
                {!occupiedTillDate && <CustomInput
                  name="to"
                  label="End Date"
                  value={to}
                  type="date"
                  onChange={date => this.handleChangeDate('to', date)}
                  error={errors ? errors.to : (errorObject && errorObject['to'])}
                  maxDate={new Date()}
                  minDate={from || undefined}
                />}
              </>}
            </div>
            <div className="single-row pt-3">
              <div className="question-box">
                <p className="question-box__question">
                  Do you have any close relative or associates who occupied any Political Position?
                </p>
                <div>
                  <RadioInput 
                    name="hasPoliticalAssociate" 
                    label="Yes"
                    value={true}
                    checked={hasPoliticalAssociate === true} 
                    onChange={this.handleChange} 
                  />
                  <RadioInput 
                    name="hasPoliticalAssociate" 
                    label="No"
                    value={false} 
                    checked={hasPoliticalAssociate === false} 
                    onChange={this.handleChange} 
                  />
                </div>
              </div>
              {hasPoliticalAssociate && <>
                <CustomInput
                  name="associatePositionName"
                  label="Name of Position"
                  value={associatePositionName}
                  onChange={this.handleChange}
                  error={
                    errors ? errors.associatePositionName : (errorObject && errorObject['associatePositionName'])
                  }
                />
                <CustomInput
                  name="associateOccupiedTillDate"
                  label="He/She still occupies this position?"
                  value={associateOccupiedTillDate ? "1" : "0"}
                  onChange={e => this.setState({associateOccupiedTillDate: e.target.value === "1" ? true : false, associateTo: ''})}
                  type="select"
                  options={[{name: 'Yes', value: "1"}, {name: 'No', value: "0"}]}
                  error={
                    errors ? errors.associateOccupiedTillDate : errorObject && errorObject["associateOccupiedTillDate"]
                  }
                />
                <div className="question-box">
                  <p className="question-box__question">When he/she occupied position?</p>
                </div>
                <CustomInput
                  name="associateFrom"
                  label="Start Date"
                  value={associateFrom}
                  type="date"
                  onChange={date => this.handleChangeDate('associateFrom', date)}
                  error={errors ? errors.associateFrom : (errorObject && errorObject['politicalAssociate.from'])}
                  maxDate={associateTo || new Date()}
                />
                {!associateOccupiedTillDate && <CustomInput
                  name="associateTo"
                  label="End Date"
                  value={associateTo}
                  type="date"
                  onChange={date => this.handleChangeDate('associateTo', date)}
                  error={errors ? errors.associateTo : (errorObject && errorObject['politicalAssociate.to'])}
                  maxDate={new Date()}
                  minDate={associateFrom || undefined}
                />}
                {!associateOccupiedTillDate && <div className="just-space">&nbsp;</div>}
                <CustomInput
                  name="relationshipWithAssociate"
                  label="Relationship with Associate"
                  value={relationshipWithAssociate}
                  onChange={this.handleChange}
                  type="select"
                  options={relationshipOption}
                  error={
                    errors ? errors.relationshipWithAssociate : (errorObject && errorObject['relationshipWithAssociate'])
                  }
                />
              </>}
            </div>
            <div className="section-form__button-area mt-4">
              {error && typeof error === 'string' && <p className="text-error text-left">{error}</p>}
              {data && <Alert alert={{ type: "success", message: data.message }} />}
              <button className="btn-default" disabled={loading}>
                Save changes
                {loading && (
                  <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { app: { profile: { userProfile: { data: userData }, politics: { error, data } } } } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.ADD_POLITICAL_STATUS_REQUEST),
    error,
    data,
    isBvnActive: userData && userData.bvn ? true : false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPoliticalStatus: (payload, history) => dispatch(addPoliticalStatus(payload, history)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PoliticalStatus));
