import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import { addBioData, addProfilePhoto } from "#/store/profile/actions";
import actionTypes from "#/store/profile/actionTypes";
import Alert from "#/components/Alert";
import Modal from "#/components/Modal";
import CustomInput from "#/components/CustomInput";
import Textbox from "#/components/Textbox";
import DateBox from "#/components/DateBox";
import SelectBox from "#/components/SelectBox";
import PhoneTextBox from "#/components/PhoneTextBox";
import ImageUploadInput from "#/components/ImageUploadInput";
import { validateFields, serializeErrors, genderOption} from "#/utils";
import { countryCodes } from "#/utils/countryCode";
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
    console.log(event.target.value)
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
        {/* // TODO: create a component for BVN Modal */}
        {isBvnModal && (
          <Modal classes="bvn-active" onClose={this.toggleBvnModal}>
            <div className="text-center">
              <h3 className="text-deep-blue">
                Please Setup your BVN to continue
              </h3>
              <button className="btn btn-primary btn-sm btn-block mt-4" onClick={this.handleBvnSetup}>
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
            <Textbox
              boxClasses="active"
              type="text"
              label="First Name"
              value={firstName}
              placeholder={"First Name"}
              name="firstName"
              disabled={true}
                  />
            <Textbox
              boxClasses="active"
              type="text"
              label="Last Name"
              value={lastName}
              placeholder={"Last Name"}
              name="lastName"
              disabled={true}
                  />
            <Textbox
              boxClasses="active"
              type="text"
              label="Middle Name"
              value={middleName}
              placeholder={"Middle Name"}
              name="middleName"
              disabled={true}
              error={
                errors
                  ? errors.middleName
                  : errorObject && errorObject["middleName"]
              }
            />

            <DateBox
              type="text"
              label="Date of birth"
              value={dateOfBirth}
              placeholder={""}
              name="dob"
              disabled={true}
            />

            <SelectBox
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

            <Textbox
              type="text"
              boxClasses="active"
              label="Place of Birth"
              value={placeOfBirth}
              placeholder={"Country of Birth"}
              onChange={this.handleChange}
              name="placeOfBirth"
              error={
                errors
                  ? errors.placeOfBirth
                  : errorObject && errorObject["placeOfBirth"]
              }
                  /> 
            <Textbox
              type="text"
              boxClasses="active"
              label="State of Origin"
              value={stateOfOrigin}
              placeholder={"State of Origin"}
              onChange={this.handleChange}
              name="stateOfOrigin"
              error={
                errors
                  ? errors.stateOfOrigin
                  : errorObject && errorObject["stateOfOrigin"]
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
              name="email"
              boxClasses={"active"}
              value={email}
              label="Email address"
              placeholder="Email address"
              disabled={true}
            />

            <Textbox
              type="text"
              boxClasses="active"
              label="Mother's maiden name"
              value={motherMaidenName}
              placeholder={"Mother's maiden name"}
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
              label="Residential Address"
              value={residentialAddress}
              placeholder={"Residential Address"}
              name="residentialAddress"
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
              <button className="btn-default px-4" disabled={loading}>
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
