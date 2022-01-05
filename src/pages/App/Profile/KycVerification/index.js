import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { getActionLoadingState } from "#/store/selectors";
import { updateKyc, addBankDetails, getUserProfile  } from "#/store/profile/actions";
import actionTypes from "#/store/profile/actionTypes";
import Alert from '#/components/Alert';
import CustomInput from "#/components/CustomInput";
import ImageUploadInput from "#/components/ImageUploadInput";
import { documentOptions, validateFields, serializeErrors } from '#/utils';
import './style.scss';

class KycVerification extends React.Component {
  imgUtilityRef = React.createRef();
  imgGovernmentRef = React.createRef();

  state = {
    governmentFileName: '',
    governmentFile: null,
    utilityFileName: '',
    utilityFile: null,
    documentType: '',
    errors: null,
    kycErrors: null,
    accountNumber: '',
    bankCode: '',
    accountName: '',
    passport: null, 
    signature: null,
  }

  componentDidMount() {
    this.setValues()
  }

  setValues = () => {
    const { bankInfo } = this.props;
    if(bankInfo){
      this.setState({
        accountNumber: bankInfo && bankInfo.accountNumber ? bankInfo.accountNumber : '',
        bankCode: bankInfo && bankInfo.bankCode ? bankInfo.bankCode : '',
        accountName: bankInfo && bankInfo.accountName ? bankInfo.accountName : '',
      })
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.bankInfo !== this.props.bankInfo) {
      this.setValues();
    }
  }

  handleBankChange = (event) => {
    const { value } = event.target
    if(value === '...select...'){
      return this.setState({ bankCode: '' });;
    }
    return this.setState({ bankCode: value });
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value });
  }

  handleGovernmetFileSelect = (file) => {
    return this.setState({ governmentFileName: file.name, governmentFile: file })
  }

  handleUtilityFileSelect = (file) => {
    return this.setState({ utilityFileName: file.name, utilityFile: file })
  }

  handleDocumentChange = (event) => {
    const { value } = event.target
    this.setState({ documentType: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ kycErrors: null });

    const { updateKyc } = this.props;
    const { governmentFile, utilityFile, documentType, passport, signature } = this.state;
    if(!governmentFile && !utilityFile && !signature && !passport) {
      return this.setState({ kycErrors: {file: 'please select a file'} });
    }
    if(governmentFile && !documentType) {
      return this.setState({ kycErrors: { document: 'please select a type'} });
    }
    const formData = new FormData();
    if (utilityFile) formData.append('utility_bill', utilityFile)
    if (governmentFile) formData.append(documentType, governmentFile)
    if (signature) formData.append('signature', signature)
    if (passport) formData.append('passport-photograph', passport)

    updateKyc(formData);
  }

  handleSubmitBankInfo = (event) => {
    event.preventDefault();
    this.setState({ errors: null });
    const { bankCode, accountNumber } = this.state;

    const data = this.state;
    const required = [ 'accountNumber', 'bankCode' ];
    const errors = validateFields(data, required)
    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }
    const payload = { bankCode, accountNumber }
    this.props.addBankDetails(payload).then(() => this.props.getUserProfile());
  }

  render() {
    const { errors, kycErrors, accountNumber, bankCode, accountName } = this.state;
    const { bvn, loading, data, error, banks, bankLoading, bankData, bankError } = this.props
    const errorObject = serializeErrors(bankError);

    return (
      <div className="mb-5">
        <div className="section-container">
          <h2 className="section-header mb-3">Bank Verification Number</h2>
          <div className="section-form mt-4">
            <CustomInput
              name="bvn"
              label="BVN"
              value={bvn ? `******${bvn.slice(7)}` : 'No BVN yet'}
              disabled
            />
            <CustomInput
              name="bankCode"
              label="Bank Name"
              value={bankCode}
              onChange={this.handleBankChange}
              type="select"
              valueKey="code"
              options={banks ? banks : []}
              error={errors ? errors.bankCode : (errorObject && errorObject['bankCode'])}
            />
            <CustomInput
              name="accountNumber"
              label="Account Number"
              value={accountNumber}
              onChange={this.handleChange}
              error={errors ? errors.accountNumber : (errorObject && errorObject['accountNumber'])}
            />
            <CustomInput
              name="accountName"
              label="Account Name"
              value={accountName}
              disabled
            />
            <div className="section-form__button-area">
              <div className="col col-md-7">
                {bankData && bankData.message !== '' && <Alert alert={{ type:"success", message: bankData.message}}/>}
              </div>
              {bankError && typeof bankError === 'string' && <p className="text-error text-left">{bankError}</p>}
              <button className="btn-default" disabled={bankLoading} onClick={this.handleSubmitBankInfo}>
                Save changes
                {bankLoading && (
                  <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="section-container">
          <h2 className="section-header mb-3">KYC Documents</h2>
          <ImageUploadInput
            acceptsList="image/png, image/jpeg, application/pdf"
            label="Upload Utility Bill"
            handleFile={this.handleUtilityFileSelect}
          />
          <ImageUploadInput
            acceptsList="image/png, image/jpeg, application/pdf"
            label="Upload Government-issued ID"
            handleFile={this.handleGovernmetFileSelect}
          />
          <div className="id-type-area">
            <CustomInput
              name="documentType"
              label="Type of ID uploaded"
              onChange={this.handleDocumentChange}
              type="select"
              options={documentOptions}
            />
          </div>
          {kycErrors && <p className="text-error">{kycErrors.document}</p>}
        </div>

        <div className="section-container">
          <h2 className="section-header mb-3">Other Documents</h2>
          <ImageUploadInput
            acceptsList="image/png, image/jpeg, application/pdf"
            label="Upload Signature Specimen"
            handleFile={file => this.setState({ signature: file})}
          />
          <ImageUploadInput
            acceptsList="image/png, image/jpeg, application/pdf"
            label="Upload Passport Photo"
            handleFile={file => this.setState({ passport: file})}
          />
          <div className="section-form__button-area mt-5">
            <div className="col col-md-7 mt-3">
              {error && <p className="text-error">{error}</p>}
              {kycErrors && <p className="text-error">{kycErrors.file}</p>}
              {data && <Alert alert={{ type:"success", message: 'Successfully uploaded your document(s)'}}/>}
            </div>
            <button className="btn-default" disabled={loading} onClick={this.handleSubmit}>
              Save changes
              {loading && (
                <div className="spinner-border spinner-border-white spinner-border-sm ml-2"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { app: { profile: { kyc: { error, data }, banks } } } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.UPDATE_KYC_REQUEST),
    bankLoading: getActionLoadingState(state, actionTypes.ADD_BANK_DETAILS_REQUEST),
    error,
    data,
    banks: banks.banks?.data && banks.banks.data.banks,
    bankData: banks.data && banks.data,
    bankError: banks.error && banks.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateKyc: (payload) => dispatch(updateKyc(payload)),
    addBankDetails: (payload) => dispatch(addBankDetails(payload)),
    getUserProfile: () => dispatch(getUserProfile()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(KycVerification));
