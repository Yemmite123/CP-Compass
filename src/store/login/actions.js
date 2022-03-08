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

const loginRequest = () => {
    return {
        type: actions.LOGIN_REQUEST,
    }
}

const loginError = (message) => {
    return {
        type: actions.LOGIN_ERROR,
        error: message,
    }
}

const loginSuccess = () => {
    return {
        type: actions.LOGIN_SUCCESS,
    }
}

const sendResetLinkRequest = () => {
    return {
        type: actions.SEND_RESET_LINK_REQUEST,
    }
}

const sendResetLinkSuccess = (data) => {
    return {
        type: actions.SEND_RESET_LINK_SUCCESS,
        data
    }
}

const sendResetLinkError = (error) => {
    return {
        type: actions.SEND_RESET_LINK_ERROR,
        error,
    }
}

const resetPasswordRequest = () => {
    return {
        type: actions.RESET_PASSWORD_REQUEST,
    }
}

const resetPasswordSuccess = (data) => {
    return {
        type: actions.RESET_PASSWORD_SUCCESS,
        data
    }
}

const resetPasswordError = (error) => {
    return {
        type: actions.RESET_PASSWORD_ERROR,
        error,
    }
}

export const login = (payload, history) => {
    return (dispatch) => {
        dispatch(loginRequest());

        fetch(`${CONFIG.BASE_URL}/auth/login`, {
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
                            if (res.isStaff === true) {
                                dispatch(loginError('unauthorized'));
                                return setTimeout(() => dispatch(clearError()), 5000);
                            }
                            dispatch(updateUser({
                                emailAddress: payload.email,
                                token: `Bearer ${res.token}`,
                                authorized: true,
                                isBvnActive: res.isBvnActive,
                                isStaff: res.isStaff,
                            }));
                            dispatch(loginSuccess());
                            if (sessionStorage.getItem('redirectOnLogin') && document.referrer) {
                                sessionStorage.removeItem('redirectOnLogin');
                                window.location = document.referrer;
                                return;
                            }

                            if (sessionStorage.getItem("blogPost")) {
                                const href = sessionStorage.getItem("blogPost");
                                sessionStorage.removeItem("blogPost");
                                let paths = href.split("/");
                                const blogName = paths[paths.length - 1];
                                history.push({
                                    pathname: `app/blogs/blog/${blogName}`,
                                    state: { routeName: blogName.split("-").join(" ") }
                                });
                                return;
                            }

                            history.push('/app/onboarding');
                        });
                }

                if ([400, 403, 404].includes(response.status)) {
                    response.json()
                        .then(res => {
                            dispatch(loginError(res.error ? res.error : res.message));
                            setTimeout(() => dispatch(clearError()), 5000);
                        })
                }
                if ([401].includes(response.status)) {
                    response.json()
                        .then(res => {
                            dispatch(loginError(res.message ? res.message : res.error));
                            setTimeout(() => dispatch(clearError()), 5000);
                            if (res.message && res.message.includes('Unverified')) {
                                dispatch(updateUser({
                                    emailAddress: payload.email, token: false,
                                    authorized: false
                                }));
                                setTimeout(() => history.push("/register/confirm-email"), 3000);
                            }
                        })
                }
                if (response.status >= 500) {
                    dispatch(loginError('Oops! We did something wrong.'));
                    setTimeout(() => dispatch(clearError()), 5000);
                }
            })
            .catch(() => {
                dispatch(loginError('Oops! We did something wrong.'));
            })
    }
}

// to send the password reset link
export const sendResetLink = (email, history) => {
    return (dispatch) => {
        dispatch(sendResetLinkRequest());
        const payload = { email };

        fetch(`${CONFIG.BASE_URL}/auth/password/forgot`, {
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
                            dispatch(sendResetLinkSuccess(!history && res));
                            history && history.push({ pathname: "/forgot-password-confirmation", state: payload })
                            setTimeout(() => dispatch(clear()), 5000);
                        });
                }

                if ([400, 401, 404, 403].includes(response.status)) {
                    response.json()
                        .then(res => {
                            dispatch(sendResetLinkError(res.error ? res.error : res.message));
                        })
                }
                if (response.status >= 500) {
                    dispatch(sendResetLinkError('Oops! We did something wrong.'));
                }
            })
            .catch(() => {
                dispatch(sendResetLinkError('Oops! We did something wrong.'));
            })
    }
}

export const resetPassword = (payload, history) => {
    return (dispatch) => {
        dispatch(resetPasswordRequest());

        fetch(`${CONFIG.BASE_URL}/auth/password/reset`, {
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
                            dispatch(resetPasswordSuccess(res));
                            setTimeout(() => history.push('/login'), 3000);
                        });
                }

                if ([400, 401, 404, 403].includes(response.status)) {
                    response.json()
                        .then(res => {
                            dispatch(resetPasswordError(res.error ? res.error : res.message));
                        })
                }
                if (response.status >= 500) {
                    dispatch(resetPasswordError('Oops! We did something wrong.'));
                    setTimeout(() => dispatch(clearError()), 5000);
                }
            })
            .catch(() => {
                dispatch(resetPasswordError('Oops! We did something wrong.'));
                setTimeout(() => dispatch(clearError()), 5000);
            })
    }
}