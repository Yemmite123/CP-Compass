import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import { riskAssessment } from "#/store/profile/actions";
import actionTypes from "#/store/profile/actionTypes";
import SelectableList from "#/components/SelectableList";
import RangeSelector from "#/components/RangeSelector";
import Modal from "#/components/Modal";
import CONFIG from "#/config";
import CpMan from "#/assets/icons/cp-lord.svg";
import CPLogo from "#/assets/images/CP-Compass-New.svg";
import "./style.scss";

class Questions extends React.Component {
  state = {
    stageOne: true,
    stageTwo: false,
    stageThree: false,
    stageFour: false,
    stageFive: false,
    stageSix: false,
    finalModal: false,
    stageOneSelected: "",
    stageOneScale: "",
    stageTwoSelected: 1,
    stageTwoOption: "",
    stageThreeSelected: 1,
    stageThreeOption: "",
    stageFourSelected: "",
    stageFourScale: "",
    stageFiveSelected: 1,
    stageFiveOption: "",
    stageSixSelected: [],
    stageSixScale: [],
    investmentSegmentCategory: "",
    investmentSegmentIcon: "",
    errors: null,
  };

  handleSelectOptionOne = (event, optionId) => {
    this.setState({
      stageOneSelected: parseInt(optionId, 10),
      stageOneScale: parseInt(event.target.id, 10),
    });
  };

  handleSelectOptionFour = (event, optionId) => {
    this.setState({
      stageFourSelected: parseInt(optionId, 10),
      stageFourScale: parseInt(event.target.id, 10),
    });
  };

  handleSelectOptionSix = (event, optionId) => {
    if (this.state.stageSixSelected.includes(parseInt(optionId, 10))) {
      const newArr = this.state.stageSixSelected.filter(
        (item) => item !== parseInt(optionId, 10)
      );
      const newScaleArr = this.state.stageSixScale.filter(
        (item) => item !== parseInt(event.target.id, 10)
      );
      return this.setState({
        stageSixSelected: newArr,
        stageSixScale: newScaleArr,
      });
    }
    this.setState({
      stageSixScale: [
        ...this.state.stageSixScale,
        parseInt(event.target.id, 10),
      ],
      stageSixSelected: [
        ...this.state.stageSixSelected,
        parseInt(optionId, 10),
      ],
    });
  };

  handleNextStep = () => {
    this.setState({ errors: null });
    const {
      stageOne,
      stageTwo,
      stageThree,
      stageFour,
      stageFive,
      stageSix,
      stageOneSelected,
      stageTwoOption,
      stageThreeOption,
      stageFourSelected,
      stageFiveOption,
    } = this.state;

    if (stageOne) {
      if (stageOneSelected === "") {
        return this.setState({
          errors: { stageOne: "please select an option" },
        });
      }
      return this.setState({ stageOne: false, stageTwo: true });
    }
    if (stageTwo) {
      if (stageTwoOption === "") {
        return this.setState({
          errors: { stageTwo: "please select an option" },
        });
      }
      this.setState({ stageTwo: false, stageThree: true });
    }
    if (stageThree) {
      if (stageThreeOption === "") {
        return this.setState({
          errors: { stageThree: "please select an option" },
        });
      }
      this.setState({ stageThree: false, stageFour: true });
    }
    if (stageFour) {
      if (stageFourSelected === "") {
        return this.setState({
          errors: { stageFour: "please select an option" },
        });
      }
      this.setState({ stageFour: false, stageFive: true });
    }
    if (stageFive) {
      if (stageFiveOption === "") {
        return this.setState({
          errors: { stageFive: "please select an option" },
        });
      }
      this.setState({ stageFive: false, stageSix: true });
    }
    if (stageSix) {
      this.setState({ stageSix: false, finalModal: true });
    }
  };

  handlePreviousStep = () => {
    const { stageOne, stageTwo, stageThree, stageFour, stageFive, stageSix } =
      this.state;

    if (stageOne) {
      this.props.history.goBack();
    }
    if (stageTwo) {
      this.setState({ stageTwo: false, stageOne: true });
    }
    if (stageThree) {
      this.setState({ stageThree: false, stageTwo: true });
    }
    if (stageFour) {
      this.setState({ stageFour: false, stageThree: true });
    }
    if (stageFive) {
      this.setState({ stageFive: false, stageFour: true });
    }
    if (stageSix) {
      this.setState({ stageSix: false, stageFive: true });
    }
  };

  handleRangeTwo = (value, options) => {
    if (value >= 0 && value < 21) {
      const option = options.find((item) => item.scale === 1);
      return this.setState({ stageTwoSelected: 1, stageTwoOption: option.id });
    }
    if (value >= 20 && value < 41) {
      const option = options.find((item) => item.scale === 2);
      return this.setState({ stageTwoSelected: 2, stageTwoOption: option.id });
    }
    if (value >= 40 && value < 60) {
      const option = options.find((item) => item.scale === 3);
      return this.setState({ stageTwoSelected: 3, stageTwoOption: option.id });
    }
    if (value >= 60 && value < 81) {
      const option = options.find((item) => item.scale === 4);
      return this.setState({ stageTwoSelected: 4, stageTwoOption: option.id });
    }
    const option = options.find((item) => item.scale === 5);
    return this.setState({ stageTwoSelected: 5, stageTwoOption: option.id });
  };

  handleRangeThree = (value, options) => {
    if (value >= 0 && value < 21) {
      const option = options.find((item) => item.scale === 1);
      return this.setState({
        stageThreeSelected: 1,
        stageThreeOption: option.id,
      });
    }
    if (value >= 20 && value < 41) {
      const option = options.find((item) => item.scale === 2);
      return this.setState({
        stageThreeSelected: 2,
        stageThreeOption: option.id,
      });
    }
    if (value >= 40 && value < 60) {
      const option = options.find((item) => item.scale === 3);
      return this.setState({
        stageThreeSelected: 3,
        stageThreeOption: option.id,
      });
    }
    if (value >= 60 && value < 81) {
      const option = options.find((item) => item.scale === 4);
      return this.setState({
        stageThreeSelected: 4,
        stageThreeOption: option.id,
      });
    }
    const option = options.find((item) => item.scale === 5);
    return this.setState({
      stageThreeSelected: 5,
      stageThreeOption: option.id,
    });
  };

  handleRangeFive = (value, options) => {
    if (value >= 0 && value < 26) {
      const option = options.find((item) => item.scale === 1);
      return this.setState({
        stageFiveSelected: 1,
        stageFiveOption: option.id,
      });
    }
    if (value >= 25 && value < 51) {
      const option = options.find((item) => item.scale === 2);
      return this.setState({
        stageFiveSelected: 2,
        stageFiveOption: option.id,
      });
    }
    if (value >= 50 && value < 76) {
      const option = options.find((item) => item.scale === 3);
      return this.setState({
        stageFiveSelected: 3,
        stageFiveOption: option.id,
      });
    }
    const option = options.find((item) => item.scale === 4);
    return this.setState({ stageFiveSelected: 4, stageFiveOption: option.id });
  };

  handleJoinSegment = () => {
    this.setState({ errors: null });

    if (this.state.stageSixSelected.length < 1) {
      return this.setState({ errors: { stageSix: "please select an option" } });
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
          scale: this.state.stageThreeSelected,
        },
        {
          questionId: 4,
          optionId: this.state.stageFourSelected,
          scale: this.state.stageFourScale,
        },
        {
          questionId: 5,
          optionId: this.state.stageFiveOption,
          scale: this.state.stageFiveSelected,
        },
        {
          questionId: 6,
          options: this.state.stageSixSelected,
          scales: this.state.stageSixScale,
        },
      ],
      dateOfBirth: this.props.history.location.state?.dateOfBirth,
      gender: this.props.history.location.state?.gender,
    };
    this.props.riskAssessment(payload).then((data) => {
      this.setState(
        {
          investmentSegmentCategory: data.data?.assessment?.riskProfile,
          investmentMessageSegment: data.data?.assessment?.message,
          investmentSegmentIcon: data.data?.assessment?.icon,
        },
        () => this.setState({ finalModal: true })
      );
    });
  };

  handleNavigateToRecommendations = () => {
    this.props.history.push("/app/marketplace/recommended");
  };

  render() {
    const {
      stageOne,
      stageTwo,
      stageThree,
      stageFour,
      stageFive,
      stageSix,
      stageOneScale,
      stageTwoSelected,
      stageThreeSelected,
      stageFourScale,
      stageFiveSelected,
      stageSixScale,
      investmentSegmentCategory,
      finalModal,
      errors,
      investmentMessageSegment,
      investmentSegmentIcon,
    } = this.state;
    const { questions, loading, error } = this.props;

    return (
      <div className="risk-questions-page">
        <div className="questions">
          <img
            src={CPLogo}
            alt="logo"
            className="cp-logo align-self-center mt-5 mb-2"
          />
          <div
            className="card p-4 align-self-center p-0 col-lg-8 col-md-8 col-sm-10 col-11"
            style={{ height: "78vh" }}
          >
            <div className="question-header text-center">
              <div className="">
                <h3 className="text-black text-medium text-center font-weight-bold">
                  Risk Assessment
                </h3>
              </div>
              <p className="text-small text-grey">
                Answering these questions would help us recommend investments
                for you which suit your risk profile. We???ll keep your info safe
                in accordance with our{" "}
                <a
                  href={`${CONFIG.WEBSITE_URL}/legal/cookiespolicy`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  privacy policy
                </a>
                .
              </p>
            </div>

            {stageOne && (
              <div className="question-section questions__one">
                <div className=" p-5">
                  <h3 className="text-medium text-center font-weight-bold text-blue">
                    What is your investment objective?
                  </h3>
                  {questions &&
                    questions[0].options?.map((option) => (
                      <SelectableList
                        onSelect={(e) =>
                          this.handleSelectOptionOne(e, option.id)
                        }
                        selected={stageOneScale === option.scale ? true : false}
                        key={Math.random() * 1000}
                        value={option.scale}
                        label={option.option}
                        noImg
                      />
                    ))}
                  {errors && (
                    <p className="text-error text-center">{errors.stageOne}</p>
                  )}
                  <button
                    className="btn btn-primary btn-sm btn-block mt-3"
                    onClick={this.handleNextStep}
                  >
                    Proceed
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-block mt-3"
                    onClick={this.handlePreviousStep}
                  >
                    Cancel Assessment
                  </button>
                </div>
              </div>
            )}

            {stageTwo && (
              <div className="question-section questions__two">
                <div className=" p-5">
                  <h3 className="text-medium text-center font-weight-bold text-blue">
                    {questions && questions[1].question}
                  </h3>
                  <RangeSelector
                    options={questions && questions[1].options}
                    handleSelectedRange={this.handleRangeTwo}
                    selectedOption={stageTwoSelected}
                  />
                  {errors && (
                    <p className="text-error text-center">{errors.stageTwo}</p>
                  )}
                  <button
                    className="btn btn-primary btn-sm btn-block mt-3"
                    onClick={this.handleNextStep}
                  >
                    Proceed
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-block mt-3"
                    onClick={this.handlePreviousStep}
                  >
                    Cancel Assessment
                  </button>
                </div>
              </div>
            )}

            {stageThree && (
              <div className="question-section questions__three">
                <div className=" p-5">
                  <h3 className="text-medium text-center font-weight-bold text-blue">
                    {questions && questions[2].question}
                  </h3>
                  <RangeSelector
                    options={questions && questions[2].options}
                    handleSelectedRange={this.handleRangeThree}
                    selectedOption={stageThreeSelected}
                  />
                  {errors && (
                    <p className="text-error text-center">
                      {errors.stageThree}
                    </p>
                  )}
                  <button
                    className="btn btn-primary btn-sm btn-block mt-3"
                    onClick={this.handleNextStep}
                  >
                    Proceed
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-block mt-3"
                    onClick={this.handlePreviousStep}
                  >
                    Cancel Assessment
                  </button>
                </div>
              </div>
            )}

            {stageFour && (
              <div className="question-section questions__four">
                <div className=" p-5">
                  <h3 className="text-medium text-center font-weight-bold text-blue">
                    {questions && questions[3].question}
                  </h3>
                  {questions &&
                    questions[3].options?.map((option) => (
                      <SelectableList
                        className={"px-4"}
                        onSelect={(e) =>
                          this.handleSelectOptionFour(e, option.id)
                        }
                        selected={
                          stageFourScale === option.scale ? true : false
                        }
                        key={Math.random() * 1000}
                        value={option.scale}
                        label={option.option}
                      />
                    ))}
                  {errors && (
                    <p className="text-error text-center">{errors.stageFour}</p>
                  )}
                  <button
                    className="btn btn-primary btn-sm btn-block mt-3"
                    onClick={this.handleNextStep}
                  >
                    Proceed
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-block mt-3"
                    onClick={this.handlePreviousStep}
                  >
                    Cancel Assessment
                  </button>
                </div>
              </div>
            )}

            {stageFive && (
              <div className="question-section questions__five">
                <div className=" p-5">
                  <h3 className="text-medium text-center font-weight-bold text-blue">
                    {questions && questions[4].question}
                  </h3>
                  <RangeSelector
                    options={questions && questions[4].options}
                    handleSelectedRange={this.handleRangeFive}
                    selectedOption={stageFiveSelected}
                  />
                  {errors && (
                    <p className="text-error text-center">{errors.stageFive}</p>
                  )}
                  <button
                    className="btn btn-primary btn-sm btn-block mt-3"
                    onClick={this.handleNextStep}
                  >
                    Proceed
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-block mt-3"
                    onClick={this.handlePreviousStep}
                  >
                    Cancel Assessment
                  </button>
                </div>
              </div>
            )}

            {stageSix && (
              <div className="question-section questions__six">
                <div className=" p-5">
                  <h3 className="text-medium text-center font-weight-bold text-blue">
                    {questions && questions[5].question}
                  </h3>
                  <div className="row">
                    {questions &&
                      questions[5].options?.map((option) => (
                        <div className="col-md-6" key={Math.random() * 1000}>
                          <SelectableList
                            onSelect={(e) =>
                              this.handleSelectOptionSix(e, option.id)
                            }
                            selected={stageSixScale.includes(option.scale)}
                            value={option.scale}
                            label={option.option}
                            noImg
                          />
                        </div>
                      ))}
                  </div>
                  {errors && (
                    <p className="text-error text-center">{errors.stageSix}</p>
                  )}
                  <button
                    className="btn btn-primary btn-sm btn-block mt-3"
                    onClick={this.handleJoinSegment}
                  >
                    Proceed
                    {loading && (
                      <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                    )}
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-block mt-3"
                    onClick={this.handlePreviousStep}
                  >
                    Cancel Assessment
                  </button>
                  {error && typeof error === "string" && (
                    <p className="text-error text-left mt-2">{error}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {finalModal && (
          <Modal onClose={null}>
            <Modal onClose={null} classes="final-modal">
              <div className="text-right pb-3">
                <img
                  src={require("#/assets/icons/close.svg")}
                  alt="close"
                  onClick={this.handleNavigateToRecommendations}
                  className="cursor-pointer"
                />
              </div>
              <div className="px-4 mt">
                <div className="d-flex justify-content-center">
                  <img
                    src={investmentSegmentIcon}
                    style={{
                      width: "100px",
                      borderRadius: "50%",
                      height: "100px",
                    }}
                  />
                </div>
                <div className="text-center">
                  <h5 className="font-bolder mt-3 text-blue">
                    {investmentSegmentCategory}
                  </h5>

                  <p className="text-small text-grey ">
                    {investmentMessageSegment &&
                    typeof investmentMessageSegment === "object"
                      ? investmentMessageSegment.join().replaceAll(",", ", ")
                      : investmentMessageSegment}
                  </p>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <button
                    className="btn btn-primary py-3 w-100 mt-4"
                    onClick={this.handleNavigateToRecommendations}
                  >
                    See recommendations
                  </button>
                </div>
              </div>
            </Modal>
          </Modal>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    app: {
      profile: {
        risk: { risks },
        segment: { data, error },
        userProfile,
      },
    },
  } = state;

  return {
    loading: getActionLoadingState(
      state,
      actionTypes.SET_RISK_QUESTIONS_REQUEST
    ),
    risks,
    data,
    error,
    gender: userProfile?.data?.gender,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    riskAssessment: (payload) => dispatch(riskAssessment(payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Questions)
);
