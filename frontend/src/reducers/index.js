import { combineReducers } from "redux";
import questions from "./questions";
import categories from "./categories";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
    questions,
    categories,
    auth: authReducer,
    errors: errorReducer
});