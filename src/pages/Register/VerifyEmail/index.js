import React from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import { verifyEmail  } from "#/store/register/actions";
import actionTypes from "#/store/register/actionTypes";
import { getActionLoadingState } from "#/store/selectors";
import './style.scss';

class VerifyEmail extends React.Component {

  componentDidMount () {
    const { params: { token, email } } = this.props.match
    this.props.verifyEmail(email, token, this.props.history)
  }

  render () {
    const { loading, error, data } = this.props;

    return (
      <div className="verify-email-page text-center">
        <div className="box">
          <div className="container">
            {
              loading &&
              <div className="spinner-border text-primary">
              </div>
            }
            {
              data && 
              <div className="success">
                <img src={require('#/assets/icons/success.svg')} alt="success"/>
                <h4 className="mt-3">{data.message}</h4>
                <p className="mt-2">redirecting you to the login page</p>
              </div>
            }
            {
              error &&
              <div>
                <img src={require('#/assets/icons/error.svg')} alt="error"/>
                <h4 className="mt-3">Email Not verified</h4>
                <p className="mt-2">redirecting you to the signup page</p>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { auth: { register: { error, data } } } = state;
  return {
    loading: getActionLoadingState(state, actionTypes.VERIFY_EMAIL_REQUEST),
    error,
    data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    verifyEmail: (email, token, history) => dispatch(verifyEmail(email, token, history)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VerifyEmail));
