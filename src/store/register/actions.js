import CONFIG from '#/config';
import * as actions from "./actionTypes";
import { updateUser } from "#/store/user/actions";

const clear = () => {
    return {
        type: actions.CLEAR,
    }
}

const clearError = () => {
    return {
        type: actions.CLEAR_ERROR,
    }
}

const registerRequest = () => {
    return {
        type: actions.REGISTER_REQUEST,
    }
}

const registerSuccess = (data) => {
    return {
        type: actions.REGISTER_SUCCESS,
        data
    }
}

const registerError = (message) => {
    return {
        type: actions.REGISTER_ERROR,
        error: message
    }
}

const verifyEmailRequest = () => {
    return {
        type: actions.VERIFY_EMAIL_REQUEST,
    }
}

const verifyEmailSuccess = (data) => {
    return {
        type: actions.VERIFY_EMAIL_SUCCESS,
        data
    }
}

const verifyEmailError = (message) => {
    return {
        type: actions.VERIFY_EMAIL_ERROR,
        error: message
    }
}

const resendTokenRequest = () => {
    return {
        type: actions.RESEND_TOKEN_REQUEST,
    }
}

const resendTokenSuccess = (data) => {
    return {
        type: actions.RESEND_TOKEN_SUCCESS,
        data
    }
}

const resendTokenError = (message) => {
    return {
        type: actions.RESEND_TOKEN_ERROR,
        error: message
    }
}

export const register = (payload, history) => {
    return (dispatch) => {
        dispatch(registerRequest());

        fetch(`${CONFIG.BASE_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if ([200, 201].includes(response.status)) {
                    response.json()
                        .then(res => {
                            dispatch(updateUser({ emailAddress: payload.email }));
                            dispatch(registerSuccess(res));
                            setTimeout(() => {
                                dispatch(clear())
                                history.push("/register/confirm-email")
                            }, 3000);
                        });
                }
                if (response.status === 400) {
                    response.json()
                        .then(res => {
                            dispatch(registerError(res.error ? res.error : res.message));
                        })
                }

                if (response.status >= 500) {
                    dispatch(registerError(`Oops! We did something wrong.`));
                    setTimeout(() => dispatch(clearError()), 5000);
                }
            })
            .catch(() => {
                dispatch(registerError(`Oops! We did something wrong.`));
            })
    }
}

export const verifyEmail = (email, token, history) => {
    return (dispatch) => {
        dispatch(verifyEmailRequest());

        fetch(`${CONFIG.BASE_URL}/auth/email/${email}/verification/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(response => {
                if ([200, 201].includes(response.status)) {
                    response.json()
                        .then(res => {
                            dispatch(verifyEmailSuccess(res));
                            setTimeout(() => history.push("/login"), 5000);
                        });
                }
                if ([400, 404, 422, 403].includes(response.status)) {
                    response.json()
                        .then(res => {
                            dispatch(verifyEmailError(res.message ? res.message : res.error));
                            setTimeout(() => {
                                history.push("/register/signup")
                                dispatch(clearError());
                            }, 7000);
                        })
                }

                if (response.status >= 500) {
                    dispatch(verifyEmailError(`Oops! We did something wrong.`));
                }
            })
            .catch(() => {
                dispatch(verifyEmailError(`Oops! We did something wrong.`));
            })
    }
}

export const resendToken = (email) => {
    const payload = { email };
    return (dispatch) => {
        dispatch(resendTokenRequest());

        fetch(`${CONFIG.BASE_URL}/auth/email/resend/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(response => {

                if ([200, 201].includes(response.status)) {
                    response.json()
                        .then(res => {
                            dispatch(resendTokenSuccess(res));
                            setTimeout(() => dispatch(clear()), 3000);
                        });
                }
                if ([400, 404].includes(response.status)) {
                    response.json()
                        .then(res => {
                            dispatch(resendTokenError(res.message ? res.message : res.error));
                        })
                }

                if (response.status >= 500) {
                    dispatch(resendTokenError(`Oops! We did something wrong.`));
                }
            })
            .catch(() => {
                dispatch(resendTokenError(`Oops! We did something wrong.`));
            })
    }
}