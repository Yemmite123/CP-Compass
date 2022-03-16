import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import { connect } from "react-redux";
import { sendResetLink } from "#/store/login/actions";
import actionTypes from "#/store/login/actionTypes";
import { getActionLoadingState } from "#/store/selectors";
import AuthNav from '#/components/AuthNav';


class PasswordLinkExpired extends React.Component {

    componentDidMount() {
        setTimeout(() => {
            this.props.history.push("/forgot-password")
        }, 5000)
    }

    render() {

        return (
            <div className="forgot-password-page text-center">
                <AuthNav />
                <div className="">
                    <div className="container">
                        <div>
                            <h4 className="mt-4 font-bolder text-blue">
                                Password Reset Expired
                            </h4>
                            {/* <p className='font-small'>Please input your registered email to reset your password</p> */}
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
