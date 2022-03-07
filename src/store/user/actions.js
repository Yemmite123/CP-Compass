
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
        // if(isUserInitiatedLogout) {
        //     sessionStorage.removeItem('redirectOnLogin');
        // } else {
        sessionStorage.setItem('redirectOnLogin', true);
        // }
        window.location = "/login";
    }
}
