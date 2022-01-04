import { combineReducers } from "redux";
import auth from "./auth";
import user from './user';
import ui from "./ui";
import app from './app';

export default combineReducers({
    auth,
    ui,
    user,
    app,
});