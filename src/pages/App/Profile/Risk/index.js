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
    showJoinSegmentModal: false,
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
        gender: sex && sex ? sex : ''
      })
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

    if (!this.props.sex || !this.props.dob) {
      return this.toggleModal()
    }
    this.props.history.push('/app/profile/segments');
  }

  joinRisk = () => {
    this.setState({ section: 'risk' })

    if (!this.props.sex || !this.props.dob) {
      return this.toggleModal()
    }
    this.props.history.push('/app/profile/risks');
  }

  joinSegmentWithAge = () => {
    if (this.state.section === 'segment') {
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

  toggleJoinSegmentModal = () => {
    this.setState(prevState => ({ showJoinSegmentModal: !prevState.showJoinSegmentModal }))
  }

  render() {
    const { segment, risk } = this.props
    const { showGenderModal, showJoinSegmentModal, dateOfBirth, gender } = this.state;

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
        {
          showJoinSegmentModal && <Modal onClose={this.toggleJoinSegmentModal}>
            <div className="text-right pb-3">
              <img src={require('#/assets/icons/close.svg')} alt="close" className="cursor-pointer" onClick={this.toggleJoinSegmentModal} />
            </div>
            <div className="px-4 mt">
              <div className="d-flex justify-content-center">
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="26" cy="26" r="26" fill="#EEF0FF" />
                  <path d="M26 38C19.3724 38 14 32.6276 14 26C14 19.3724 19.3724 14 26 14C32.6276 14 38 19.3724 38 26C38 32.6276 32.6276 38 26 38ZM26 35.6C28.5461 35.6 30.9879 34.5886 32.7882 32.7882C34.5886 30.9879 35.6 28.5461 35.6 26C35.6 23.4539 34.5886 21.0121 32.7882 19.2118C30.9879 17.4114 28.5461 16.4 26 16.4C23.4539 16.4 21.0121 17.4114 19.2118 19.2118C17.4114 21.0121 16.4 23.4539 16.4 26C16.4 28.5461 17.4114 30.9879 19.2118 32.7882C21.0121 34.5886 23.4539 35.6 26 35.6ZM20 26H22.4C22.4 26.9548 22.7793 27.8705 23.4544 28.5456C24.1295 29.2207 25.0452 29.6 26 29.6C26.9548 29.6 27.8705 29.2207 28.5456 28.5456C29.2207 27.8705 29.6 26.9548 29.6 26H32C32 27.5913 31.3679 29.1174 30.2426 30.2426C29.1174 31.3679 27.5913 32 26 32C24.4087 32 22.8826 31.3679 21.7574 30.2426C20.6321 29.1174 20 27.5913 20 26Z" fill="black" />
                </svg>

              </div>
              <div className="text-center">
                <h5 className="text-blue font-bolder mt-3">We’d like to know about you</h5>
                <p className="text-small text-grey ">
                  Tell us more about you by answering these quick questions.
                  This will help us personalize your experience, recommend a
                  segment and hence help you reach your financial goals faster.
                </p>
              </div>
              <div className="d-flex flex-column align-items-center">
                <button className="btn btn-primary py-3 w-100 mt-4" onClick={this.joinSegment}>
                  Proceed
                </button>
              </div>
            </div>
          </Modal>
        }
        <div className="row">
          <div className="col-lg-4">
            <div div className="guide-item border rounded-lg p-3 d-flex flex-column justify-content-between">
              <img src={segment ? segment.icon : require('#/assets/icons/blank-avatar.svg')} className="img-fluid user-img " alt="user-img" />
              <span className="h3 text-medium mt-3 text-blue">Trybe</span>
              <p className="font-light">Join a trybe of like minded individuals who have similar goals as you.</p>
              <p className="text-blue font-light cursor-pointer join" onClick={this.toggleJoinSegmentModal}>Join a tribe here {`>`}</p>
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
