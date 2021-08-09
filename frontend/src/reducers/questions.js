import {
    CREATE_QUESTION,
    RETRIEVE_QUESTIONS,
    UPDATE_QUESTION,
    DELETE_QUESTION,
    DELETE_ALL_QUESTIONS
  } from "../actions/types";
  
  const initialState = [];
  
  function questionReducer(questions = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case CREATE_QUESTION:
        return [...questions, payload];
  
      case RETRIEVE_QUESTIONS:
        return payload;
  
      case UPDATE_QUESTION:
        return questions.map((question) => {
          if (question._id === payload._id) {
            return {
              ...question,
              ...payload,
            };
          } else {
            return question;
          }
        });
  
      case DELETE_QUESTION:
        return questions.filter(({ _id }) => _id !== payload.id);
  
      case DELETE_ALL_QUESTIONS:
        return [];
  
      default:
        return questions;
    }
  };
  
  export default questionReducer;