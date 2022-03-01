
import * as actions from './actionTypes';

export const updateUser = (data) => {
    return {
        type: actions.UPDATE_USER,
        data: data
    }
}

export const logout = (isUserInitiatedLogout) => {
    return () => {
        localStorage.clear();
        sessionStorage.setItem('redirectOnLogin', true);
        window.location = "/login";
    }
}
