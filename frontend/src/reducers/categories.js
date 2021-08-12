import {
    CREATE_CATEGORIES,
    RETRIEVE_CATEGORIES,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    DELETE_ALL_CATEGORIES
  } from "../actions/types";
  
  const initialState = [];
  
  function questionReducer(questions = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case CREATE_CATEGORIES:
        return [...questions, payload];
  
      case RETRIEVE_CATEGORIES:
        return payload;
  
      case UPDATE_CATEGORY:
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
  
      case DELETE_CATEGORY:
        return questions.filter(({ _id }) => _id !== payload.id);
  
      case DELETE_ALL_CATEGORIES:
        return [];
  
      default:
        return questions;
    }
  };
  
  export default questionReducer;