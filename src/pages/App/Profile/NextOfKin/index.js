import React from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import { addNextOfKinDetails } from "#/store/profile/actions";
import actionTypes from "#/store/profile/actionTypes";
import Alert from "#/components/Alert";
import Modal from "#/components/Modal";
import CustomInput from "#/components/CustomInput";
import Textbox from "#/components/Textbox";
import DateBox from "#/components/DateBox";
import SelectBox from "#/components/SelectBox";
import PhoneTextBox from "#/components/PhoneTextBox";
import { countryCodes } from "#/utils/countryCode";
import {
  validateFields,
  serializeErrors,
  genderOption,
  relationshipOption,
} from "#/utils";
import "./style.scss";

class NextOfKin extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    gender: "male",
    phone: "",
    dateOfBirth: new Date(),
    relationship: "brother",
    motherMaidenName: "",
    contactAddress: "",
    nationality: "",
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
        firstName: userInfo && userInfo.firstName ? userInfo.firstName : "",
        lastName: userInfo && userInfo.lastName ? userInfo.lastName : "",
        email: userInfo && userInfo.email ? userInfo.email : "",
        phone: userInfo && userInfo.phone ? userInfo.phone : "",
        gender: userInfo && userInfo.gender ? userInfo.gender : "male",
        dateOfBirth:
          userInfo && userInfo.dateOfBirth
            ? new Date(userInfo.dateOfBirth.split("T")[0])
            : "",
        relationship:
          userInfo && userInfo.relationship ? userInfo.relationship : "brother",
        motherMaidenName:
          userInfo && userInfo.motherMaidenName
            ? userInfo.motherMaidenName
            : "",
        contactAddress:
          userInfo && userInfo.contactAddress ? userInfo.contactAddress : "",
        nationality:
          userInfo && userInfo.nationality ? userInfo.nationality : "",
        countryCode:
          userInfo && userInfo.countryCode ? userInfo.countryCode : "+234",
      });
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    console.log(value)
    this.setState({ [name]: value });
  };

  handleChangeDate = (item, date) => {
    this.setState({ [item]: date });
  };

  handleGenderChange = (event) => {
    const { value } = event.target;
    this.setState({ gender: value });
  };

  handleRelationshipChange = (event) => {
    const { value } = event.target;
    this.setState({ relationship: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.props.isBvnActive) {
      return this.toggleBvnModal();
    }

    const { addNextOfKinDetails } = this.props;
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      motherMaidenName,
      contactAddress,
      nationality,
      relationship,
      gender,
      countryCode,
    } = this.state;

    this.setState({ errors: null });

    const data = this.state;
    const required = [];
    const errors = validateFields(data, required);

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }
    const payload = {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth: moment(dateOfBirth).format("YYYY-MM-DD"),
      motherMaidenName,
      contactAddress,
      nationality,
      relationship,
      gender,
      countryCode,
    };
    addNextOfKinDetails(payload);
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
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      motherMaidenName,
      contactAddress,
      nationality,
      errors,
      gender,
      relationship,
      countryCode,
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
          <h2 className="section-header">Next of Kin</h2>
          <p className="section-description">
            Our first point of contact should the need arise
          </p>
          <form onSubmit={this.handleSubmit} className="section-form">
            <Textbox
              onChange={this.handleChange}
              boxClasses="active"
              type="text"
              label="First Name"
              value={firstName}
              placeholder={"First Name"}
              name="firstName"
            />
            <Textbox
              onChange={this.handleChange}

              boxClasses="active"
              type="text"
              label="Last Name"
              value={lastName}
              placeholder={"Last Name"}
              name="lastName"
            />
            <SelectBox
              boxClasses="active"
              label="Gender"
              value={gender}
              placeholder={"Gender"}
              options={genderOption}
              optionName="name"
              onChange={this.handleGenderChange}
              error={
                errors ? errors.gender : errorObject && errorObject["gender"]
              }
            />
            <DateBox
              label="Date of Birth"
              value={dateOfBirth}
              placeholder={""}
              name="dateOfBirth"
              onChange={(date) => this.handleChangeDate("dateOfBirth", date)}
              error={
                errors
                  ? errors.dateOfBirth
                  : errorObject && errorObject["dateOfBirth"]
              }
              maxDate={new Date()}
            />
            <SelectBox
              boxClasses="active"

              name="relationship"
              label="Relationship"
              value={relationship}
              onChange={this.handleRelationshipChange}
              type="select"
              options={relationshipOption}
              placeholder={"Relationship"}
              optionName="name"
              error={
                errors
                  ? errors.relationship
                  : errorObject && errorObject["relationship"]
              }
            />
            <Textbox
              onChange={this.handleChange}
              name="email"
              boxClasses={"active"}
              value={email}
              label="Email Address"
              placeholder="Email Address"
              error={
                errors ? errors.email : errorObject && errorObject["email"]
              }
            />
            <PhoneTextBox
              onChange={this.handleChange}
              boxClasses="active"
              name="phone"
              value={phone}
              label="Phone number"
              placeholder="Phone number"
              options={countryCodes}
              onChangeSelect={this.handleChange}
              selectName="countryCode"
              defaultValue={countryCode}
              type="number"
              error={errors ? errors.phoneNumber : (errorObject && errorObject['phone'])}
            />

            <Textbox
              type="text"
              boxClasses="active"
              label="Mother's Maiden Name"
              value={motherMaidenName}
              placeholder={"Mother's Maiden Name"}
              name="motherMaidenName"
              onChange={this.handleChange}
              error={
                errors
                  ? errors.motherMaidenName
                  : errorObject && errorObject["motherMaidenName"]
              }
            />

            <Textbox
              type="text"
              boxClasses="active"
              label="Contact Address"
              value={contactAddress}
              placeholder={"Contact Address"}
              name="contactAddress"
              onChange={this.handleChange}
              error={
                errors
                  ? errors.contactAddress
                  : errorObject && errorObject["contactAddress"]
              }
            />

            <Textbox
              type="text"
              boxClasses="active"
              label="Nationality"
              value={nationality}
              placeholder={"Nationality"}
              onChange={this.handleChange}
              name="nationality"
              error={
                errors
                  ? errors.nationality
                  : errorObject && errorObject["nationality"]
              }
            />
            <div className="section-form__button-area">
              {error && typeof error === "string" && (
                <p className="text-error text-left">{error}</p>
              )}
              {data && (
                <Alert alert={{ type: "success", message: data.message }} />
              )}
              <button className="btn-default px-4`" disabled={loading}>
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
        nextOfKin: { error, data },
      },
    },
  } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.ADD_NEXT_OF_KIN_REQUEST),
    error,
    data,
    isBvnActive: userData && userData.bvn ? true : false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addNextOfKinDetails: (payload) => dispatch(addNextOfKinDetails(payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NextOfKin)
);
