import {
    CREATE_CATEGORIES,
    RETRIEVE_CATEGORIES,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    DELETE_ALL_CATEGORIES
  } from "../actions/types";
  
  const initialState = [];
  
  function categoriesReducer(categories = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case CREATE_CATEGORIES:
        return [...categories, payload];
  
      case RETRIEVE_CATEGORIES:
        return payload;
  
      case UPDATE_CATEGORY:
        return categories.map((question) => {
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
        return categories.filter(({ _id }) => _id !== payload.id);
  
      case DELETE_ALL_CATEGORIES:
        return [];
  
      default:
        return categories;
    }
  };
  
  export default categoriesReducer;