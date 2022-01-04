import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import { addBioData, addProfilePhoto } from "#/store/profile/actions";
import actionTypes from "#/store/profile/actionTypes";
import Alert from "#/components/Alert";
import Modal from "#/components/Modal";
import CustomInput from "#/components/CustomInput";
import ImageUploadInput from "#/components/ImageUploadInput";
import { validateFields, serializeErrors, genderOption } from "#/utils";
import "./style.scss";

class BioData extends React.Component {
  state = {
    fileName: "",
    file: null,
    phone: "",
    placeOfBirth: "",
    middleName: "",
    nationality: "",
    stateOfOrigin: "",
    gender: "",
    motherMaidenName: "",
    residentialAddress: "",
    errors: null,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    pictureUrl: null,
    countryCode: "+234",
    isBvnModal: false,
  };
  imgRef = React.createRef();

  componentDidMount() {
    this.setValues();
  }

  setValues = () => {
    const { userInfo } = this.props;
    if (userInfo) {
      this.setState({
        firstName: userInfo && userInfo.firstName ? userInfo.firstName : "",
        lastName: userInfo && userInfo.lastName ? userInfo.lastName : "",
        gender: userInfo && userInfo.gender ? userInfo.gender : "",
        dateOfBirth:
          userInfo && userInfo.dateOfBirth
            ? userInfo.dateOfBirth.split("T")[0]
            : "",
        email: userInfo && userInfo.email ? userInfo.email : "",
        middleName: userInfo && userInfo.middleName ? userInfo.middleName : "",
        motherMaidenName:
          userInfo && userInfo.motherMaidenName
            ? userInfo.motherMaidenName
            : "",
        placeOfBirth:
          userInfo && userInfo.placeOfBirth ? userInfo.placeOfBirth : "",
        phone: userInfo && userInfo.phone ? userInfo.phone : "",
        residentialAddress:
          userInfo && userInfo.residentialAddress
            ? userInfo.residentialAddress
            : "",
        nationality:
          userInfo && userInfo.nationality ? userInfo.nationality : "",
        stateOfOrigin:
          userInfo && userInfo.stateOfOrigin ? userInfo.stateOfOrigin : "",
        pictureUrl:
          userInfo && userInfo.pictureUrl ? userInfo.pictureUrl : null,
      });
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  handleFileClick = (e) => {
    e.preventDefault();
    this.imgRef.current.click();
  };

  handleImageSelect = (file) => {
    const { addProfilePhoto } = this.props;
    this.setState({ fileName: file.name }, () => {
      const formData = new FormData();
      formData.append('profile_picture', file);
      addProfilePhoto(formData);
    })
  }

  handleGenderChange = (event) => {
    const { value } = event.target;
    this.setState({ gender: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (!this.props.isBvnActive) {
      return this.toggleBvnModal();
    }

    const { addBioData } = this.props;
    const {
      middleName,
      placeOfBirth,
      phone,
      stateOfOrigin,
      motherMaidenName,
      residentialAddress,
      nationality,
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
      middleName,
      placeOfBirth,
      phone,
      stateOfOrigin,
      motherMaidenName,
      residentialAddress,
      nationality,
      gender,
      countryCode,
    };
    addBioData(payload);
  };

  handleBvnSetup = () => {
    this.props.history.push("/app/onboarding");
  };

  toggleBvnModal = () => {
    this.setState((prevState) => ({ isBvnModal: !prevState.isBvnModal }));
  };

  render() {
    const {
      email,
      middleName,
      firstName,
      lastName,
      placeOfBirth,
      phone,
      stateOfOrigin,
      motherMaidenName,
      residentialAddress,
      nationality,
      errors,
      dateOfBirth,
      pictureUrl,
      gender,
      countryCode,
      isBvnModal,
    } = this.state;
    const { loading, error, data, photo } = this.props;
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
          <h2 className="section-header">Bio-data</h2>
          <p className="section-description">
            This section contains your basic profile information like name,
            email etc.
          </p>
          <ImageUploadInput
            label="Change Profile Avatar"
            instruction="Upload JPG or PNG files - Max size of 150Kb."
            currentImageURL={photo || pictureUrl}
            handleFile={this.handleImageSelect}
          />
          <form onSubmit={this.handleSubmit} className="section-form">
            <CustomInput
              name="firstName"
              label="First name"
              value={firstName}
              disabled
            />
            <CustomInput
              name="lastName"
              label="Last name"
              value={lastName}
              disabled
            />
            <CustomInput
              name="middleName"
              label="Other name"
              value={middleName}
              onChange={this.handleChange}
              error={
                errors
                  ? errors.middleName
                  : errorObject && errorObject["middleName"]
              }
            />
            <CustomInput
              name="dob"
              label="Date of birth"
              value={dateOfBirth}
              disabled
              type="date"
            />
            <CustomInput
              name="gender"
              label="Gender"
              value={gender}
              onChange={this.handleGenderChange}
              type="select"
              options={genderOption}
              error={
                errors ? errors.gender : errorObject && errorObject["gender"]
              }
            />
            <CustomInput
              name="placeOfBirth"
              label="Country of Birth"
              value={placeOfBirth}
              onChange={this.handleChange}
              error={
                errors
                  ? errors.placeOfBirth
                  : errorObject && errorObject["placeOfBirth"]
              }
            />
            <CustomInput
              name="stateOfOrigin"
              label="State of Origin"
              value={stateOfOrigin}
              onChange={this.handleChange}
              error={
                errors
                  ? errors.stateOfOrigin
                  : errorObject && errorObject["stateOfOrigin"]
              }
            />
            <CustomInput
              name="nationality"
              label="Nationality"
              value={nationality}
              onChange={this.handleChange}
              error={
                errors
                  ? errors.nationality
                  : errorObject && errorObject["nationality"]
              }
            />
            <CustomInput
              name="phone"
              label="Phone number"
              type="phone"
              value={phone}
              countryCodeValue={countryCode}
              onChange={this.handleChange}
              error={
                errors
                  ? errors.phoneNumber
                  : errorObject && errorObject["phone"]
              }
            />
            <CustomInput
              name="email"
              label="Email address"
              value={email}
              disabled
            />
            <CustomInput
              name="motherMaidenName"
              label="Mother's maiden name"
              value={motherMaidenName}
              onChange={this.handleChange}
              error={
                errors
                  ? errors.motherMaidenName
                  : errorObject && errorObject["motherMaidenName"]
              }
            />
            <CustomInput
              name="residentialAddress"
              label="Residential Address"
              value={residentialAddress}
              onChange={this.handleChange}
              error={
                errors
                  ? errors.residentialAddress
                  : errorObject && errorObject["residentialAddress"]
              }
            />
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
        bioData: { error, data, photo },
      },
    },
  } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.ADD_BIODATA_REQUEST),
    error,
    data,
    photo,
    isBvnActive: userData && userData.bvn ? true : false,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addBioData: (payload) => dispatch(addBioData(payload)),
    addProfilePhoto: (payload) => dispatch(addProfilePhoto(payload)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BioData)
);
