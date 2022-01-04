import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CONFIG from '#/config';
import { getActionLoadingState } from "#/store/selectors";
import { joinSegment } from "#/store/profile/actions";
import actionTypes from "#/store/profile/actionTypes";
import Modal from '#/components/Modal';
import SelectableList from '#/components/SelectableList';
import Pill from '#/components/Pill';
import './style.scss';

class Questions extends React.Component {

  state = {
    startModal: true,
    finalModal: false,
    stageOne: false,
    stageTwo: false,
    stageThree: false,
    stageFour: false,
    view: 0,
    stageOneSelected: '',
    stageOneOthers: '',
    selectedInterest: [],
    stageTwoOthers: '',
    selectedDescription: '',
    stageThreeOthers: '',
    selectedSpending: '',
    stageFourOthers: '',
    investmentSegmentCategory: '',
    segmentIcon: '',
    errors: null,
  }

  handleNextStep = () => {
    const { 
      startModal, stageOne, stageTwo, stageThree, stageFour, 
      stageOneSelected, stageOneOthers, selectedInterest, stageTwoOthers, 
      stageFourOthers, stageThreeOthers, selectedDescription, selectedSpending,
    } = this.state;

    this.setState({ errors: null });
    if (startModal) {
      this.setState({ startModal: false, stageOne: true, view: 1 })
    }
    if (stageOne) {
      if(stageOneSelected === '' && stageOneOthers === '') {
        return this.setState({ errors: { stageOne: 'please select an option'  } })
      }
      return this.setState({ stageOne: false, stageTwo: true, view: 2 })
    }
    if (stageTwo) {
      if(selectedInterest.length < 1 && stageTwoOthers === '') return this.setState({ errors: { stageTwo: 'please select an option'  } })
      this.setState({ stageTwo: false, stageThree: true, view: 3 })
    }
    if (stageThree) {
      if(selectedDescription === '' && stageThreeOthers === '') return this.setState({ errors: { stageThree: 'please select an option'  } })
      this.setState({ stageThree: false, stageFour: true, view: 4 })
    }
    if (stageFour) {
      if(selectedSpending === '' && stageFourOthers === '') return this.setState({ errors: { stageFour: 'please select an option'  } })
      this.setState({ stageFour: false, finalModal: true })
    }
  }

  handlePreviousStep = () => {
    const { 
      startModal, stageOne, stageTwo, stageThree, stageFour, 
    } = this.state;

    if (startModal) {
      this.props.history.goBack();
    }
    if (stageOne) {
      this.setState({ stageOne: false, startModal: true })
    }
    if (stageTwo) {
      this.setState({ stageTwo: false, stageOne: true })
    }
    if (stageThree) {
      this.setState({ stageThree: false, stageTwo: true })
    }
    if (stageFour) {
      this.setState({ stageFour: false, stageThree: true })
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value });
  }

  handleSelectOptionOne = (event) => {
    if(!Number.isInteger(parseInt(event.target.id, 10))) {
      return;
    }
    this.setState({ stageOneSelected: parseInt(event.target.id, 10) });
  }

  handleSelectInterest = (event) => {
    if(!Number.isInteger(parseInt(event.target.id, 10))) {
      return;
    }
    if (this.state.selectedInterest.includes(parseInt(event.target.id, 10))) {
      const newArr = this.state.selectedInterest.filter(interest => interest !== parseInt(event.target.id, 10))
      return this.setState({ selectedInterest: newArr })
    }
    this.setState({ selectedInterest: [...this.state.selectedInterest, parseInt(event.target.id, 10)] });
  }

  handleSelectDescription = (event) => {
    if(!Number.isInteger(parseInt(event.target.id, 10))) {
      return;
    }
    this.setState({ selectedDescription: parseInt(event.target.id, 10) });
  }

  handleSelectSpending = (event) => {
    if(!Number.isInteger(parseInt(event.target.id, 10))) {
      return;
    }
    this.setState({ selectedSpending: parseInt(event.target.id, 10) });
  }

  handleJoinSegment = () => {
    this.setState({ errors: null });
    const { selectedSpending, stageFourOthers } = this.state;
    if(selectedSpending === '' && stageFourOthers === '') return this.setState({ errors: { stageFour: 'please select an option'  } })
    const payload = {
      answers: [
        {
          segment_question_id: 1,
          segment_option_id: this.state.stageOneSelected === 0 ? null : this.state.stageOneSelected,
          others: this.state.stageOneOthers
        },
        {
          segment_question_id: 2,
          segment_options: this.state.selectedInterest === 0 ? null : this.state.selectedInterest,
          others: this.state.stageTwoOthers

        },
        {
          segment_question_id: 3,
          segment_option_id: this.state.selectedDescription === 0 ? null : this.state.selectedDescription,
          others: this.state.stageThreeOthers,
        },
        {
          segment_question_id: 4,
          segment_option_id: this.state.selectedSpending === 0 ? null : this.state.selectedSpending,
          others: this.state.stageFourOthers
        }
      ],
      dateOfBirth: this.props.history.location.state?.dateOfBirth,
      gender: this.props.history.location.state?.gender
    }
    this.props.joinSegment(payload)
      .then(data => {
        this.setState({ investmentSegmentCategory: data.message, segmentIcon: data?.segment?.icon }, () => this.setState({ finalModal: true }))
      })
  }

  handleNavigateToRecommendations = () => {
    this.props.history.push('/app/marketplace/recommended')
  }

  render() {
    const {
      startModal, view, stageOne,
      stageTwo, stageThree, stageFour,
      stageOneSelected, stageOneOthers, finalModal,
      selectedInterest, stageTwoOthers, stageFourOthers,
      stageThreeOthers, selectedDescription, selectedSpending,
      investmentSegmentCategory, segmentIcon, errors,
    } = this.state;

    const { questions, loading, error } = this.props

    return (
      <div className="questions-page">
        {startModal &&
          <Modal>
            <p onClick={this.handlePreviousStep} className="cursor-pointer text-blue">{'< Back'}</p>
            <h3 className="text-deep-blue text-medium">We’d like to know more about you</h3>
            <p className="text-black mt-3">
              Tell us more about you by answering these quick questions.
              This will help us personalize your experience,
              recommend a segment and hence help you reach your financial goals faster.
          </p>
            <div className="text-right">
              <button className="btn btn-md btn-primary" onClick={this.handleNextStep}>
                Continue
            </button>
            </div>
          </Modal>
        }
        <div className="questions">
          {!startModal &&
            (!finalModal &&
              <div className="question-header">
                <div className="d-flex justify-content-between">
                  <h3 className="text-black text-medium">Join a segment</h3>
                  <p>{view}/4</p>
                </div>
                <p>
                  Answering these quick questions will help us recommend a segment that best suits you.
                We’ll keep your info safe in accordance with our <a href={`${CONFIG.WEBSITE_URL}/cookies`} target="_blank" rel="noopener noreferrer">privacy policy</a>.
                </p>
              </div>
            )
          }
          {stageOne &&
            <div className={`question-section questions__one ${stageOne ? 'questions--active' : 'questions--inactive'}`}>
              <div className="progress">
                <div
                  className="progress-bar bg-default"
                  style={{ width: `25%` }}
                  role="progressbar"
                  aria-valuenow={25}
                  aria-valuemin="0"
                  aria-valuemax="100">
                </div>
              </div>
              <div className="card p-5">
              <p onClick={this.handlePreviousStep} className="cursor-pointer text-blue">{'< Back'}</p>

                <h3 className="text-medium text-deep-blue">{questions?.data[0].question}</h3>
                <div className="row">
                  {questions?.data && questions?.data[0].options?.slice(0, questions?.data[0].options?.length - 1).map(option => (
                    <div className="col-md-6" key={Math.random() * 1000}>
                      <SelectableList
                        onSelect={this.handleSelectOptionOne}
                        selected={stageOneSelected === option.id ? true : false}
                        img={option.icon}
                        value={option.id}
                        label={option.option}
                        noImg
                      />
                    </div>
                  ))}
                  <div className="col-md-6">
                    <div
                      // id="0"
                      className={`questions--others mt-2 d-flex justify-content-between ${stageOneSelected === 0 && 'selected'}`}
                      // onClick={this.handleSelectOptionOne}
                    >
                      <div>
                        <div className="d-flex" id="0" onClick={this.handleSelectOptionOne}>
                          <img src={require("#/assets/icons/others-segments.svg")} alt="check" className="img-fluid mr-2" />
                          <p id="0" onClick={this.handleSelectOptionOne} className="mb-0">Others</p>
                        </div>
                        {stageOneSelected === 0 &&
                          <input
                            type="text"
                            name="stageOneOthers"
                            className="mt-2 p-2"
                            id="stageOneOthers"
                            value={stageOneOthers}
                            onChange={this.handleChange}
                            placeholder="please specify"
                          />
                        }
                      </div>
                      {stageOneSelected === 0 && <img src={require("#/assets/icons/check-blue.svg")} alt="check" />}
                    </div>
                  </div>
                </div>
                {errors && <p className="text-error text-center">{errors.stageOne}</p>}
                <button className="btn btn-primary btn-sm btn-block mt-3" onClick={this.handleNextStep}>
                  Proceed
                </button>
              </div>
            </div>
          }

          {stageTwo &&
            <div className={`question-section questions__one ${stageTwo ? 'questions--active' : 'questions--inactive'}`}>
              <div className="progress">
                <div
                  className="progress-bar bg-default"
                  style={{ width: `50%` }}
                  role="progressbar"
                  aria-valuenow={50}
                  aria-valuemin="0"
                  aria-valuemax="100">
                </div>
              </div>
              <div className="card p-5">
                <p onClick={this.handlePreviousStep} className="cursor-pointer text-blue">{'< Back'}</p>
                <h3 className="text-medium text-deep-blue">{questions?.data[1].question}</h3>
                <div className="row">
                  {questions?.data[1].options.map(interest => (
                    <div className="col-md-6" key={Math.random() * 1000}>
                      <Pill
                        value={interest.id}
                        selected={selectedInterest.includes(interest.id)}
                        label={interest.option}
                        onSelect={this.handleSelectInterest}
                        img={interest.icon}
                      />
                    </div>
                  ))}
                </div>
                <div className="others">
                  {selectedInterest.includes(questions?.data[1].options[questions?.data[1].options.length - 1].id) &&
                    <input
                      type="text"
                      name="stageTwoOthers"
                      className="mt-2 p-2"
                      id="stageTwoOthers"
                      value={stageTwoOthers}
                      onChange={this.handleChange}
                      placeholder="please specify"
                    />
                  }
                </div>
                {errors && <p className="text-error text-center">{errors.stageTwo}</p>}
                <button className="btn btn-primary btn-sm btn-block mt-2" onClick={this.handleNextStep}>
                  Proceed
                </button>
              </div>
            </div>
          }

          {stageThree &&
            <div className={`question-section questions__one ${stageThree ? 'questions--active' : 'questions--inactive'}`}>
              <div className="progress">
                <div
                  className="progress-bar bg-default"
                  style={{ width: `75%` }}
                  role="progressbar"
                  aria-valuenow={75}
                  aria-valuemin="0"
                  aria-valuemax="100">
                </div>
              </div>
              <div className="card p-5">
              <p onClick={this.handlePreviousStep} className="cursor-pointer text-blue">{'< Back'}</p>
                <h3 className="text-medium text-deep-blue">{questions?.data[2].question}</h3>
                <div className="row">
                  {questions?.data && questions?.data[2].options?.slice(0, questions?.data[2].options?.length - 1).map(option => (
                    <div className="col-md-6" key={Math.random() * 1000}>
                      <SelectableList
                        onSelect={this.handleSelectDescription}
                        selected={selectedDescription === option.id ? true : false}
                        value={option.id}
                        label={option.option}
                        img={option.icon}
                        noImg
                      />
                    </div>
                  ))}
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div
                      // id="0"
                      className={`questions--others mt-2 d-flex justify-content-between ${selectedDescription === 0 && 'selected'}`}
                      // onClick={this.handleSelectDescription}
                    >
                      <div>
                        <div className="d-flex" id="0" onClick={this.handleSelectDescription}>
                          <img src={require("#/assets/icons/others-segments.svg")} alt="check" className="img-fluid mr-2" />
                          <p id="0" onClick={this.handleSelectDescription} className="mb-0">Others</p>
                        </div>
                        {selectedDescription === 0 &&
                          <input
                            type="text"
                            name="stageThreeOthers"
                            className="mt-2 p-2"
                            id="stageThreeOthers"
                            value={stageThreeOthers}
                            onChange={this.handleChange}
                            placeholder="please specify"
                          />
                        }
                      </div>
                      {selectedDescription === 0 && <img src={require("#/assets/icons/check-blue.svg")} alt="check" />}
                    </div>
                  </div>

                </div>
                {errors && <p className="text-error text-center">{errors.stageThree}</p>}
                <button className="btn btn-primary btn-sm btn-block mt-3" onClick={this.handleNextStep}>
                  Proceed
                </button>
              </div>
            </div>
          }

          {stageFour &&
            <div className={`question-section questions__one ${stageFour ? 'questions--active' : 'questions--inactive'}`}>
            <div className="progress">
              <div
                className="progress-bar bg-default"
                style={{ width: `95%` }}
                role="progressbar"
                aria-valuenow={95}
                aria-valuemin="0"
                aria-valuemax="100">
              </div>
            </div>
              <div className="card p-5">
              <p onClick={this.handlePreviousStep} className="cursor-pointer text-blue">{'< Back'}</p>
                <h3 className="text-medium text-deep-blue">{questions?.data[3].question}</h3>
                <div className="row">
                  {questions?.data && questions?.data[3].options?.slice(0, questions?.data[3].options?.length - 1).map(option => (
                    <div className="col-md-6" key={Math.random() * 1000}>
                      <SelectableList
                        onSelect={this.handleSelectSpending}
                        selected={selectedSpending === option.id ? true : false}
                        value={option.id}
                        label={option.option}
                        noImg
                        img={option.icon}
                      />
                    </div>
                  ))}
                  <div className="col-md-6">
                    <div
                      // id="0"
                      className={`questions--others mt-2 d-flex justify-content-between ${selectedSpending === 0 && 'selected'}`}
                      // onClick={this.handleSelectSpending}
                    >
                      <div id="0" onClick={this.handleSelectSpending}>
                        <div className="d-flex">
                          <img src={require("#/assets/icons/others-segments.svg")} alt="check" className="img-fluid mr-2" />
                          <p id="0" onClick={this.handleSelectSpending} className="mb-0">Others</p>
                        </div>
                        {selectedSpending === 0 &&
                          <input
                            type="text"
                            name="stageFourOthers"
                            className="mt-2 p-2"
                            id="stageFourOthers"
                            value={stageFourOthers}
                            onChange={this.handleChange}
                            placeholder="please specify"
                          />
                        }
                      </div>
                      {selectedSpending === 0 && <img src={require("#/assets/icons/check-blue.svg")} alt="check" />}
                    </div>
                  </div>
                </div>
                {errors && <p className="text-error text-center">{errors.stageFour}</p>}
                <button className="btn btn-primary btn-sm btn-block mt-3" onClick={this.handleJoinSegment}>
                  Proceed
                  {loading &&
                    <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                  }
                </button>
                {error && typeof error === 'string' && <p className="text-error text-left mt-2">{error}</p>}
              </div>
            </div>
          }
        </div>
        {
          finalModal &&
          <Modal onClose={null}>
            <div className="text-center">
              <img src={segmentIcon === ''.trim() ? require("#/assets/icons/cp-lord.svg") : segmentIcon} alt="cp-segment" className="img-fluid segment-img" />
              <h3 className="text-medium text-center mt-2"><span className="text-deep-blue">{investmentSegmentCategory}</span> </h3>
              <p className="text-black mt-3 text-center">
                The answers you have provided suggests that you are best suited for this segment.
                You can now enjoy the personalized services and investment offerings tailored for this segment.
                Start by trying out our recommended investments.
              </p>
              <div className="text-center mt-3">
                <button className="btn btn-sm btn-primary w-75" onClick={this.handleNavigateToRecommendations}>
                  See recommendations
                </button>
              </div>
            </div>
          </Modal>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    app: { profile: { segment: { data, error } } }
  } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.JOIN_SEGMENT_REQUEST),
    data,
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    joinSegment: (payload) => dispatch(joinSegment(payload)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Questions));
