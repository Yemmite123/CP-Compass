import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import { sendResetLink } from "#/store/login/actions";
import actionTypes from "#/store/login/actionTypes";
import { getActionLoadingState } from "#/store/selectors";
import AuthNav from '#/components/AuthNav';


class PasswordLinkExpired extends React.Component {

    // componentDidMount() {
    //     setTimeout(() => {
    //         this.props.history.push("/forgot-password")
    //     }, 5000)
    // }

    render() {

        return (
            <div className="forgot-password-page text-center">
                <AuthNav />
                <div className="box">
                    <div className="container">
                        <div>
                            <img
                                width={84}
                                src={require("#/assets/icons/calender.png")}
                                alt="bank"
                                className="pb-3"
                            />
                            <h4 className="mt-4 font-bolder text-blue">
                                Link Expired
                            </h4>
                            <p className='font-small'>The link to the password has either expired or has been used</p>
                            <Link to="/login" className="btn py-3 btn-primary w-100 mt-4">

                                Go to login page

                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendResetLink: (email, history) => dispatch(sendResetLink(email, history)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PasswordLinkExpired));
