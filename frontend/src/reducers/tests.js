import {
    CREATE_TESTS,
    RETRIEVE_TESTS,
    UPDATE_TEST,
    DELETE_TEST,
    DELETE_ALL_TESTS
  } from "../actions/types";
  
  const initialState = [];
  
  function testsReducer(tests = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case CREATE_TESTS:
        return [...tests, payload];
  
      case RETRIEVE_TESTS:
        return payload;
  
      case UPDATE_TEST:
        return tests.map((question) => {
          if (question._id === payload._id) {
            return {
              ...question,
              ...payload,
            };
          } else {
            return question;
          }
        });
  
      case DELETE_TEST:
        return tests.filter(({ _id }) => _id !== payload.id);
  
      case DELETE_ALL_TESTS:
        return [];
  
      default:
        return tests;
    }
  };
  
  export default testsReducer;