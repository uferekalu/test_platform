import { combineReducers } from "redux";
import questions from "./questions";
import categories from "./categories";
import tests from "./tests";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
    questions,
    categories,
    tests,
    auth: authReducer,
    errors: errorReducer
});