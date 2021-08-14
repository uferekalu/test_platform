import {
    CREATE_RESULTS,
    RETRIEVE_RESULTS,
    UPDATE_RESULT,
  } from "./types";
  
  import ResultsDataService from "../services/categories-services";
  
  export const retrieveResult = () => async (dispatch) => {
    try {
      const res = await ResultsDataService.getAll();
  
      dispatch({
        type: RETRIEVE_RESULTS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };
