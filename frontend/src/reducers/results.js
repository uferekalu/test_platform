import {
    RETRIEVE_RESULTS
} from "../actions/types";
  
  const initialState = [];
  
  function resultsReducer(results = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case RETRIEVE_RESULTS:
        return payload;
      default:
        return results;
    }
  };
  
  export default resultsReducer;