import {
    CREATE_QUESTION,
    RETRIEVE_QUESTIONS,
    UPDATE_QUESTION,
    DELETE_QUESTION,
    DELETE_ALL_QUESTIONS
  } from "./types";
  
  import QuestionDataService from "../services/question-service";
  
  export const createQuestion = (description, alternatives, category) => async (dispatch) => {
    try {
      const res = await QuestionDataService.create({ description, alternatives, category });
  
      dispatch({
        type: CREATE_QUESTION,
        payload: res.data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  export const retrieveQuestions = () => async (dispatch) => {
    try {
      const res = await QuestionDataService.getAll();
  
      dispatch({
        type: RETRIEVE_QUESTIONS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  export const updateQuestion = (id, data) => async (dispatch) => {
    try {
      const res = await QuestionDataService.update(id, data);
  
      dispatch({
        type: UPDATE_QUESTION,
        payload: data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  export const deleteQuestion = (id) => async (dispatch) => {
    try {
      await QuestionDataService.delete(id);
      dispatch({
        type: DELETE_QUESTION,
        payload: { id },
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  export const deleteAllQuestions = () => async (dispatch) => {
    try {
      const res = await QuestionDataService.deleteAll();
  
      dispatch({
        type: DELETE_ALL_QUESTIONS,
        payload: res.data,
      });
  
      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  
  export const findQuestionByDescription = (description) => async (dispatch) => {
    try {
      const res = await QuestionDataService.findByTitle(description);
  
      dispatch({
        type: RETRIEVE_QUESTIONS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  export const simpleUpdateQuestion = (payload) => {
    return {
      type: UPDATE_QUESTION,
      payload
    }
  }