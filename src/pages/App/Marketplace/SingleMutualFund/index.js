import React from 'react';
import { withRouter } from "react-router-dom";
import moment from 'moment';
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import actionTypes from "#/store/ppi/actionTypes";
import { submitMutualForm, sendFormToMail } from '#/store/ppi/actions'
import Document from '#/assets/icons/document-icon-1.svg';
import DownloadIcon from '#/assets/icons/download-icon.svg';
import Modal from '#/components/Modal';
import Textbox from '#/components/Textbox';
import SelectBox from '#/components/SelectBox';
import PhoneTextbox from '#/components/PhoneTextBox';
import { refineOptions } from '#/utils';
import { countryCodes } from '#/utils/countryCode';
import DateBox from '#/components/DateBox';
import './style.scss';
class SingleMutualFund extends React.Component {

  state = {
    showForm: false,
    countryCode: '+234',
    errors: {},
    payload: {},
    dateOfBirth: ''
  }
  descriptionRef = React.createRef();

  componentDidMount() {
    if (this.props.fund) {
      this.descriptionRef.current.innerHTML = `${this.props.fund.description}`
    }
    if(this.props.profile) {
      this.updateDetails()
    }
  }

  componentDidUpdate(prevProps){
    if (prevProps.fund !== this.props.fund) {
      this.descriptionRef.current.innerHTML = `${this.props.fund.description}`
    }
  }

  updateDetails = () => {
    this.setState({
      dateOfBirth: new Date(this.props.profile.dateOfBirth.split('T')[0])
    })
  }

  handleChangeDate = (item, date) => {
    this.setState({ [item]: date });
  }

  openForm = () => {
    this.setState(prevState => ({ showForm: !prevState.showForm }));
  }

  closeForm = (event) => {
    event.preventDefault();
    this.setState(prevState => ({ showForm: !prevState.showForm }));
  }

  submitForm = (event) => {
    event.preventDefault();

    let errors = 0;
    this.setState({ errors: {} });

    const formElements = event.target.elements;
    let payload;

    Array.prototype.forEach.call(formElements, (element) => {
      if(element.name !== '' && element.name === 'bvn' && (element.value.length < 11 || element.value.length > 11 )){
        errors +=1;
        return this.setState({ errors: { bvn: 'bvn cannot be less or greater that 11 characters'} });
      }
      if(element.name !== '' && element.name === 'phoneNumber' && (element.value.length < 10 || element.value.length > 11 )){
        errors +=1;
        return this.setState({ errors: { phoneNumber: 'phone number cannot be less than 10 or greater that 11 characters'} });
      }
      if(element.name !== '' && element.name === 'accountNumber' && (element.value.length < 10 || element.value.length > 10 )){
        errors +=1;
        return this.setState({ errors: { accountNumber: 'account number cannot be less or greater that 10 characters'} });
      }
    });

    Array.prototype.forEach.call(formElements, (element) => {
      if(this.state.dateOfBirth !== '' && element.name !== '') {
        return payload = {
          ...payload, [element.name]: element.value, DateOfBirth: moment(this.state.dateOfBirth).format('YYYY-MM-DD')
        }
      }
      if(element.name !== ''){
        return payload = {
          ...payload, [element.name]: element.value
        }
      }
    });

    if (errors > 0) {
      return null;
    }

    this.props.submitMutualForm(this.props.fund.slug, payload)
    .then(data => {
      this.openForm();
    });
  }

  sendToMail = () => {
    this.props.sendFormToMail(this.props.fund.slug);
  }

  render() {
    const { fund, loading, mailLoading, error, profile } = this.props;
    const { showForm, errors, dateOfBirth, countryCode } = this.state;
    const filename = fund.document ? fund.document[0].substring(fund.document[0].lastIndexOf('/') + 1) : '';

    return (
      <div className="single-fund-page">
        {
          showForm &&
          <Modal>
            <div className="content">
              <h4 className="text-center text-blue">Instructions</h4>
              <p className="text-grey font-weight-light text-center text-small">
                {fund.instructions ? fund.instructions : 
              'Orders must be made in accordance with the instructions set out in the Private Placement Memorandum. Investors must carefully follow all instructions as applications which do not comply with the instruction may be rejected. If in any doubt, consult your Stockbroker, Accountant, Banker, Solicitor or any professional adviser for guidance.'
                }
              </p>
              <form onSubmit={this.submitForm}>
                <div className="row">


              {fund.isFormBuilder === 1 &&
                <>
                  {
                    fund.formBuilder?.map((item, i) => {
                      return (
                        <div key={i} className="col-md-6">
                          {item.type === 'select' ?
                            <SelectBox
                              label={item.title}
                              placeholder={item.placeholder}
                              name={item.name}
                              options={refineOptions(item.options)}
                              value="value"
                              optionName="name"
                              boxClasses="mt-3"
                              actualDefaultValue={item.name === 'bankName' ? profile.bankInfo && profile.bankInfo['bankName'].toLowerCase() : profile[item.name]}
                              required
                              error={errors && errors[item.name]}
                            />
                          :
                          ( item.name === 'phoneNumber' ?
                          <PhoneTextbox 
                            name={item.name}
                            label={item.title}
                            placeholder={item.placeholder}
                            boxClasses="mt-3"
                            options={countryCodes}
                            selectName="countryCode"
                            type={item.type}
                            id={item.name.toLowerCase()}
                            actualCodeDefaultValue={profile?.countryCode ?? countryCode}
                            maxlength="11"
                            error={errors && errors[item.name]}
                            defaultNumber={profile?.phone ?? ''}
                          />
                          :
                         ( item.name === 'DateOfBirth' ?
                         <DateBox
                            label={item.title}
                            placeholder={item.placeholder}
                            name={item.name}
                            boxClasses="mt-3"
                            error={errors && errors[item.name]}
                            type={item.type}
                            id={item.name.toLowerCase()}
                            value={dateOfBirth}
                            defaultValue={dateOfBirth}
                            max={new Date()}
                            required
                            onChange={date => this.handleChangeDate('dateOfBirth', date)}
                          />
                         :
                         <Textbox
                          type={item.type}
                          name={item.name}
                          placeholder={item.placeholder}
                          label={item.title}
                          id={item.name.toLowerCase()}
                          required
                          boxClasses="mt-3"
                          defaultValue={
                            ['accountNumber'].includes(item.name) 
                            ? profile.bankInfo && profile.bankInfo[item.name]
                            : item.name === 'Nationality'
                            ?  profile.nationality 
                            : item.name === 'address' 
                            ? profile.residentialAddress 
                            : item.name === 'MiddleName'
                            ? profile.middleName
                            : item.name === 'MothersMaiden Name'
                            ? profile.motherMaidenName
                            : profile[item.name]
                          }
                          error={errors && errors[item.name]}
                          />)
                          )
                        }
                        </div>
                      )
                    })
                  }
                </>
              }
              </div>
              {error && typeof error === 'string' && <p className="text-error mt-2">{error}</p>}

              <div className="mt-4 d-flex justify-content-center">
                <button className="btn w-25 btn-sm btn-stroke mr-2" onClick={this.closeForm}>
                  Cancel
                </button>
                <button className="btn w-25 btn-sm btn-primary" type="submit">
                  submit
                  {loading &&
                    <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                  }
                </button>
              </div>
            </form>
            </div>
          </Modal>
        }
        <h3 className="border-bottom pb-2">{fund.title}</h3>
        {fund.image && <img src={fund.image} alt={fund.title} className="fund-image" /> }
        {fund.image && <hr /> }
        <p className="font-weight-normal mb-1">Summary:</p>
        <p>{fund.summary}</p>

        <p className="font-weight-normal mb-1 mt-5">Description:</p>
        <div ref={this.descriptionRef}>
        </div>
        {
          fund.document &&
          <>
            <div className="send-email-section d-flex justify-content-between align-items-center flex-wrap">
              <div className="d-flex mb-2">
                <img src={Document} alt="document" className="img-fluid" />
                <p className="mb-0 ml-2">
                  {filename.length > 35 ? `${filename.substring(0, 35)}...` : filename }
                </p>
              </div>
              <div className="d-flex mb-2">
                <button className="btn btn-sm btn-primary" onClick={this.sendToMail}>
                  Send doc to my email
                  {mailLoading &&
                    <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                  }
                </button>
              </div>
            </div>
            <div className="download-section d-flex justify-content-between align-items-center flex-wrap">
              <div className="d-flex">
                <img src={Document} alt="document" className="img-fluid" />
                <p className="mb-0 ml-2">
                  {filename.length > 35 ? `${filename.substring(0, 35)}...` : filename }
                </p>
              </div>
              <div className="d-flex">
                <a href={fund?.document && fund.document[0]} target="_blank" download rel="noopener noreferrer">
                  <img src={DownloadIcon} alt="download" className="mr-2"/>
                  <span className="text-blue">Download</span>
                </a>
              </div>
            </div>
            <p className="font-weight-bold mb-1 mt-3">Submission of form</p>
            <p>When done filling the form, please send it to <span className="text-blue">admin@cpcompass.com</span></p>
          </>
        }
        {
          fund.isFormBuilder === 1 &&
          <button className="btn btn-primary btn-sm" onClick={this.openForm}>
            Invest Now
          </button>
        }

      </div>
    )
  }
}

const mapStateToProps = state => {
  const { app: { ppi: { data, error }, profile: { userProfile: { data:profile } } } } = state;

  return {
    loading: getActionLoadingState(state, actionTypes.SUBMIT_MUTUAL_FORM_REQUEST),
    mailLoading: getActionLoadingState(state, actionTypes.SEND_FORM_TO_EMAIL_REQUEST),
    data,
    error,
    profile,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitMutualForm: (slug, payload) => dispatch(submitMutualForm(slug, payload)),
    sendFormToMail: (slug) => dispatch(sendFormToMail(slug)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleMutualFund));