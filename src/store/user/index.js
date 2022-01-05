import * as actions from "./actionTypes";

const defaultState = {
    token: false,
    emailAddress: false,
    authorized: false,
    firstName: false,
    lastName: false,
    isBvnActive: false,
    isStaff: false
}
     
export default (state = defaultState, action) => {
    switch(action.type) {
        case actions.UPDATE_USER:
            let update = Object.assign({}, state, action.data);
            return update;
        default:
            return state;
    }
}
