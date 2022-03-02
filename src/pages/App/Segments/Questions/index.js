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
import CPLogo from '#/assets/images/CP-Compass-New.svg'
import Back from "#/components/Back";
import ProfileImg from '#/assets/icons/man-profile.svg'

import './style.scss';

class Questions extends React.Component {

  state = {
    startModal: false,
    finalModal: false,
    stageOne: true,
    stageTwo: false,
    stageThree: false,
    stageFour: false,
    stageFive: false,
    otherSegmentsModal: false,
    singleSegment: false,
    singleSegmentName: "",
    singleSegmentDescription: "",
    singleSegmentIcon: "",
    otherSegments: [],
    view: 1,
    stageOneSelected: '',
    stageOneOthers: '',
    selectedInterest: [],
    stageTwoOthers: '',
    selectedDescription: '',
    stageThreeOthers: '',
    selectedSpending: '',
    stageFourOthers: '',
    investmentSegmentCategory: '',
    investmentDescription: '',
    segmentIcon: '',
    errors: null,
  }




  handleNextStep = () => {
    const {
      startModal, stageOne, stageTwo, stageThree, stageFour,
      stageOneSelected, stageOneOthers, selectedInterest, stageTwoOthers,
      stageFourOthers, stageThreeOthers, selectedDescription, selectedSpending, finalModal, singleSegment
    } = this.state;

    this.setState({ errors: null });
    if (startModal) {
      this.setState({ startModal: false, stageOne: true, view: 1 })
    }
    if (stageOne) {
      if (stageOneSelected === '' && stageOneOthers === '') {
        return this.setState({ errors: { stageOne: 'please select an option' } })
      }
      return this.setState({ stageOne: false, stageTwo: true, view: 2 })
    }
    if (stageTwo) {
      if (selectedInterest.length < 1 && stageTwoOthers === '') return this.setState({ errors: { stageTwo: 'please select an option' } })
      this.setState({ stageTwo: false, stageThree: true, view: 3 })
    }
    if (stageThree) {
      if (selectedDescription === '' && stageThreeOthers === '') return this.setState({ errors: { stageThree: 'please select an option' } })
      this.setState({ stageThree: false, stageFour: true, view: 4 })
    }
    if (stageFour) {
      if (selectedSpending === '' && stageFourOthers === '') return this.setState({ errors: { stageFour: 'please select an option' } })
      this.setState({ stageFour: false, finalModal: true })
    }
    if (finalModal) {
      this.setState({ finalModal: false, otherSegmentsModal: true })
    }

    if (singleSegment) {
      this.setState({ singleSegment: false, otherSegmentsModal: true });
    }
  }

  handleSelectSingleSegment = (name, description, icon) => {
    this.setState({ singleSegmentName: name, singleSegmentDescription: description, singleSegmentIcon: icon, singleSegment: true });
  }

  handlePreviousStep = () => {
    const {
      startModal, stageOne, stageTwo, stageThree, stageFour,
    } = this.state;

    // if (startModal) {
    //   this.props.history.goBack();
    // }
    if (stageOne) {
      this.setState({ stageOne: false, startModal: false })
      this.props.history.goBack();
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
    if (!Number.isInteger(parseInt(event.target.id, 10))) {
      return;
    }
    this.setState({ stageOneSelected: parseInt(event.target.id, 10) });
  }

  handleSelectInterest = (event) => {
    if (!Number.isInteger(parseInt(event.target.id, 10))) {
      return;
    }
    if (this.state.selectedInterest.includes(parseInt(event.target.id, 10))) {
      const newArr = this.state.selectedInterest.filter(interest => interest !== parseInt(event.target.id, 10))
      return this.setState({ selectedInterest: newArr })
    }
    this.setState({ selectedInterest: [...this.state.selectedInterest, parseInt(event.target.id, 10)] });
  }

  handleSelectDescription = (event) => {
    if (!Number.isInteger(parseInt(event.target.id, 10))) {
      return;
    }
    this.setState({ selectedDescription: parseInt(event.target.id, 10) });
  }

  handleSelectSpending = (event) => {
    if (!Number.isInteger(parseInt(event.target.id, 10))) {
      return;
    }
    this.setState({ selectedSpending: parseInt(event.target.id, 10) });
  }

  handleJoinSegment = () => {
    this.setState({ errors: null });
    const { selectedSpending, stageFourOthers } = this.state;
    if (selectedSpending === '' && stageFourOthers === '') return this.setState({ errors: { stageFour: 'please select an option' } })
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
      .then((_data) => {
        const { data, data2 } = _data;
        
        this.setState({ otherSegments: data2?.data?.segments?.data, investmentSegmentCategory: data.message, investmentDescription: data?.segment?.description, segmentIcon: data?.segment?.icon }, () => this.setState({ finalModal: true }))
      })
  }

  handleNavigateToRecommendations = () => {
    if (this.state.singleSegment) {
      this.setState({ singleSegment: false })

    }
    if (this.state.finalModal) {
      this.setState({ finalModal: false })
    }
    this.props.history.push('/app/marketplace/recommended')
  }

  render() {
    const {
      startModal, view, stageOne, otherSegmentsModal, otherSegments,
      singleSegment, singleSegmentDescription, singleSegmentName, singleSegmentIcon,
      stageTwo, stageThree, stageFour, stageFive,
      stageOneSelected, stageOneOthers, finalModal,
      selectedInterest, stageTwoOthers, stageFourOthers,
      stageThreeOthers, selectedDescription, selectedSpending,
      investmentSegmentCategory, investmentDescription, segmentIcon, errors,
    } = this.state;

    const { questions, loading, error } = this.props

    return (
      <div className="questions-page">
        {otherSegments && <div className="p-4">
          <Back onClick={() => this.props.history.push('/app/profile/risk-profile')
          } />
        </div>}
        {startModal &&
          <Modal onClose={this.handlePreviousStep}>
            <div className="text-right pb-3">
              <img src={require('#/assets/icons/close.svg')} alt="close" className="cursor-pointer" onClick={this.handlePreviousStep} />
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
                <button className="btn btn-primary py-3 w-100 mt-4" onClick={this.handleNextStep}>
                  Proceed
                  {loading &&
                    <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                  }
                </button>
              </div>
            </div>
          </Modal>
        }
        <div className="questions">
          <img src={CPLogo} alt="logo" className="cp-logo align-self-center mb-2" />

          <div className={`card p-4 align-self-center p-0  ${otherSegmentsModal ? "col-lg-11 col-md-11 col-sm-11 col-11" : "col-lg-7 col-md-8 col-sm-10 col-11"}`} style={{ height: "78vh" }}>

            {!startModal &&
              (!finalModal &&

                <div className="question-header text-center">
                  <div className="">
                    <h3 className="text-black text-medium font-weight-bold text-center">Join a Trybe</h3>
                  </div>
                  {otherSegmentsModal ? <div className="px-lg-5"><p className="px-5">This is a list of other segments that are available on the platform, you can join any if you don’t want to be in the one recommended before.</p> </div> : <p>
                    Answering these quick questions will help us recommend a segment that best suits you.
                    We’ll keep your info safe in accordance with our <a href={`${CONFIG.WEBSITE_URL}/legal/cookiespolicy`} target="_blank" rel="noopener noreferrer">privacy policy</a>.
                  </p>
                  }
                </div>
              )
            }
            {stageOne &&
              <div className={`question-section questions__one ${stageOne ? 'questions--active' : 'questions--inactive'}`}>
                <div className=" p-4 px-5">
                  <h3 className="text-medium text-center text-blue">{questions?.data[0].question}</h3>
                  <div className="row">
                    {questions?.data && questions?.data[0].options?.slice(0, questions?.data[0].options?.length - 1).map(option => (
                      <div className="col-md-6 p-1" key={Math.random() * 1000}>
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
                    <div className={`${stageOneSelected === 0 ? "col-12 p-1" : "col-md-6 p-1"}`}>
                      <div
                        // id="0"
                        className={`questions--others mt-2 d-flex justify-content-between ${stageOneSelected === 0 && 'selected'}`}
                      // onClick={this.handleSelectOptionOne}
                      >
                        <div style={{ width: "100%" }} className="align-self-center">
                          <div className="d-flex" id="0" onClick={this.handleSelectOptionOne}>
                            <img src={require("#/assets/icons/others-segments.svg")} alt="check" className="img-fluid mr-2" />
                            <p id="0" onClick={this.handleSelectOptionOne} className="mb-0">Others</p>
                          </div>
                          {stageOneSelected === 0 &&
                            <input
                              style={{ width: "100%", outline: "none" }}
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
                        {stageOneSelected === 0 && <img width={24} src={require("#/assets/icons/check-blue.svg")} alt="check" />}
                      </div>
                    </div>
                  </div>
                  {errors && <p className="text-error text-center">{errors.stageOne}</p>}
                  <button className="btn btn-primary btn-sm btn-block mt-4" onClick={this.handleNextStep}>
                    Proceed
                  </button>
                  <button className="btn btn-danger btn-sm btn-block mt-3" onClick={this.handlePreviousStep}>
                    Cancel Segment
                  </button>
                </div>
              </div>
            }

            {stageTwo &&
              <div className={`question-section questions__one ${stageTwo ? 'questions--active' : 'questions--inactive'}`}>
                <div className=" p-5">
                  <h3 className="text-medium text-center font-weight-bold text-blue">{questions?.data[1].question}</h3>
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
                        style={{ width: "100%", outline: "none" }}
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
                  <button className="btn btn-primary btn-sm btn-block mt-4" onClick={this.handleNextStep}>
                    Proceed
                  </button>
                  <button className="btn btn-danger btn-sm btn-block mt-3" onClick={this.handlePreviousStep}>
                    Cancel Segment
                  </button>
                </div>
              </div>
            }

            {stageThree &&
              <div className={`question-section questions__one ${stageThree ? 'questions--active' : 'questions--inactive'}`}>
                <div className=" p-5">
                  <h3 className="text-medium font-weight-bold text-center text-blue">{questions?.data[2].question}</h3>
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
                    <div className={`${selectedDescription === 0 ? "col-12" : "col-md-6"}`}>
                      <div
                        // id="0"
                        className={`questions--others mt-2 d-flex justify-content-between ${selectedDescription === 0 && 'selected'}`}
                      // onClick={this.handleSelectOptionOne}
                      >
                        <div style={{ width: "100%" }} className="align-self-center">
                          <div className="d-flex" id="0" onClick={this.handleSelectDescription}>
                            <img src={require("#/assets/icons/others-segments.svg")} alt="check" className="img-fluid mr-2" />
                            <p id="0" onClick={this.handleSelectDescription} className="mb-0">Others</p>
                          </div>
                          {selectedDescription === 0 &&
                            <input
                              style={{ width: "100%", outline: "none" }}
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
                        {selectedDescription === 0 && <img width={24} src={require("#/assets/icons/check-blue.svg")} alt="check" />}
                      </div>
                    </div>

                  </div>
                  {errors && <p className="text-error text-center">{errors.stageThree}</p>}
                  <button className="btn btn-primary btn-sm btn-block mt-4" onClick={this.handleNextStep}>
                    Proceed
                  </button>
                  <button className="btn btn-danger btn-sm btn-block mt-3" onClick={this.handlePreviousStep}>
                    Cancel Segment
                  </button>
                </div>
              </div>
            }

            {stageFour &&
              <div className={`question-section questions__one ${stageFour ? 'questions--active' : 'questions--inactive'}`}>

                <div className=" p-5">

                  <h3 className="text-medium text-center font-weight-bold text-blue">{questions?.data[3].question}</h3>
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
                    <div className={`${selectedSpending === 0 ? "col-12" : "col-md-6"}`}>
                      <div
                        // id="0"
                        className={`questions--others mt-2 d-flex justify-content-between ${selectedSpending === 0 && 'selected'}`}
                      // onClick={this.handleSelectOptionOne}
                      >
                        <div style={{ width: "100%" }} className="align-self-center">
                          <div className="d-flex" id="0" onClick={this.handleSelectSpending}>
                            <img src={require("#/assets/icons/others-segments.svg")} alt="check" className="img-fluid mr-2" />
                            <p id="0" onClick={this.handleSelectSpending} className="mb-0">Others</p>
                          </div>
                          {selectedSpending === 0 &&
                            <input
                              style={{ width: "100%", outline: "none" }}
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
                        {selectedSpending === 0 && <img width={24} src={require("#/assets/icons/check-blue.svg")} alt="check" />}
                      </div>
                    </div>
                  </div>
                  {errors && <p className="text-error text-center">{errors.stageFour}</p>}
                  <button className="btn btn-primary btn-sm btn-block mt-4" onClick={this.handleJoinSegment}>
                    Proceed
                    {loading &&
                      <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                    }
                  </button>
                  <button className="btn btn-danger btn-sm btn-block mt-3" onClick={this.handlePreviousStep}>
                    Cancel Segment
                  </button>
                  {error && typeof error === 'string' && <p className="text-error text-left mt-2">{error}</p>}
                </div>
              </div>
            }
            {otherSegmentsModal &&
              <div className={`question-section questions__one ${otherSegmentsModal ? 'questions--active' : 'questions--inactive'}`}>
                <div className=" p-5">
                  <div className="row">
                    {
                      otherSegments.map((segment) => {
                        return <div className="col-lg-3 col-md-4 col-12 mt-3">
                          <div className='card py-2 px-3 text-center h-100 d-flex justify-content-between'>
                            <div>
                              <img style={{ width: "60px", borderRadius: "50%", height: "60px" }} src={segment.icon} />
                              <h5 className="text-blue mt-4 font-weight-bold">
                                {segment.name}
                              </h5>
                              <div className="mt-3">
                                <p>
                                  {segment.description ? segment.description.slice(0, 85) + "..." : <></>}
                                </p>
                              </div>
                            </div>
                            <div className='px-3'>
                              <button
                                className="btn w-100 btn-sm btn-primary btn-md-block"
                                onClick={() => this.handleSelectSingleSegment(segment.name, segment.description, segment.icon)}
                              >
                                Read more
                              </button>

                            </div>
                          </div>
                        </div>
                      })
                    }

                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        {
          singleSegment &&
          <Modal onClose={this.handleNavigateToRecommendations} classes="final-modal">
            <div className="px-4 mt">
              <div className="d-flex justify-content-center">
                <img src={singleSegmentIcon} style={{ width: "100px", borderRadius: "50%", height: "100px" }} />
              </div>
              <div className="text-center">
                <h5 className="font-bolder mt-3 text-blue">{singleSegmentName}</h5>
                <p className="text-small text-grey ">
                  {
                    singleSegmentDescription
                  }
                </p>
              </div>
              <div className="d-flex flex-column align-items-center">
                <button className="btn btn-primary py-3 w-100 mt-4" onClick={this.handleNavigateToRecommendations}>
                  See recommendations
                </button>
                <p className="mt-4 text-blue font-weight-bold cursor-pointer" onClick={this.handleNextStep}>
                  View other segments
                </p>
              </div>
            </div>

          </Modal>
        }
        {
          finalModal &&
          <Modal onClose={this.handleNavigateToRecommendations} classes="final-modal">
            <div className="text-right pb-3">
              <img
                style={{ cursor: "pointer" }}
                src={require("#/assets/icons/close.svg")}
                alt="close"
                onClick={this.handleNavigateToRecommendations}
              />
            </div>
            <div className="px-4 mt">
              <div className="d-flex justify-content-center">
                <img src={segmentIcon} style={{ width: "100px", borderRadius: "50%", height: "100px" }} />
              </div>
              <div className="text-center">
                <h5 className="font-bolder mt-3 text-blue">{investmentSegmentCategory}</h5>
                <p className="text-small text-grey ">
                  {
                    investmentDescription
                  }
                </p>
              </div>
              <div className="d-flex flex-column align-items-center">
                <button className="btn btn-primary py-3 w-100 mt-4" onClick={this.handleNavigateToRecommendations}>
                  See recommendations
                </button>
                <p className="mt-4 text-blue font-weight-bold cursor-pointer" onClick={this.handleNextStep}>
                  View other segments
                </p>
              </div>
            </div>

          </Modal>
        }
      </div >
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
