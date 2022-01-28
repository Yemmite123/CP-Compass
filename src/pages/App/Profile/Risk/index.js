import React from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Modal from '#/components/Modal';
import SelectBox from '#/components/SelectBox';
import DateBox from '#/components/DateBox';
import { genderOption } from '#/utils';
import './style.scss';

class Risk extends React.Component {

  state = {
    showGenderModal: false,
    dateOfBirth: '',
    gender: '',
    section: '',
  }

  componentDidMount() {
    this.setValues()
    console.log(this.props.segment)
  }

  setValues = () => {
    const { sex, dob } = this.props;
    if (sex) {
      this.setState({
        gender: sex && sex ? sex : ''})
    }
    if (dob) {
      this.setState({
        dateOfBirth: dob && dob ? new Date(dob) : new Date(),
      })
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value });
  }

  handleGenderChange = (event) => {
    const { value } = event.target
    this.setState({ gender: value });
  }

  handleChangeDate = (item, date) => {
    this.setState({ [item]: date });
  }

  joinSegment = () => {
    this.setState({ section: 'segment' })

    if(!this.props.sex || !this.props.dob){
      return this.toggleModal()
    }
    this.props.history.push('/app/profile/segments');
  }

  joinRisk = () => {
    this.setState({ section: 'risk' })

    if(!this.props.sex || !this.props.dob){
      return this.toggleModal()
    }
    this.props.history.push('/app/profile/risks');
  }

  joinSegmentWithAge = () => {
    if(this.state.section === 'segment') {
      return this.props.history.push({
        pathname: '/app/profile/segments',
        state: { gender: this.state.gender, dateOfBirth: moment(this.state.dateOfBirth).format('YYYY-MM-DD') },
      });
    }
    return this.props.history.push({
      pathname: '/app/profile/risks',
      state: { gender: this.state.gender, dateOfBirth: moment(this.state.dateOfBirth).format('YYYY-MM-DD') },
    });
  }

  toggleModal = () => {
    this.setState(prevState => ({ showGenderModal: !prevState.showGenderModal }))
  }

  render() {
    const { segment, risk } = this.props
    const { showGenderModal, dateOfBirth, gender } = this.state;

    return (
      <div className="risk-page">
        {
          showGenderModal &&
          <Modal onClose={this.toggleModal}>
            <h3 className="text-blue">You haven’t set up your Date of Birth and Gender</h3>
            <p className="text-small">Complete field to continue to segment</p>
            <DateBox
              onChange={date => this.handleChangeDate('dateOfBirth', date)}
              label="Date of Birth"
              placeholder="Date of Birth"
              name="dateOfBirth"
              boxClasses="mt-3"
              value={dateOfBirth}
            />
            <SelectBox
              onChange={this.handleGenderChange}
              name="gender"
              label="Gender"
              placeholder="Gender"
              boxClasses="mt-3"
              options={genderOption}
              value="value"
              optionName="name"
              defaultValue={gender}
            />

            <button onClick={this.joinSegmentWithAge} className="mt-3 btn btn-block btn-sm btn-primary">
              Continue
            </button>
          </Modal>
        }
         <div className="row">
          <div className="col-lg-4">
            <div div className="guide-item border rounded-lg p-3 d-flex flex-column justify-content-between">
                <img src={segment ? segment.icon : require('#/assets/icons/blank-avatar.svg')} className="img-fluid user-img " alt="user-img" />
                <span className="h3 text-medium mt-3 text-blue">Trybe</span>
                <p className="font-light">Join a trybe of like minded individuals who have similar goals as you.</p>
                <p className="text-blue font-light cursor-pointer join" onClick={this.joinSegment}>Join a tribe here {`>`}</p>
            </div>
          </div>

          <div className="col-lg-4">
            <div div className="guide-item border rounded-lg p-3 d-flex flex-column justify-content-between">
              <img src={risk ? risk.icon : require('#/assets/icons/blank-avatar.svg')} className="img-fluid user-img" alt="user-img" />

                <span className="h3 text-medium mt-3 text-blue">Risk Assessment</span>
                <p className="font-light">Your risk assessment answers would help us recommend investments which suit you.</p>
                <p className="text-blue text-small font-light cursor-pointer join" onClick={this.joinRisk}>Set your risk profile here {`>`}</p>
            </div>
          </div> 
        </div>
      </div>
    )
  }
}

export default withRouter(Risk);
