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
import moment from "moment"
import { validateFields, serializeErrors, genderOption } from "#/utils";
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
    isSubmitted: false
  };
  imgRef = React.createRef();

  componentDidMount() {
    this.setValues();
  }

  handleChangeDate = (item, date) => {
    this.setState({ [item]: date });
  };

  setValues = () => {
    const { userInfo } = this.props;
    ((userInfo && userInfo.dateOfBirth) ? this.setState({ isSubmitted: true }) : this.setState({ isSubmitted: false }))
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

    this.setState({ isSubmitted: true });
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
      isSubmitted,
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
            <div className="text-right pb-3">
              <img src={require('#/assets/icons/close.svg')} alt="close" className="cursor-pointer" onClick={this.toggleBvnModal} />
            </div>
            <div className="px-4 mt">
              <div className="d-flex justify-content-center">
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="26" cy="26" r="26" fill="#EEF0FF" />
                  <path d="M26.0943 18.9523C26.6161 18.9523 27.0392 18.5292 27.0392 18.0074C27.0392 17.4855 26.6161 17.0625 26.0943 17.0625C25.5725 17.0625 25.1494 17.4855 25.1494 18.0074C25.1494 18.5292 25.5725 18.9523 26.0943 18.9523Z" fill="#3A4080" />
                  <path d="M37.2441 35.1104H14.9449C14.423 35.1104 14 35.5334 14 36.0552C14 36.5771 14.423 37.0001 14.9449 37.0001H37.2441C37.766 37.0001 38.189 36.5771 38.189 36.0552C38.189 35.5334 37.766 35.1104 37.2441 35.1104Z" fill="#3A4080" />
                  <path d="M38.189 18.9055C38.189 18.532 37.9689 18.1935 37.6275 18.0419L26.4543 13.0813C26.2096 12.9726 25.9305 12.973 25.6861 13.0819L14.5601 18.0425C14.2194 18.1944 14 18.5326 14 18.9055V21.4095C14 21.4175 14.001 21.4252 14.0012 21.4331C14.001 21.441 14 21.4487 14 21.4567C14 21.9786 14.423 22.4016 14.9449 22.4016C15.4997 22.4016 15.748 22.8762 15.748 23.3465V32.1583C15.748 32.1781 15.7498 32.1974 15.751 32.217C15.7498 32.2365 15.748 32.2558 15.748 32.2756C15.748 32.7975 16.1711 33.2205 16.6929 33.2205H35.5906C36.1124 33.2205 36.5354 32.7975 36.5354 32.2756C36.5354 31.7538 36.1124 31.3307 35.5906 31.3307H32.7559V23.3465C32.7559 22.8255 33.1798 22.4016 33.7008 22.4016C34.2218 22.4016 34.6457 22.8255 34.6457 23.3465V27.5284C34.6457 28.0503 35.0687 28.4733 35.5906 28.4733C36.1124 28.4733 36.5354 28.0503 36.5354 27.5284V23.3465C36.5354 23.1248 36.5866 22.4016 37.2441 22.4016C37.766 22.4016 38.189 21.9786 38.189 21.4567C38.189 21.4487 38.188 21.441 38.1878 21.4331C38.188 21.4252 38.189 21.4175 38.189 21.4095V18.9055ZM19.5276 31.3307H17.6378V23.3465C17.6378 22.8255 18.0617 22.4016 18.5827 22.4016C19.1037 22.4016 19.5276 22.8255 19.5276 23.3465V31.3307ZM23.3071 31.3307H21.4173V23.3465C21.4173 22.8255 21.8412 22.4016 22.3622 22.4016C22.8832 22.4016 23.3071 22.8255 23.3071 23.3465V31.3307ZM27.0866 31.3307H25.1969V23.3465C25.1969 22.8255 25.6207 22.4016 26.1417 22.4016C26.6627 22.4016 27.0866 22.8255 27.0866 23.3465V31.3307ZM30.8661 31.3307H28.9764V23.3465C28.9764 22.8255 29.4003 22.4016 29.9213 22.4016C30.4423 22.4016 30.8661 22.8255 30.8661 23.3465V31.3307ZM36.2992 20.4646H15.8898V19.5188L26.0717 14.9791L36.2992 19.5199V20.4646Z" fill="#3A4080" />
                </svg>
              </div>
              <div className="text-center">
                <h5 className="text-blue font-bolder mt-3"> Please Setup your BVN to continue</h5>
              </div>
              <div className="d-flex flex-column align-items-center">
                <button className="btn btn-primary py-3 w-100 mt-4" onClick={this.handleBvnSetup}>
                  Setup BVN
                </button>
              </div>
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
            maxSizeInMb={150 / 1024}
            handleFile={this.handleImageSelect}
          />
          <form onSubmit={this.handleSubmit} className="section-form">
            <Textbox
              boxClasses="active"
              type="text"
              label="First Name"
              displayLabel={true}
              value={firstName}
              placeholder={"First Name"}
              name="firstName"
              disabled={true}
            />
            <Textbox
              boxClasses="active"
              type="text"
              label="Last Name"
              displayLabel={true}
              value={lastName}
              placeholder={"Last Name"}
              name="lastName"
              disabled={true}
            />
            <Textbox
              boxClasses="active"
              type="text"
              label="Other Names"
              value={middleName}
              displayLabel={true}
              placeholder={"Middle Name"}
              onChange={this.handleChange}
              name="middleName"
              error={
                errors
                  ? errors.middleName
                  : errorObject && errorObject["middleName"]
              }
            />

            <DateBox
              type="text"
              label="Date of Birth"
              value={dateOfBirth}
              placeholder={""}
              name="dob"
              onChange={(date) => this.handleChangeDate("dateOfBirth", date)}
              startDate={moment().subtract(18, "y").toDate()}
              max={moment().subtract(18, "y").toDate()}
              disabled={(this.props.isBvnActive) ? true : false}
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

            <Textbox
              type="text"
              boxClasses="active"
              label="Country of Birth"
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
              label="Phone Number"
              placeholder="Phone Number"
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
              label="Email Address"
              placeholder="Email Address"
              disabled={true}
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
