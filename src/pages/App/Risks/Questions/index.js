import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import { riskAssessment } from "#/store/profile/actions";
import actionTypes from "#/store/profile/actionTypes";
import SelectableList from '#/components/SelectableList';
import RangeSelector from '#/components/RangeSelector';
import Modal from '#/components/Modal';
import CONFIG from '#/config';
import CpMan from "#/assets/icons/cp-lord.svg"
import './style.scss';

class Questions extends React.Component {

  state = {
    stageOne: true,
    stageTwo: false,
    stageThree: false,
    stageFour: false,
    stageFive: false,
    stageSix: false,
    finalModal: false,
    stageOneSelected: '',
    stageOneScale: '',
    stageTwoSelected: 1,
    stageTwoOption: '',
    stageThreeSelected: 1,
    stageThreeOption: '',
    stageFourSelected: '',
    stageFourScale: '',
    stageFiveSelected: 1,
    stageFiveOption: '',
    stageSixSelected: [],
    stageSixScale: [],
    investmentSegmentCategory: '',
    investmentSegmentIcon: '',
    errors: null,
  }

  handleSelectOptionOne = (event, optionId) => {
    this.setState({ stageOneSelected: parseInt(optionId, 10), stageOneScale: parseInt(event.target.id, 10) });
  }

  handleSelectOptionFour = (event, optionId) => {
    this.setState({ stageFourSelected: parseInt(optionId, 10), stageFourScale: parseInt(event.target.id, 10) });
  }

  handleSelectOptionSix = (event, optionId) => {
    if (this.state.stageSixSelected.includes(parseInt(optionId, 10))) {
      const newArr = this.state.stageSixSelected.filter(item => item !== parseInt(optionId, 10))
      const newScaleArr = this.state.stageSixScale.filter(item => item !== parseInt(event.target.id, 10))
      return this.setState({ stageSixSelected: newArr, stageSixScale: newScaleArr })
    }
    this.setState({ stageSixScale: [...this.state.stageSixScale, parseInt(event.target.id, 10)],
      stageSixSelected: [...this.state.stageSixSelected, parseInt(optionId, 10)] });
  }

  handleNextStep = () => {
    this.setState({ errors: null });
    const { 
      stageOne, stageTwo, stageThree, stageFour, stageFive, stageSix,
      stageOneSelected, stageTwoOption, stageThreeOption, stageFourSelected, stageFiveOption,
     } = this.state;

    if (stageOne) {
      if(stageOneSelected === '') {
        return this.setState({ errors: {stageOne: 'please select an option'} })
      }
      return this.setState({ stageOne: false, stageTwo: true })
    }
    if (stageTwo) {
      if(stageTwoOption === '') {
        return this.setState({ errors: {stageTwo: 'please select an option'} })
      }
      this.setState({ stageTwo: false, stageThree: true })
    }
    if (stageThree) {
      if(stageThreeOption === '') {
        return this.setState({ errors: {stageThree: 'please select an option'} })
      }
      this.setState({ stageThree: false, stageFour: true })
    }
    if (stageFour) {
      if(stageFourSelected === '') {
        return this.setState({ errors: {stageFour: 'please select an option'} })
      }
      this.setState({ stageFour: false, stageFive: true })
    }
    if (stageFive) {
      if(stageFiveOption === '') {
        return this.setState({ errors: {stageFive: 'please select an option'} })
      }
      this.setState({ stageFive: false, stageSix: true })
    }
    if (stageSix) {
      this.setState({ stageSix: false, finalModal: true })
    }
  }

  handlePreviousStep = () => {
    const { 
      stageOne, stageTwo, stageThree, stageFour, stageFive, stageSix
    } = this.state;

    if (stageOne) {
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
    if (stageFive) {
      this.setState({ stageFive: false, stageFour: true })
    }
    if (stageSix) {
      this.setState({ stageSix: false, stageFive: true })
    }
  }

  handleRangeTwo = (value, options) => {
    if (value >= 0 && value < 21) {
      const option = options.find(item => item.scale === 1)
      return this.setState({stageTwoSelected: 1, stageTwoOption: option.id})
    }
    if (value >= 20 && value < 41) {
      const option = options.find(item => item.scale === 2)
      return this.setState({stageTwoSelected: 2, stageTwoOption: option.id})
    }
    if (value >= 40 && value < 60) {
      const option = options.find(item => item.scale === 3)
      return this.setState({stageTwoSelected: 3, stageTwoOption: option.id})
    }
    if (value >= 60 && value < 81) {
      const option = options.find(item => item.scale === 4)
      return this.setState({stageTwoSelected: 4, stageTwoOption: option.id})
    }
    const option = options.find(item => item.scale === 5)
    return this.setState({stageTwoSelected: 5, stageTwoOption: option.id})
  }

  handleRangeThree = (value, options) => {
    if (value >= 0 && value < 21) {
      const option = options.find(item => item.scale === 1)
      return this.setState({stageThreeSelected: 1, stageThreeOption: option.id})
    }
    if (value >= 20 && value < 41) {
      const option = options.find(item => item.scale === 2)
      return this.setState({stageThreeSelected: 2, stageThreeOption: option.id})
    }
    if (value >= 40 && value < 60) {
      const option = options.find(item => item.scale === 3)
      return this.setState({stageThreeSelected: 3, stageThreeOption: option.id})
    }
    if (value >= 60 && value < 81) {
      const option = options.find(item => item.scale === 4)
      return this.setState({stageThreeSelected: 4, stageThreeOption: option.id})
    }
    const option = options.find(item => item.scale === 5)
    return this.setState({stageThreeSelected: 5, stageThreeOption: option.id})
  }

  handleRangeFive = (value, options) => {
    if (value >= 0 && value < 26) {
      const option = options.find(item => item.scale === 1)
      return this.setState({stageFiveSelected: 1, stageFiveOption: option.id})
    }
    if (value >= 25 && value < 51) {
      const option = options.find(item => item.scale === 2)
      return this.setState({stageFiveSelected: 2, stageFiveOption: option.id})
    }
    if (value >= 50 && value < 76) {
      const option = options.find(item => item.scale === 3)
      return this.setState({stageFiveSelected: 3, stageFiveOption: option.id})
    }
    const option = options.find(item => item.scale === 4)
    return this.setState({stageFiveSelected: 4, stageFiveOption: option.id})
  }

  handleJoinSegment = () => {
    this.setState({ errors: null });

    if(this.state.stageSixSelected.length < 1) {
      return this.setState({ errors: {stageSix: 'please select an option'} })
    }
    const payload = {
      answers: [
        {
        questionId: 1,
        optionId: this.state.stageOneSelected,
        scale: this.state.stageOneScale,
        },
        {
        questionId: 2,
        optionId: this.state.stageTwoOption,
        scale: this.state.stageTwoSelected,
        },
        {
        questionId: 3,
        optionId: this.state.stageThreeOption,
        scale: this.state.stageThreeSelected 
        },
        {
        questionId: 4,
        optionId: this.state.stageFourSelected,
        scale: this.state.stageFourScale,
        },
        {
        questionId: 5,
        optionId: this.state.stageFiveOption,
        scale: this.state.stageFiveSelected 
        },
        {
        questionId: 6,
        options: this.state.stageSixSelected,
        scales: this.state.stageSixScale,
        }
        ],
        dateOfBirth: this.props.history.location.state?.dateOfBirth,
        gender: this.props.history.location.state?.gender
    }
    this.props.riskAssessment(payload)
      .then(data => {
        this.setState({ 
          investmentSegmentCategory: data.data?.assessment?.riskProfile,
          investmentMessageSegment: data.data?.assessment?.message,
          investmentSegmentIcon: data.data?.assessment?.icon,
         }, () => this.setState({ finalModal: true }))
      })
  }

  handleNavigateToRecommendations = () => {
    this.props.history.push('/app/marketplace/recommended')
  }

  render() {
    const { stageOne, stageTwo, stageThree,
      stageFour, stageFive, stageSix,
      stageOneScale, stageTwoSelected, stageThreeSelected,
      stageFourScale, stageFiveSelected, stageSixScale,
      investmentSegmentCategory, finalModal, errors, investmentMessageSegment, investmentSegmentIcon } = this.state;
    const { questions, loading, error } = this.props

    return (
      <div className="risk-questions-page">
        <div className="questions">
          <div className="question-header text-center">
            <div className="">
              <h3 className="text-black text-medium text-center font-weight-bold">Risk Assessment</h3>
            </div>
            <p className="text-small text-grey">
              Answering these questions would help us recommend investments for you which suit your risk profile.
              We’ll keep your info safe in accordance with our <a href={`${CONFIG.WEBSITE_URL}/cookies`} target="_blank" rel="noopener noreferrer">privacy policy</a>.
            </p>
          </div>

          {stageOne &&
            <div className="question-section questions__one">
              <div className="card p-5">
            
                <h3 className="text-medium text-center font-weight-bold text-blue">{questions && questions[0].question}</h3>
                {
                  questions && questions[0].options?.map(option => (
                    <SelectableList
                      onSelect={(e) => this.handleSelectOptionOne(e, option.id)}
                      selected={stageOneScale === option.scale ? true : false}
                      key={Math.random() * 1000}
                      value={option.scale}
                      label={option.option}
                      noImg
                    />
                  ))
                }
                {errors && <p className="text-error text-center">{errors.stageOne}</p>}
                <button className="btn btn-primary btn-sm btn-block mt-3" onClick={this.handleNextStep}>
                  Proceed
              </button>
              <button className="btn btn-danger btn-sm btn-block mt-3" onClick={this.handlePreviousStep}>
                  Cancel Segment
                </button>
              </div>
            </div>
          }

          {stageTwo &&
            <div className="question-section questions__two">
              <div className="card p-5">
              
                <h3 className="text-medium text-center font-weight-bold text-blue">{questions && questions[1].question}</h3>
                <RangeSelector options={questions && questions[1].options} handleSelectedRange={this.handleRangeTwo} selectedOption={stageTwoSelected} />
                {errors && <p className="text-error text-center">{errors.stageTwo}</p>}
                <button className="btn btn-primary btn-sm btn-block mt-3" onClick={this.handleNextStep}>
                  Proceed
              </button>
              <button className="btn btn-danger btn-sm btn-block mt-3" onClick={this.handlePreviousStep}>
                  Cancel Segment
                </button>
              </div>
            </div>
          }

          {stageThree &&
            <div className="question-section questions__three">
              <div className="card p-5">
              
                <h3 className="text-medium text-center font-weight-bold text-blue">{questions && questions[2].question}</h3>
                <RangeSelector options={questions && questions[2].options} handleSelectedRange={this.handleRangeThree} selectedOption={stageThreeSelected} />
                {errors && <p className="text-error text-center">{errors.stageThree}</p>}
                <button className="btn btn-primary btn-sm btn-block mt-3" onClick={this.handleNextStep}>
                  Proceed
              </button>
              <button className="btn btn-danger btn-sm btn-block mt-3" onClick={this.handlePreviousStep}>
                  Cancel Segment
                </button>
              </div>
            </div>
          }

          {stageFour &&
            <div className="question-section questions__four">
              <div className="card p-5">
              
                <h3 className="text-medium text-center font-weight-bold text-blue">{questions && questions[3].question}</h3>
                {
                  questions && questions[3].options?.map(option => (
                    <SelectableList
                      className={"px-4"}
                      onSelect={(e) => this.handleSelectOptionFour(e, option.id)}
                      selected={stageFourScale === option.scale ? true : false}
                      key={Math.random() * 1000}
                      value={option.scale}
                      label={option.option}
                    />
                  ))
                }
                {errors && <p className="text-error text-center">{errors.stageFour}</p>}
                <button className="btn btn-primary btn-sm btn-block mt-3" onClick={this.handleNextStep}>
                  Proceed
              </button>
              <button className="btn btn-danger btn-sm btn-block mt-3" onClick={this.handlePreviousStep}>
                  Cancel Segment
                </button>
              </div>
            </div>
          }

          {stageFive &&
            <div className="question-section questions__five">
              <div className="card p-5">
              
                <h3 className="text-medium text-center font-weight-bold text-blue">{questions && questions[4].question}</h3>
                <RangeSelector options={questions && questions[4].options} handleSelectedRange={this.handleRangeFive} selectedOption={stageFiveSelected} />
                {errors && <p className="text-error text-center">{errors.stageFive}</p>}
                <button className="btn btn-primary btn-sm btn-block mt-3" onClick={this.handleNextStep}>
                  Proceed
              </button>
              <button className="btn btn-danger btn-sm btn-block mt-3" onClick={this.handlePreviousStep}>
                  Cancel Segment
                </button>
              </div>
           
            </div>
          }

          {stageSix &&
            <div className="question-section questions__six">
              <div className="card p-5">
              
                <h3 className="text-medium text-center font-weight-bold text-blue">{questions && questions[5].question}</h3>
                <div className="row">
                  {
                    questions && questions[5].options?.map(option => (
                      <div className="col-md-6" key={Math.random() * 1000}>
                        <SelectableList
                          onSelect={(e) => this.handleSelectOptionSix(e, option.id)}
                          selected={stageSixScale.includes(option.scale)}
                          value={option.scale}
                          label={option.option}
                          noImg
                        />
                      </div>
                    ))
                  }
                </div>
                {errors && <p className="text-error text-center">{errors.stageSix}</p>}
                <button className="btn btn-primary btn-sm btn-block mt-3" onClick={this.handleJoinSegment}>
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
        </div>
        {
          finalModal &&
          <Modal onClose={null}>
            <Modal onClose={null} classes="final-modal">
             <div className="text-right pb-3">
                <img src={require('#/assets/icons/close.svg')} alt="close"/>
            </div>
            <div className="px-4 mt">
              <div className="d-flex justify-content-center">
              <svg width="109" height="109" viewBox="0 0 109 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M54.5053 102.897L76.0986 97.4443C88.4239 87.2098 96.2745 71.7727 96.2745 54.5002C96.2745 27.8582 77.6016 5.57775 52.6293 0.0317383C23.396 1.01763 0 25.0266 0 54.5C0 69.6391 6.17383 83.3352 16.1397 93.2112L54.5053 102.897Z" fill="#CBE2FF"/>
                <path d="M95.1422 54.5C95.1422 72.3647 86.5455 88.22 73.2645 98.1594L92.857 93.2116C102.824 83.3356 108.998 69.6395 108.998 54.5C108.998 24.4005 84.598 0 54.4984 0C52.1515 0 49.8391 0.148598 47.5703 0.436426C74.3986 3.84012 95.1422 26.7476 95.1422 54.5Z" fill="#BED8FB"/>
                <path d="M68.0455 20.6396C68.0455 17.856 65.7891 15.5996 63.0055 15.5996H45.6375C39.2314 15.5996 34.0381 20.7929 34.0381 27.199V40.0773H74.9576V27.3816C74.9576 24.5981 72.7012 22.3416 69.9177 22.3416H69.7478C68.8077 22.3416 68.0455 21.5797 68.0455 20.6396Z" fill="#1E1E1E"/>
                <path d="M69.9176 22.3419H69.7477C68.8076 22.3419 68.0455 21.5797 68.0455 20.6396C68.0455 17.856 65.789 15.5996 63.0055 15.5996H61.1012V40.0774H74.9574V27.3816C74.9576 24.5985 72.701 22.3419 69.9176 22.3419Z" fill="black"/>
                <path d="M90.4891 79.2707C89.1566 77.9546 87.5084 76.9368 85.6373 76.3445L70.7582 71.6337L54.5044 71.0625L38.2438 71.6337L23.3647 76.3445C18.3311 77.9382 14.9102 82.6095 14.9102 87.8894V91.9543C24.4453 102.03 37.7855 108.468 52.6308 108.969C69.2635 105.274 83.1016 94.1564 90.4891 79.2707Z" fill="#4A80AA"/>
                <path d="M94.0919 91.954V87.8891C94.0919 84.1558 92.3803 80.7285 89.5989 78.4766C81.6983 94.5766 66.0911 106.209 47.5858 108.562C49.8194 108.845 52.0944 108.995 54.4038 109C56.6227 108.996 58.8123 108.868 60.9659 108.62C73.9589 107.085 85.5516 100.979 94.0919 91.954Z" fill="#407093"/>
                <path d="M55.7349 108.184C59.0324 101.637 67.6189 83.0483 65.1705 71.4368L54.5044 67.2856L43.8284 71.437C41.3043 83.4068 50.5068 102.791 53.5534 108.755C54.2862 108.579 55.0137 108.388 55.7349 108.184Z" fill="#E4F6FF"/>
                <path d="M61.3553 102.994L57.0306 85.98H51.9709L47.6569 102.947L52.9915 108.886C54.3457 108.576 55.6811 108.216 56.9959 107.81L61.3553 102.994Z" fill="#E16568"/>
                <path d="M53.0753 108.979C53.5171 108.991 53.9597 108.999 54.404 109C54.9181 108.999 55.4305 108.99 55.9415 108.976L58.6893 105.94C56.5265 106.699 54.3016 107.325 52.0239 107.809L53.0753 108.979Z" fill="#DD636E"/>
                <path d="M63.6089 69.8666V60.2725H45.3897V69.8666C45.3897 74.8976 54.4993 80.3932 54.4993 80.3932C54.4993 80.3932 63.6089 74.8976 63.6089 69.8666Z" fill="#FFDDCE"/>
                <path d="M74.9576 38.3876H71.475C69.5381 38.3876 67.968 36.8175 67.968 34.8806V32.9614C67.968 30.4384 65.4995 28.6546 63.1041 29.4464C57.5172 31.293 51.4847 31.2934 45.8976 29.4476L45.891 29.4455C43.4956 28.6542 41.0276 30.438 41.0276 32.9608V34.8808C41.0276 36.8177 39.4575 38.3878 37.5206 38.3878H34.0381V44.1226C34.0381 45.5879 35.2261 46.7761 36.6916 46.7761C37.154 46.7761 37.5302 47.1382 37.5594 47.5998C38.1188 56.4705 45.4863 63.4929 54.498 63.4929C63.5097 63.4929 70.8772 56.4705 71.4366 47.5998C71.4658 47.1384 71.842 46.7761 72.3044 46.7761C73.7697 46.7761 74.9579 45.5882 74.9579 44.1226V38.3876H74.9576Z" fill="#FFDDCE"/>
                <path d="M71.4748 38.3874C69.5379 38.3874 67.9678 36.8173 67.9678 34.8804V32.9612C67.9678 30.4382 65.4994 28.6544 63.1039 29.4462C62.4422 29.6648 61.774 29.8556 61.1012 30.0225V48.9638C61.008 55.1265 57.6311 60.4901 52.6442 63.3888C53.2532 63.455 53.8711 63.4923 54.4976 63.4923C63.5092 63.4923 70.8768 56.4699 71.4362 47.5991C71.4654 47.1378 71.8416 46.7755 72.304 46.7755C73.7693 46.7755 74.9574 45.5875 74.9574 44.122V38.3872H71.4748V38.3874Z" fill="#FFCBBE"/>
                <path d="M45.3864 67.2861L38.2422 73.091L45.7342 82.3545C46.6456 83.2418 48.0801 83.2963 49.0564 82.481L54.6905 77.7746L45.3864 67.2861Z" fill="#F4FBFF"/>
                <path d="M63.6091 67.2861L54.6907 77.7746L59.9861 82.3024C60.9563 83.1318 62.3975 83.0901 63.3181 82.2059L70.7565 73.091L63.6091 67.2861Z" fill="#F4FBFF"/>
                <path d="M45.3878 67.2856L34.9017 72.4374C34.1033 72.8295 33.7827 73.8007 34.1904 74.5912L36.2448 78.5744C36.7772 79.6065 36.5807 80.8642 35.759 81.6847C35.336 82.1069 34.8778 82.5642 34.4808 82.9606C33.7701 83.6699 33.5149 84.718 33.8278 85.6722C36.3082 93.2334 48.2459 104.796 52.7636 108.979C53.0674 108.987 53.3718 108.993 53.6769 108.996C50.4007 102.624 38.7912 78.4132 45.3878 67.2856Z" fill="#365E7D"/>
                <path d="M73.2392 81.6845C72.4172 80.864 72.2209 79.6063 72.7533 78.5742L74.8077 74.591C75.2154 73.8005 74.8948 72.8293 74.0965 72.4372L63.6103 67.2856C70.2052 78.4102 58.6038 102.61 55.324 108.991C55.6322 108.986 55.9399 108.978 56.2469 108.968C60.774 104.775 72.6922 93.2266 75.1703 85.6724C75.4832 84.7182 75.228 83.6701 74.5173 82.9608C74.1203 82.5642 73.6622 82.1067 73.2392 81.6845Z" fill="#365E7D"/>
                <path d="M54.6923 77.7744L49.1444 82.4078L51.9712 85.9803H57.0309L59.8579 82.197L54.6923 77.7744Z" fill="#AD3336"/>
              </svg>

              </div>
                <div className="text-center">
                  <h5 className="font-bolder mt-3">Mr. Tonsan is a <span className='text-blue'>CP Lord</span></h5>
                  <p className="text-small text-grey ">
                  He is passionate about the financial security and growth of his family. His budget is all encompassing as it covers everyone. Mr. Tonsan is financially confident, he invests a significant portion of his earnings in diverse portfolios, hedging against different forms of risks. He is never in crisis to meet his educational, mortgage, and lifestyle needs. He is a man constantly walking his way up to financial freedom – a man in control!
                  </p>
                </div>
               <div className="d-flex flex-column align-items-center">
                <button className="btn btn-primary py-3 w-100 mt-4" onClick={this.handleNavigateToRecommendations}>
                See recommendations
                </button>
              </div>
            </div>
          
          </Modal>
          </Modal>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    app: { profile: { risk: { risks }, segment: { data, error }, userProfile } }
  } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.SET_RISK_QUESTIONS_REQUEST),
    risks,
    data,
    error,
    gender: userProfile?.data?.gender
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    riskAssessment: (payload) => dispatch(riskAssessment(payload)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Questions));
