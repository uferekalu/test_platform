import { combineReducers } from "redux";
import questions from "./questions";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
    questions,
    auth: authReducer,
    errors: errorReducer
});