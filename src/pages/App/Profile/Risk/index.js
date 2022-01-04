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
        <div className="row mb-5">
          <div className="col-md-4">
            <div className="section-details text-left">
              <h3>Segment</h3>
              <p className="text-grey">Your segment determines your investment recommendations and other personalized services</p>
            </div>
          </div>
          <div className="col-md-7">
            <div className="d-flex align-items-center">
              <div className="user-img-container mr-3">
                <img src={segment ? segment.icon : require('#/assets/icons/blank-avatar.svg')} className="img-fluid user-img" alt="user-img" />
              </div>
              <div>
                <p className="text-grey text-small mb-0">{segment ? segment.name : 'You are yet to join a segment'}</p>
                <p onClick={this.joinSegment} className="text-blue cursor-pointer">Join a tribe here {`>`} </p>
              </div>
            </div>
          </div>
        </div>

        <hr />
        <div className="row mt-5">
          <div className="col-md-4">
            <div className="section-details text-left">
              <h3>Risk profile</h3>
              <p className="text-grey">Set your risk tolerance.</p>
            </div>
          </div>

          <div className="col-md-7">
            <div className="d-flex align-items-center">
              <div className="user-img-container mr-3">
                <img src={risk ? risk.icon : require('#/assets/icons/blank-avatar.svg')} className="img-fluid user-img" alt="user-img" />
              </div>
              <div>
                <p className="text-grey text-small mb-0">{risk ? risk.profile : 'You are yet tto do your risk assessment'}</p>
                <p onClick={this.joinRisk} className="text-blue cursor-pointer">Set your risk profile here {`>`} </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Risk);
