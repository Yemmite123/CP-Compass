import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { getActionLoadingState } from "#/store/selectors";
import { addEmploymentDetails } from "#/store/profile/actions";
import actionTypes from "#/store/profile/actionTypes";
import Alert from "#/components/Alert";
import Modal from "#/components/Modal";
import {
  validateFields,
  serializeErrors,
  employmentOption,
  qualificationOption,
  industiesList,
} from "#/utils";
import CustomInput from "#/components/CustomInput";
import "./style.scss";

class EmploymentDetails extends React.Component {
  state = {
    qualification: "",
    status: "",
    appointmentDate: new Date(),
    occupation: "",
    companyName: "",
    companyAddress: "",
    companyType: "",
    officialPhoneNumber: "",
    officialEmailAddress: "",
    errors: null,
    countryCode: "+234",
    isBvnModal: false,
  };

  componentDidMount() {
    this.setValues();
  }

  setValues = () => {
    const { userInfo } = this.props;
    if (userInfo) {
      this.setState({
        qualification:
          userInfo && userInfo.qualification ? userInfo.qualification : "",
        status: userInfo && userInfo.status ? userInfo.status : "",
        appointmentDate:
          userInfo && userInfo.appointmentDate
            ? new Date(userInfo.appointmentDate.split("T")[0])
            : "",
        occupation: userInfo && userInfo.occupation ? userInfo.occupation : "",
        companyName:
          userInfo && userInfo.companyName ? userInfo.companyName : "",
        companyAddress:
          userInfo && userInfo.companyAddress ? userInfo.companyAddress : "",
        companyType: 
          userInfo && userInfo.companyType ? userInfo.companyType : "",
        officialPhoneNumber:
          userInfo && userInfo.officialPhoneNumber
            ? userInfo.officialPhoneNumber
            : "",
        officialEmailAddress:
          userInfo && userInfo.officialEmailAddress
            ? userInfo.officialEmailAddress
            : "",
      });
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  handleStatusChange = (event) => {
    const { value } = event.target;
    this.setState({ status: value });
  };

  handleQualificationChange = (event) => {
    const { value } = event.target;
    this.setState({ qualification: value });
  };

  handleChangeDate = (item, date) => {
    this.setState({ [item]: date });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.props.isBvnActive) {
      return this.toggleBvnModal();
    }

    const { addEmploymentDetails } = this.props;
    const {
      qualification,
      status,
      appointmentDate,
      occupation,
      companyName,
      companyAddress,
      companyType,
      officialPhoneNumber,
      officialEmailAddress,
      countryCode,
    } = this.state;

    this.setState({ errors: null });

    const hasNoQualification = status === "retired" || status === "student";
    const data = this.state;
    const required = hasNoQualification ? [] : ["qualification"];
    const errors = validateFields(data, required);

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }
    let payload = {
      qualification,
      status,
      appointmentDate: moment(appointmentDate).format("YYYY-MM-DD"),
      occupation,
      companyName,
      companyType,
      companyAddress,
      officialPhoneNumber,
      officialEmailAddress,
      countryCode,
    };

    if(status === 'self-employed') {
      payload = {status, qualification, companyName, companyAddress, companyType};
    }
    if(hasNoQualification) {
      payload = {status};
    }

    addEmploymentDetails(payload);
  };

  handleBvnSetup = () => {
    this.props.history.push("/app/onboarding");
  };

  toggleBvnModal = () => {
    this.setState((prevState) => ({ isBvnModal: !prevState.isBvnModal }));
  };

  render() {
    const {
      isBvnModal,
      countryCode,
      qualification,
      appointmentDate,
      errors,
      occupation,
      companyName,
      companyAddress,
      companyType,
      officialPhoneNumber,
      officialEmailAddress,
      status,
    } = this.state;
    const { loading, error, data } = this.props;
    const errorObject = serializeErrors(error);

    return (
      <div className="section-container">
        {isBvnModal && (
          <Modal classes="bvn-active" onClose={this.toggleBvnModal}>
            <div className="text-center">
              <h3 className="text-deep-blue">
                Please Setup your BVN to continue
              </h3>
              <button
                className="btn btn-primary btn-sm btn-block mt-4"
                onClick={this.handleBvnSetup}
              >
                Setup BVN
              </button>
            </div>
          </Modal>
        )}
        <div>
          <h2 className="section-header">Employment Details</h2>
          <p className="section-description">We’d like to know what you do.</p>
          <form onSubmit={this.handleSubmit} className="section-form">
            {status !== "retired" && status !== "student" && <CustomInput
              name="qualification"
              label="Level of Qualification"
              type="select"
              options={qualificationOption}
              value={qualification}
              onChange={this.handleQualificationChange}
              error={
                errors
                  ? errors.qualification
                  : errorObject && errorObject["qualification"]
              }
            />}
            <CustomInput
              name="status"
              label="Employment Status"
              type="select"
              options={employmentOption}
              value={status}
              onChange={this.handleStatusChange}
              error={
                errors ? errors.status : errorObject && errorObject["status"]
              }
            />
            {status === "employed" && <CustomInput
              name="occupation"
              label="Occupation"
              value={occupation}
              onChange={this.handleChange}
              error={
                errors
                  ? errors.occupation
                  : errorObject && errorObject["occupation"]
              }
            />}
            {status === "employed" && <CustomInput
              name="appointmentDate"
              label="Appointment Date"
              value={appointmentDate}
              type="date"
              onChange={(date) =>
                this.handleChangeDate("appointmentDate", date)
              }
              error={
                errors
                  ? errors.appointmentDate
                  : errorObject && errorObject["appointmentDate"]
              }
              maxDate={new Date()}
            />}
            {(status === "employed" || status === "self-employed") && <CustomInput
              name="companyName"
              label="Company Name"
              value={companyName}
              onChange={this.handleChange}
              error={
                errors
                  ? errors.companyName
                  : errorObject && errorObject["companyName"]
              }
            />}
            {(status === "employed" || status === "self-employed") && <CustomInput
              name="companyAddress"
              label="Company Address"
              value={companyAddress}
              onChange={this.handleChange}
              error={
                errors
                  ? errors.companyAddress
                  : errorObject && errorObject["companyAddress"]
              }
            />}
            {(status === "employed" || status === "self-employed") && <CustomInput
              name="companyType"
              label="Company Type"
              type="select"
              options={industiesList}
              value={companyType}
              onChange={this.handleChange}
              error={
                errors
                  ? errors.companyType
                  : errorObject && errorObject["companyType"]
              }
            />}
            {status === "employed" && <CustomInput
              name="officialPhoneNumber"
              label="Official Phone Number"
              type="phone"
              value={officialPhoneNumber}
              countryCodeValue={countryCode}
              onChange={this.handleChange}
              error={
                errors
                  ? errors.officialPhoneNumber
                  : errorObject && errorObject["officialPhoneNumber"]
              }
            />}
            {status === "employed" && <CustomInput
              name="officialEmailAddress"
              label="Official Email Address"
              value={officialEmailAddress}
              onChange={this.handleChange}
              error={
                errors
                  ? errors.officialEmailAddress
                  : errorObject && errorObject["officialEmailAddress"]
              }
            />}
            <div className="section-form__button-area">
              {error && typeof error === "string" && (
                <p className="text-error text-left">{error}</p>
              )}
              {data && (
                <Alert alert={{ type: "success", message: data.message }} />
              )}
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
    );
  }
}

const mapStateToProps = (state) => {
  const {
    app: {
      profile: {
        userProfile: { data: userData },
        employment: { error, data },
      },
    },
  } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.ADD_EMPLOYMENT_REQUEST),
    error,
    data,
    isBvnActive: userData && userData.bvn ? true : false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addEmploymentDetails: (payload) => dispatch(addEmploymentDetails(payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EmploymentDetails)
);